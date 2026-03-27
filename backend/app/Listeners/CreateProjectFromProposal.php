<?php
namespace App\Listeners;

use App\Enums\ProjectProgressStatus;
use App\Events\ProposalApproved;
use App\Models\Project;

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
            'slug'          => $proposal->slug,
            'description'   => $proposal->description,
            'area_id'       => $proposal->area_id,
            'project_type'  => $proposal->project_type,
            'leader_id'     => $proposal->student_id,
            'supervisor_id' => $proposal->supervisor_id,
            'proposal_id'   => $proposal->id,
            'start_date'    => now(),
            'mid_report'    => ProjectProgressStatus::Not_Submitted,
            'mid_seminar'   => ProjectProgressStatus::Not_Completed,
            'final_report'  => ProjectProgressStatus::Not_Submitted,
            'final_seminar' => ProjectProgressStatus::Not_Completed,
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
