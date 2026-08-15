<?php
namespace App\Http\Resources\proposal;

use App\Http\Resources\MemberResource;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class FacultyProposalResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        $user                = $request->user();
        $canViewApplicants   = $user && ($user->hasRole('ic') || $user->id === $this->supervisor_id);
        $canManageApplicants = $user && $user->id === $this->supervisor_id;

        return [
            'id'                  => $this->id,
            'title'               => $this->title,
            'slug'                => $this->slug,
            'description'         => $this->description,
            'file'                => $this->fileUrl,
            'type'                => $this->type->value,
            'projectType'         => $this->project_type->value,
            'eligibleMajors'      => $this->eligible_majors->value,
            'maxStudents'         => $this->max_students,
            'supervisor'          => $this->supervisor ? new MemberResource($this->supervisor) : null,
            'status'              => $this->status->value,
            'members'             => MemberResource::collection($this->whenLoaded('members', fn() => $this->members, collect())),
            'appliedStudents'     => $canViewApplicants
                ? MemberResource::collection($this->whenLoaded('applicants', fn() => $this->applicants, collect()))
                : [],
            'canViewApplicants'   => (bool) $canViewApplicants,
            'canManageApplicants' => (bool) $canManageApplicants,
            'projectArea'         => $this->area?->name,
            'submittedAt'         => $this->submitted_at->format('Y-m-d'),
        ];
    }
}
