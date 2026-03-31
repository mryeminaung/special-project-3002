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
            'id'          => $this->id,
            'title'       => $this->title,
            'slug'        => $this->slug,
            'description' => $this->description,
            'supervisor'  => $this->whenLoaded('supervisor', function ($supervisor) {
                return [
                    'id'   => $supervisor->id,
                    'name' => $supervisor->name,
                ];
            }),
            'submittedBy' => new MemberResource(($this->leader)),
            // 'members'     => MemberResource::collection($this->getRelation('members')),
            'status'      => $this->status,
            'submittedAt' => $this->submitted_at->format('d-m-Y'),
        ];
    }
}
