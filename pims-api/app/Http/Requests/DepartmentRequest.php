<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Str;

class DepartmentRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'name' => 'required|string|unique:departments,name|max:255',
            'code' => 'required|string|unique:departments,code|max:255',
        ];
    }

    public function messages()
    {
        return [
            "name.unique" => "The department name must be unique.",
            "code.unique" => "The department code must be unique.",
        ];
    }

    public function passedValidation()
    {
        $this->merge([
            'slug' => Str::slug($this->name),
        ]);
    }
}
