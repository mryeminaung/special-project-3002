<?php
namespace App\Http\Controllers;

use App\Events\ProposalApproved;
use App\Http\Requests\ProposalRequest;
use App\Http\Resources\ProposalResource;
use App\Http\Resources\proposal\BrowseFacultyResource;
use App\Http\Resources\proposal\FacultyProposalResource;
use App\Http\Resources\proposal\ProposalTableResource;
use App\Http\Resources\proposal\StudentProposalResource;
use App\Models\Proposal;
use App\Models\User;
use App\Traits\ApiResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class ProposalController extends Controller
{
    use ApiResponse;

    public function index()
    {
        $proposals = Proposal::orderBy('id')->paginate(5);
        $data      = $this->paginatedResponse(ProposalTableResource::class, $proposals);
        return $this->successResponse("Proposals retrived successfully.", $data);
    }

    public function store(ProposalRequest $request)
    {
        $user                 = Auth::user();
        $data                 = $request->validated();
        $data['slug']         = Str::slug($data['title'], '-');
        $data['submitted_at'] = now();

        if ($data['type'] === 'student') {
            $studentId = $user->id;
            // Check if student is already a leader in another proposal
            $isLeader = Proposal::where('student_id', $studentId)
                ->whereNotNull('student_id')
                ->exists();

            // Check if student is already a member in another proposal
            $isMember = DB::table('proposal_student')->where('user_id', $studentId)->exists();

            if ($isLeader || $isMember) {
                return response()->json([
                    'message' => 'Student is already part of another proposal as leader or member.',
                ], 422);
            }
        }

        if ($data['type'] === 'student') {
            $data['student_id'] = $user->id;
        } else {
            $data['student_id'] = null;
        }

        return DB::transaction(function () use ($data, $request) {
            $proposal = Proposal::create($data);

            if ($request->type === 'student' && $request->has('members')) {
                $memberIds = collect($request->members)->mapWithKeys(function ($memberId) {
                    return [(int) $memberId => ['status' => 'accepted']];
                })->toArray();

                $proposal->applications()->syncWithoutDetaching($memberIds);
            }

            return response()->json([
                'message' => 'Proposal created successfully',
            ], 201);
        });
    }

    public function approveByIC(Proposal $proposal)
    {
        if ($proposal->status === 'approved') {
            return response()->json(['message' => 'This proposal is already a project.'], 422);
        }

        if ($proposal->type === 'faculty') {
            $proposal->update(['status' => 'approved']);

            return response()->json(['message' => 'Proposal approved successfully!']);
        }

        return DB::transaction(function () use ($proposal) {
            $proposal->update(['status' => 'approved']);

            event(new ProposalApproved($proposal));

            return response()->json(['message' => 'Proposal transformed to Project successfully!']);
        });
    }

    public function rejectByIC(Proposal $proposal)
    {
        $proposal->update([
            'status' => 'rejected',
        ]);

        return response()->json(['message' => 'Proposal Rejected!']);
    }

    public function show(Proposal $proposal)
    {
        if ($proposal->type === 'student') {
            if ($proposal->student_id !== null) {
                return $this->successResponse(
                    'Student proposal detail view',
                    new StudentProposalResource($proposal->load('members')),
                    200);
            } else {
                return $this->errorResponse(
                    'Student proposal not found',
                    404);
            }
        }

        if ($proposal->type === 'faculty') {
            return $this->successResponse(
                'Faculty proposal detail view',
                new FacultyProposalResource($proposal->load(['supervisor', 'members', 'applicants'])),
                200);
        }
    }

    public function browseProposals()
    {
        $auth      = Auth::user();
        $proposals = Proposal::where('supervisor_id', $auth->id)->orderBy('id')->paginate(5);

        if ($proposals->isEmpty()) {
            return $this->errorResponse('No proposals found for the supervisor', 404);
        }

        $data = $this->paginatedResponse(ProposalTableResource::class, $proposals);
        return $this->successResponse("Proposals retrived successfully.", $data);
    }

    public function facultyProposals()
    {
        $joinedProposalsCount = DB::table('proposal_student')
            ->where('user_id', Auth::id())
            ->count();

        $proposals = Proposal::where('type', 'faculty')
            ->where('status', 'approved')
            ->with(['applications:id', 'supervisor:id,name'])
            ->withCount('applications')
            ->orderBy('id')
            ->get();

        return $this->successResponse(
            "Faculty proposals retrived successfully.",
            [
                'proposals'              => BrowseFacultyResource::collection($proposals),
                'joined_proposals_count' => $joinedProposalsCount,
            ]);
    }

    public function joinFacultyProposal(Proposal $proposal)
    {
        $user = Auth::user();

        if (! $user->hasRole('Student')) {
            return $this->errorResponse('Only students can join faculty proposals.', 403);
        }

        if ($proposal->type !== 'faculty' || $proposal->status !== 'approved') {
            return $this->errorResponse('Only approved faculty proposals can be joined.', 422);
        }

        $alreadyJoined = DB::table('proposal_student')
            ->where('proposal_id', $proposal->id)
            ->where('user_id', $user->id)
            ->exists();

        if ($alreadyJoined) {
            return $this->errorResponse('You have already joined this proposal.', 422);
        }

        $joinedProposalsCount = DB::table('proposal_student')
            ->where('user_id', $user->id)
            ->count();

        if ($joinedProposalsCount >= 3) {
            return $this->errorResponse('Students can join up to 3 proposals only.', 422);
        }

        $currentMembersCount = $proposal->applications()->count();
        $maxStudents         = $proposal->max_students ?? 0;

        if ($maxStudents > 0 && $currentMembersCount >= $maxStudents) {
            return $this->errorResponse('This proposal has no available slots left.', 422);
        }

        DB::transaction(function () use ($proposal, $user) {
            $proposal->applications()->syncWithoutDetaching([
                $user->id => ['status' => 'pending'],
            ]);
        });

        return $this->successResponse('Joined proposal successfully.', [
            'proposal_id'        => $proposal->id,
            'available_slots'    => max($maxStudents - ($currentMembersCount + 1), 0),
            'joined_proposals'   => $joinedProposalsCount + 1,
            'joined_proposal'    => true,
            'application_status' => 'pending',
        ], 201);
    }

    public function acceptApplicant(Proposal $proposal, User $student)
    {
        $authUser = Auth::user();

        if ($authUser->id !== $proposal->supervisor_id) {
            return $this->errorResponse('Only the proposal supervisor can accept applicants.', 403);
        }

        $application = DB::table('proposal_student')
            ->where('proposal_id', $proposal->id)
            ->where('user_id', $student->id)
            ->first();

        if (! $application) {
            return $this->errorResponse('Application not found for this student.', 404);
        }

        if ($application->status === 'accepted') {
            return $this->successResponse('Student is already accepted.', null, 200);
        }

        $acceptedCount = DB::table('proposal_student')
            ->where('proposal_id', $proposal->id)
            ->where('status', 'accepted')
            ->count();

        $maxStudents = $proposal->max_students ?? 0;

        if ($maxStudents > 0 && $acceptedCount >= $maxStudents) {
            return $this->errorResponse('This proposal has reached its student slot limit.', 422);
        }

        DB::table('proposal_student')
            ->where('proposal_id', $proposal->id)
            ->where('user_id', $student->id)
            ->update([
                'status'     => 'accepted',
                'updated_at' => now(),
            ]);

        $acceptedCount = DB::table('proposal_student')
            ->where('proposal_id', $proposal->id)
            ->where('status', 'accepted')
            ->count();

        if ($maxStudents > 0 && $acceptedCount >= $maxStudents) {
            if (! $proposal->project()->exists()) {
                $leaderId = DB::table('proposal_student')
                    ->where('proposal_id', $proposal->id)
                    ->where('status', 'accepted')
                    ->orderBy('id')
                    ->value('user_id');

                if ($leaderId) {
                    $proposal->update([
                        'student_id' => $leaderId,
                        'status'     => 'approved',
                    ]);

                    event(new ProposalApproved($proposal->fresh()));
                }
            }
        }

        return $this->successResponse('Student accepted successfully.', [
            'accepted_count' => $acceptedCount,
            'max_students'   => $maxStudents,
        ]);
    }

    public function rejectApplicant(Proposal $proposal, User $student)
    {
        $authUser = Auth::user();

        if ($authUser->id !== $proposal->supervisor_id) {
            return $this->errorResponse('Only the proposal supervisor can reject applicants.', 403);
        }

        $deleted = DB::table('proposal_student')
            ->where('proposal_id', $proposal->id)
            ->where('user_id', $student->id)
            ->delete();

        if (! $deleted) {
            return $this->errorResponse('Application not found for this student.', 404);
        }

        return $this->successResponse('Student rejected and removed from application list.', null, 200);
    }

    public function myProposals()
    {
        $proposals = Auth::user()->teamProposals()->get();

        if ($proposals->isEmpty()) {
            return $this->errorResponse('No proposals found for the student', 404);
        }

        return ProposalResource::collection($proposals->load(['supervisor', 'leader', 'members']));
    }

    public function destroy(Proposal $proposal)
    {
        $proposal->delete();
        return $this->successResponse('Proposal deleted successfully', null, 200);
    }
}
