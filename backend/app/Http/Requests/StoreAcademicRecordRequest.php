<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreAcademicRecordRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'course_name'             => 'nullable|string|max:255',
            'year_level'              => 'nullable|string|max:50',
            'semester'                => 'nullable|string|max:50',
            'gpa'                     => 'nullable|numeric|min:0|max:5',
            'current_subjects'        => 'nullable|array',
            'academic_awards'         => 'nullable|array',
            'quiz_bee_participations' => 'nullable|array',
            'programming_contests'    => 'nullable|array',
        ];
    }
}
