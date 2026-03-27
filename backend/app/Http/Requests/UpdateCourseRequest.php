<?php

namespace App\Http\Requests;

use App\Models\Course;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateCourseRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $course = Course::findOrFail($this->route('id'));

        return [
            'credits' => 'sometimes|integer|min:1|max:6',
            'course_code' => [
                'sometimes', 'string', 'max:20',
                Rule::unique('courses', 'course_code')->ignore($course->course_id, 'course_id'),
            ],
            'course_title' => [
                'sometimes', 'string', 'max:100',
                Rule::unique('courses', 'course_title')->ignore($course->course_id, 'course_id'),
            ],
        ];
    }
}
