<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\CommentRequest;
use App\Http\Resources\CommentResource;
use App\Models\Comment;
use App\Models\Proposal;
use App\Services\CommentService;
use App\Traits\ApiResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Gate;

class CommentController extends Controller
{
    use ApiResponse;

    public function __construct(
        private CommentService $commentService
    ) {}

    public function index()
    {
        Gate::authorize('viewAny', Comment::class);

        $comments = $this->commentService->list();

        return $this->successResponse(
            "Comments retrieved successfully",
            CommentResource::collection($comments)
        );
    }

    public function store(CommentRequest $request)
    {
        Gate::authorize('create', Comment::class);

        $comment = $this->commentService->create(
            array_merge($request->validated(), ['user_id' => Auth::id()])
        );

        return $this->successResponse(
            "Comment added successfully",
            new CommentResource($comment),
            201
        );
    }

    public function show(Proposal $proposal)
    {
        $comments = $this->commentService->listByProposal($proposal);

        return $this->successResponse(
            "Comments retrieved successfully",
            CommentResource::collection($comments)
        );
    }

    public function update(Request $request, Proposal $proposal, Comment $comment)
    {
        Gate::authorize('update', $comment);

        $validated = $request->validate([
            'description' => 'required|string',
        ]);

        if ($comment->proposal_id !== $proposal->id) {
            return $this->errorResponse("Comment not found for this proposal", 404);
        }

        $comment = $this->commentService->update($comment, $validated);

        return $this->successResponse(
            "Comment updated successfully",
            new CommentResource($comment->load('author'))
        );
    }

    public function destroy(Comment $comment)
    {
        Gate::authorize('delete', $comment);

        $this->commentService->delete($comment);

        return $this->successResponse("Comment deleted successfully", null, 204);
    }
}
