<?php

namespace App\Services;

use App\Models\User;
use Illuminate\Database\Eloquent\Collection;

class UserService
{
    public function getFacultiesForProposal(): Collection
    {
        return User::role('faculty')
            ->with('faculty')
            ->get();
    }

    public function getStudentsForProposal(int $currentUserId): Collection
    {
        $existingMemberIds = \Illuminate\Support\Facades\DB::table('proposal_student')
            ->pluck('user_id')
            ->toArray();

        return User::role('student')
            ->where('id', '!=', $currentUserId)
            ->whereNotIn('id', $existingMemberIds)
            ->with('student')
            ->get();
    }

    public function getFacultiesList(): Collection
    {
        return User::role('faculty')->get();
    }
}
