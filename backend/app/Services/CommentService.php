<?php

namespace App\Services;

use App\Models\Comment;
use App\Models\Proposal;
use Illuminate\Support\Collection;

class CommentService
{
    public function list(): Collection
    {
        return Comment::with('author')->orderBy('id')->get();
    }

    public function listByProposal(Proposal $proposal): Collection
    {
        return $proposal->comments()->with('author')->get();
    }

    public function create(array $data): Comment
    {
        return Comment::create($data);
    }

    public function update(Comment $comment, array $data): Comment
    {
        $comment->update($data);

        return $comment->fresh();
    }

    public function delete(Comment $comment): bool
    {
        return $comment->delete();
    }
}
