<?php

namespace App\Http\Requests\auth;

use Illuminate\Foundation\Http\FormRequest;

class UpdateProfileRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'phoneNo' => 'required|string|max:20',
            'address' => 'required|string|max:255',
        ];
    }
}
