<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\AnnouncementRequest;
use App\Http\Resources\AnnouncementResource;
use App\Models\Announcement;
use App\Services\AnnouncementService;
use App\Traits\ApiResponse;
use Illuminate\Support\Facades\Gate;

class AnnouncementController extends Controller
{
    use ApiResponse;

    public function __construct(
        private AnnouncementService $announcementService
    ) {}

    public function index()
    {
        $audience = request()->query('audience');
        $announcements = $this->announcementService->list($audience);

        return $this->successResponse(
            "Announcements retrieved successfully",
            AnnouncementResource::collection($announcements)
        );
    }

    public function store(AnnouncementRequest $request)
    {
        Gate::authorize('create', Announcement::class);

        $announcement = $this->announcementService->create($request->validated());

        return $this->successResponse(
            'Announcement created successfully',
            new AnnouncementResource($announcement),
            201
        );
    }

    public function show(Announcement $announcement)
    {
        return $this->successResponse(
            "Announcement retrieved successfully",
            new AnnouncementResource($announcement)
        );
    }

    public function update(AnnouncementRequest $request, Announcement $announcement)
    {
        Gate::authorize('update', $announcement);

        $announcement = $this->announcementService->update($announcement, $request->validated());

        return $this->successResponse(
            'Announcement updated successfully',
            new AnnouncementResource($announcement),
            200
        );
    }

    public function destroy(Announcement $announcement)
    {
        Gate::authorize('delete', $announcement);

        $this->announcementService->delete($announcement);

        return $this->successResponse(
            'Announcement deleted successfully',
            null,
            204
        );
    }
}
