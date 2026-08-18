<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('grades', function (Blueprint $table) {
            $table->id();
            $table->foreignId('project_id')->constrained()->cascadeOnDelete();
            $table->foreignId('student_id')->constrained('users')->cascadeOnDelete();
            $table->foreignId('examiner_id')->constrained('users')->cascadeOnDelete();
            $table->string('grade');          // A / B / C / D / F or numeric
            $table->text('remarks')->nullable();
            $table->enum('type', ['mid', 'final']);
            $table->timestamps();

            $table->unique(['project_id', 'student_id', 'examiner_id', 'type'], 'unique_grade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('grades');
    }
};
