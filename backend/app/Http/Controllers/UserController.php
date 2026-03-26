<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Student;
use App\Models\Faculty;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules\Password;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\DB;

class UserController extends Controller
{
    /**
     * List all users (with their role-specific profiles).
     */
    public function index()
    {
        $users = User::with(['student', 'faculty'])->get();

        $users = $users->map(function ($user) {
            $data = $user->only([
                'id',
                'firstname',
                'middlename',
                'lastname',
                'user_id',
                'email',
                'role',
                'birth_date',
                'contact_number',
                'gender',
                'address',
                'profile_picture',
                'is_active',
                'last_login_at'
            ]);
            if ($user->role === 'student') {
                $data['student'] = $user->student;
            } elseif ($user->role === 'faculty') {
                $data['faculty'] = $user->faculty;
            }
            return $data;
        });

        return response()->json(['users' => $users], 200);
    }

    /**
     * Get all students (with their student profiles).
     */
    public function getStudents()
    {
        $students = User::with('student')
            ->where('role', 'student')
            ->get()
            ->map(function ($user) {
                return [
                    'user' => $user->only([
                        'id',
                        'firstname',
                        'middlename',
                        'lastname',
                        'user_id',
                        'email',
                        'birth_date',
                        'contact_number',
                        'gender',
                        'address',
                        'profile_picture',
                        'is_active',
                        'last_login_at'
                    ]),
                    'student' => $user->student,
                ];
            });

        return response()->json(['students' => $students], 200);
    }

    /**
     * Get all faculty (with their faculty profiles).
     */
    public function getFaculty()
    {
        $faculty = User::with('faculty')
            ->where('role', 'faculty')
            ->get()
            ->map(function ($user) {
                return [
                    'user' => $user->only([
                        'id',
                        'firstname',
                        'middlename',
                        'lastname',
                        'user_id',
                        'email',
                        'birth_date',
                        'contact_number',
                        'gender',
                        'address',
                        'profile_picture',
                        'is_active',
                        'last_login_at'
                    ]),
                    'faculty' => $user->faculty,
                ];
            });

        return response()->json(['faculty' => $faculty], 200);
    }

    /**
     * Show a single user with their profile.
     */
    public function show($identifier)
    {
        $user = User::with(['student', 'faculty'])
            ->where('id', $identifier)
            ->orWhere('user_id', $identifier)
            ->firstOrFail();

        $data = $user->only([
            'id',
            'firstname',
            'middlename',
            'lastname',
            'user_id',
            'email',
            'role',
            'birth_date',
            'contact_number',
            'gender',
            'address',
            'profile_picture',
            'is_active',
            'last_login_at'
        ]);

        if ($user->role === 'student') {
            $data['student'] = $user->student;
        } elseif ($user->role === 'faculty') {
            $data['faculty'] = $user->faculty;
        }

        return response()->json(['user' => $data], 200);
    }

    /**
     * Create a new student or faculty (admin not allowed via API).
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            // Common user fields
            'firstname' => 'required|string|max:255',
            'middlename' => 'nullable|string|max:255',
            'lastname' => 'required|string|max:255',
            'user_id' => 'required|string|size:7|unique:users,user_id',
            'email' => 'required|email|unique:users,email',
            'password' => ['required', Password::min(8)->mixedCase()->numbers()],
            'role' => ['required', Rule::in(['student', 'faculty'])],
            'birth_date' => 'nullable|date',
            'contact_number' => 'nullable|string|max:20',
            'gender' => ['nullable', Rule::in(['male', 'female', 'other'])],
            'address' => 'nullable|string',
            'profile_picture' => 'nullable|string|max:255',
            'is_active' => 'boolean',
        ]);

        // Student-specific fields
        if ($validated['role'] === 'student') {
            $studentRules = [
                'parent_guardian_name' => 'nullable|string|max:255',
                'emergency_contact' => 'nullable|string|max:20',
                'section' => 'nullable|string|max:100',
                'program' => 'nullable|string|max:100',
                'year_level' => 'nullable|integer|min:1|max:6',
                'gpa' => 'nullable|numeric|min:0|max:4',
                'current_subjects' => 'nullable|array',
                'academic_awards' => 'nullable|array',
                'events_participated' => 'nullable|array',
                'blood_type' => 'nullable|string|max:3',
                'disabilities' => 'nullable|string',
                'medical_condition' => 'nullable|string',
                'allergies' => 'nullable|string',
                'sports_activities' => 'nullable|array',
                'organizations' => 'nullable|array',
                'behavior_discipline_records' => 'nullable|array',
            ];
            $validated = array_merge($validated, $request->validate($studentRules));
        }

        // Faculty-specific fields
        if ($validated['role'] === 'faculty') {
            $facultyRules = [
                'department' => 'nullable|string|max:255',
                'specialization' => 'nullable|string|max:255',
                'subjects_handled' => 'nullable|array',
                'teaching_schedule' => 'nullable|array',
                'research_projects' => 'nullable|array',
            ];
            $validated = array_merge($validated, $request->validate($facultyRules));
        }

        DB::beginTransaction();
        try {
            // Create user
            $user = User::create([
                'firstname' => $validated['firstname'],
                'middlename' => $validated['middlename'] ?? null,
                'lastname' => $validated['lastname'],
                'user_id' => $validated['user_id'],
                'email' => $validated['email'],
                'password' => Hash::make($validated['password']),
                'role' => $validated['role'],
                'birth_date' => $validated['birth_date'] ?? null,
                'contact_number' => $validated['contact_number'] ?? null,
                'gender' => $validated['gender'] ?? null,
                'address' => $validated['address'] ?? null,
                'profile_picture' => $validated['profile_picture'] ?? null,
                'is_active' => $validated['is_active'] ?? true,
            ]);

            // Create role-specific profile
            if ($validated['role'] === 'student') {
                $student = Student::create([
                    'user_id' => $user->id,
                    'parent_guardian_name' => $validated['parent_guardian_name'] ?? null,
                    'emergency_contact' => $validated['emergency_contact'] ?? null,
                    'section' => $validated['section'] ?? null,
                    'program' => $validated['program'] ?? null,
                    'year_level' => $validated['year_level'] ?? null,
                    'gpa' => $validated['gpa'] ?? null,
                    'current_subjects' => $validated['current_subjects'] ?? null,
                    'academic_awards' => $validated['academic_awards'] ?? null,
                    'events_participated' => $validated['events_participated'] ?? null,
                    'blood_type' => $validated['blood_type'] ?? null,
                    'disabilities' => $validated['disabilities'] ?? null,
                    'medical_condition' => $validated['medical_condition'] ?? null,
                    'allergies' => $validated['allergies'] ?? null,
                    'sports_activities' => $validated['sports_activities'] ?? null,
                    'organizations' => $validated['organizations'] ?? null,
                    'behavior_discipline_records' => $validated['behavior_discipline_records'] ?? null,
                ]);
                $profile = $student;
            } else { // faculty
                $faculty = Faculty::create([
                    'user_id' => $user->id,
                    'department' => $validated['department'] ?? null,
                    'specialization' => $validated['specialization'] ?? null,
                    'subjects_handled' => $validated['subjects_handled'] ?? null,
                    'teaching_schedule' => $validated['teaching_schedule'] ?? null,
                    'research_projects' => $validated['research_projects'] ?? null,
                ]);
                $profile = $faculty;
            }

            DB::commit();

            $response = [
                'message' => ucfirst($validated['role']) . ' created successfully',
                'user' => $user->only([
                    'id',
                    'firstname',
                    'middlename',
                    'lastname',
                    'user_id',
                    'email',
                    'role',
                    'birth_date',
                    'contact_number',
                    'gender',
                    'address',
                    'profile_picture',
                    'is_active'
                ]),
            ];

            if ($validated['role'] === 'student') {
                $response['student'] = $profile;
            } else {
                $response['faculty'] = $profile;
            }

            return response()->json($response, 201);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['message' => 'Creation failed: ' . $e->getMessage()], 500);
        }
    }

    /**
     * Update a user (common fields and role-specific fields).
     */
    public function update(Request $request, $identifier)
    {
        $user = User::where('id', $identifier)->orWhere('user_id', $identifier)->firstOrFail();

        $rules = [
            'firstname' => 'sometimes|string|max:255',
            'middlename' => 'nullable|string|max:255',
            'lastname' => 'sometimes|string|max:255',
            'email' => ['sometimes', 'email', Rule::unique('users', 'email')->ignore($user->id)],
            'password' => ['sometimes', Password::min(8)->mixedCase()->numbers()],
            'birth_date' => 'nullable|date',
            'contact_number' => 'nullable|string|max:20',
            'gender' => ['nullable', Rule::in(['male', 'female', 'other'])],
            'address' => 'nullable|string',
            'profile_picture' => 'nullable|string|max:255',
            'is_active' => 'boolean',
        ];

        // Role-specific rules
        if ($user->role === 'student') {
            $rules = array_merge($rules, [
                'parent_guardian_name' => 'nullable|string|max:255',
                'emergency_contact' => 'nullable|string|max:20',
                'section' => 'nullable|string|max:100',
                'program' => 'nullable|string|max:100',
                'year_level' => 'nullable|integer|min:1|max:6',
                'gpa' => 'nullable|numeric|min:0|max:4',
                'current_subjects' => 'nullable|array',
                'academic_awards' => 'nullable|array',
                'events_participated' => 'nullable|array',
                'blood_type' => 'nullable|string|max:3',
                'disabilities' => 'nullable|string',
                'medical_condition' => 'nullable|string',
                'allergies' => 'nullable|string',
                'sports_activities' => 'nullable|array',
                'organizations' => 'nullable|array',
                'behavior_discipline_records' => 'nullable|array',
            ]);
        } elseif ($user->role === 'faculty') {
            $rules = array_merge($rules, [
                'department' => 'nullable|string|max:255',
                'specialization' => 'nullable|string|max:255',
                'subjects_handled' => 'nullable|array',
                'teaching_schedule' => 'nullable|array',
                'research_projects' => 'nullable|array',
            ]);
        }

        $validated = $request->validate($rules);

        DB::beginTransaction();
        try {
            // Update common user fields
            $userData = $request->only([
                'firstname',
                'middlename',
                'lastname',
                'email',
                'birth_date',
                'contact_number',
                'gender',
                'address',
                'profile_picture',
                'is_active'
            ]);
            if ($request->filled('password')) {
                $userData['password'] = Hash::make($request->password);
            }
            $user->update($userData);

            // Update role-specific profile
            if ($user->role === 'student' && $user->student) {
                $studentData = $request->only([
                    'parent_guardian_name',
                    'emergency_contact',
                    'section',
                    'program',
                    'year_level',
                    'gpa',
                    'current_subjects',
                    'academic_awards',
                    'events_participated',
                    'blood_type',
                    'disabilities',
                    'medical_condition',
                    'allergies',
                    'sports_activities',
                    'organizations',
                    'behavior_discipline_records'
                ]);
                $user->student->update($studentData);
                $profile = $user->student->fresh();
            } elseif ($user->role === 'faculty' && $user->faculty) {
                $facultyData = $request->only([
                    'department',
                    'specialization',
                    'subjects_handled',
                    'teaching_schedule',
                    'research_projects'
                ]);
                $user->faculty->update($facultyData);
                $profile = $user->faculty->fresh();
            } else {
                $profile = null;
            }

            DB::commit();

            $response = [
                'message' => 'User updated successfully',
                'user' => $user->fresh()->only([
                    'id',
                    'firstname',
                    'middlename',
                    'lastname',
                    'user_id',
                    'email',
                    'role',
                    'birth_date',
                    'contact_number',
                    'gender',
                    'address',
                    'profile_picture',
                    'is_active'
                ]),
            ];

            if ($user->role === 'student') {
                $response['student'] = $profile;
            } elseif ($user->role === 'faculty') {
                $response['faculty'] = $profile;
            }

            return response()->json($response, 200);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['message' => 'Update failed: ' . $e->getMessage()], 500);
        }
    }

    /**
     * Delete a user (only if inactive).
     */
    public function destroy($identifier)
    {
        $user = User::where('id', $identifier)->orWhere('user_id', $identifier)->firstOrFail();

        // Prevent admin from deleting themselves
        if ($user->id === auth()->id()) {
            return response()->json(['message' => 'You cannot delete your own account.'], 403);
        }

        if ($user->is_active) {
            return response()->json(['message' => 'User must be deactivated before deletion.'], 422);
        }

        $user->delete();

        return response()->json(['message' => 'User deleted successfully'], 200);
    }
}