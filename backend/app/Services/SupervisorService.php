<?php

namespace App\Services;

use App\Models\User;
use Illuminate\Database\Eloquent\Collection;

class SupervisorService
{
    public function list(): Collection
    {
        return User::whereHas('faculty')
            ->whereHas('projects')
            ->with('faculty')
            ->get();
    }

    public function detail(int $id): array
    {
        $supervisor = User::with('faculty')->findOrFail($id);

        $activeProjects = $supervisor->projects()
            ->where('status', 'active')
            ->with('leader')
            ->get();

        $pastProjects = $supervisor->projects()
            ->where('status', '!=', 'active')
            ->with('leader')
            ->get();

        return [
            'supervisor' => $supervisor,
            'activeProjects' => $activeProjects,
            'pastProjects' => $pastProjects,
        ];
    }
}
