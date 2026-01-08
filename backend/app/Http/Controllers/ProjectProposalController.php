<?php

namespace App\Http\Controllers;

use App\Http\Requests\ProposalRequest;
use App\Http\Resources\ProjectProposalResource;
use App\Models\ProjectProposal;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Number;
use Illuminate\Support\Str;

use function Illuminate\Support\now;

class ProjectProposalController extends Controller
{
    public function index()
    {
        return ProjectProposalResource::collection(ProjectProposal::with(['supervisor', 'submitter'])->get());
    }

    public function store(ProposalRequest $request)
    {
        $request->merge([
            'slug' => Str::slug($request->title, '-'),
            'status' => 'pending',
            'submitted_at' => now()
        ]);
        ProjectProposal::create($request->all());
    }

    public function show()
    {
        $proposal = ProjectProposal::where("submitted_by", Auth::id())
            ->first();
        return new ProjectProposalResource($proposal->load(['supervisor', 'submitter']));
    }

    public function detail(ProjectProposal $projectProposal)
    {
        $proposal = $projectProposal->load(['supervisor', 'submitter']);
        return new ProjectProposalResource($proposal);
    }

    public function destroy(ProjectProposal $projectProposal)
    {
        $projectProposal->delete();

        return response()->json([
            'message' => 'Proposal deleted successfully'
        ]);
    }
}
