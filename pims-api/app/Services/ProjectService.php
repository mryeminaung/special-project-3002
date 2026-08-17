<?php

namespace App\Services;

use App\Enums\ProjectProgressStatus;
use App\Events\ExaminersUpdated;
use App\Models\Project;
use App\Models\User;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class ProjectService
{
    public function list(): Collection
    {
        return Project::with(['leader', 'supervisor', 'members', 'area', 'examiners'])->get();
    }

    public function studentProjects(User $user): Collection
    {
        return Project::with(['leader', 'supervisor', 'members', 'area'])
            ->where('leader_id', $user->id)
            ->orWhereHas('members', function ($query) use ($user) {
                $query->where('users.id', $user->id);
            })
            ->get();
    }

    public function assignedProjects(User $supervisor): Collection
    {
        return Project::with(['leader', 'supervisor', 'members', 'area'])
            ->where('supervisor_id', $supervisor->id)
            ->get();
    }

    public function updateMilestoneStatus(Project $project): Project
    {
        $allMilestonesCompleted =
            $project->mid_report_approved
            && $project->final_report_approved
            && $project->mid_seminar === ProjectProgressStatus::Completed->value
            && $project->final_seminar === ProjectProgressStatus::Completed->value;

        if ($allMilestonesCompleted && $project->status !== 'completed') {
            $project->status = 'under review';
        } elseif (! $allMilestonesCompleted && $project->status !== 'completed') {
            $project->status = 'active';
        }

        $project->save();

        return $project->fresh();
    }

    public function approveReport(Project $project, string $type): array
    {
        $reportField   = $type === 'mid' ? 'mid_report'          : 'final_report';
        $approvedField = $type === 'mid' ? 'mid_report_approved'  : 'final_report_approved';

        if ($project->{$reportField} !== ProjectProgressStatus::Submitted->value) {
            return ['success' => false, 'message' => 'Report has not been submitted by the student yet.', 'status' => 422];
        }

        $project->{$approvedField} = true;
        $project->save();

        $this->updateMilestoneStatus($project);

        return ['success' => true, 'message' => ucfirst($type) . '-term report approved.', 'status' => 200];
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

        $midReport    = $type === 'mid'   ? $project->mid_report   : $project->mid_report;
        $finalReport  = $type === 'final' ? $project->final_report  : $project->final_report;

        $allDone =
            $midReport   === ProjectProgressStatus::Submitted->value
            && $finalReport  === ProjectProgressStatus::Submitted->value
            && $project->mid_seminar   === ProjectProgressStatus::Completed->value
            && $project->final_seminar === ProjectProgressStatus::Completed->value;

        if ($allDone && $project->status !== 'completed') {
            $project->status = 'under review';
        }

        $project->save();

        return [
            'success' => true,
            'message' => 'Report status updated successfully.',
            'data' => ['type' => $type, 'status' => $status],
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

    public function syncExaminers(Project $project, array $userIds): Project
    {
        return DB::transaction(function () use ($project, $userIds) {
            $current = $project->examiners()->pluck('users.id')->toArray();
            $added   = array_diff($userIds, $current);
            $removed = array_diff($current, $userIds);

            $project->examiners()->sync($userIds);

            ExaminersUpdated::dispatch($project, $added);

            foreach ($added as $id) {
                $user = User::find($id);
                if ($user && ! $user->hasRole('examiner')) {
                    $user->assignRole('examiner');
                }
            }

            foreach ($removed as $id) {
                $this->demoteExaminerIfIdle(User::find($id), $project->id);
            }

            return $project->load('examiners');
        });
    }

    public function removeExaminer(Project $project, User $examiner): void
    {
        DB::transaction(function () use ($project, $examiner) {
            $project->examiners()->detach($examiner->id);
            $this->demoteExaminerIfIdle($examiner, $project->id);
        });
    }

    public function markComplete(Project $project): Project
    {
        return DB::transaction(function () use ($project) {
            $examiners = $project->examiners()->get();

            $project->update(['status' => 'completed']);

            foreach ($examiners as $examiner) {
                $this->demoteExaminerIfIdle($examiner, $project->id);
            }

            return $project->fresh();
        });
    }

    private function demoteExaminerIfIdle(?User $user, int $excludeProjectId): void
    {
        if (! $user) return;

        $stillExamining = DB::table('project_examiner')
            ->join('projects', 'project_examiner.project_id', '=', 'projects.id')
            ->where('project_examiner.user_id', $user->id)
            ->where('projects.id', '!=', $excludeProjectId)
            ->where('projects.status', '!=', 'completed')
            ->exists();

        if (! $stillExamining && $user->hasRole('examiner')) {
            $user->removeRole('examiner');
        }
    }
}
