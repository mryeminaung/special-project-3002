<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class FacultyResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'phoneNumber'  => $this->phone_number,
            'address'      => $this->address,
            'rank'         => $this->rank?->name,
            'rankId'       => $this->rank_id,
            'department'   => $this->department?->name,
            'departmentId' => $this->department_id,
        ];
    }
}
