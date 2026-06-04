<?php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\ProjectProgressResource;
use App\Models\Project;
use App\Models\ProjectArea;
use App\Models\ProjectEvent;
use App\Models\Proposal;
use App\Models\Task;
use App\Models\User;
use Illuminate\Support\Facades\Auth;

class DashboardController extends Controller
{
    public function __invoke()
    {
        $user = Auth::user();

        if ($user->hasRole('IC')) {
            return $this->getICDashboardData();
        }

        if ($user->hasRole('Admin')) {
            return $this->getAdminDashboardData();
        }

        if ($user->hasRole('Supervisor') || $user->hasRole('Faculty')) {
            return $this->getFacultyDashboardData();
        }

        if ($user->hasRole('Student')) {
            return $this->getStudentDashboardData();
        }
    }

    private function getICDashboardData()
    {
        $noOfProposals    = Proposal::count();
        $noOfProjects     = Project::count();
        $noOfSupervisors  = Project::distinct('supervisor_id')->count('supervisor_id');
        $noOfFaculties    = User::where('is_student', false)->count();
        $projectsProgress = ProjectProgressResource::collection(Project::all());

        return response()->json(
            [
                'noOfProposals'    => $noOfProposals,
                'noOfProjects'     => $noOfProjects,
                'noOfSupervisors'  => $noOfSupervisors,
                'noOfFaculties'    => $noOfFaculties,
                'projectsProgress' => $projectsProgress,
            ]
        );
    }

    private function getFacultyDashboardData()
    {
        $authId           = Auth::id();
        $projectMembers   = Proposal::count();
        $assignedProjects = Proposal::count();
        $pendingProposals = Proposal::where('status', 'pending')->where('supervisor_id', $authId)->count();
        $completionRate   = User::where('is_student', false)->count();

        return response()->json([
            'projectMembers'   => $projectMembers,
            'assignedProjects' => $assignedProjects,
            'pendingProposals' => $pendingProposals,
            'completionRate'   => $completionRate,
        ]);
    }

    private function getAdminDashboardData()
    {
        $noOfFaculties    = User::where('is_student', false)->count();
        $noOfStudents     = User::where('is_student', true)->count();
        $noOfProjectAreas = ProjectArea::count();
        $noOfEvents       = ProjectEvent::count();

        return response()->json([
            'noOfStudents'     => $noOfStudents,
            'noOfFaculties'    => $noOfFaculties,
            'noOfProjectAreas' => $noOfProjectAreas,
            'noOfEvents'       => 3,
        ]
        );
    }

    private function getStudentDashboardData()
    {
        $userId        = Auth::id();
        $noOfProposals = Proposal::where('student_id', $userId)
            ->count();
        $noOfProjects = Project::where('leader_id', $userId)
            ->count();
        $noOfTasks = Task::where('assigned_to', $userId)
            ->count();
        $completedTasks = Task::where('assigned_to', $userId)
            ->where('status', 'completed')
            ->count();
        $completionRate = $noOfTasks > 0 ? ($completedTasks / $noOfTasks) * 100 : 0;

        return response()->json([
            'noOfProposals'  => $noOfProposals,
            'noOfProjects'   => $noOfProjects,
            'noOfTasks'      => $noOfTasks,
            'completionRate' => $completionRate,
        ]);
    }
}
