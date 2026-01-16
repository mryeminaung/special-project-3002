<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProposalResource extends JsonResource
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
            'title' => $this->title,
            'slug' => $this->slug,
            'description' => $this->description,
            'supervisor' => $this->whenLoaded('supervisor', function ($supervisor) {
                return [
                    'id'    => $supervisor->id,
                    'name'  => $supervisor->name,
                    'email' => $supervisor->email,
                ];
            }),
            'submittedBy' => $this->whenLoaded('leader', function ($leader) {
                return [
                    'id'    => $leader->id,
                    'name'  => $leader->name,
                    'email' => $leader->email,
                ];
            }),
            'members' => MemberResource::collection($this->getRelation('members')),
            'file' => $this->fileUrl,
            'status' => $this->status,
            'submitted_at' => $this->submitted_at->format('d-m-Y')
        ];
    }
}
