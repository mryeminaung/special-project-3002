<?php

namespace App\Notifications;

use App\Models\Proposal;
use Illuminate\Notifications\Notification;

class ProposalApprovedNotification extends Notification
{
    public function __construct(public Proposal $proposal) {}

    public function via(object $notifiable): array
    {
        return ['database'];
    }

    public function toDatabase(object $notifiable): array
    {
        return [
            'type'  => 'proposal_approved',
            'title' => 'Proposal Approved',
            'body'  => "Your proposal \"{$this->proposal->title}\" has been approved. A project has been created.",
            'url'   => "/projects/{$this->proposal->slug}",
        ];
    }
}
