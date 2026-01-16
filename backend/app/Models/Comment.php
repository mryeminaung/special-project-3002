<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Comment extends Model
{
    protected $fillable = ['description', 'proposal_id', 'user_id'];

    public function proposal()
    {
        return $this->belongsTo(Proposal::class, "proposal_id");
    }

    public function author()
    {
        return $this->belongsTo(User::class, "user_id");
    }
}
