<?php

use App\Enums\ProjectEventType;
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
        Schema::create('project_events', function (Blueprint $table) {
            $table->id();
            $table->string('title')->nullable();
            $table->text('detail')->nullable();
            $table->enum('type', ProjectEventType::cases())->default(("special"));
            $table->dateTime('start_date')->nullable();
            $table->dateTime('end_date')->nullable();
            $table->boolean('is_active')->default(false);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('project_events');
    }
};
