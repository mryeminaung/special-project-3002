<?php

namespace App\Models;

use App\Enums\AnnouncementAudience;
use Illuminate\Database\Eloquent\Model;

class Announcement extends Model
{
    protected $fillable = [
        'title',
        'description',
        'audience',
        'created_by',
    ];

    public function casts()
    {
        return [
            'audience' => AnnouncementAudience::class,
        ];
    }

    public function announcer()
    {
        return $this->belongsTo(User::class, 'created_by');
    }
}
