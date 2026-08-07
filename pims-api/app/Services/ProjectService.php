<?php

namespace App\Services;

use App\Enums\ProjectProgressStatus;
use App\Models\Project;
use App\Models\User;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Facades\Auth;

class ProjectService
{
    public function list(): Collection
    {
        return Project::with(['leader', 'supervisor', 'members'])->get();
    }

    public function studentProjects(User $user): Collection
    {
        return Project::with(['leader', 'supervisor', 'members'])
            ->where('leader_id', $user->id)
            ->orWhereHas('members', function ($query) use ($user) {
                $query->where('users.id', $user->id);
            })
            ->get();
    }

    public function assignedProjects(User $supervisor): Collection
    {
        return Project::with(['leader', 'supervisor', 'members'])
            ->where('supervisor_id', $supervisor->id)
            ->get();
    }

    public function updateMilestoneStatus(Project $project): Project
    {
        $allMilestonesCompleted =
            $project->mid_report === ProjectProgressStatus::Submitted->value
            && $project->final_report === ProjectProgressStatus::Submitted->value
            && $project->mid_seminar === ProjectProgressStatus::Completed->value
            && $project->final_seminar === ProjectProgressStatus::Completed->value;

        if ($allMilestonesCompleted && $project->status !== 'completed') {
            $project->status = 'under review';
        } else {
            $project->status = 'active';
        }

        $project->save();

        return $project->fresh();
    }

    public function updateSeminarDeadlines(Project $project, array $validated): array
    {
        $midDeadline = $validated['midSeminarDeadline'] ?? null;
        $finalDeadline = $validated['finalSeminarDeadline'] ?? null;
        $isMidSeminarCompleted = $project->mid_seminar === ProjectProgressStatus::Completed->value;

        if ($midDeadline === null && $finalDeadline === null) {
            return ['success' => false, 'message' => 'At least one seminar deadline must be provided.', 'status' => 422];
        }

        if ($isMidSeminarCompleted && $midDeadline !== null) {
            return ['success' => false, 'message' => 'Mid-term seminar is completed, so mid-term deadline cannot be changed.', 'status' => 422];
        }

        if (! $isMidSeminarCompleted && $finalDeadline !== null) {
            return ['success' => false, 'message' => 'Final seminar deadline can be set only after mid-term seminar is completed.', 'status' => 422];
        }

        if ($midDeadline !== null) {
            $project->mid_seminar_deadline = $midDeadline;
        }

        if ($finalDeadline !== null) {
            $project->final_seminar_deadline = $finalDeadline;
        }

        $project->save();

        return [
            'success' => true,
            'message' => 'Seminar deadlines updated successfully.',
            'data' => [
                'midSeminarDeadline'   => $project->mid_seminar_deadline,
                'finalSeminarDeadline' => $project->final_seminar_deadline,
            ],
            'status' => 200,
        ];
    }

    public function updateReportStatus(Project $project, string $type, string $status): array
    {
        $reportField = $type === 'mid' ? 'mid_report' : 'final_report';
        $project->{$reportField} = $status === 'submitted'
            ? ProjectProgressStatus::Submitted->value
            : ProjectProgressStatus::Not_Submitted->value;
        $project->save();

        return [
            'success' => true,
            'message' => 'Report status updated successfully.',
            'data' => [
                'type'   => $type,
                'status' => $status,
            ],
            'status' => 200,
        ];
    }

    public function updateSeminarStatus(Project $project, string $type, string $status): array
    {
        if ($type === 'final' && $project->mid_seminar !== ProjectProgressStatus::Completed->value) {
            return ['success' => false, 'message' => 'Final seminar status can be changed only after mid-term seminar is completed.', 'status' => 422];
        }

        $seminarField = $type === 'mid' ? 'mid_seminar' : 'final_seminar';
        $project->{$seminarField} = $status === 'completed'
            ? ProjectProgressStatus::Completed->value
            : ProjectProgressStatus::Not_Completed->value;

        $allMilestonesCompleted =
            $project->mid_report === ProjectProgressStatus::Submitted->value
            && $project->final_report === ProjectProgressStatus::Submitted->value
            && (($type === 'mid' ? $project->mid_seminar : $status) === ProjectProgressStatus::Completed->value)
            && (($type === 'final' ? $project->final_seminar : $status) === ProjectProgressStatus::Completed->value);

        if ($allMilestonesCompleted && $project->status !== 'completed') {
            $project->status = 'under review';
        }

        $project->save();

        return [
            'success' => true,
            'message' => 'Seminar status updated successfully.',
            'data' => [
                'type'   => $type,
                'status' => $status,
            ],
            'status' => 200,
        ];
    }
}
