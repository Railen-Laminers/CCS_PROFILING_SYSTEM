<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreEventRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'title'          => 'required|string|max:200',
            'description'    => 'required|string',
            'start_datetime' => 'required|date|before:end_datetime',
            'end_datetime'   => 'required|date|after:start_datetime',
        ];
    }
}
