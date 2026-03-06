<?php
namespace App\Http\Controllers;

use App\Events\ProposalApproved;
use App\Http\Requests\ProposalRequest;
use App\Http\Resources\ProposalResource;
use App\Models\Proposal;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

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
        try {
            $user = Auth::user();

            // Check if user is already in a team or as a leader in proposals
            if (
                $user->teamProposals()->exists() ||
                Proposal::where('student_id', $user->id)->exists()
            ) {
                return response()->json([
                    'message' => 'You have already submitted a proposal, are part of a team, or are a leader in another proposal.',
                ], 422);
            }

            $proposal = Proposal::create($request->except('members'));
            if ($request->has('members')) {
                $proposal->members()->attach($request->members);
            }
            return response()->json([
                'message' => 'Proposal created successfully',
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to create proposal',
                'error'   => $e->getMessage(),
            ], 500);
        }
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
