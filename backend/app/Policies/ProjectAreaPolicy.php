<?php

namespace App\Policies;

use App\Models\ProjectArea;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class ProjectAreaPolicy
{
    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user): bool
    {
        return false;
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, ProjectArea $projectArea): bool
    {
        return false;
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user)
    {
        return $user->hasRole('ic') ? Response::allow() : Response::deny('Only instructors can create project areas.');
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, ProjectArea $projectArea)
    {
        return $user->hasRole('ic') ? Response::allow() : Response::deny('Only instructors can update project areas.');
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, ProjectArea $projectArea)
    {
        return $user->hasRole('ic') ? Response::allow() : Response::deny('Only instructors can delete project areas.');
    }
}
