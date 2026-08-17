<?php

namespace App\Events;

use App\Models\ProjectEvent;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class ProjectEventCreated
{
    use Dispatchable, SerializesModels;

    public function __construct(public ProjectEvent $event) {}
}
