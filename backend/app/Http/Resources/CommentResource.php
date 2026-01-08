<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CommentResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'description' => $this->description,
            'author' => $this->whenLoaded('author', function ($author) {
                return [
                    'id' => $author->id,
                    'name' => $author->name,
                    'role' => $author->roles->first()?->name ?? 'Student',
                ];
            }),
            'updatedAt' => $this->updated_at->format('M d, Y'),
        ];
    }
}
