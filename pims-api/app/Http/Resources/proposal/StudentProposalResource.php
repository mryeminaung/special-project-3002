<?php
namespace App\Http\Resources\proposal;

use App\Http\Resources\MemberResource;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class StudentProposalResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'             => $this->id,
            'title'          => $this->title,
            'slug'           => $this->slug,
            'description'    => $this->description,
            'file'           => $this->fileUrl,
            'type'           => $this->type->value,
            'projectType'    => $this->project_type->value,
            'eligibleMajors' => $this->eligible_majors->value,
            'submittedBy'    => $this->leader ? new MemberResource($this->leader) : null,
            'supervisor'     => $this->supervisor ? new MemberResource($this->supervisor) : null,
            'status'         => $this->status->value,
            'members'        => MemberResource::collection($this->whenLoaded('members', fn() => $this->members, collect())),
            'projectArea'    => $this->area?->name,
            'submittedAt'    => $this->submitted_at->format('Y-m-d'),
        ];
    }
}
