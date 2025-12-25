<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class StudentResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return  [
            'major' => $this->major->name,
            "phoneNumber" => $this->phone_number,
            'gpa' => $this->gpa,
            'graduationStatus' => $this->graduation_status
        ];;
    }
}
