<?php

namespace App\Services;

use App\Models\Announcement;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class AnnouncementService
{
    public function list(?string $audience = null): LengthAwarePaginator
    {
        $query = Announcement::query();

        if ($audience) {
            $query->where('audience', $audience);
        }

        return $query->orderBy('created_at', 'desc')->paginate(15);
    }

    public function create(array $data): Announcement
    {
        return Announcement::create($data);
    }

    public function update(Announcement $announcement, array $data): Announcement
    {
        $announcement->update($data);

        return $announcement->fresh();
    }

    public function delete(Announcement $announcement): bool
    {
        return $announcement->delete();
    }
}
