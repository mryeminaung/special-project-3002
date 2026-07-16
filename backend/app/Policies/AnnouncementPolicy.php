<?php

namespace App\Policies;

use App\Models\Announcement;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class AnnouncementPolicy
{
    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user): bool
    {
        return true;
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user)
    {
        return $user->hasRole('ic') ? Response::allow() : Response::deny('Only instructors can create announcements.');
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, Announcement $announcement)
    {
        return $user->hasRole('ic') ? Response::allow() : Response::deny('Only instructors can update announcements.');
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, Announcement $announcement)
    {
        return $user->hasRole('ic') ? Response::allow() : Response::deny('Only instructors can delete announcements.');
    }
}
