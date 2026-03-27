<?php

namespace App\Http\Requests;

use App\Models\User;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rules\Password;
use Illuminate\Validation\Rule;

class UpdateUserRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        // Resolve the user being updated for unique-ignore rules
        $user = User::where('id', $this->route('identifier'))
            ->orWhere('user_id', $this->route('identifier'))
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

        return $rules;
    }
}
