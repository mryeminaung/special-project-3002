<?php

namespace App\Listeners;

use App\Events\ProjectEventCreated;
use App\Models\User;
use App\Notifications\ProjectEventCreatedNotification;

class NotifyProjectEvent
{
    public function handle(ProjectEventCreated $event): void
    {
        $notification = new ProjectEventCreatedNotification($event->event);

        User::role('student')->each(fn(User $user) => $user->notify($notification));
    }
}
