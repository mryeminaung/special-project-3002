<?php

namespace App\Listeners;

use App\Events\ProposalApproved;
use App\Notifications\ProposalApprovedNotification;
use Illuminate\Support\Collection;

class NotifyProposalApproved
{
    public function handle(ProposalApproved $event): void
    {
        $proposal = $event->proposal->load(['leader', 'supervisor', 'members']);

        // Collect all recipients: leader + team members + supervisor
        $recipients = collect();

        if ($proposal->leader) {
            $recipients->push($proposal->leader);
        }

        $recipients = $recipients->merge($proposal->members);

        if ($proposal->supervisor) {
            $recipients->push($proposal->supervisor);
        }

        $recipients->unique('id')->each(function ($user) use ($proposal) {
            $user->notify(new ProposalApprovedNotification($proposal));
        });
    }
}
