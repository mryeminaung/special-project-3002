<?php

namespace App\Notifications;

use App\Models\Announcement;
use Illuminate\Notifications\Notification;

class AnnouncementCreatedNotification extends Notification
{
    public function __construct(public Announcement $announcement) {}

    public function via(object $notifiable): array
    {
        return ['database'];
    }

    public function toDatabase(object $notifiable): array
    {
        return [
            'type'  => 'announcement',
            'title' => 'New Announcement',
            'body'  => $this->announcement->title,
            'url'   => '/announcements',
        ];
    }
}
