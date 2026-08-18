<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ProjectEvent extends Model
{
    protected $fillable = [
        'title', 'detail', 'type', 'start_date', 'end_date', 'is_active', 'format_url',
    ];

    protected $casts = [
        'start_date' => 'datetime',
        'end_date'   => 'datetime',
        'is_active'  => 'boolean',
    ];
}
