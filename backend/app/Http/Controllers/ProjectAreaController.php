<?php
namespace App\Http\Controllers;

use App\Models\ProjectArea;

class ProjectAreaController extends Controller
{
    public function index()
    {
        return response()->json(ProjectArea::all());
    }
}
