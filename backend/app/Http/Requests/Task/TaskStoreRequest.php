<?php
namespace App\Http\Requests\Task;

use Illuminate\Foundation\Http\FormRequest;

class TaskStoreRequest extends FormRequest
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
            'title'       => 'required|string|max:255',
            'description' => 'nullable|string',
            'due_date'    => 'nullable|date',
            'priority'    => 'required|in:low,medium,high',
            'status'      => 'required|in:todo,in_progress,completed',
            'assigned_to' => 'required|exists:users,id',
            'project_id'  => 'required|exists:projects,id',
        ];
    }
}
