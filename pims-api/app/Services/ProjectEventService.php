<?php

namespace App\Services;

use App\Events\ProjectEventCreated;
use App\Models\ProjectEvent;
use Illuminate\Database\Eloquent\Collection;

class ProjectEventService
{
    public function list(): Collection
    {
        return ProjectEvent::orderBy('id')->get();
    }

    public function create(array $data): ProjectEvent
    {
        $event = ProjectEvent::create($data);
        ProjectEventCreated::dispatch($event);
        return $event;
    }

    public function toggleActive(ProjectEvent $event): ProjectEvent
    {
        $event->update(['is_active' => !$event->is_active]);

        return $event->fresh();
    }

    public function update(ProjectEvent $event, array $data): ProjectEvent
    {
        $event->update($data);

        return $event->fresh();
    }

    public function delete(ProjectEvent $event): bool
    {
        return $event->delete();
    }
}
