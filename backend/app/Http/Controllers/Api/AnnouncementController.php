<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\AnnnouncementRequest;
use App\Http\Resources\AnnouncementResource;
use App\Models\Announcement;
use App\Traits\ApiResponse;
use Illuminate\Support\Facades\Gate;

class AnnouncementController extends Controller
{
    use ApiResponse;

    public function index()
    {
        $query = Announcement::query();

        // optional filter by audience query parameter
        if ($audience = request()->query('audience')) {
            $query->where('audience', $audience);
        }

        $announcements = $query->orderBy('created_at', 'desc')->get();

        return $this->successResponse("Announcements retrieved successfully", AnnouncementResource::collection($announcements));
    }

    public function store(AnnnouncementRequest $request)
    {
        Gate::authorize('create', Announcement::class);

        $announcement = Announcement::create($request->all());

        return $this->successResponse(
            'Announcement created successfully',
            new AnnouncementResource($announcement),
            201
        );
    }

    public function show(Announcement $announcement)
    {
        return $this->successResponse("Announcement retrieved successfully", new AnnouncementResource($announcement));
    }

    public function update(AnnnouncementRequest $request, Announcement $announcement)
    {
        Gate::authorize('update', $announcement);

        $announcement->update($request->all());

        return $this->successResponse(
            'Announcement updated successfully',
            new AnnouncementResource($announcement),
            200
        );
    }

    public function destroy(Announcement $announcement)
    {
        Gate::authorize('delete', $announcement);

        $announcement->delete();

        return $this->successResponse(
            'Announcement deleted successfully',
            null,
            204
        );
    }
}
