<?php
namespace App\Http\Controllers;

use App\Enums\ProjectProgressStatus;
use App\Http\Resources\UserResource;
use App\Models\Project;
use App\Traits\ApiResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class FileController extends Controller
{
    use ApiResponse;

    public function uploadProfilePicture(Request $request)
    {
        $request->validate([
            'avatar_url' => ['required', 'image'],
        ]);

        $path      = $request->file('avatar_url')->store('avatars', 'public');
        $avatarURL = 'storage/' . $path;

        $user = Auth::user();

        if ($user) {
            $user->update([
                'avatar_url' => $avatarURL,
            ]);
        }

        return response()->json([
            'user'  => new UserResource(Auth::user()->load(['student', 'faculty'])),
            'token' => $request->bearerToken(),
        ], 200);
    }

    public function deleteProfilePicture(Request $request)
    {
        $user = Auth::user();

        if (! $user || ! $user->avatar_url) {
            return response()->json([
                'user'  => new UserResource(Auth::user()->load(['student', 'faculty'])),
                'token' => $request->bearerToken(),
            ], 200);
        }

        $url  = $user->avatar_url;
        $path = ltrim($url, '/');
        if (strpos($path, 'storage/') === 0) {
            $path = substr($path, strlen('storage/'));
        }

        if (! empty($path)) {
            Storage::disk('public')->delete($path);
        }

        $user->update([
            'avatar_url' => null,
        ]);

        return response()->json([
            'user'  => new UserResource(Auth::user()->load(['student', 'faculty'])),
            'token' => $request->bearerToken(),
        ], 200);
    }

    public function uploadReport(Request $request)
    {
        if ($request->hasFile('file')) {
            $request->validate([
                'file' => ['required', 'mimes:pdf,doc,docx', 'max:10240'],
            ], [
                'file.required' => 'Please upload a file.',
                'file.mimes'    => 'Only PDF, DOC, or DOCX files are allowed.',
                'file.max'      => 'File size must not exceed 10MB.',
            ]);

            $file = $request->file('file');

            $originalName = $file->getClientOriginalName();
            $fileName     = time() . '_' . Str::slug(pathinfo($originalName, PATHINFO_FILENAME)) . '.' . $file->getClientOriginalExtension();

            $type = $request->input('type');
            $slug = $request->input('slug');
            $path = $file->storeAs("reports/$type", $fileName, 'public');

            if ($slug) {
                $project = Project::where('slug', $slug)->first();
                if ($project) {
                    $url = "storage/$path";
                    if ($type === 'mid') {
                        $project->mid_report_url = $url;
                        $project->mid_report     = ProjectProgressStatus::Submitted->value;
                    } elseif ($type === 'final') {
                        $project->final_report_url = $url;
                        $project->final_report     = ProjectProgressStatus::Submitted->value;
                    }
                    $project->save();
                }
            }

            return $this->successResponse(
                "Report is stored successfully",
                ['url' => "storage/$path"],
            );
        }

        return $this->errorResponse("File upload failed", 400);
    }

    public function uploadToS3(Request $request)
    {
        if ($request->hasFile('file')) {
            $request->validate([
                'file' => ['required', 'mimes:pdf,doc,docx', 'max:10240'],
            ], [
                'file.required' => 'Please upload a file.',
                'file.mimes'    => 'Only PDF, DOC, or DOCX files are allowed.',
                'file.max'      => 'File size must not exceed 10MB.',
            ]);

            $file = $request->file('file');

            $originalName = $file->getClientOriginalName();
            $fileName     = time() . '_' . Str::slug(pathinfo($originalName, PATHINFO_FILENAME)) . '.' . $file->getClientOriginalExtension();

            $path = $file->storeAs('proposals', $fileName, 'public');

            return $this->successResponse(
                "Proposals is stored successfully",
                ['url' => "storage/$path"],
            );
        }

        return $this->errorResponse("File upload failed", 400);
    }

    public function deleteReport(Request $request)
    {
        $validated = $request->validate([
            'slug' => ['required', 'string', 'exists:projects,slug'],
            'type' => ['required', 'in:mid,final'],
        ]);

        $project = Project::where('slug', $validated['slug'])->first();

        if (! $project) {
            return $this->errorResponse("Project not found", 404);
        }

        $reportField = $validated['type'] === 'mid' ? 'mid_report_url' : 'final_report_url';
        $reportUrl   = $project->{$reportField};

        if ($reportUrl) {
            $path = ltrim($reportUrl, '/');
            if (strpos($path, 'storage/') === 0) {
                $path = substr($path, strlen('storage/'));
            }
            Storage::disk('public')->delete($path);
        }

        $project->{$reportField} = null;
        if ($validated['type'] === 'mid') {
            $project->mid_report = ProjectProgressStatus::Not_Submitted->value;
        } else {
            $project->final_report = ProjectProgressStatus::Not_Submitted->value;
        }
        $project->save();

        return $this->successResponse("Report deleted successfully", null);
    }
}
