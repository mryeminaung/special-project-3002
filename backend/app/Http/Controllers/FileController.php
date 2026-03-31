<?php
namespace App\Http\Controllers;

use App\Http\Resources\UserResource;
use App\Models\Project;
use App\Traits\ApiResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;

class FileController extends Controller
{
    use ApiResponse;

    public function uploadProfilePicture(Request $request)
    {
        $request->validate([
            'avatar_url' => ['required', 'image'],
        ]);

        $path      = $request->file('avatar_url')->store('avatars', 's3');
        $avatarURL = Storage::disk('s3')->url($path);

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
        $path = parse_url($url, PHP_URL_PATH) ?? '';
        $path = ltrim($path, '/');

        $bucket = config('filesystems.disks.s3.bucket') ?? '';
        if ($bucket && strpos($path, $bucket . '/') === 0) {
            $path = substr($path, strlen($bucket) + 1);
        }

        if (empty($path)) {
            $baseUrl = rtrim(Storage::disk('s3')->url(''), '/');
            $path    = ltrim(str_replace($baseUrl, '', $url), '/');
        }

        if (! empty($path)) {
            Storage::disk('s3')->delete($path);
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

            $type = $request->input('type');
            $slug = $request->input('slug');
            $path = $request->file('file')->store("reports/$type", 'public');

            if ($slug) {
                $project = Project::where('slug', $slug)->first();
                if ($project) {
                    $url = "storage/$path";
                    if ($type === 'mid') {
                        $project->mid_report_url = $url;
                    } elseif ($type === 'final') {
                        $project->final_report_url = $url;
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

            $path = $request->file('file')->store('proposals', 'public');
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
        $project->save();

        return $this->successResponse("Report deleted successfully", null);
    }

    public function deleteFromS3(Request $request)
    {
        $request->validate([
            'url' => ['required', 'url'],
        ]);
        $path = "";

        $deleted = Storage::disk('s3')->delete($path);

        if ($deleted) {
            return response()->json(['success' => true]);
        }

        return response()->json(['error' => 'Delete failed or file not found'], 400);
    }
}
