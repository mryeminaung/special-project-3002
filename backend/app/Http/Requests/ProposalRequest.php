<?php
namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Str;

class ProposalRequest extends FormRequest
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
            'title'         => 'required|unique:proposals,title',
            'description'   => 'required',
            'fileUrl'       => 'required',
            'members'       => 'required',
            'area_id'       => 'required|exists:project_areas,id',
            'student_id'    => 'required|exists:users,id',
            'supervisor_id' => 'required|exists:users,id',
        ];
    }

    public function messages(): array
    {
        return [
            'title.unique' => 'The proposal title has already been taken.',
        ];
    }

    /**
     * Handle a passed validation attempt.
     */
    protected function passedValidation(): void
    {
        $this->merge([
            'slug'         => Str::slug($this->title, '-'),
            'status'       => 'pending',
            'submitted_at' => now(),
        ]);
    }
}
