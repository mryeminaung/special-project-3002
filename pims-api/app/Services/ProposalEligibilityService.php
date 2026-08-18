<?php

namespace App\Services;

use App\Enums\ProposalStatus;
use App\Models\Proposal;
use App\Models\User;
use Illuminate\Support\Facades\DB;

class ProposalEligibilityService
{
    public const STUDENT_PENDING_LIMIT = 3;
    public const FACULTY_LIMIT         = 5;

    /**
     * Full eligibility snapshot for a student.
     *
     * canCreate  – can start a new student-type proposal (leader)
     * canJoin    – can submit another application to a faculty proposal
     */
    public function checkStudentEligibility(User $student): array
    {
        $isLeader = Proposal::where('student_id', $student->id)
            ->where('status', '!=', ProposalStatus::Rejected)
            ->exists();

        $isAccepted = DB::table('proposal_student')
            ->where('user_id', $student->id)
            ->where('status', 'accepted')
            ->exists();

        $pendingCount = $this->getStudentPendingCount($student);

        $canCreate = ! $isLeader && ! $isAccepted;
        $canJoin   = ! $isAccepted && $pendingCount < self::STUDENT_PENDING_LIMIT;

        $reason = null;
        if ($isAccepted) {
            $reason = 'You have already been accepted into a proposal.';
        } elseif ($pendingCount >= self::STUDENT_PENDING_LIMIT) {
            $reason = 'You have reached the maximum of ' . self::STUDENT_PENDING_LIMIT . ' pending applications.';
        } elseif ($isLeader) {
            $reason = 'You are already leading a proposal.';
        }

        return [
            'canCreate'    => $canCreate,
            'canJoin'      => $canJoin,
            'isAccepted'   => $isAccepted,
            'pendingCount' => $pendingCount,
            'pendingLimit' => self::STUDENT_PENDING_LIMIT,
            'reason'       => $reason,
        ];
    }

    public function checkFacultyEligibility(User $faculty): array
    {
        $current = $this->getFacultyCount($faculty);

        if ($current >= self::FACULTY_LIMIT) {
            return [
                'eligible' => false,
                'reason'   => 'You have reached the supervision limit of ' . self::FACULTY_LIMIT . ' proposals.',
                'current'  => $current,
                'limit'    => self::FACULTY_LIMIT,
            ];
        }

        return ['eligible' => true, 'reason' => null, 'current' => $current, 'limit' => self::FACULTY_LIMIT];
    }

    public function getStudentPendingCount(User $student): int
    {
        return DB::table('proposal_student')
            ->where('user_id', $student->id)
            ->where('status', 'pending')
            ->count();
    }

    public function getFacultyCount(User $faculty): int
    {
        return Proposal::where('supervisor_id', $faculty->id)
            ->where('status', '!=', ProposalStatus::Rejected)
            ->count();
    }
}
