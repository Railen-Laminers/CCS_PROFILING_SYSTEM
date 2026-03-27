<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class SearchStudentsRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'search'          => 'nullable|string|max:255',
            'program'         => 'nullable|string|in:BSIT,BSCS',
            'year_level'      => 'nullable|integer|min:1|max:4',
            'gender'          => 'nullable|string|in:male,female,other',
            'gpa_min'         => 'nullable|numeric|min:0|max:4',
            'gpa_max'         => 'nullable|numeric|min:0|max:4',
            'sports'          => 'nullable|array',
            'sports.*'        => 'string|max:100',
            'organizations'   => 'nullable|array',
            'organizations.*' => 'string|max:100',
            'per_page'        => 'nullable|integer|min:5|max:100',
        ];
    }
}
