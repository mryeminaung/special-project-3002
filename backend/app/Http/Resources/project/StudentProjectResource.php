<?php
namespace App\Http\Resources\project;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class StudentProjectResource extends JsonResource
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
            'status'       => $this->status,
            'supervisor'   => $this->supervisor->name,
            'membersCount' => 5,
            'startedAt'    => $this->start_date->format('d-m-Y'),
        ];
    }
}
