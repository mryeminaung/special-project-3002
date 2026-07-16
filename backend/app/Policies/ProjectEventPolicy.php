<?php

namespace App\Policies;

use App\Models\ProjectEvent;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class ProjectEventPolicy
{
    public function viewAny(User $user): bool
    {
        return true;
    }

    public function view(User $user, ProjectEvent $projectEvent): bool
    {
        return true;
    }

    public function create(User $user)
    {
        return $user->hasRole('ic')
            ? Response::allow()
            : Response::deny('Only instructors can create project events.');
    }

    public function update(User $user, ProjectEvent $projectEvent)
    {
        return $user->hasRole('ic')
            ? Response::allow()
            : Response::deny('Only instructors can update project events.');
    }

    public function delete(User $user, ProjectEvent $projectEvent)
    {
        return $user->hasRole('ic')
            ? Response::allow()
            : Response::deny('Only instructors can delete project events.');
    }
}
