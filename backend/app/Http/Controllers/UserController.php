<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreUserRequest;
use App\Http\Requests\UpdateUserRequest;
use App\Services\UserService;

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
     * Create a new student or faculty.
     */
    public function store(StoreUserRequest $request)
    {
        $result = $this->userService->createUser($request->validated());

        return response()->json($result, 201);
    }

    /**
     * Update a user (common fields and role-specific fields).
     */
    public function update(UpdateUserRequest $request, $identifier)
    {
        $user = \App\Models\User::where('id', $identifier)
            ->orWhere('user_id', $identifier)
            ->firstOrFail();

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