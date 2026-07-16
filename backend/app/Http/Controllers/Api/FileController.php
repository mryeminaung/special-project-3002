<?php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\UserResource;
use App\Services\FileService;
use App\Traits\ApiResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class FileController extends Controller
{
    use ApiResponse;

    public function __construct(
        private FileService $fileService
    ) {}

    public function uploadProfilePicture(Request $request)
    {
        $request->validate([
            'avatar_url' => ['required', 'image'],
        ]);

        $this->fileService->uploadProfilePicture($request->file('avatar_url'));

        return $this->successResponse(
            'Profile picture uploaded successfully.',
            new UserResource(Auth::user()->load(['student', 'faculty']))
        );
    }

    public function deleteProfilePicture()
    {
        $this->fileService->deleteProfilePicture();

        return $this->successResponse(
            'Profile picture deleted successfully.',
            new UserResource(Auth::user()->load(['student', 'faculty']))
        );
    }

    public function uploadReport(Request $request)
    {
        $request->validate([
            'file' => ['required', 'mimes:pdf,doc,docx', 'max:10240'],
        ], [
            'file.required' => 'Please upload a file.',
            'file.mimes'    => 'Only PDF, DOC, or DOCX files are allowed.',
            'file.max'      => 'File size must not exceed 10MB.',
        ]);

        $file = $request->file('file');
        $type = $request->input('type');
        $slug = $request->input('slug');

        $projectId = null;
        if ($slug) {
            $project = \App\Models\Project::where('slug', $slug)->first();
            $projectId = $project?->id;
        }

        $result = $this->fileService->uploadReport($file, $projectId, $type);

        return $this->successResponse(
            "Report is stored successfully",
            ['url' => "storage/{$result['path']}"]
        );
    }

    public function uploadToS3(Request $request)
    {
        $request->validate([
            'file' => ['required', 'mimes:pdf,doc,docx', 'max:10240'],
        ], [
            'file.required' => 'Please upload a file.',
            'file.mimes'    => 'Only PDF, DOC, or DOCX files are allowed.',
            'file.max'      => 'File size must not exceed 10MB.',
        ]);

        $path = $this->fileService->uploadProposalFile($request->file('file'));

        return $this->successResponse(
            "Proposal file stored successfully",
            ['url' => "storage/$path"]
        );
    }

    public function deleteReport(Request $request)
    {
        $validated = $request->validate([
            'slug' => ['required', 'string', 'exists:projects,slug'],
            'type' => ['required', 'in:mid,final'],
        ]);

        $project = \App\Models\Project::where('slug', $validated['slug'])->first();

        if (! $project) {
            return $this->errorResponse("Project not found", 404);
        }

        $reportField = $validated['type'] === 'mid' ? 'mid_report_url' : 'final_report_url';
        $reportUrl = $project->{$reportField};

        if ($reportUrl) {
            $path = ltrim($reportUrl, '/');
            if (str_starts_with($path, 'storage/')) {
                $path = substr($path, strlen('storage/'));
            }

            $this->fileService->deleteReport($path, $project->id, $validated['type']);
        }

        return $this->successResponse("Report deleted successfully", null);
    }
}
