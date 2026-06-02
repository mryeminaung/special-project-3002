<?php
namespace App\Http\Controllers;

use App\Http\Resources\SupervisorResource;
use App\Models\Project;
use App\Models\User;

class SupervisorController extends Controller
{
    public function index()
    {
        $supervisors = User::whereIn('id', function ($query) {
            $query->select('supervisor_id')->from('projects');
        })->get();

        return SupervisorResource::collection($supervisors);
    }

    public function show(string $id)
    {
        $supervisor = User::with(['faculty.rank', 'faculty.department'])->findOrFail($id);

        $projects = Project::with(['members'])
            ->where('supervisor_id', $supervisor->id)
            ->orderByDesc('start_date')
            ->get();

        $activeProjects = $projects
            ->where('status', '!=', 'completed')
            ->values()
            ->map(function ($project) {
                return [
                    'id'       => $project->id,
                    'title'    => $project->name,
                    'students' => $project->members->count() . ' Students',
                ];
            });

        $pastProjects = $projects
            ->where('status', 'completed')
            ->values()
            ->map(function ($project) {
                return [
                    'id'      => $project->id,
                    'title'   => $project->name,
                    'year'    => optional($project->start_date)->format('Y'),
                    'outcome' => 'Completed',
                ];
            });

        return response()->json([
            'id'             => $supervisor->id,
            'name'           => $supervisor->name,
            'email'          => $supervisor->email,
            'rank'           => $supervisor->faculty?->rank?->name,
            'faculty'        => $supervisor->faculty?->department?->name,
            'phone'          => $supervisor->faculty?->phone_number,
            'imageUrl'       => $supervisor->avatar_url,
            'activeProjects' => $activeProjects,
            'pastProjects'   => $pastProjects,
        ]);
    }
}
