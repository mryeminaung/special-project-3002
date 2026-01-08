<?php

namespace App\Http\Controllers;

use App\Http\Resources\CommentResource;
use App\Models\ProjectProposal;
use App\Models\ProposalComment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ProposalCommentController extends Controller
{
    public function store(Request $request)
    {
        ProposalComment::create([
            'description' => $request->description,
            'proposal_id' => $request->proposalId,
            'user_id' => Auth::id()
        ]);

        return "Commented";
    }

    public function show(ProjectProposal $projectProposal)
    {
        $comments = $projectProposal->comments()->with('author')->latest()->get();

        return CommentResource::collection($comments);
    }

    public function destroy(ProposalComment $proposalComment)
    {
        $proposalComment->delete();
        return "Comment deleted";
    }
}
