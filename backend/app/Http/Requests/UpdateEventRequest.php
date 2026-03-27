<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateEventRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'title'          => 'sometimes|string|max:200',
            'description'    => 'sometimes|string',
            'start_datetime' => 'sometimes|date|before:end_datetime',
            'end_datetime'   => 'sometimes|date|after:start_datetime',
        ];
    }
}
