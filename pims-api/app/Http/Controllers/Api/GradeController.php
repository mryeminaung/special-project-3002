<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Grade;
use App\Models\Project;
use App\Services\GradeService;
use App\Traits\ApiResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class GradeController extends Controller
{
    use ApiResponse;

    public function __construct(
        private GradeService $gradeService
    ) {}

    public function index(Project $project)
    {
        $grades = $this->gradeService->list($project);

        return $this->successResponse('Grades retrieved.', $grades);
    }

    public function store(Request $request, Project $project)
    {
        $validated = $request->validate([
            'student_id' => ['required', 'integer', 'exists:users,id'],
            'type'       => ['required', 'in:mid,final'],
            'grade'      => ['required', 'string', 'max:10'],
            'remarks'    => ['nullable', 'string', 'max:1000'],
        ]);

        $result = $this->gradeService->give($project, $validated, Auth::user());

        if (! $result['success']) {
            return $this->errorResponse($result['message'], $result['status']);
        }

        return $this->successResponse($result['message'], $result['data'], 201);
    }

    public function update(Request $request, Project $project, Grade $grade)
    {
        $validated = $request->validate([
            'grade'   => ['required', 'string', 'max:10'],
            'remarks' => ['nullable', 'string', 'max:1000'],
        ]);

        // Only the examiner who gave the grade can update it
        if ($grade->examiner_id !== Auth::id()) {
            return $this->errorResponse('You can only update your own grades.', 403);
        }

        $result = $this->gradeService->update($grade, $validated);

        return $this->successResponse($result['message'], $result['data']);
    }
}
