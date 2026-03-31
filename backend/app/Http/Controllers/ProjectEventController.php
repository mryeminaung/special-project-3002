<?php
namespace App\Http\Controllers;

use App\Http\Requests\ProjectEventStoreRequest;
use App\Http\Resources\ProjectEventResource;
use App\Models\ProjectEvent;
use App\Traits\ApiResponse;

class ProjectEventController extends Controller
{
    use ApiResponse;

    public function index()
    {
        return $this->successResponse(
            "Project events retrieved successfully",
            ProjectEventResource::collection(ProjectEvent::orderBy('id')->get()),
        );
    }

    public function store(ProjectEventStoreRequest $request)
    {
        $data = $request->validated();

        $event = ProjectEvent::create($data);

        if ($event) {
            return $this->successResponse(
                "Project event created successfully",
                $event,
                201
            );
        }
        return $this->errorResponse("Failed to create project event", 500);
    }

    public function toggleActive(ProjectEvent $projectEvent)
    {
        $projectEvent->is_active = ! $projectEvent->is_active;

        if ($projectEvent->save()) {
            $eventStatuses = ProjectEvent::orderBy('id')->get(['id', 'type', 'is_active']);
            return $this->successResponse(
                "Project event status toggled successfully",
                $eventStatuses
            );
        }
        return $this->errorResponse("Failed to toggle project event status", 500);
    }

    public function destroy(ProjectEvent $projectEvent)
    {
        if ($projectEvent->delete()) {
            return $this->successResponse(
                "Project event deleted successfully",
                null
            );
        }
        return $this->errorResponse("Failed to delete project event", 500);
    }
}
