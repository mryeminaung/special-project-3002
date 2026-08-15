<?php

namespace App\Services;

use App\Enums\ProjectEventType;
use App\Enums\ProjectType;
use App\Enums\ProposalStatus;
use App\Enums\ProposalType;
use App\Events\ProposalApproved;
use App\Models\Proposal;
use App\Models\ProjectEvent;
use App\Models\User;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class ProposalService
{
    public function listPaginated(): LengthAwarePaginator
    {
        return Proposal::with('supervisor:id,name', 'area:id,name')->orderBy('id')->paginate(5);
    }

    public function create(array $data, User $user): array
    {
        $eventType = $data['project_type'] ?? null;
        if ($eventType) {
            $eventCheck = $this->validateProjectEvent($eventType);
            if (! $eventCheck['valid']) {
                return ['success' => false, 'message' => $eventCheck['message']];
            }
        }

        $data['slug']         = Str::slug($data['title'], '-');
        $data['submitted_at'] = now();

        if (($data['type'] ?? ProposalType::Student->value) === ProposalType::Student->value) {
            $studentId = $user->id;

            $isLeader = Proposal::where('student_id', $studentId)
                ->whereNotNull('student_id')
                ->exists();

            $isMember = DB::table('proposal_student')
                ->where('user_id', $studentId)
                ->where('status', 'accepted')
                ->exists();

            if ($isLeader || $isMember) {
                return ['success' => false, 'message' => 'Student is already part of another proposal as leader or member.'];
            }

            $data['student_id'] = $user->id;
        } else {
            $data['student_id'] = null;
        }

        return DB::transaction(function () use ($data) {
            $proposal = Proposal::create($data);

            return ['success' => true, 'proposal' => $proposal];
        });
    }

    public function syncMembers(Proposal $proposal, array $memberIds): void
    {
        $members = collect($memberIds)->mapWithKeys(function ($memberId) {
            return [(int) $memberId => ['status' => 'accepted']];
        })->toArray();

        $proposal->applications()->syncWithoutDetaching($members);
    }

    public function approveByIC(Proposal $proposal): array
    {
        if ($proposal->status === ProposalStatus::Approved) {
            return ['success' => false, 'message' => 'This proposal is already a project.'];
        }

        return DB::transaction(function () use ($proposal) {
            $proposal->update(['status' => ProposalStatus::Approved]);

            event(new ProposalApproved($proposal->fresh()));

            return ['success' => true, 'message' => 'Proposal transformed to Project successfully!'];
        });
    }

    public function rejectByIC(Proposal $proposal): array
    {
        $proposal->update(['status' => ProposalStatus::Rejected]);

        return ['success' => true, 'message' => 'Proposal Rejected!'];
    }

    public function browseBySupervisor(User $supervisor): LengthAwarePaginator
    {
        return Proposal::where('supervisor_id', $supervisor->id)
            ->with('supervisor:id,name', 'area:id,name')
            ->orderBy('id')
            ->paginate(5);
    }

    public function listFacultyProposals(): Collection
    {
        return Proposal::where('type', ProposalType::Faculty)
            ->with(['applications' => fn($q) => $q->withPivot('status'), 'supervisor:id,name'])
            ->withCount('applications')
            ->orderBy('id')
            ->get();
    }

    public function getJoinedProposalsCount(User $user): int
    {
        return DB::table('proposal_student')
            ->where('user_id', $user->id)
            ->count();
    }

    public function joinFacultyProposal(Proposal $proposal, User $user): array
    {
        if (! $user->hasRole('student')) {
            return ['success' => false, 'message' => 'Only students can join faculty proposals.', 'status' => 403];
        }

        if ($proposal->type !== ProposalType::Faculty || $proposal->status !== ProposalStatus::Approved) {
            return ['success' => false, 'message' => 'Only approved faculty proposals can be joined.', 'status' => 422];
        }

        $eventCheck = $this->validateProjectEvent($proposal->project_type->value);
        if (! $eventCheck['valid']) {
            return ['success' => false, 'message' => $eventCheck['message'], 'status' => 422];
        }

        $alreadyJoined = DB::table('proposal_student')
            ->where('proposal_id', $proposal->id)
            ->where('user_id', $user->id)
            ->exists();

        if ($alreadyJoined) {
            return ['success' => false, 'message' => 'You have already joined this proposal.', 'status' => 422];
        }

        $joinedProposalsCount = $this->getJoinedProposalsCount($user);

        if ($joinedProposalsCount >= 2) {
            return ['success' => false, 'message' => 'Students can join up to 2 proposals only.', 'status' => 422];
        }

        $currentMembersCount = $proposal->applications()->count();
        $maxStudents         = $proposal->max_students ?? 0;

        if ($maxStudents > 0 && $currentMembersCount >= $maxStudents) {
            return ['success' => false, 'message' => 'This proposal has no available slots left.', 'status' => 422];
        }

        DB::transaction(function () use ($proposal, $user) {
            $proposal->applications()->syncWithoutDetaching([
                $user->id => ['status' => 'pending'],
            ]);
        });

        return [
            'success' => true,
            'message' => 'Joined proposal successfully.',
            'data'    => [
                'proposal_id'        => $proposal->id,
                'available_slots'    => max($maxStudents - ($currentMembersCount + 1), 0),
                'joined_proposals'   => $joinedProposalsCount + 1,
                'joined_proposal'    => true,
                'application_status' => 'pending',
            ],
            'status'  => 201,
        ];
    }

    public function acceptApplicant(Proposal $proposal, User $student, User $authUser): array
    {
        if ($authUser->id !== $proposal->supervisor_id) {
            return ['success' => false, 'message' => 'Only the proposal supervisor can accept applicants.', 'status' => 403];
        }

        $application = DB::table('proposal_student')
            ->where('proposal_id', $proposal->id)
            ->where('user_id', $student->id)
            ->first();

        if (! $application) {
            return ['success' => false, 'message' => 'Application not found for this student.', 'status' => 404];
        }

        if ($application->status === 'accepted') {
            return ['success' => true, 'message' => 'Student is already accepted.', 'data' => null, 'status' => 200];
        }

        $acceptedCount = DB::table('proposal_student')
            ->where('proposal_id', $proposal->id)
            ->where('status', 'accepted')
            ->count();

        $maxStudents = $proposal->max_students ?? 0;

        if ($maxStudents > 0 && $acceptedCount >= $maxStudents) {
            return ['success' => false, 'message' => 'This proposal has reached its student slot limit.', 'status' => 422];
        }

        DB::table('proposal_student')
            ->where('proposal_id', $proposal->id)
            ->where('user_id', $student->id)
            ->update(['status' => 'accepted', 'updated_at' => now()]);

        $acceptedCount = DB::table('proposal_student')
            ->where('proposal_id', $proposal->id)
            ->where('status', 'accepted')
            ->count();

        // If the project already exists (created at IC approval), sync this student into it.
        $project = $proposal->project()->first();
        if ($project && ! $project->members()->where('users.id', $student->id)->exists()) {
            $project->members()->attach($student->id);
        }

        // When team is full, promote the first accepted student to project leader
        // (replaces the temporary supervisor placeholder set at IC approval time).
        if ($maxStudents > 0 && $acceptedCount >= $maxStudents && $project) {
            $leaderId = DB::table('proposal_student')
                ->where('proposal_id', $proposal->id)
                ->where('status', 'accepted')
                ->orderBy('id')
                ->value('user_id');

            if ($leaderId && $project->leader_id === $project->supervisor_id) {
                $project->update(['leader_id' => $leaderId]);
                $proposal->update(['student_id' => $leaderId]);
            }
        }

        return [
            'success' => true,
            'message' => 'Student accepted successfully.',
            'data'    => [
                'accepted_count' => $acceptedCount,
                'max_students'   => $maxStudents,
            ],
            'status'  => 200,
        ];
    }

    public function rejectApplicant(Proposal $proposal, User $student, User $authUser): array
    {
        if ($authUser->id !== $proposal->supervisor_id) {
            return ['success' => false, 'message' => 'Only the proposal supervisor can reject applicants.', 'status' => 403];
        }

        $deleted = DB::table('proposal_student')
            ->where('proposal_id', $proposal->id)
            ->where('user_id', $student->id)
            ->delete();

        if (! $deleted) {
            return ['success' => false, 'message' => 'Application not found for this student.', 'status' => 404];
        }

        return ['success' => true, 'message' => 'Student rejected and removed from application list.', 'data' => null, 'status' => 200];
    }

    public function myProposals(User $user): Collection
    {
        return $user->teamProposals()
            ->with(['supervisor', 'leader', 'members'])
            ->get();
    }

    public function delete(Proposal $proposal): bool
    {
        return $proposal->delete();
    }

    private function validateProjectEvent(string $projectType): array
    {
        $eventTypeMap = [
            ProjectType::Special->value  => ProjectEventType::Special->value,
            ProjectType::Capstone->value => ProjectEventType::Capstone->value,
            ProjectType::Master->value   => ProjectEventType::Master->value,
        ];

        $eventType = $eventTypeMap[$projectType] ?? $projectType;

        $event = ProjectEvent::where('type', $eventType)->first();

        if (! $event) {
            return ['valid' => false, 'message' => 'No event has been created for this project type. Please wait for the instructor to set up the event.'];
        }

        if (! $event->is_active) {
            return ['valid' => false, 'message' => 'This project type enrollment is currently closed.'];
        }

        $now = now();

        if ($event->start_date && $now->lt($event->start_date)) {
            return ['valid' => false, 'message' => 'Submission period has not started yet. Opens on ' . $event->start_date->format('Y-m-d') . '.'];
        }

        if ($event->end_date && $now->gt($event->end_date)) {
            return ['valid' => false, 'message' => 'Submission period has ended. Closed on ' . $event->end_date->format('Y-m-d') . '.'];
        }

        return ['valid' => true];
    }
}
