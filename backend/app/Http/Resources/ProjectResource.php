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
            'id'           => $this->id,
            'name'         => $this->name,
            'slug'         => $this->slug,
            'description'  => $this->description,
            'midSeminar'   => $this->mid_seminar,
            'finalSeminar' => $this->final_seminar,
            'midReport'    => $this->mid_report,
            'finalReport'  => $this->final_report,
            'leader'       => new MemberResource($this->leader),
            'supervisor'   => new MemberResource($this->supervisor),
            'members'      => MemberResource::collection($this->whenLoaded('members')),
            'status'       => $this->status,
            'startedAt'    => $this->start_date->format('d-m-Y'),
        ];
    }
}
