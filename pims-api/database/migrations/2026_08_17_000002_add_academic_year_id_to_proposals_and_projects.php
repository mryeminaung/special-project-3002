<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('proposals', function (Blueprint $table) {
            $table->foreignId('academic_year_id')
                ->nullable()
                ->constrained('academic_years')
                ->nullOnDelete()
                ->after('id');
        });

        Schema::table('projects', function (Blueprint $table) {
            $table->foreignId('academic_year_id')
                ->nullable()
                ->constrained('academic_years')
                ->nullOnDelete()
                ->after('id');
        });
    }

    public function down(): void
    {
        Schema::table('proposals', function (Blueprint $table) {
            $table->dropForeignIdFor(\App\Models\AcademicYear::class);
            $table->dropColumn('academic_year_id');
        });

        Schema::table('projects', function (Blueprint $table) {
            $table->dropForeignIdFor(\App\Models\AcademicYear::class);
            $table->dropColumn('academic_year_id');
        });
    }
};
