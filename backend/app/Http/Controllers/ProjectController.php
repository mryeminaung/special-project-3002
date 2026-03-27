<?php
namespace App\Http\Controllers;

use App\Http\Resources\ProjectResource;
use App\Models\Project;
use Illuminate\Support\Facades\Auth;

class ProjectController extends Controller
{
    public function index()
    {
        $projects = Project::with(['leader', 'supervisor', 'members'])->get();
        return ProjectResource::collection($projects);
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
