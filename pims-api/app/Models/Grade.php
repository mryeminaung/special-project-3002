<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Grade extends Model
{
    protected $fillable = [
        'project_id',
        'student_id',
        'examiner_id',
        'grade',
        'remarks',
        'type',
    ];

    public function project()
    {
        return $this->belongsTo(Project::class);
    }

    public function student()
    {
        return $this->belongsTo(User::class, 'student_id');
    }

    public function examiner()
    {
        return $this->belongsTo(User::class, 'examiner_id');
    }
}
