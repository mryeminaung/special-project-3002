<?php

namespace App\Http\Controllers;

use App\Http\Requests\ProposalRequest;
use App\Http\Resources\ProjectProposalResource;
use App\Models\ProjectProposal;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;

use function Illuminate\Support\now;

class ProjectProposalController extends Controller
{
    public function index() {}

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

    public function showProposalsList()
    {
        return ProjectProposalResource::collection(ProjectProposal::all());
    }

    public function approveByIC(ProjectProposal $projectProposal) {}

    public function destroy(ProjectProposal $projectProposal)
    {
        //
    }
}
