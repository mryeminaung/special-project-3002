<?php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\SupervisorResource;
use App\Services\SupervisorService;
use App\Traits\ApiResponse;

class SupervisorController extends Controller
{
    use ApiResponse;

    public function __construct(
        private SupervisorService $supervisorService
    ) {}

    public function index()
    {
        $supervisors = $this->supervisorService->list();

        return $this->successResponse(
            'Supervisors retrieved successfully.',
            SupervisorResource::collection($supervisors)
        );
    }

    public function show(string $id)
    {
        $data = $this->supervisorService->detail((int) $id);

        return $this->successResponse(
            'Supervisor detail retrieved successfully.',
            [
                'id'             => $data['supervisor']->id,
                'name'           => $data['supervisor']->name,
                'email'          => $data['supervisor']->email,
                'rank'           => $data['supervisor']->faculty?->rank?->name,
                'faculty'        => $data['supervisor']->faculty?->department?->name,
                'phone'          => $data['supervisor']->faculty?->phone_number,
                'imageUrl'       => $data['supervisor']->avatar_url,
                'activeProjects' => $data['activeProjects']->map(fn ($p) => [
                    'id'       => $p->id,
                    'title'    => $p->name,
                    'students' => $p->members->count() . ' Students',
                ]),
                'pastProjects'   => $data['pastProjects']->map(fn ($p) => [
                    'id'      => $p->id,
                    'title'   => $p->name,
                    'year'    => optional($p->start_date)->format('Y'),
                    'outcome' => 'Completed',
                ]),
            ]
        );
    }
}
