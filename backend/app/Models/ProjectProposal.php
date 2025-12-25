<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ProjectProposal extends Model
{
    protected $fillable = ['title', 'description', 'supervisor_id', 'submitted_at', 'fileUrl', 'members', 'status', 'submitted_by'];

    public function getSupervisor($supervisorId)
    {
        $user = User::find($supervisorId);
        return [
            'name' => $user->name,
            'email' => $user->email,
        ];
    }

    public function getMembers($members)
    {
        $users = User::where('is_student', true)->get();
        $students = $users->whereIn('id', $members);
        $studentsData = [];

        foreach ($students as $student) {
            $studentsData[] = [
                'id' => $student->id,
                'name' => $student->name,
                'email' => $student->email
            ];
        }
        return $studentsData;
    }

    public function getSubmittedStudent($studentId)
    {
        $student = User::find($studentId);
        return [
            'id' => $student->id,
            'name' => $student->name,
            'email' => $student->email
        ];
    }

    protected $casts = [
        'members' => 'array',
        'submitted_at' => 'datetime',
    ];
}
