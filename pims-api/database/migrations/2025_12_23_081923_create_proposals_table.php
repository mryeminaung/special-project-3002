<?php

use App\Enums\EligibleMajors;
use App\Enums\ProjectType;
use App\Enums\ProposalStatus;
use App\Enums\ProposalType;
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
            $table->enum('type', ProposalType::cases())->default(ProposalType::Student);
            $table->integer('max_students')->nullable();
            $table->enum('project_type', ProjectType::cases())->default(ProjectType::Special);
            $table->enum('eligible_majors', EligibleMajors::cases())->default(EligibleMajors::Both);
            $table->enum('status', ProposalStatus::cases())->default(ProposalStatus::Pending);
            $table->timestamp('submitted_at');
            $table->foreignId('area_id')->nullable()->constrained('project_areas')->nullOnDelete();
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
