<?php
namespace App\Http\Controllers;

use App\Events\ProposalApproved;
use App\Http\Requests\ProposalRequest;
use App\Http\Resources\ProposalResource;
use App\Http\Resources\proposal\FacultyProposalResource;
use App\Http\Resources\proposal\ProposalTableResource;
use App\Http\Resources\proposal\StudentProposalResource;
use App\Models\Proposal;
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
                $proposal->members()->attach($request->members);
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
            if ($proposal->student_id === null) {
                return $this->successResponse(
                    'Faculty proposal detail view',
                    new FacultyProposalResource($proposal),
                    200);
            } else {
                return $this->errorResponse(
                    'Student proposal not found',
                    404);
            }
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
