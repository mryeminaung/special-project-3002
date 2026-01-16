<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Faculty extends Model
{
    protected $fillable = ['phone_number', 'user_id', 'rank_id', 'department_id'];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function department()
    {
        return $this->belongsTo(Department::class);
    }

    public function rank()
    {
        return $this->belongsTo(Rank::class);
    }

    public function projects()
    {
        return $this->hasMany(Project::class, "supervisor_id");
    }
}
