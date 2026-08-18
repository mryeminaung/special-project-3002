<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\ProposalRequest;
use App\Http\Resources\ProposalResource;
use App\Http\Resources\proposal\BrowseFacultyResource;
use App\Http\Resources\proposal\FacultyProposalResource;
use App\Http\Resources\proposal\ProposalTableResource;
use App\Http\Resources\proposal\StudentProposalResource;
use App\Enums\ProposalType;
use App\Models\Proposal;
use App\Models\User;
use App\Services\ProposalEligibilityService;
use App\Services\ProposalService;
use App\Traits\ApiResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Gate;

class ProposalController extends Controller
{
    use ApiResponse;

    public function __construct(
        private ProposalService $proposalService,
        private ProposalEligibilityService $eligibilityService
    ) {}

    public function eligibility()
    {
        $user = Auth::user();

        if ($user->hasRole('student')) {
            $result = $this->eligibilityService->checkStudentEligibility($user);
        } elseif ($user->hasAnyRole(['faculty', 'supervisor']) && ! $user->hasRole('ic')) {
            $result = $this->eligibilityService->checkFacultyEligibility($user);
        } else {
            $result = ['eligible' => true, 'reason' => null, 'current' => 0, 'limit' => 0];
        }

        return $this->successResponse('Eligibility retrieved.', $result);
    }

    public function index(Request $request)
    {
        $yearId = $request->query('year_id') ? (int) $request->query('year_id') : null;
        $proposals = $this->proposalService->listPaginated($yearId);
        $data = $this->paginatedResponse(ProposalTableResource::class, $proposals);

        return $this->successResponse("Proposals retrieved successfully.", $data);
    }

    public function store(ProposalRequest $request)
    {
        $result = $this->proposalService->create($request->validated(), Auth::user());

        if (! $result['success']) {
            return $this->errorResponse($result['message'], 422);
        }

        if ($request->type === ProposalType::Student->value && $request->has('members')) {
            $this->proposalService->syncMembers($result['proposal'], $request->members);
        }

        return $this->successResponse('Proposal created successfully', null, 201);
    }

    public function approveByIC(Proposal $proposal)
    {
        Gate::authorize('approve', $proposal);

        $result = $this->proposalService->approveByIC($proposal);

        if (! $result['success']) {
            return $this->errorResponse($result['message'], 422);
        }

        return $this->successResponse($result['message']);
    }

    public function rejectByIC(Proposal $proposal)
    {
        Gate::authorize('reject', $proposal);

        $result = $this->proposalService->rejectByIC($proposal);

        return $this->successResponse($result['message']);
    }

    public function show(Proposal $proposal)
    {
        if ($proposal->type === ProposalType::Student) {
            if ($proposal->student_id !== null) {
                return $this->successResponse(
                    'Student proposal detail view',
                    new StudentProposalResource($proposal->load(['supervisor', 'members', 'area'])),
                    200
                );
            } else {
                return $this->errorResponse('Student proposal not found', 404);
            }
        }

        if ($proposal->type === ProposalType::Faculty) {
            return $this->successResponse(
                'Faculty proposal detail view',
                new FacultyProposalResource($proposal->load(['supervisor', 'members', 'applicants', 'area'])),
                200
            );
        }

        return $this->errorResponse('Proposal type not recognized', 404);
    }

public function facultyProposals(Request $request)
    {
        $yearId = $request->query('year_id') ? (int) $request->query('year_id') : null;
        $joinedProposalsCount = $this->proposalService->getJoinedProposalsCount(Auth::user());
        $proposals = $this->proposalService->listFacultyProposals($yearId);

        return $this->successResponse(
            "Faculty proposals retrieved successfully.",
            [
                'proposals'              => BrowseFacultyResource::collection($proposals),
                'joined_proposals_count' => $joinedProposalsCount,
            ]
        );
    }

    public function joinFacultyProposal(Proposal $proposal)
    {
        $result = $this->proposalService->joinFacultyProposal($proposal, Auth::user());

        if (! $result['success']) {
            return $this->errorResponse($result['message'], $result['status']);
        }

        return $this->successResponse($result['message'], $result['data'], $result['status']);
    }

    public function acceptApplicant(Proposal $proposal, User $student)
    {
        $result = $this->proposalService->acceptApplicant($proposal, $student, Auth::user());

        if (! $result['success']) {
            return $this->errorResponse($result['message'], $result['status']);
        }

        return $this->successResponse($result['message'], $result['data'] ?? null, $result['status']);
    }

    public function rejectApplicant(Proposal $proposal, User $student)
    {
        $result = $this->proposalService->rejectApplicant($proposal, $student, Auth::user());

        if (! $result['success']) {
            return $this->errorResponse($result['message'], $result['status']);
        }

        return $this->successResponse($result['message'], $result['data'] ?? null, $result['status']);
    }

    public function allProposals(Request $request)
    {
        $supervisorId = $request->boolean('mine') ? Auth::id() : null;
        $yearId = $request->query('year_id') ? (int) $request->query('year_id') : null;

        $proposals = $this->proposalService->listAll($supervisorId, $yearId);
        $data = $this->paginatedResponse(ProposalTableResource::class, $proposals);

        return $this->successResponse('All proposals retrieved.', $data);
    }

    public function myProposals(Request $request)
    {
        $yearId = $request->query('year_id') ? (int) $request->query('year_id') : null;
        $proposals = $this->proposalService->myProposals(Auth::user(), $yearId);

        return $this->successResponse(
            'Student proposals retrieved successfully.',
            ProposalResource::collection($proposals)
        );
    }

    public function destroy(Proposal $proposal)
    {
        Gate::authorize('delete', $proposal);

        $this->proposalService->delete($proposal);

        return $this->successResponse('Proposal deleted successfully', null, 204);
    }
}
