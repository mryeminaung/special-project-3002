<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class AcademicYearResource extends JsonResource
{
    public function toArray($request): array
    {
        return [
            'id'               => $this->id,
            'label'            => $this->label,
            'year'             => $this->year,
            'semester'         => $this->semester,
            'startDate'        => $this->start_date?->format('Y-m-d'),
            'endDate'          => $this->end_date?->format('Y-m-d'),
            'isActive'         => $this->is_active,
            'proposalsCount'   => $this->when(isset($this->proposals_count), $this->proposals_count),
            'projectsCount'    => $this->when(isset($this->projects_count), $this->projects_count),
        ];
    }
}
