<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rules\File;

Route::get("/upload", function () {
  return view('upload');
})->name('uploading');
