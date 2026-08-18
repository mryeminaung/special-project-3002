<?php
namespace App\Http\Resources\proposal;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Auth;

class BrowseFacultyResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        $membersCount           = (int) ($this->applications_count ?? 0);
        $maxStudents            = (int) ($this->max_students ?? 0);
        $currentUserApplication = $this->relationLoaded('applications')
            ? $this->applications->firstWhere('id', Auth::id())
            : null;

        return [
            'id'                => $this->id,
            'title'             => $this->title,
            'slug'              => $this->slug,
            'description'       => $this->description,
            'supervisorName'    => $this->supervisor?->name ?? 'Unknown',
            'file'              => $this->fileUrl,
            'status'            => $this->status->value,
            'projectType'       => $this->project_type->value,
            'type'              => $this->type->value,
            'eligibleMajors'    => $this->eligible_majors->value,
            'maxStudents'       => $maxStudents,
            'membersCount'      => $membersCount,
            'availableSlots'    => max($maxStudents - $membersCount, 0),
            'isJoined'          => (bool) $currentUserApplication,
            'applicationStatus' => $currentUserApplication?->pivot?->status,
            'academicYear'      => $this->academicYear?->year,
        ];
    }
}
