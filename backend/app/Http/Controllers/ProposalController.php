<?php
namespace App\Http\Controllers;

use App\Events\ProposalApproved;
use App\Http\Requests\ProposalRequest;
use App\Http\Resources\ProposalResource;
use App\Models\Proposal;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class ProposalController extends Controller
{
    public function index()
    {
        try {
            $proposals = Proposal::with(['supervisor', 'leader', 'members'])->get();
            return ProposalResource::collection($proposals);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to retrieve proposals',
                'error'   => $e->getMessage(),
            ], 500);
        }
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

    public function myProposals()
    {
        $proposals = Auth::user()->teamProposals()->with(['supervisor', 'leader', 'members'])->get();

        if ($proposals->isEmpty()) {
            return response()->json([
                'message' => 'Proposals not found',
            ], 404);
        }

        return ProposalResource::collection($proposals->load(['supervisor', 'leader', 'members']));
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

    public function detail(Proposal $proposal)
    {
        try {
            if (! $proposal) {
                return response()->json([
                    'message' => 'Proposal not found',
                ], 404);
            }

            $proposal = $proposal->load(['supervisor', 'leader', 'members']);
            return new ProposalResource($proposal);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to retrieve proposal details',
                'error'   => $e->getMessage(),
            ], 500);
        }
    }

    public function browseProposals()
    {
        try {
            $proposals = Proposal::where('supervisor_id', Auth::id())->with(['supervisor', 'leader', 'members'])->get();

            if ($proposals->isEmpty()) {
                return response()->json([
                    'message' => 'Proposals not found',
                ], 404);
            }

            return ProposalResource::collection($proposals);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to retrieve proposals',
                'error'   => $e->getMessage(),
            ], 500);
        }
    }

    public function destroy(Proposal $proposal)
    {
        try {
            $proposal->delete();
            return response()->json([
                'message' => 'Proposal deleted successfully',
            ], 204);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to delete proposal',
                'error'   => $e->getMessage(),
            ], 500);
        }
    }
}
