<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ProjectArea extends Model
{
    protected $fillable = [
        'name',
        'slug',
        'description',
    ];

    public function projects()
    {
        return $this->hasMany(Project::class, 'area_id');
    }
}
