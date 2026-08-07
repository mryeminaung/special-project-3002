<?php

namespace App\Policies;

use App\Models\Project;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class ProjectPolicy
{
    public function viewAny(User $user): bool
    {
        return true;
    }

    public function view(User $user, Project $project): bool
    {
        return true;
    }

    public function updateSeminarDeadlines(User $user, Project $project)
    {
        if ($user->hasRole('Student')) {
            return Response::deny('Students are not allowed to update seminar deadlines.');
        }

        return Response::allow();
    }

    public function updateReportStatus(User $user, Project $project)
    {
        if ($user->hasRole('Student')) {
            return Response::deny('Students are not allowed to update report status.');
        }

        return Response::allow();
    }

    public function updateSeminarStatus(User $user, Project $project)
    {
        if ($user->hasRole('Student')) {
            return Response::deny('Students are not allowed to update seminar status.');
        }

        return Response::allow();
    }
}
