<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Spatie\Permission\Traits\HasRoles;

class Student extends Model
{
    use HasRoles;
    protected $fillable = ["phone_number", "gpa", "graduation_status", "user_id", "major_id"];

    public function major()
    {
        return $this->belongsTo(Major::class, 'major_id');
    }

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }
}
