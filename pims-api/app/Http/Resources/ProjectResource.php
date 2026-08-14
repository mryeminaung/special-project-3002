<?php
namespace App\Http\Resources;

use App\Enums\ProjectProgressStatus;
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
            'title'        => $this->name,
            'slug'         => $this->slug,
            'description'  => $this->description,
            'type'         => $this->type,
            'projectType'  => $this->project_type,
            'progressStatus'       => [
                'midReport'    => $this->mid_report === ProjectProgressStatus::Submitted->value,
                'finalReport'  => $this->final_report === ProjectProgressStatus::Submitted->value,
                'midSeminar'   => $this->mid_seminar === ProjectProgressStatus::Completed->value,
                'finalSeminar' => $this->final_seminar === ProjectProgressStatus::Completed->value,
            ],
            'midReportUrl'         => $this->mid_report_url,
            'finalReportUrl'       => $this->final_report_url,
            'midSeminarDeadline'   => $this->mid_seminar_deadline,
            'finalSeminarDeadline' => $this->final_seminar_deadline,
            'leader'       => new MemberResource($this->leader),
            'supervisor'   => new MemberResource($this->supervisor),
            'members'      => MemberResource::collection($this->whenLoaded('members')),
            'status'       => $this->status,
            'projectArea'  => $this->area?->name,
            'startedAt'    => $this->start_date?->format('Y-m-d'),
            'approvedAt'   => $this->created_at?->format('Y-m-d'),
        ];
    }
}
