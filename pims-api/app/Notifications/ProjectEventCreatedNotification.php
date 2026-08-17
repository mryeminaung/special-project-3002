<?php

namespace App\Notifications;

use App\Models\ProjectEvent;
use Illuminate\Notifications\Notification;

class ProjectEventCreatedNotification extends Notification
{
    public function __construct(public ProjectEvent $event) {}

    public function via(object $notifiable): array
    {
        return ['database'];
    }

    public function toDatabase(object $notifiable): array
    {
        return [
            'type'  => 'project_event',
            'title' => 'New Project Event',
            'body'  => "A new \"{$this->event->type}\" project event is now open for proposals.",
            'url'   => '/proposals/me',
        ];
    }
}
