<?php

namespace App\Http\Controllers;

use App\Services\UserService;
use Illuminate\Http\Request;
use Illuminate\Validation\Rules\Password;
use Illuminate\Validation\Rule;

class UserController extends Controller
{
    public function __construct(
        private readonly UserService $userService
    ) {}

    /**
     * List all users (with their role-specific profiles).
     */
    public function index()
    {
        return response()->json(['users' => $this->userService->getAllUsers()], 200);
    }

    /**
     * Get all students (with their student profiles).
     */
    public function getStudents()
    {
        return response()->json(['students' => $this->userService->getAllStudents()], 200);
    }

    /**
     * Get all faculty (with their faculty profiles).
     */
    public function getFaculty()
    {
        return response()->json(['faculty' => $this->userService->getAllFaculty()], 200);
    }

    /**
     * Show a single user with their profile.
     */
    public function show($identifier)
    {
        return response()->json(['user' => $this->userService->findByIdentifier($identifier)], 200);
    }

    /**
     * Create a new student or faculty (admin not allowed via API).
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            // Common user fields
            'firstname'      => 'required|string|max:255',
            'middlename'     => 'nullable|string|max:255',
            'lastname'       => 'required|string|max:255',
            'user_id'        => 'required|string|size:7|unique:users,user_id',
            'email'          => 'required|email|unique:users,email',
            'password'       => ['required', Password::min(8)->mixedCase()->numbers()],
            'role'           => ['required', Rule::in(['student', 'faculty'])],
            'birth_date'     => 'nullable|date',
            'contact_number' => 'nullable|string|max:20',
            'gender'         => ['nullable', Rule::in(['male', 'female', 'other'])],
            'address'        => 'nullable|string',
            'profile_picture' => 'nullable|string|max:255',
            'is_active'      => 'boolean',
        ]);

        // Student-specific fields
        if ($validated['role'] === 'student') {
            $validated = array_merge($validated, $request->validate([
                'parent_guardian_name'        => 'nullable|string|max:255',
                'emergency_contact'           => 'nullable|string|max:20',
                'section'                     => 'nullable|string|max:100',
                'program'                     => 'nullable|string|max:100',
                'year_level'                  => 'nullable|integer|min:1|max:6',
                'gpa'                         => 'nullable|numeric|min:0|max:4',
                'current_subjects'            => 'nullable|array',
                'academic_awards'             => 'nullable|array',
                'events_participated'         => 'nullable|array',
                'blood_type'                  => 'nullable|string|max:3',
                'disabilities'                => 'nullable|string',
                'medical_condition'           => 'nullable|string',
                'allergies'                   => 'nullable|string',
                'sports_activities'           => 'nullable|array',
                'organizations'               => 'nullable|array',
                'behavior_discipline_records' => 'nullable|array',
            ]));
        }

        // Faculty-specific fields
        if ($validated['role'] === 'faculty') {
            $validated = array_merge($validated, $request->validate([
                'department'        => 'nullable|string|max:255',
                'specialization'    => 'nullable|string|max:255',
                'subjects_handled'  => 'nullable|array',
                'teaching_schedule' => 'nullable|array',
                'research_projects' => 'nullable|array',
            ]));
        }

        $result = $this->userService->createUser($validated);

        return response()->json($result, 201);
    }

    /**
     * Update a user (common fields and role-specific fields).
     */
    public function update(Request $request, $identifier)
    {
        // We need to find the user first to build role-specific validation rules
        $user = \App\Models\User::where('id', $identifier)
            ->orWhere('user_id', $identifier)
            ->firstOrFail();

        $rules = [
            'firstname'      => 'sometimes|string|max:255',
            'middlename'     => 'nullable|string|max:255',
            'lastname'       => 'sometimes|string|max:255',
            'email'          => ['sometimes', 'email', Rule::unique('users', 'email')->ignore($user->id)],
            'password'       => ['sometimes', Password::min(8)->mixedCase()->numbers()],
            'birth_date'     => 'nullable|date',
            'contact_number' => 'nullable|string|max:20',
            'gender'         => ['nullable', Rule::in(['male', 'female', 'other'])],
            'address'        => 'nullable|string',
            'profile_picture' => 'nullable|string|max:255',
            'is_active'      => 'boolean',
        ];

        // Role-specific rules
        if ($user->role === 'student') {
            $rules = array_merge($rules, [
                'parent_guardian_name'        => 'nullable|string|max:255',
                'emergency_contact'           => 'nullable|string|max:20',
                'section'                     => 'nullable|string|max:100',
                'program'                     => 'nullable|string|max:100',
                'year_level'                  => 'nullable|integer|min:1|max:6',
                'gpa'                         => 'nullable|numeric|min:0|max:4',
                'current_subjects'            => 'nullable|array',
                'academic_awards'             => 'nullable|array',
                'events_participated'         => 'nullable|array',
                'blood_type'                  => 'nullable|string|max:3',
                'disabilities'                => 'nullable|string',
                'medical_condition'           => 'nullable|string',
                'allergies'                   => 'nullable|string',
                'sports_activities'           => 'nullable|array',
                'organizations'               => 'nullable|array',
                'behavior_discipline_records' => 'nullable|array',
            ]);
        } elseif ($user->role === 'faculty') {
            $rules = array_merge($rules, [
                'department'        => 'nullable|string|max:255',
                'specialization'    => 'nullable|string|max:255',
                'subjects_handled'  => 'nullable|array',
                'teaching_schedule' => 'nullable|array',
                'research_projects' => 'nullable|array',
            ]);
        }

        $request->validate($rules);

        // Separate user data from profile data
        $userData = $request->only([
            'firstname', 'middlename', 'lastname', 'email', 'password',
            'birth_date', 'contact_number', 'gender', 'address',
            'profile_picture', 'is_active',
        ]);

        $profileFields = $user->role === 'student'
            ? ['parent_guardian_name', 'emergency_contact', 'section', 'program',
               'year_level', 'gpa', 'current_subjects', 'academic_awards',
               'events_participated', 'blood_type', 'disabilities', 'medical_condition',
               'allergies', 'sports_activities', 'organizations', 'behavior_discipline_records']
            : ['department', 'specialization', 'subjects_handled', 'teaching_schedule', 'research_projects'];

        $profileData = $request->only($profileFields);

        $result = $this->userService->updateUser($identifier, $userData, $profileData);

        return response()->json($result, 200);
    }

    /**
     * Delete a user (only if inactive).
     */
    public function destroy($identifier)
    {
        $this->userService->deleteUser($identifier, auth()->id());

        return response()->json(['message' => 'User deleted successfully'], 200);
    }
}