<?php

namespace App\Policies;

use App\Models\Proposal;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class ProposalPolicy
{
    public function viewAny(User $user): bool
    {
        return true;
    }

    public function view(User $user, Proposal $proposal): bool
    {
        return true;
    }

    public function create(User $user): bool
    {
        return true;
    }

    public function approve(User $user, Proposal $proposal)
    {
        return $user->hasRole('ic')
            ? Response::allow()
            : Response::deny('Only instructors can approve proposals.');
    }

    public function reject(User $user, Proposal $proposal)
    {
        return $user->hasRole('ic')
            ? Response::allow()
            : Response::deny('Only instructors can reject proposals.');
    }

    public function delete(User $user, Proposal $proposal)
    {
        if ($user->hasRole('ic')) {
            return Response::allow();
        }

        if ($user->id === $proposal->student_id) {
            return Response::allow();
        }

        return Response::deny('You can only delete your own proposals.');
    }
}
