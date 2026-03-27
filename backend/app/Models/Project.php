<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Project extends Model
{
    public $timestamps = false;

    protected $fillable = ['name', 'slug', 'description', 'area_id', 'status', 'mid_report', 'final_report', 'mid_seminar', 'final_seminar', 'start_date', 'end_date', 'proposal_id', 'supervisor_id', 'leader_id', 'project_type'];

    public function supervisor()
    {
        return $this->belongsTo(User::class, 'supervisor_id');
    }

    public function leader()
    {
        return $this->belongsTo(User::class, 'leader_id');
    }

    public function members()
    {
        return $this->belongsToMany(User::class, 'project_student', 'project_id', 'user_id');
    }

    public function proposal()
    {
        return $this->belongsTo(Proposal::class, 'proposal_id');
    }

    protected $casts = [
        'start_date' => 'datetime',
    ];
}
