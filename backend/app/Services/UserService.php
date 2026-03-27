<?php

namespace App\Services;

use App\Models\User;
use App\Models\Student;
use App\Models\Faculty;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class UserService
{
    /**
     * Common user fields used for response formatting.
     */
    private const USER_FIELDS = [
        'id', 'firstname', 'middlename', 'lastname', 'user_id',
        'email', 'role', 'birth_date', 'contact_number', 'gender',
        'address', 'profile_picture', 'is_active', 'last_login_at',
    ];

    /**
     * User fields without last_login_at (used for create/update responses).
     */
    private const USER_FIELDS_SHORT = [
        'id', 'firstname', 'middlename', 'lastname', 'user_id',
        'email', 'role', 'birth_date', 'contact_number', 'gender',
        'address', 'profile_picture', 'is_active',
    ];

    /**
     * Student-specific fields for mass operations.
     */
    private const STUDENT_FIELDS = [
        'parent_guardian_name', 'emergency_contact', 'section', 'program',
        'year_level', 'gpa', 'current_subjects', 'academic_awards',
        'events_participated', 'blood_type', 'disabilities',
        'medical_condition', 'allergies', 'sports_activities',
        'organizations', 'behavior_discipline_records',
    ];

    /**
     * Faculty-specific fields for mass operations.
     */
    private const FACULTY_FIELDS = [
        'department', 'specialization', 'subjects_handled',
        'teaching_schedule', 'research_projects',
    ];

    /**
     * Get all users with their role-specific profiles formatted for response.
     */
    public function getAllUsers(): array
    {
        $users = User::with(['student', 'faculty'])->get();

        return $users->map(function ($user) {
            $data = $user->only(self::USER_FIELDS);
            if ($user->role === 'student') {
                $data['student'] = $user->student;
            } elseif ($user->role === 'faculty') {
                $data['faculty'] = $user->faculty;
            }
            return $data;
        })->toArray();
    }

    /**
     * Get all students with their profiles.
     */
    public function getAllStudents(): array
    {
        return User::with('student')
            ->where('role', 'student')
            ->get()
            ->map(function ($user) {
                return [
                    'user'    => $user->only(self::USER_FIELDS),
                    'student' => $user->student,
                ];
            })->toArray();
    }

    /**
     * Get all faculty with their profiles.
     */
    public function getAllFaculty(): array
    {
        return User::with('faculty')
            ->where('role', 'faculty')
            ->get()
            ->map(function ($user) {
                return [
                    'user'    => $user->only(self::USER_FIELDS),
                    'faculty' => $user->faculty,
                ];
            })->toArray();
    }

    /**
     * Find a user by ID or user_id with their profile.
     */
    public function findByIdentifier(string $identifier): array
    {
        $user = User::with(['student', 'faculty'])
            ->where('id', $identifier)
            ->orWhere('user_id', $identifier)
            ->firstOrFail();

        $data = $user->only(self::USER_FIELDS);

        if ($user->role === 'student') {
            $data['student'] = $user->student;
        } elseif ($user->role === 'faculty') {
            $data['faculty'] = $user->faculty;
        }

        return $data;
    }

    /**
     * Create a new user with their role-specific profile.
     */
    public function createUser(array $validated): array
    {
        return DB::transaction(function () use ($validated) {
            $user = User::create([
                'firstname'      => $validated['firstname'],
                'middlename'     => $validated['middlename'] ?? null,
                'lastname'       => $validated['lastname'],
                'user_id'        => $validated['user_id'],
                'email'          => $validated['email'],
                'password'       => Hash::make($validated['password']),
                'role'           => $validated['role'],
                'birth_date'     => $validated['birth_date'] ?? null,
                'contact_number' => $validated['contact_number'] ?? null,
                'gender'         => $validated['gender'] ?? null,
                'address'        => $validated['address'] ?? null,
                'profile_picture' => $validated['profile_picture'] ?? null,
                'is_active'      => $validated['is_active'] ?? true,
            ]);

            $response = [
                'message' => ucfirst($validated['role']) . ' created successfully',
                'user'    => $user->only(self::USER_FIELDS_SHORT),
            ];

            if ($validated['role'] === 'student') {
                $studentData = ['user_id' => $user->id];
                foreach (self::STUDENT_FIELDS as $field) {
                    $studentData[$field] = $validated[$field] ?? null;
                }
                $response['student'] = Student::create($studentData);
            } else {
                $facultyData = ['user_id' => $user->id];
                foreach (self::FACULTY_FIELDS as $field) {
                    $facultyData[$field] = $validated[$field] ?? null;
                }
                $response['faculty'] = Faculty::create($facultyData);
            }

            return $response;
        });
    }

    /**
     * Update an existing user and their role-specific profile.
     */
    public function updateUser(string $identifier, array $userData, array $profileData): array
    {
        $user = User::where('id', $identifier)
            ->orWhere('user_id', $identifier)
            ->firstOrFail();

        return DB::transaction(function () use ($user, $userData, $profileData) {
            if (isset($userData['password'])) {
                $userData['password'] = Hash::make($userData['password']);
            }
            $user->update($userData);

            $profile = null;
            if ($user->role === 'student' && $user->student) {
                $user->student->update($profileData);
                $profile = $user->student->fresh();
            } elseif ($user->role === 'faculty' && $user->faculty) {
                $user->faculty->update($profileData);
                $profile = $user->faculty->fresh();
            }

            $response = [
                'message' => 'User updated successfully',
                'user'    => $user->fresh()->only(self::USER_FIELDS_SHORT),
            ];

            if ($user->role === 'student') {
                $response['student'] = $profile;
            } elseif ($user->role === 'faculty') {
                $response['faculty'] = $profile;
            }

            return $response;
        });
    }

    /**
     * Delete a user (must be inactive and not the current admin).
     */
    public function deleteUser(string $identifier, int $currentUserId): void
    {
        $user = User::where('id', $identifier)
            ->orWhere('user_id', $identifier)
            ->firstOrFail();

        if ($user->id === $currentUserId) {
            abort(403, 'You cannot delete your own account.');
        }

        if ($user->is_active) {
            abort(422, 'User must be deactivated before deletion.');
        }

        $user->delete();
    }
}
