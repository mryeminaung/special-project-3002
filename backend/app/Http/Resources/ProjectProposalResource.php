<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Date;

class ProjectProposalResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'title' => $this->title,
            'description' => $this->description,
            'supervisor' => $this->getSupervisor($this->supervisor_id),
            'submittedBy' => $this->getSubmittedStudent($this->members[0]),
            'students' => $this->getMembers($this->members),
            'file' => $this->fileUrl,
            'status' => $this->status,
            'submitted_at' => $this->submitted_at->format('d-m-Y')
        ];
    }
}
