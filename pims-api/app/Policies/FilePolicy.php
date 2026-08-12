<?php

namespace App\Policies;

use App\Models\User;
use Illuminate\Auth\Access\Response;

class FilePolicy
{
    public function uploadProfilePicture(User $user): bool
    {
        return true;
    }

    public function deleteProfilePicture(User $user): bool
    {
        return true;
    }

    public function uploadReport(User $user): bool
    {
        if ($user->hasRole('student')) {
            return false;
        }

        return true;
    }

    public function deleteReport(User $user): bool
    {
        if ($user->hasRole('student')) {
            return false;
        }

        return true;
    }
}
