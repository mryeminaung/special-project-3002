<?php
namespace App\Http\Resources;

use App\Enums\ProjectProgressStatus;
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
        $midReportSubmitted   = $this->mid_report === ProjectProgressStatus::Submitted->value;
        $midSeminarDone       = $this->mid_seminar === ProjectProgressStatus::Completed->value;
        $finalReportSubmitted = $this->final_report === ProjectProgressStatus::Submitted->value;
        $finalSeminarDone     = $this->final_seminar === ProjectProgressStatus::Completed->value;

        return [
            'id'             => $this->id,
            'name'           => $this->name,
            'slug'           => $this->slug,
            'type'           => $this->type,
            'supervisorName' => $this->supervisor?->name,
            'midReport'      => $midReportSubmitted ? 'Submitted' : 'Not Submitted',
            'midSeminar'     => $midSeminarDone ? 'Completed' : 'Not Completed',
            'finalReport'    => $finalReportSubmitted ? 'Submitted' : 'Not Submitted',
            'finalSeminar'   => $finalSeminarDone ? 'Completed' : 'Not Completed',
        ];
    }
}
