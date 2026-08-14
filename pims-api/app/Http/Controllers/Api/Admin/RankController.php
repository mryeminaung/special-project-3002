<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Rank;
use App\Traits\ApiResponse;

class RankController extends Controller
{
    use ApiResponse;

    public function index()
    {
        $ranks = Rank::orderBy('name')->get();

        return $this->successResponse('Ranks retrieved successfully.', $ranks);
    }
}
