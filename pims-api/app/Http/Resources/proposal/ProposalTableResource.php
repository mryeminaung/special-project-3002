<?php
namespace App\Http\Resources\proposal;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProposalTableResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id'             => $this->id,
            'title'          => $this->title,
            'slug'           => $this->slug,
            'supervisorName' => $this->supervisor->name,
            'projectArea'    => $this->area->name,
            'type'           => ucfirst($this->type),
            'projectType'    => ucfirst($this->project_type),
            'status'         => $this->status,
            'submittedAt'    => $this->submitted_at->format('d-m-Y'),
        ];
    }
}
