<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Department extends Model
{
    protected $fillable = ["name"];

    public function faculties()
    {
        return $this->hasMany(Faculty::class, 'department_id');
    }
}
