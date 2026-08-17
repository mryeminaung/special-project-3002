<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Storage;

class UserResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'         => $this->id,
            'name'       => $this->name,
            'email'      => $this->email,
            'avatar_url' => $this->avatar_url ? Storage::disk('public')->url($this->avatar_url) : null,
            'roles'      => $this->roles->pluck('name'),
            'permissions' => $this->getAllPermissions()->pluck('name'),
            'status'     => 'Active',
            'profile'    => match(true) {
                $this->relationLoaded('student') && $this->student !== null => new StudentResource($this->student),
                $this->relationLoaded('faculty') && $this->faculty !== null => new FacultyResource($this->faculty),
                default => null,
            },
        ];
    }
}
