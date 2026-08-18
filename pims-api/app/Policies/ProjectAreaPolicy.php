<?php

namespace App\Policies;

use App\Models\ProjectArea;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class ProjectAreaPolicy
{
    public function viewAny(User $user): bool
    {
        return true;
    }

    public function view(User $user, ProjectArea $projectArea): bool
    {
        return true;
    }

    public function create(User $user)
    {
        return $user->hasPermissionTo('manage-project-areas')
            ? Response::allow()
            : Response::deny('Unauthorized.');
    }

    public function update(User $user, ProjectArea $projectArea)
    {
        return $user->hasPermissionTo('manage-project-areas')
            ? Response::allow()
            : Response::deny('Unauthorized.');
    }

    public function delete(User $user, ProjectArea $projectArea)
    {
        return $user->hasPermissionTo('manage-project-areas')
            ? Response::allow()
            : Response::deny('Unauthorized.');
    }
}
