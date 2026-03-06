<?php
namespace App\Http\Controllers;

use App\Http\Requests\Task\TaskStoreRequest;
use App\Models\Task;
use Illuminate\Http\Request;

class TaskController extends Controller
{
    public function index()
    {
        return Task::all();
    }

    public function store(TaskStoreRequest $request)
    {
        Task::create($request->validated());
        return response()->json(['message' => 'Task created successfully']);
    }

    public function update(Request $request, Task $task)
    {
        return "Task Update: " . $task->id;
    }

    public function destroy(Task $task)
    {
        $task->delete();

        return response()->json(['message' => 'Task deleted successfully']);
    }
}
