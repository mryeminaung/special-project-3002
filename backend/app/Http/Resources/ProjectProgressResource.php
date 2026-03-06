<?php
namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProjectProgressResource extends JsonResource
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
            'name'           => $this->name,
            'supervisorName' => $this->supervisor->name,
            'midReport'      => $this->mid_report ? 'Submitted' : 'Not Submitted',
            'midSeminar'     => $this->mid_seminar ? 'Completed' : 'Not Completed',
            'finalReport'    => $this->final_report ? 'Submitted' : 'Not Submitted',
            'finalSeminar'   => $this->final_seminar ? 'Completed' : 'Not Completed',
        ];
    }
}
