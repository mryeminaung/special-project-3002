<?php
namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ProjectEventStoreRequest extends FormRequest
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
            'title'      => 'nullable|string|max:255',
            'detail'     => 'nullable|string',
            'type'       => 'required|in:special,capstone,master/thesis',
            'start_date' => 'nullable|date',
            'end_date'   => 'nullable|date|after_or_equal:start_date',
            'is_active'  => 'required|boolean',
        ];
    }
}
