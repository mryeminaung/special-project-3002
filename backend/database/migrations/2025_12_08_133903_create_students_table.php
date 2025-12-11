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
        Schema::create('students', function (Blueprint $table) {
            $table->id();
            $table->string("phone_number");
            $table->string("gpa")->nullable();
            $table->enum("graduation_status", ["Active", "Graduated", "On Leave"]);
            $table->foreignId("user_id")->constrained("users");
            $table->foreignId("major_id")->constrained("majors");
            // $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('students');
    }
};
