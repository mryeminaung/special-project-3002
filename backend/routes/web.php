<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rules\File;

Route::get("/upload", function () {
  return view('upload');
})->name('uploading');

Route::post("/upload-to-s3", function () {

  if (request()->hasFile('myFile')) {

    $data = request()->validate([
      'filename' => 'required|string|max:20|',
      'myFile' => ['required', 'mimes:pdf,docx,csv'],
    ], [
      'myFile.mimes' => "You should upload files with .pdf, .docx and .xlsx"
    ]);

    // dd($data);

    $file = $data['myFile'];
    $filename = $data['filename'];

    $file->storeAs('proposals', $filename, [
      'disk' => 's3',
      'visibility' => 'public',
    ]);

    $url = Storage::disk("s3")->url('/proposals/' . $filename);

    return redirect()
      ->route('uploading')
      ->with('url', $url);
  } else {
    dd("Not Hit");
  }
});

