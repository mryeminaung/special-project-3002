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
use Illuminate\Support\Facades\Gate;

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
        Gate::authorize('updateSeminarDeadlines', $project);

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
        Gate::authorize('updateReportStatus', $project);

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
        Gate::authorize('updateSeminarStatus', $project);

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
}
