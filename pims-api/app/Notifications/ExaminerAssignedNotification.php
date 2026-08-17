<?php

namespace App\Notifications;

use App\Models\Project;
use Illuminate\Notifications\Notification;

class ExaminerAssignedNotification extends Notification
{
    public function __construct(public Project $project) {}

    public function via(object $notifiable): array
    {
        return ['database'];
    }

    public function toDatabase(object $notifiable): array
    {
        return [
            'type'  => 'examiner_assigned',
            'title' => 'Assigned as Examiner',
            'body'  => "You have been assigned as an examiner for \"{$this->project->name}\".",
            'url'   => "/projects/{$this->project->slug}",
        ];
    }
}
