<?php
namespace App\Http\Resources\proposal;

use App\Http\Resources\MemberResource;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class StudentProposalResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id'          => $this->id,
            'title'       => $this->title,
            'slug'        => $this->slug,
            'description' => $this->description,
            'file'        => $this->fileUrl,
            'type'        => ucfirst($this->type),
            'projectType' => ucfirst($this->project_type),
            'submittedBy' => new MemberResource($this->leader),
            'supervisor'  => new MemberResource($this->supervisor),
            'status'      => $this->status,
            'members'     => MemberResource::collection(
                $this->resource->relationLoaded('members')
                    ? $this->resource->getRelation('members')
                    : collect()
            ),
            'submittedAt' => $this->submitted_at->format('d-m-Y'),
        ];
    }
}
