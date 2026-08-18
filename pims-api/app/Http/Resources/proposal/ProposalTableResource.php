<?php
namespace App\Http\Resources\proposal;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProposalTableResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'          => $this->id,
            'title'       => $this->title,
            'slug'        => $this->slug,
            'supervisor'  => $this->supervisor?->name,
            'projectArea' => $this->area?->name,
            'type'        => $this->type->value,
            'projectType' => $this->project_type->value,
            'status'       => $this->status->value,
            'submittedAt'  => $this->submitted_at->format('Y-m-d'),
            'academicYear' => $this->academicYear?->year,
        ];
    }
}
