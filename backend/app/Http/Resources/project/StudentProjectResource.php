<?php
namespace App\Http\Resources\project;

use App\Enums\ProjectProgressStatus;
use App\Http\Resources\MemberResource;
use Illuminate\Foundation\Mix;
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
            'id'             => $this->id,
            'title'          => $this->name,
            'slug'           => $this->slug,
            'description'    => $this->description,
            // 'file' => ;
            'midReportUrl'   => $this->mid_report_url,
            'finalReportUrl' => $this->final_report_url,
            'progressStatus' => [
                'midReport'    => $this->mid_report === ProjectProgressStatus::Not_Submitted ? true : false,
                'finalReport'  => $this->final_report_submitted === ProjectProgressStatus::Not_Submitted ? true : false,
                'midSeminar'   => $this->mid_seminar_completed === ProjectProgressStatus::Not_Completed ? true : false,
                'finalSeminar' => $this->final_seminar_completed === ProjectProgressStatus::Not_Completed ? true : false,
            ],
            'type'           => $this->type,
            'status'         => $this->status,
            'projectType'    => $this->project_type,
            'submittedBy'    => new MemberResource($this->leader),
            'supervisor'     => new MemberResource($this->supervisor),
            'membersCount'   => 5,
            'members'        => MemberResource::collection($this->members),
            'startedAt'      => $this->start_date->format('d-m-Y'),
        ];
    }
}
