<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\CommentRequest;
use App\Http\Resources\CommentResource;
use App\Models\Comment;
use App\Models\Proposal;
use App\Traits\ApiResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;

class CommentController extends Controller
{
    use ApiResponse;

    public function index()
    {
        Gate::authorize('viewAny', Comment::class);

        try {
            $comments = Comment::with('author')->latest()->get();
            return $this->successResponse("Comments retrieved successfully", CommentResource::collection($comments));
        } catch (\Exception $e) {
            return $this->errorResponse("Failed to retrieve comments", $e->getMessage(), 500);
        }
    }

    public function store(CommentRequest $request)
    {
        Gate::authorize('create', Comment::class);

        try {
            $newComment = Comment::create($request->all());
            return $this->successResponse("Comment added successfully", $newComment, 201);
        } catch (\Exception $e) {
            return $this->errorResponse("Failed to add comment", $e->getMessage(), 500);
        }
    }

    public function show(Proposal $proposal)
    {
        $comments = $proposal->comments()->with('author')->latest()->get();
        return $this->successResponse("Comments retrieved successfully", CommentResource::collection($comments));
    }

    public function update(Request $request, Proposal $proposal, Comment $comment)
    {
        Gate::authorize('update', $comment);

        try {
            $data = $request->validate([
                'description' => 'required|string',
            ]);

            if ($comment->proposal_id !== $proposal->id) {
                return $this->errorResponse("Comment not found for this proposal", null, 404);
            }

            $comment->update($data);
            $comment->save();

            return $this->successResponse("Comment updated successfully", new CommentResource($comment->load('author')));
        } catch (\Exception $e) {
            return $this->errorResponse("Failed to update comment", $e->getMessage(), 500);
        }
    }

    public function destroy(Comment $comment)
    {
        Gate::authorize('delete', $comment);

        $comment->delete();
        return $this->successResponse("Comment deleted successfully", null, 204);
    }
}
