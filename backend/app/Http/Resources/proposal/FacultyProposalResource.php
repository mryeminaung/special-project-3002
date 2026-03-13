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
        return [
            'id'          => $this->id,
            'title'       => $this->title,
            'slug'        => $this->slug,
            'description' => $this->description,
            'file'        => $this->fileUrl,
            'type'        => ucfirst($this->type),
            'projectType' => ucfirst($this->project_type),
            'maxStudents' => $this->max_students,
            'supervisor'  => new MemberResource($this->supervisor),
            'status'      => $this->status,
            'members'     => [
                ['id' => 3, 'name' => 'Ye Min Aung', 'email' => '2019-miit-ece-001@miit.edu.mm'],
                ['id' => 4, 'name' => 'Min Myat Thaw', 'email' => '2019-miit-cse-026@miit.edu.mm'],
                ['id' => 5, 'name' => 'Khant Zay Phyo', 'email' => '2019-miit-cse-017@miit.edu.mm'],
            ],
            'submittedAt' => $this->submitted_at->format('d-m-Y'),
        ];
    }
}
