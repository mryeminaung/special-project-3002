<?php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\ProjectResource;
use App\Http\Resources\project\StudentProjectResource;
use App\Models\Project;
use App\Services\ProjectService;
use App\Traits\ApiResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ProjectController extends Controller
{
    use ApiResponse;

    public function __construct(
        private ProjectService $projectService
    ) {}

    public function index()
    {
        $projects = $this->projectService->list();

        return $this->successResponse('Projects retrieved successfully.', ProjectResource::collection($projects));
    }

    public function studentProjects()
    {
        $projects = $this->projectService->studentProjects(Auth::user());

        return $this->successResponse('Success', StudentProjectResource::collection($projects));
    }

    public function assignedProjects()
    {
        $projects = $this->projectService->assignedProjects(Auth::user());

        return $this->successResponse('Projects retrieved successfully.', ProjectResource::collection($projects));
    }

    public function show(Project $project)
    {
        $project = $this->projectService->updateMilestoneStatus($project);
        $project->load(['leader', 'supervisor', 'members', 'area', 'examiners']);

        if ($project->type === 'student') {
            return $this->successResponse("Success", new StudentProjectResource($project));
        }

        if ($project->type === 'faculty') {
            return $this->successResponse("Success", new ProjectResource($project));
        }

        return $this->errorResponse('Project type not recognized', 404);
    }

    public function updateSeminarDeadlines(Request $request, Project $project)
    {
        $validated = $request->validate([
            'midSeminarDeadline'   => ['nullable', 'date'],
            'finalSeminarDeadline' => ['nullable', 'date'],
        ]);

        $result = $this->projectService->updateSeminarDeadlines($project, $validated);

        if (! $result['success']) {
            return $this->errorResponse($result['message'], $result['status']);
        }

        return $this->successResponse($result['message'], $result['data']);
    }

    public function updateReportStatus(Request $request, Project $project)
    {
        $validated = $request->validate([
            'type'   => ['required', 'in:mid,final'],
            'status' => ['required', 'in:not submitted,submitted'],
        ]);

        $result = $this->projectService->updateReportStatus(
            $project,
            $validated['type'],
            $validated['status']
        );

        return $this->successResponse($result['message'], $result['data']);
    }

    public function updateSeminarStatus(Request $request, Project $project)
    {
        $validated = $request->validate([
            'type'   => ['required', 'in:mid,final'],
            'status' => ['required', 'in:not completed,completed'],
        ]);

        $result = $this->projectService->updateSeminarStatus(
            $project,
            $validated['type'],
            $validated['status']
        );

        if (! $result['success']) {
            return $this->errorResponse($result['message'], $result['status']);
        }

        return $this->successResponse($result['message'], $result['data']);
    }

    public function syncExaminers(Request $request, Project $project)
    {
        $validated = $request->validate([
            'examiner_ids'   => ['required', 'array', 'max:3'],
            'examiner_ids.*' => ['integer', 'exists:users,id'],
        ]);

        $project = $this->projectService->syncExaminers($project, $validated['examiner_ids']);
        $project->load(['leader', 'supervisor', 'members', 'area', 'examiners']);

        return $this->successResponse('Examiners updated.', new ProjectResource($project));
    }

    public function removeExaminer(Project $project, int $userId)
    {
        $examiner = \App\Models\User::findOrFail($userId);
        $this->projectService->removeExaminer($project, $examiner);

        return $this->successResponse('Examiner removed.', null);
    }

    public function approveReport(Request $request, Project $project)
    {
        $validated = $request->validate([
            'type' => ['required', 'in:mid,final'],
        ]);

        $result = $this->projectService->approveReport($project, $validated['type']);

        if (! $result['success']) {
            return $this->errorResponse($result['message'], $result['status']);
        }

        return $this->successResponse($result['message'], null);
    }

    public function markComplete(Project $project)
    {
        if ($project->status !== 'under review') {
            return $this->errorResponse('Project must be under review before marking complete.', 422);
        }

        $project = $this->projectService->markComplete($project);

        return $this->successResponse('Project marked as completed.', new ProjectResource($project));
    }
}
