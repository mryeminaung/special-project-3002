<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('projects', function (Blueprint $table) {
            $table->boolean('mid_report_approved')->default(false)->after('mid_report_url');
            $table->boolean('final_report_approved')->default(false)->after('final_report_url');
        });
    }

    public function down(): void
    {
        Schema::table('projects', function (Blueprint $table) {
            $table->dropColumn(['mid_report_approved', 'final_report_approved']);
        });
    }
};
