<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProposalResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'          => $this->id,
            'title'       => $this->title,
            'slug'        => $this->slug,
            'description' => $this->description,
            'type'        => $this->type->value,
            'projectType' => $this->project_type->value,
            'status'      => $this->status->value,
            'supervisor'  => $this->whenLoaded('supervisor', fn($s) => ['id' => $s->id, 'name' => $s->name]),
            'submittedBy' => $this->leader ? new MemberResource($this->leader) : null,
            'members'     => MemberResource::collection($this->whenLoaded('members', fn() => $this->members, collect())),
            'submittedAt'  => $this->submitted_at?->format('Y-m-d'),
            'academicYear' => $this->academicYear?->year,
        ];
    }
}
