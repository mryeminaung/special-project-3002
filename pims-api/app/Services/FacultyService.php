<?php

namespace App\Services;

use App\Models\User;
use Illuminate\Database\Eloquent\Collection;

class FacultyService
{
  public function list(): Collection
  {
    return User::whereHas('faculty')
      ->with(['faculty.rank', 'faculty.department'])
      ->get();
  }

  public function detail(int $id): array
  {
    $user = User::with('faculty.rank', 'faculty.department')->findOrFail($id);

    $activeProjects = $user->projects()
      ->where('status', 'active')
      ->with(['leader', 'members'])
      ->get();

    $pastProjects = $user->projects()
      ->where('status', '!=', 'active')
      ->with(['leader', 'members'])
      ->get();

    return [
      'user'           => $user,
      'activeProjects' => $activeProjects,
      'pastProjects'   => $pastProjects,
    ];
  }
}
