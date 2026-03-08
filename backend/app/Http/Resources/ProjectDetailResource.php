<?php
namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProjectDetailResource extends JsonResource
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
            'name'        => $this->name,
            'description' => $this->description,
            'status'      => $this->status,
            'start_date'  => $this->start_date,
            'end_date'    => $this->end_date,
            'leader'      => new UserResource($this->leader),
            'supervisor'  => new UserResource($this->supervisor),
            'members'     => UserResource::collection($this->members),
        ];
    }
}
