<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreCourseRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'credits'      => 'required|integer|min:1|max:6',
            'course_code'  => 'required|string|max:20|unique:courses,course_code',
            'course_title' => 'required|string|max:100|unique:courses,course_title',
        ];
    }
}
