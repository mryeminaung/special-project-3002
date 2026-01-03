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
            'id' => $this->id,
            'title' => $this->title,
            'slug' => $this->slug,
            'description' => $this->description,
            'supervisor' => $this->whenLoaded('supervisor', function ($supervisor) {
                return [
                    'id'    => $supervisor->id,
                    'name'  => $supervisor->name,
                    'email' => $supervisor->email,
                    // 'department' => $supervisor->faculty->department->name,
                    // 'rank' => $supervisor->faculty->rank->name
                ];
            }),
            'submittedBy' => $this->whenLoaded('submitter', function ($submitter) {
                return [
                    'id'    => $submitter->id,
                    'name'  => $submitter->name,
                    'email' => $submitter->email,
                    // 'major' => $submitter->student->major->name,
                    // 'phone_number' => $submitter->student->phone_number,
                ];
            }),
            'students' => $this->getMembers($this->members),
            'file' => $this->fileUrl,
            'status' => $this->status,
            'submitted_at' => $this->submitted_at->format('d-m-Y')
        ];
    }
}
