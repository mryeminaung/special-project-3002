<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Proposal extends Model
{
    protected $fillable = ['title', 'description', 'slug', 'supervisor_id', 'submitted_at', 'fileUrl', 'status', 'student_id'];

    public function leader()
    {
        return $this->belongsTo(User::class, 'student_id');
    }

    public function members()
    {
        return $this->belongsToMany(User::class, 'proposal_student', 'proposal_id', 'user_id');
    }

    public function supervisor()
    {
        return $this->belongsTo(User::class, 'supervisor_id', 'id');
    }

    public function comments()
    {
        return $this->hasMany(Comment::class, "proposal_id", "id");
    }

    protected $casts = [
        'members' => 'array',
        'submitted_at' => 'datetime',
    ];
}
