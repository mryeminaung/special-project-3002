<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\ProjectAreaRequest;
use App\Models\ProjectArea;
use App\Traits\ApiResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;

class ProjectAreaController extends Controller
{
    use ApiResponse;

    public function index()
    {
        return $this->successResponse('Project areas retrieved successfully', ProjectArea::all());
    }

    public function store(ProjectAreaRequest $request)
    {
        Gate::authorize('create', ProjectArea::class);

        $projectArea = ProjectArea::create($request->all());

        return $this->successResponse('Project area created successfully', $projectArea,  201);
    }

    public function show(ProjectArea $projectArea)
    {
        return $this->successResponse('Project area retrieved successfully', $projectArea);
    }

    public function update(ProjectAreaRequest $request, ProjectArea $projectArea)
    {
        Gate::authorize('update', $projectArea);

        $projectArea->update($request->all());

        return $this->successResponse('Project area updated successfully', $projectArea);
    }

    public function destroy(ProjectArea $projectArea)
    {
        Gate::authorize('delete', $projectArea);

        $projectArea->delete();

        return $this->successResponse('Project area deleted successfully', null, 204);
    }
}
