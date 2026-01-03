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
            'submitted_by' => fake()->randomElement([20, 21, 22, 23, 24]),
            'status' => 'pending',
            'submitted_at' => now()
        ]);
        ProjectProposal::create($request->all());
    }

    public function show()
    {
        return Auth::id();

        return ProjectProposal::with(['supervisor', 'submitter'])
            ->where("submitted_by", Auth::id())
            ->get();
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
