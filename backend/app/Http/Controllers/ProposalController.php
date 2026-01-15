<?php

namespace App\Http\Controllers;

use App\Http\Requests\ProposalRequest;
use App\Http\Resources\ProposalResource;
use App\Models\Proposal;
use Illuminate\Support\Facades\Auth;

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

    public function show()
    {
        $proposal = Proposal::where("student_id", Auth::id())
            ->first();

        if (!$proposal) {
            return response()->json([
                'message' => 'Proposal not found'
            ], 404);
        }

        return new ProposalResource($proposal->load(['supervisor', 'leader', 'members']));
    }

    public function approveByIc(Proposal $proposal)
    {
        $proposal->update([
            'status' => 'approved'
        ]);

        return $proposal;
    }

    public function rejectByIc(Proposal $proposal)
    {
        $proposal->update([
            'status' => 'rejected'
        ]);

        return $proposal;
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
