<?php
namespace App\Providers;

use App\Events\ProposalApproved;
use App\Listeners\CreateProjectFromProposal;
use Illuminate\Foundation\Support\Providers\EventServiceProvider as ServiceProvider;

class EventServiceProvider extends ServiceProvider
{
    /**
     * The event to listener mappings for the application.
     *
     * @var array<class-string, array<int, class-string>>
     */
    protected $listen = [
        ProposalApproved::class => [
            CreateProjectFromProposal::class,
        ],
    ];
}
