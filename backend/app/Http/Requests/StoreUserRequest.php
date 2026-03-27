<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rules\Password;
use Illuminate\Validation\Rule;

class StoreUserRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $rules = [
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
        ];

        // Student-specific fields
        if ($this->input('role') === 'student') {
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
        }

        // Faculty-specific fields
        if ($this->input('role') === 'faculty') {
            $rules = array_merge($rules, [
                'department'        => 'nullable|string|max:255',
                'specialization'    => 'nullable|string|max:255',
                'subjects_handled'  => 'nullable|array',
                'teaching_schedule' => 'nullable|array',
                'research_projects' => 'nullable|array',
            ]);
        }

        return $rules;
    }
}
