<?php

namespace App\Services;

use App\Models\Faculty;
use App\Models\User;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Str;

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

  public function update(int $id, array $data): User
  {
    $user = User::findOrFail($id);

    $user->update([
      'name'  => $data['name'] ?? $user->name,
      'email' => $data['email'] ?? $user->email,
    ]);

    $faculty = $user->faculty;

    if ($faculty) {
      $faculty->update([
        'phone_number'  => $data['phone_number'] ?? $faculty->phone_number,
        'address'       => $data['address'] ?? $faculty->address,
        'department_id' => $data['department_id'] ?? $faculty->department_id,
        'rank_id'       => $data['rank_id'] ?? $faculty->rank_id,
      ]);
    } else {
      Faculty::create([
        'user_id'       => $user->id,
        'phone_number'  => $data['phone_number'] ?? null,
        'address'       => $data['address'] ?? null,
        'department_id' => $data['department_id'] ?? null,
        'rank_id'       => $data['rank_id'] ?? null,
      ]);
    }

    return $user->fresh(['faculty.rank', 'faculty.department']);
  }

  public function resetPassword(int $id): string
  {
    $user = User::findOrFail($id);
    $tempPassword = Str::random(12);
    $user->update(['password' => $tempPassword]);

    return $tempPassword;
  }
}
