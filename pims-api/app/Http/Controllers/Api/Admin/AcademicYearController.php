<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Resources\AcademicYearResource;
use App\Models\AcademicYear;
use App\Services\AcademicYearService;
use App\Traits\ApiResponse;
use Illuminate\Http\Request;

class AcademicYearController extends Controller
{
    use ApiResponse;

    public function __construct(
        private AcademicYearService $service
    ) {}

    public function index()
    {
        $years = $this->service->list();

        return $this->successResponse('Academic years retrieved.', AcademicYearResource::collection($years));
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'year'       => ['required', 'string', 'regex:/^\d{4}\/\d{4}$/'],
            'semester'   => ['required', 'integer', 'in:1,2'],
            'start_date' => ['required', 'date'],
            'end_date'   => ['required', 'date', 'after:start_date'],
            'is_active'  => ['boolean'],
        ]);

        $year = $this->service->create($data);

        return $this->successResponse('Academic year created.', new AcademicYearResource($year), 201);
    }

    public function update(Request $request, AcademicYear $academicYear)
    {
        $data = $request->validate([
            'year'       => ['sometimes', 'string', 'regex:/^\d{4}\/\d{4}$/'],
            'semester'   => ['sometimes', 'integer', 'in:1,2'],
            'start_date' => ['sometimes', 'date'],
            'end_date'   => ['sometimes', 'date', 'after:start_date'],
            'is_active'  => ['boolean'],
        ]);

        $year = $this->service->update($academicYear, $data);

        return $this->successResponse('Academic year updated.', new AcademicYearResource($year));
    }

    public function setActive(AcademicYear $academicYear)
    {
        $year = $this->service->setActive($academicYear);

        return $this->successResponse('Academic year set as active.', new AcademicYearResource($year));
    }

    public function destroy(AcademicYear $academicYear)
    {
        $this->service->delete($academicYear);

        return $this->successResponse('Academic year deleted.', null, 204);
    }
}
