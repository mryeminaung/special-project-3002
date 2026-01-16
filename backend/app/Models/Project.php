<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Project extends Model
{
    protected $fillable = ['name', 'slug', 'description', 'status', 'mid_report', 'final_report', 'start_date', 'end_date', 'proposal_id', 'supervisor_id'];

    public function supervisor()
    {
        return $this->belongsTo(User::class, 'id', 'supervisor_id');
    }

    public function leader()
    {
        return $this->belongsTo(User::class, 'id', 'leader_id');
    }

    public function members()
    {
        return $this->belongsToMany(User::class, 'project_student', 'project_id', 'user_id');
    }

    public function proposal()
    {
        return $this->belongsTo(Proposal::class, 'id', 'proposal_id');
    }
}
