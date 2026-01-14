<?php

namespace App\Http\Controllers;

use App\Http\Requests\CommentRequest;
use App\Http\Resources\CommentResource;
use App\Models\Comment;
use App\Models\Proposal;

class CommentController extends Controller
{
    public function store(CommentRequest $request)
    {
        try {
            Comment::create($request->all());
            return response()->json(['message' => 'Comment added successfully'], 201);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to add comment',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function show(Proposal $proposal)
    {
        try {
            $comments = $proposal->comments()->with('author')->latest()->get();
            return CommentResource::collection($comments);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to retrieve comments',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function update(Proposal $proposal)
    {
        try {
            $comments = $proposal->comments()->with('author')->latest()->get();
            return CommentResource::collection($comments);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to retrieve comments',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function destroy(Comment $comment)
    {
        try {
            $comment->delete();
            return response()->json(['message' => 'Comment deleted successfully'], 204);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to delete comment',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
