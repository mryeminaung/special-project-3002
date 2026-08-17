<?php

namespace App\Listeners;

use App\Enums\AnnouncementAudience;
use App\Events\AnnouncementCreated;
use App\Models\User;
use App\Notifications\AnnouncementCreatedNotification;

class NotifyAnnouncement
{
    public function handle(AnnouncementCreated $event): void
    {
        $announcement = $event->announcement;
        $notification = new AnnouncementCreatedNotification($announcement);

        $roles = match ($announcement->audience) {
            AnnouncementAudience::STUDENTS->value,
            AnnouncementAudience::STUDENTS  => ['student'],
            AnnouncementAudience::FACULTIES->value,
            AnnouncementAudience::FACULTIES => ['faculty', 'supervisor'],
            default                          => ['student', 'faculty', 'supervisor'],
        };

        User::role($roles)->each(fn(User $user) => $user->notify($notification));
    }
}
