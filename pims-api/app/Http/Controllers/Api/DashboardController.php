<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\DashboardService;
use App\Traits\ApiResponse;
use Illuminate\Support\Facades\Auth;

class DashboardController extends Controller
{
    use ApiResponse;

    public function __construct(
        private DashboardService $dashboardService
    ) {}

    public function __invoke()
    {
        $user = Auth::user();

        if ($user->hasRole('ic')) {
            return $this->successResponse('Dashboard data', $this->dashboardService->getICDashboardData());
        }

        if ($user->hasRole('admin')) {
            return $this->successResponse('Dashboard data', $this->dashboardService->getAdminDashboardData());
        }

        if ($user->hasRole('student-affairs')) {
            return $this->successResponse('Dashboard data', $this->dashboardService->getStudentAffairsDashboardData());
        }

        if ($user->hasRole('supervisor') || $user->hasRole('faculty')) {
            return $this->successResponse('Dashboard data', $this->dashboardService->getFacultyDashboardData($user->id));
        }

        if ($user->hasRole('student')) {
            return $this->successResponse('Dashboard data', $this->dashboardService->getStudentDashboardData($user->id));
        }

        return $this->errorResponse('No dashboard data available for your role.', 403);
    }
}
