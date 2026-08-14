<?php

namespace App\Services;

use App\Models\Department;
use Illuminate\Database\Eloquent\Collection;

class DepartmentService
{
    public function list(): Collection
    {
        return Department::withCount('faculties')->get();
    }

    public function create(array $data): Department
    {
        return Department::create($data);
    }

    public function detail(int $id): Department
    {
        return Department::withCount('faculties')
            ->with(['faculties' => function ($query) {
                $query->with(['user', 'rank']);
            }])
            ->findOrFail($id);
    }

    public function update(Department $department, array $data): Department
    {
        $department->update($data);

        return $department->fresh();
    }

    public function delete(Department $department): bool
    {
        return $department->delete();
    }
}
