<?php
namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProjectEventResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id'        => $this->id,
            'title'     => $this->title,
            'detail'    => $this->detail,
            'type'      => $this->type,
            'startDate' => $this->start_date,
            'endDate'   => $this->end_date,
            'isActive'  => $this->is_active,
            'formatUrl' => $this->format_url,
        ];
    }
}
