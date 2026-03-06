<?php
namespace App\Listeners;

use App\Events\ProposalApproved;
use App\Models\Project;
use Illuminate\Support\Str;

class CreateProjectFromProposal
{
    /**
     * Create the event listener.
     */
    public function __construct()
    {
        //
    }

    /**
     * Handle the event.
     */
    public function handle(ProposalApproved $event): void
    {
        $proposal = $event->proposal;

        // Transform Proposal to Project
        $project = Project::create([
            'name'          => $proposal->title,
            'slug'          => Str::slug($proposal->title) . '-' . time(),
            'description'   => $proposal->description,
            'area_id'       => $proposal->area_id,
            'project_type'  => $proposal->project_type,
            'leader_id'     => $proposal->student_id,
            'supervisor_id' => $proposal->supervisor_id,
            'proposal_id'   => $proposal->id,
            'start_date'    => now(),
        ]);

        // Supervisor Role Assignment
        if (! $project->supervisor->hasRole('Supervisor')) {
            $project->supervisor->assignRole('Supervisor');
        }

        // Project Leader Role Assignment
        // $project->leader->assignRole('Project Leader');

        // Sync the team members
        $memberIds = $proposal->members()->pluck('user_id');
        $project->members()->attach($memberIds);
    }
}
