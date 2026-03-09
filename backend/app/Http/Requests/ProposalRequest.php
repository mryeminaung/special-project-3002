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
            'title'           => 'required|unique:proposals,title',
            'description'     => 'required',
            'fileUrl'         => 'required',
            'members'         => 'nullable|array|max:5',
            'type'            => 'nullable|in:student,faculty',
            'max_students'    => 'nullable|integer|min:1|max:10',
            'project_type'    => 'nullable|in:special,capstone,master',
            'eligible_majors' => 'nullable|in:cse,ece,both',
            'area_id'         => 'required|exists:project_areas,id',
            'student_id'      => 'nullable|exists:users,id',
            'supervisor_id'   => 'required|exists:users,id',
        ];
    }

    public function messages(): array
    {
        return [
            'title.unique' => 'The proposal title has already been taken.',
        ];
    }

}
