<?php

namespace App\Services;

use App\Models\ProjectArea;
use Illuminate\Database\Eloquent\Collection;

class ProjectAreaService
{
    public function list(): Collection
    {
        return ProjectArea::orderBy('name')->get();
    }

    public function create(array $data): ProjectArea
    {
        return ProjectArea::create($data);
    }

    public function update(ProjectArea $projectArea, array $data): ProjectArea
    {
        $projectArea->update($data);

        return $projectArea->fresh();
    }

    public function delete(ProjectArea $projectArea): bool
    {
        return $projectArea->delete();
    }
}
