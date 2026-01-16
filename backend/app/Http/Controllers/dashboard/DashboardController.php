<?php

namespace App\Http\Controllers\dashboard;

use App\Http\Controllers\Controller;
use App\Models\Proposal;
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
        $noOfProposals = Proposal::all()->count();
        return response()->json(
            ['noOfProposals' => $noOfProposals]
        );
    }

    private function getStudentDashboardData()
    {
        return "Student Role - Managing my proposal and team";
    }
}
