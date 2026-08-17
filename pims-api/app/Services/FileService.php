<?php

namespace App\Services;

use App\Enums\ProjectProgressStatus;
use App\Models\Project;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;

class FileService
{
    public function uploadProfilePicture(UploadedFile $file): string
    {
        $path = $file->store('avatars', 'public');

        Auth::user()->update(['avatar_url' => $path]);

        return $path;
    }

    public function deleteProfilePicture(): bool
    {
        $user = Auth::user();

        if ($user->avatar_url) {
            Storage::disk('public')->delete($user->avatar_url);
            $user->update(['avatar_url' => null]);

            return true;
        }

        return false;
    }

    public function uploadReport(UploadedFile $file, ?int $projectId, string $type): array
    {
        $path = $file->store('reports', 'public');

        if ($projectId) {
            $project = Project::findOrFail($projectId);
            $urlField      = $type === 'mid' ? 'mid_report_url'      : 'final_report_url';
            $statusField   = $type === 'mid' ? 'mid_report'          : 'final_report';
            $approvedField = $type === 'mid' ? 'mid_report_approved'  : 'final_report_approved';

            $project->update([
                $urlField      => $path,
                $statusField   => ProjectProgressStatus::Submitted->value,
                $approvedField => false,   // reset approval when student re-uploads
            ]);
        }

        return ['path' => $path];
    }

    public function uploadProposalFile(UploadedFile $file): string
    {
        return $file->store('proposals', 'public');
    }

    public function deleteReport(string $filePath, ?int $projectId, string $type): bool
    {
        Storage::disk('public')->delete($filePath);

        if ($projectId) {
            $project = Project::findOrFail($projectId);
            $field = $type === 'mid' ? 'mid_report_url' : 'final_report_url';
            $statusField = $type === 'mid' ? 'mid_report' : 'final_report';

            $approvedField = $type === 'mid' ? 'mid_report_approved' : 'final_report_approved';
            $project->update([
                $field         => null,
                $statusField   => ProjectProgressStatus::Not_Submitted->value,
                $approvedField => false,
            ]);
        }

        return true;
    }
}
