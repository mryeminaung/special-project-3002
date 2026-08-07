<?php
namespace App\Http\Resources\proposal;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Auth;

class BrowseFacultyResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $membersCount           = (int) ($this->applications_count ?? 0);
        $maxStudents            = (int) ($this->max_students ?? 0);
        $currentUserApplication = $this->relationLoaded('applications')
            ? $this->applications->firstWhere('id', Auth::id())
            : null;

        return [
            'id'                 => $this->id,
            'title'              => $this->title,
            'slug'               => $this->slug,
            'description'        => $this->description,
            'supervisor_name'    => $this->supervisor?->name ?? 'Unknown',
            'fileUrl'            => $this->fileUrl,
            'status'             => $this->status,
            'project_type'       => $this->project_type,
            'type'               => $this->type,
            'eligible_majors'    => $this->eligible_majors,
            'max_students'       => $maxStudents,
            'members_count'      => $membersCount,
            'available_slots'    => max($maxStudents - $membersCount, 0),
            'is_joined'          => (bool) $currentUserApplication,
            'application_status' => $currentUserApplication?->pivot?->status,
        ];
    }
}
