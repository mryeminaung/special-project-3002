<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\UserResource;
use App\Services\FacultyService;
use App\Traits\ApiResponse;
use Illuminate\Http\Request;

class FacultyController extends Controller
{
    use ApiResponse;

    public function __construct(
        private FacultyService $facultyService
    ) {}

    public function index()
    {
        return UserResource::collection($this->facultyService->list());
    }

    public function show(string $id) {}

    public function detail(string $id)
    {
        $data = $this->facultyService->detail((int) $id);

        return $this->successResponse(
            'Faculty detail retrieved successfully.',
            [
                'id'             => $data['user']->id,
                'name'           => $data['user']->name,
                'email'          => $data['user']->email,
                'rank'           => $data['user']->faculty?->rank?->name,
                'department'     => $data['user']->faculty?->department?->name,
                'phone'          => $data['user']->faculty?->phone_number,
                'address'        => $data['user']->faculty?->address,
                'imageUrl'       => $data['user']->avatar_url,
                'activeProjects' => $data['activeProjects']->map(fn($p) => [
                    'id'       => $p->id,
                    'title'    => $p->name,
                    'students' => $p->members->count() . ' Students',
                ]),
                'pastProjects'   => $data['pastProjects']->map(fn($p) => [
                    'id'      => $p->id,
                    'title'   => $p->name,
                    'year'    => optional($p->start_date)->format('Y'),
                    'outcome' => 'Completed',
                ]),
            ]
        );
    }
}
