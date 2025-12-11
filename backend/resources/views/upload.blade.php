<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Upload to AWS S3</title>

    <style>
        body {
            font-family: Arial, Helvetica, sans-serif;
            background: #f8fafc;
            padding: 40px;
        }

        .upload-wrapper {
            max-width: 500px;
            margin: 0 auto;
        }

        .upload-label {
            font-size: 14px;
            color: #374151;
            font-weight: 500;
            display: block;
            margin-bottom: 6px;
        }

        .upload-box {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 14px;
            padding: 40px 20px;
            background: #f9fafb;
            border: 2px dashed #d1d5db;
            border-radius: 12px;
            cursor: pointer;
            transition: .25s background;
            position: relative;
        }

        .upload-box:hover {
            background: #f3f4f6;
        }

        .upload-icon {
            width: 50px;
            height: 50px;
            stroke: #9ca3af;
        }

        .upload-text-main {
            font-size: 14px;
            color: #4b5563;
            font-weight: 600;
        }

        .upload-text-sub {
            font-size: 12px;
            color: #9ca3af;
        }

        .upload-box input {
            position: absolute;
            inset: 0;
            opacity: 0;
            cursor: pointer;
        }

        .upload-info {
            font-size: 12px;
            color: #6b7280;
            margin-top: 6px;
        }

        .btn-submit {
            margin-top: 20px;
            padding: 10px 18px;
            background: #2563eb;
            color: white;
            border: none;
            border-radius: 6px;
            cursor: pointer;
        }

        .btn-submit:hover {
            background: #1e4db7;
        }

        .preview-wrapper {
            margin-top: 20px;
        }

        .preview-box {
            width: 100%;
            height: 220px;
            background: #f3f4f6;
            border: 1px solid #e5e7eb;
            border-radius: 12px;
            display: flex;
            align-items: center;
            justify-content: center;
            overflow: hidden;
        }

        .preview-box img {
            max-width: 100%;
            max-height: 100%;
            object-fit: contain;
            background: white;
            border-radius: 12px;
        }

        .preview-info {
            margin-top: 10px;
            font-size: 12px;
            color: #6b7280;
            text-align: center;
        }

        .filename-input {
            padding: 8px 10px;
            border-radius: 10px;
        }
    </style>
</head>

<body>

    <div class="upload-wrapper">
        @if ($errors->any())
            <div style="color: red; margin-bottom: 15px;">
                <ul>
                    @foreach ($errors->all() as $error)
                        <li>{{ $error }}</li>
                    @endforeach
                </ul>
            </div>
        @endif

        <form action="/upload-to-s3" method="POST" enctype="multipart/form-data">

            <!-- Laravel CSRF -->
            @csrf
            <label for="filename" class="upload-label">Enter File Name</label>

            <input class="filename-input" id="filename" name="filename" placeholder="Enter filename" />
            <label for="myFile" class="upload-label">Upload File</label>

            <input type="file" id="myFile" name="myFile">

            <p class="upload-info">
                Allowed: pdf, docx, csv
            </p>

            <button type="submit" class="btn-submit">
                Upload to S3
            </button>
        </form>
        <div class="preview-wrapper">
            @if (session('url'))
                <a href={{ session('url') }} download>Click to Download</a>
            @endif
            <div class="preview-info" id="previewInfo">
                No file selected
            </div>
        </div>

    </div>

</body>

</html>
