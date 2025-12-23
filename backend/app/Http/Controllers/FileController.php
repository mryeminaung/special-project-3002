<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class FileController extends Controller
{
    public function uploadToS3(Request $request)
    {
        if ($request->hasFile('file')) {
            $request->validate([
                'file' => ['required', 'mimes:pdf,doc,docx', 'max:10240'],
            ]);

            $path = $request->file('file')->store('proposals', 's3');

            return response()->json([
                'url' => Storage::disk('s3')->url($path),
            ]);
        }

        return response()->json(['error' => 'No file received'], 400);
    }

    public function deleteFromS3(Request $request)
    {
        $request->validate([
            'url' => ['required', 'url'],
        ]);

        $url = $request->input('url');

        // Try to extract the object key from the URL path
        $path = parse_url($url, PHP_URL_PATH) ?? '';
        $path = ltrim($path, '/');

        $bucket = config('filesystems.disks.s3.bucket') ?? '';
        if ($bucket && strpos($path, $bucket . '/') === 0) {
            $path = substr($path, strlen($bucket) + 1);
        }

        if (empty($path)) {
            $baseUrl = rtrim(Storage::disk('s3')->url(''), '/');
            $path = ltrim(str_replace($baseUrl, '', $url), '/');
        }

        if (empty($path)) {
            return response()->json(['error' => 'Could not determine S3 object key from provided URL'], 400);
        }

        $deleted = Storage::disk('s3')->delete($path);

        if ($deleted) {
            return response()->json(['success' => true]);
        }

        return response()->json(['error' => 'Delete failed or file not found'], 400);
    }
}
