<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\ProjectEventStoreRequest;
use App\Models\ProjectEvent;
use App\Services\ProjectEventService;
use App\Traits\ApiResponse;
use Illuminate\Support\Facades\Gate;

class ProjectEventController extends Controller
{
    use ApiResponse;

    public function __construct(
        private ProjectEventService $projectEventService
    ) {}

    public function index()
    {
        $events = $this->projectEventService->list();

        return $this->successResponse(
            "Project events retrieved successfully",
            $events
        );
    }

    public function store(ProjectEventStoreRequest $request)
    {
        Gate::authorize('create', ProjectEvent::class);

        $event = $this->projectEventService->create($request->validated());

        return $this->successResponse(
            "Project event created successfully",
            $event,
            201
        );
    }

    public function toggleActive(ProjectEvent $projectEvent)
    {
        Gate::authorize('update', $projectEvent);

        $event = $this->projectEventService->toggleActive($projectEvent);

        return $this->successResponse(
            "Project event status toggled successfully",
            $event
        );
    }

    public function destroy(ProjectEvent $projectEvent)
    {
        Gate::authorize('delete', $projectEvent);

        $this->projectEventService->delete($projectEvent);

        return $this->successResponse(
            "Project event deleted successfully",
            null,
            204
        );
    }
}
