<?php

namespace App\Services;

use App\Models\User;
use Illuminate\Database\Eloquent\Collection;

class UserService
{
    public function getFacultiesForProposal(): Collection
    {
        return User::where('is_student', false)
            ->whereNotIn('id', function ($query) {
                $query->select('user_id')->from('model_has_roles')
                    ->whereIn('role_id', function ($q) {
                        $q->select('id')->from('roles')
                            ->whereIn('name', ['admin', 'student-affairs']);
                    });
            })
            ->with('faculty')
            ->get();
    }

    public function getStudentsForProposal(int $currentUserId): Collection
    {
        $existingMemberIds = \Illuminate\Support\Facades\DB::table('proposal_student')
            ->pluck('user_id')
            ->toArray();

        return User::where('is_student', true)
            ->where('id', '!=', $currentUserId)
            ->whereNotIn('id', $existingMemberIds)
            ->with('student')
            ->get();
    }

    public function getFacultiesList(): Collection
    {
        return User::where('is_student', false)
            ->whereNotIn('id', function ($query) {
                $query->select('user_id')->from('model_has_roles')
                    ->whereIn('role_id', function ($q) {
                        $q->select('id')->from('roles')
                            ->whereIn('name', ['admin', 'student-affairs']);
                    });
            })
            ->get();
    }
}
