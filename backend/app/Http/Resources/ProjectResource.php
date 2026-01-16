<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProjectResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */

    public function toArray(Request $request): array
    {
        return [
            'id'            => $this->id,
            'name'         => $this->title,
            'slug'         => $this->slug,
            'description'  => $this->description,
            'leader'     => $this->leader->name ?? 'N/A',
            'supervisor' => $this->supervisor->name ?? 'N/A',
            'members'   => MemberResource::collection($this->getRelation("members")),
            'membersCount'   => $this->members_count ?? $this->members()->count(),
            'status'        => $this->status,
            'startedAt'  => $this->created_at->format('d-m-Y'),
        ];
    }
}
