<?php
namespace App\Http\Controllers;

use App\Http\Resources\ProjectResource;
use App\Http\Resources\project\StudentProjectResource;
use App\Models\Project;
use App\Traits\ApiResponse;
use Illuminate\Support\Facades\Auth;

class ProjectController extends Controller
{
    use ApiResponse;

    public function index()
    {
        $projects = Project::with(['leader', 'supervisor', 'members'])->get();
        return ProjectResource::collection($projects);
    }

    public function studentProjects()
    {
        $projects = Project::all();

        return $this->successResponse("Success", StudentProjectResource::collection($projects));
    }

    public function assignedProjects()
    {
        $projects = Project::with(['leader', 'supervisor', 'members'])
            ->where('supervisor_id', Auth::id())
            ->get();
        return ProjectResource::collection($projects);
    }

    public function show(Project $project)
    {
        return new ProjectResource($project->load(['leader', 'supervisor', 'members']));
    }
}
