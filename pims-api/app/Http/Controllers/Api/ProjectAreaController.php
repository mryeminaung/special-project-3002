<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\ProjectAreaRequest;
use App\Models\ProjectArea;
use App\Services\ProjectAreaService;
use App\Traits\ApiResponse;
use Illuminate\Support\Facades\Gate;

class ProjectAreaController extends Controller
{
    use ApiResponse;

    public function __construct(
        private ProjectAreaService $projectAreaService
    ) {}

    public function index()
    {
        $areas = $this->projectAreaService->list();

        return $this->successResponse('Project areas retrieved successfully', $areas);
    }

    public function store(ProjectAreaRequest $request)
    {
        Gate::authorize('create', ProjectArea::class);

        $projectArea = $this->projectAreaService->create($request->validated());

        return $this->successResponse('Project area created successfully', $projectArea, 201);
    }

    public function show(ProjectArea $projectArea)
    {
        return $this->successResponse('Project area retrieved successfully', $projectArea);
    }

    public function update(ProjectAreaRequest $request, ProjectArea $projectArea)
    {
        Gate::authorize('update', $projectArea);

        $projectArea = $this->projectAreaService->update($projectArea, $request->validated());

        return $this->successResponse('Project area updated successfully', $projectArea);
    }

    public function destroy(ProjectArea $projectArea)
    {
        Gate::authorize('delete', $projectArea);

        $this->projectAreaService->delete($projectArea);

        return $this->successResponse('Project area deleted successfully', null, 204);
    }
}
