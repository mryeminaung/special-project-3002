<?php

namespace App\Http\Controllers;

use App\Models\ProjectProposal;
use Illuminate\Http\Request;

class ProjectProposalController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        return $request->all();
    }

    /**
     * Display the specified resource.
     */
    public function show(ProjectProposal $projectProposal)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, ProjectProposal $projectProposal)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(ProjectProposal $projectProposal)
    {
        //
    }
}
