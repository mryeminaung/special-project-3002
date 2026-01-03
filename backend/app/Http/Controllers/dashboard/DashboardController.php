<?php

namespace App\Http\Controllers\dashboard;

use App\Http\Controllers\Controller;
use App\Http\Resources\UserResource;
use App\Models\ProjectProposal;
use App\Models\Rank;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Spatie\Permission\Models\Role;

class DashboardController extends Controller
{
    public function index()
    {
        $user = Auth::user();

        if ($user->hasRole('IC')) {
            return $this->getICDashboardData();
        }

        if ($user->hasRole('Student Affairs')) {
            return "Student Affairs Role - Reviewing administrative details";
        }

        if ($user->hasRole('Supervisor')) {
            return "Supervisor Role - Mentoring and grading active projects";
        }

        if ($user->hasRole('Student')) {
            return $this->getStudentDashboardData();
        }

        return "No specific role assigned";
    }

    private function getICDashboardData()
    {
        $noOfProposals = ProjectProposal::all()->count();
        return response()->json(
            ['noOfProposals' => $noOfProposals]
        );
    }

    private function getStudentDashboardData()
    {
        return "Student Role - Managing my proposal and team";
    }
}
