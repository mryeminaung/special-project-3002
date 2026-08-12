<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class StudentResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'phoneNumber'      => $this->phone_number,
            'address'          => $this->address,
            'major'            => $this->major?->name,
            'gpa'              => $this->gpa,
            'graduationStatus' => $this->graduation_status,
        ];
    }
}
