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

    public function getStudents()
    {
        return User::role('student')
            ->leftJoin('students', 'users.id', '=', 'students.user_id')
            ->leftJoin('majors', 'students.major_id', '=', 'majors.id')
            ->select(
                'users.id',
                'users.name',
                'users.email',
                'users.avatar_url',
                'users.created_at as registered_at',
                'students.phone_number',
                'students.gpa',
                'students.graduation_status',
                'students.batch',
                'majors.name as major_name'
            )
            ->orderBy('users.name')
            ->get();
    }

    public function getStudentFilters()
    {
        $majors = \App\Models\Major::pluck('name')->filter()->values();
        $batches = \App\Models\Student::whereNotNull('batch')
            ->distinct()
            ->pluck('batch')
            ->filter()
            ->sort()
            ->values();

        return [
            'majors' => $majors,
            'batches' => $batches,
        ];
    }
}
