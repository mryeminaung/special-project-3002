<?php

namespace App\Listeners;

use App\Events\ExaminersUpdated;
use App\Models\User;
use App\Notifications\ExaminerAssignedNotification;

class NotifyNewExaminers
{
    public function handle(ExaminersUpdated $event): void
    {
        if (empty($event->addedUserIds)) {
            return;
        }

        User::whereIn('id', $event->addedUserIds)->each(function (User $user) use ($event) {
            $user->notify(new ExaminerAssignedNotification($event->project));
        });
    }
}
