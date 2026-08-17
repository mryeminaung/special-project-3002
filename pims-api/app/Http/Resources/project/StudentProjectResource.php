<?php
namespace App\Http\Resources\project;

use App\Enums\ProjectProgressStatus;
use App\Http\Resources\MemberResource;
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
            'id'                   => $this->id,
            'title'                => $this->name,
            'slug'                 => $this->slug,
            'description'          => $this->description,
            'midReportUrl'         => $this->mid_report_url,
            'finalReportUrl'       => $this->final_report_url,
            'midSeminarDeadline'   => $this->mid_seminar_deadline,
            'finalSeminarDeadline' => $this->final_seminar_deadline,
            'progressStatus'       => [
                'midReport'          => $this->mid_report === ProjectProgressStatus::Submitted->value,
                'finalReport'        => $this->final_report === ProjectProgressStatus::Submitted->value,
                'midReportApproved'  => (bool) $this->mid_report_approved,
                'finalReportApproved'=> (bool) $this->final_report_approved,
                'midSeminar'         => $this->mid_seminar === ProjectProgressStatus::Completed->value,
                'finalSeminar'       => $this->final_seminar === ProjectProgressStatus::Completed->value,
            ],
            'type'                 => $this->type,
            'status'               => $this->status,
            'projectType'          => $this->project_type,
            'submittedBy'          => new MemberResource($this->leader),
            'supervisor'           => new MemberResource($this->supervisor),
            'membersCount'         => $this->members->count(),
            'members'              => MemberResource::collection($this->members),
            'projectArea'          => $this->area?->name,
            'startedAt'            => $this->start_date?->format('Y-m-d'),
            'approvedAt'           => $this->created_at?->format('Y-m-d'),
            'examiners'            => MemberResource::collection($this->whenLoaded('examiners')),
        ];
    }
}
