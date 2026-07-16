<?php

namespace App\Services;

use App\Http\Resources\ProjectProgressResource;
use App\Models\Project;
use App\Models\ProjectArea;
use App\Models\ProjectEvent;
use App\Models\Proposal;
use App\Models\User;

class DashboardService
{
    public function getICDashboardData(): array
    {
        $noOfProposals    = Proposal::count();
        $noOfProjects     = Project::count();
        $noOfSupervisors  = Project::distinct('supervisor_id')->count('supervisor_id');
        $noOfFaculties    = User::where('is_student', false)->count();
        $projectsProgress = ProjectProgressResource::collection(Project::all());

        return [
            'noOfProposals'    => $noOfProposals,
            'noOfProjects'     => $noOfProjects,
            'noOfSupervisors'  => $noOfSupervisors,
            'noOfFaculties'    => $noOfFaculties,
            'projectsProgress' => $projectsProgress,
        ];
    }

    public function getFacultyDashboardData(int $userId): array
    {
        $assignedProjects = Project::where('supervisor_id', $userId)->count();
        $pendingProposals = Proposal::where('status', 'pending')
            ->where('supervisor_id', $userId)
            ->count();
        $totalProposals = Proposal::where('supervisor_id', $userId)->count();

        return [
            'assignedProjects' => $assignedProjects,
            'pendingProposals' => $pendingProposals,
            'totalProposals'   => $totalProposals,
        ];
    }

    public function getAdminDashboardData(): array
    {
        $noOfFaculties    = User::where('is_student', false)->count();
        $noOfStudents     = User::where('is_student', true)->count();
        $noOfProjectAreas = ProjectArea::count();
        $noOfEvents       = ProjectEvent::count();

        return [
            'noOfStudents'     => $noOfStudents,
            'noOfFaculties'    => $noOfFaculties,
            'noOfProjectAreas' => $noOfProjectAreas,
            'noOfEvents'       => $noOfEvents,
        ];
    }

    public function getStudentDashboardData(int $userId): array
    {
        $noOfProposals = Proposal::where('student_id', $userId)->count();
        $noOfProjects = Project::where('leader_id', $userId)->count();

        return [
            'noOfProposals' => $noOfProposals,
            'noOfProjects'  => $noOfProjects,
        ];
    }
}
