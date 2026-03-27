<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('proposals', function (Blueprint $table) {
            $table->id();
            $table->string('title')->unique();
            $table->string('slug')->unique();
            $table->text('description');
            $table->string('fileUrl')->unique();
            $table->enum('type', ['student', 'faculty'])->default('student');
            $table->integer('max_students')->nullable();
            $table->enum('project_type', ['special', 'capstone', 'master'])->default('special');
            $table->enum('eligible_majors', ['cse', 'ece', 'both'])->default("both");
            $table->enum('status', ["approved", 'pending', 'rejected'])->default("pending");
            $table->timestamp('submitted_at');
            $table->foreignId('area_id')->constrained('project_areas')->onDelete('set null');
            $table->foreignId("student_id")->nullable()->constrained('users')->cascadeOnDelete();
            $table->foreignId('supervisor_id')->constrained('users')->cascadeOnDelete();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('proposals');
    }
};
