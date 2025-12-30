<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class UserResource extends JsonResource
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
            'name' => $this->name,
            'email' => $this->email,
            'role' => $this->roles->pluck('name')->first(),
            'status' => 'Active',
            $this->mergeWhen($this->relationLoaded('student') && $this->student, function () use ($request) {
                return (new StudentResource($this->student))->toArray($request);
            }),

            $this->mergeWhen($this->relationLoaded('faculty') && $this->faculty, function () use ($request) {
                return (new FacultyResource($this->faculty))->toArray($request);
            }),

            // $this->mergeWhen($this->relationLoaded('student') && $this->student, [
            //     'student_info' => new StudentResource($this->student),
            // ]),
            // $this->mergeWhen($this->relationLoaded('faculty') && $this->faculty, [
            //     'faculty_info' => new FacultyResource($this->faculty),
            // ]),


            // 'student_info' => new StudentResource($this->whenLoaded('student')),
            // 'faculty_info' => new FacultyResource($this->whenLoaded('faculty'))
        ];
    }
}
