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
        Schema::create('projects', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('slug');
            $table->text('description');
            $table->enum('mid_report', ['not submitted', 'submitted'])->default('not submitted');
            $table->enum('mid_seminar', ['not completed', 'completed'])->default('not completed');
            $table->enum('final_report', ['not submitted', 'submitted'])->default('not submitted');
            $table->enum('final_seminar', ['not completed', 'completed'])->default('not completed');
            $table->enum('project_type', ['special', 'capstone', 'master'])->default('special');
            $table->enum('status', ['active', 'completed', 'under review'])->default('active');
            $table->timestamp('start_date');
            $table->timestamp('end_date')->nullable();
            $table->foreignId('area_id')->constrained('project_areas')->onDelete('set null');
            $table->foreignId('leader_id')->constrained('users')->cascadeOnDelete();
            $table->foreignId('proposal_id')->constrained('proposals')->cascadeOnDelete();
            $table->foreignId('supervisor_id')->constrained('users')->cascadeOnDelete();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('projects');
    }
};
