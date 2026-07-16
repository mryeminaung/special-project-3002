<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\DepartmentRequest;
use App\Models\Department;
use App\Services\DepartmentService;
use App\Traits\ApiResponse;

class DepartmentController extends Controller
{
    use ApiResponse;

    public function __construct(
        private DepartmentService $departmentService
    ) {}

    public function index()
    {
        $departments = $this->departmentService->list();

        return $this->successResponse("Departments retrieved successfully", $departments);
    }

    public function store(DepartmentRequest $request)
    {
        $department = $this->departmentService->create($request->validated());

        return $this->successResponse('Department created successfully', $department);
    }

    public function show(Department $department)
    {
        return $this->successResponse('Department retrieved successfully', $department);
    }

    public function update(DepartmentRequest $request, Department $department)
    {
        $department = $this->departmentService->update($department, $request->validated());

        return $this->successResponse('Department updated successfully', $department);
    }

    public function destroy(Department $department)
    {
        $this->departmentService->delete($department);

        return $this->successResponse('Department deleted successfully', null, 204);
    }
}
