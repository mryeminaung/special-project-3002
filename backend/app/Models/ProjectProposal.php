<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ProjectProposal extends Model
{
    protected $fillable = ['title', 'description', 'slug', 'supervisor_id', 'submitted_at', 'fileUrl', 'members', 'status', 'submitted_by'];

    public function getMembers($members)
    {
        $users = User::where('is_student', true)->get();
        $members = $users->whereIn('id', $members);
        $studentsData = [];

        foreach ($members as $member) {
            $studentsData[] = [
                'id' => $member->id,
                'name' => $member->name,
                'email' => $member->email,
                // 'major' => $member->student->major->name,
                // 'phone_number' => $member->student->phone_number,
            ];
        }
        return $studentsData;
    }

    public function supervisor()
    {
        return $this->belongsTo(User::class, 'supervisor_id', 'id');
    }

    public function submitter()
    {
        return $this->belongsTo(User::class, 'submitted_by', 'id');
    }

    protected $casts = [
        'members' => 'array',
        'submitted_at' => 'datetime',
    ];
}
