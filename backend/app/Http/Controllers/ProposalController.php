<?php

namespace App\Http\Controllers;

use App\Http\Requests\ProposalRequest;
use App\Http\Resources\ProposalResource;
use App\Models\Project;
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
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function store(ProposalRequest $request)
    {
        try {
            $proposal = Proposal::create($request->except('members'));
            if ($request->has('members')) {
                $proposal->members()->attach($request->members);
            }
            return response()->json([
                'message' => 'Proposal created successfully'
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to create proposal',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function myProposals()
    {
        $proposals = Auth::user()->teamProposals()->with(['supervisor', 'leader', 'members'])->get();

        if ($proposals->isEmpty()) {
            return response()->json([
                'message' => 'Proposal not found'
            ], 404);
        }

        return ProposalResource::collection($proposals->load(['supervisor', 'leader', 'members']));
    }

    public function approveByIC(Proposal $proposal)
    {
        return DB::transaction(function () use ($proposal) {
            $proposal->update(['status' => 'approved']);

            $project = Project::create([
                'name'          => $proposal->title,
                'slug'          => Str::slug($proposal->title),
                'description'   => $proposal->description,
                'leader_id'     => $proposal->student_id,
                'supervisor_id' => $proposal->supervisor_id,
                'proposal_id'   => $proposal->id,
                'start_date' => now(),
            ]);

            // // Sync Team Members from Proposal Pivot to Project Pivot
            $memberIds = $proposal->members()->pluck('user_id');
            $project->members()->attach($memberIds);

            return response()->json(['message' => 'Proposal transformed to Project successfully!']);
        });
    }

    public function rejectByIC(Proposal $proposal)
    {
        $proposal->update([
            'status' => 'rejected'
        ]);

        return response()->json(['message' => 'Proposal Rejected!']);
    }

    public function detail(Proposal $proposal)
    {
        try {
            if (!$proposal) {
                return response()->json([
                    'message' => 'Proposal not found'
                ], 404);
            }

            $proposal = $proposal->load(['supervisor', 'leader', 'members']);
            return new ProposalResource($proposal);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to retrieve proposal details',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function browseProposals()
    {
        try {
            $proposals = Proposal::where('supervisor_id', 11)->with(['supervisor', 'leader', 'members'])->get();
            return ProposalResource::collection($proposals);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to retrieve proposals',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function destroy(Proposal $proposal)
    {
        try {
            $proposal->delete();
            return response()->json([
                'message' => 'Proposal deleted successfully'
            ], 204);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to delete proposal',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
