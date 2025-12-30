<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Project extends Model
{
    protected $fillable = ['name', 'description', 'status', 'start_date', 'end_date', 'proposal_id', 'supervisor_id'];

    public function supervisor()
    {
        return $this->belongsTo(User::class, 'id', 'supervisor_id');
    }

    public function students()
    {
        // return $this->hasMany();
    }
}
