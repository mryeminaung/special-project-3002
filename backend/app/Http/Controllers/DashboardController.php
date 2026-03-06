<?php
namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Http\Resources\ProjectProgressResource;
use App\Models\Project;
use App\Models\Proposal;
use App\Models\User;
use Illuminate\Support\Facades\Auth;

class DashboardController extends Controller
{
    public function index()
    {
        $user = Auth::user();

        if ($user->hasRole('IC')) {
            return $this->getICDashboardData();
        }

        if ($user->hasRole('Student Affairs')) {
            return $this->getStudentAffairsDashboardData();
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
        $noOfProposals   = Proposal::count();
        $noOfProjects    = Project::count();
        $noOfSupervisors = Project::distinct('supervisor_id')->count('supervisor_id');
        $noOfFaculties   = User::where('is_student', false)->count();

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
        return "Hit";
    }

    private function getStudentAffairsDashboardData()
    {
        return "Student Role - Managing my proposal and team";
    }

    private function getStudentDashboardData()
    {
        $userId        = Auth::id();
        $noOfProposals = Proposal::where('student_id', $userId)
            ->count();
        $noOfProjects = Project::where('leader_id', $userId)
            ->count();

        return response()->json([
            'noOfProposals' => $noOfProposals,
            'noOfProjects'  => $noOfProjects,
        ]);
    }
}
