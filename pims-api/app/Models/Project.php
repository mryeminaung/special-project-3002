<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Project extends Model
{
    protected $fillable = [
        'name',
        'slug',
        'description',
        'area_id',
        'academic_year_id',
        'status',
        'mid_report_approved',
        'final_report_approved',
        'mid_report',
        'final_report',
        'mid_seminar',
        'final_seminar',
        'start_date',
        'end_date',
        'proposal_id',
        'supervisor_id',
        'leader_id',
        'project_type',
        'type',
        'mid_report_url',
        'final_report_url',
        'mid_seminar_deadline',
        'final_seminar_deadline',
    ];

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

    public function area()
    {
        return $this->belongsTo(ProjectArea::class, 'area_id');
    }

    public function examiners()
    {
        return $this->belongsToMany(User::class, 'project_examiner', 'project_id', 'user_id')->withTimestamps();
    }

    protected $casts = [
        'start_date' => 'datetime',
    ];
}
