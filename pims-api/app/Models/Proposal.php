<?php

namespace App\Models;

use App\Enums\EligibleMajors;
use App\Enums\ProjectType;
use App\Enums\ProposalStatus;
use App\Enums\ProposalType;
use Illuminate\Database\Eloquent\Model;

class Proposal extends Model
{
    protected $fillable = [
        'title',
        'description',
        'area_id',
        'slug',
        'supervisor_id',
        'submitted_at',
        'fileUrl',
        'status',
        'student_id',
        'project_type',
        'type',
        'eligible_majors',
        'max_students',
    ];

    protected $casts = [
        'submitted_at'    => 'datetime',
        'status'          => ProposalStatus::class,
        'type'            => ProposalType::class,
        'project_type'    => ProjectType::class,
        'eligible_majors' => EligibleMajors::class,
    ];

    // student leader (student proposals) or first accepted student (faculty proposals)
    public function leader()
    {
        return $this->belongsTo(User::class, 'student_id');
    }

    // faculty who supervises (student proposals) or faculty who created (faculty proposals)
    public function supervisor()
    {
        return $this->belongsTo(User::class, 'supervisor_id');
    }

    public function creator()
    {
        return $this->type === ProposalType::Faculty
            ? $this->supervisor()
            : $this->leader();
    }

    // accepted members via pivot
    public function members()
    {
        return $this->belongsToMany(User::class, 'proposal_student', 'proposal_id', 'user_id')
            ->wherePivot('status', 'accepted');
    }

    // pending applicants via pivot (faculty proposals)
    public function applicants()
    {
        return $this->belongsToMany(User::class, 'proposal_student', 'proposal_id', 'user_id')
            ->wherePivot('status', 'pending');
    }

    // all pivot entries regardless of status
    public function applications()
    {
        return $this->belongsToMany(User::class, 'proposal_student', 'proposal_id', 'user_id')
            ->withPivot('status');
    }

    public function area()
    {
        return $this->belongsTo(ProjectArea::class, 'area_id');
    }

    public function comments()
    {
        return $this->hasMany(Comment::class, 'proposal_id');
    }

    public function project()
    {
        return $this->hasOne(Project::class, 'proposal_id');
    }
}
