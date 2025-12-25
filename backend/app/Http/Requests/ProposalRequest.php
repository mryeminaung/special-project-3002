<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use App\Models\User;

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
            'title' => 'required',
            'description' => 'required',
            'fileUrl' => 'required',
            'members' => 'required',
            // 'submitted_by' => [
            //     'required',
            //     function ($attribute, $value, $fail) {
            //         $user = User::find($value);
            //         if (!$user || !$user->roles()->where('name', 'Student')->exists()) {
            //             $fail('The selected user must be a Student.');
            //         }
            //     },
            'supervisor_id' => [
                'required',
                function ($attribute, $value, $fail) {
                    $user = User::find($value);
                    if (!$user || !$user->roles()->where('name', 'Faculty')->exists()) {
                        $fail('The selected supervisor must be a Faculty member.');
                    }
                },
            ],
        ];
    }
}
