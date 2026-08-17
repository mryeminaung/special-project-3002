<?php

namespace App\Providers;

use App\Events\AnnouncementCreated;
use App\Events\ExaminersUpdated;
use App\Events\ProjectEventCreated;
use App\Events\ProposalApproved;
use App\Listeners\CreateProjectFromProposal;
use App\Listeners\NotifyAnnouncement;
use App\Listeners\NotifyNewExaminers;
use App\Listeners\NotifyProjectEvent;
use App\Listeners\NotifyProposalApproved;
use Illuminate\Foundation\Support\Providers\EventServiceProvider as ServiceProvider;

class EventServiceProvider extends ServiceProvider
{
    protected $listen = [
        ProposalApproved::class => [
            CreateProjectFromProposal::class,
            NotifyProposalApproved::class,
        ],
        ExaminersUpdated::class => [
            NotifyNewExaminers::class,
        ],
        AnnouncementCreated::class => [
            NotifyAnnouncement::class,
        ],
        ProjectEventCreated::class => [
            NotifyProjectEvent::class,
        ],
    ];
}
