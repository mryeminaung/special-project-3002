<?php
namespace App\Http\Resources\proposal;

use App\Http\Resources\MemberResource;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class FacultyProposalResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $user                = $request->user();
        $canViewApplicants   = $user && ($user->hasRole('IC') || $user->id === $this->supervisor_id);
        $canManageApplicants = $user && $user->id === $this->supervisor_id;

        return [
            'id'                  => $this->id,
            'title'               => $this->title,
            'slug'                => $this->slug,
            'description'         => $this->description,
            'file'                => $this->fileUrl,
            'type'                => ucfirst($this->type),
            'projectType'         => ucfirst($this->project_type),
            'maxStudents'         => $this->max_students,
            'supervisor'          => new MemberResource($this->supervisor),
            'status'              => $this->status,
            'members'             => MemberResource::collection($this->members),
            'appliedStudents'     => $canViewApplicants
                ? MemberResource::collection($this->applicants)
                : [],
            'canViewApplicants'   => (bool) $canViewApplicants,
            'canManageApplicants' => (bool) $canManageApplicants,
            'submittedAt'         => $this->submitted_at->format('d-m-Y'),
        ];
    }
}
