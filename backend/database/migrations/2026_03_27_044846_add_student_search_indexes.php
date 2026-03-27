<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('students', function (Blueprint $table) {
            $table->index('program');
            $table->index('year_level');
            $table->index('gpa');
        });

        Schema::table('users', function (Blueprint $table) {
            $table->index(['role', 'is_active']);
            $table->index('gender');
        });
    }

    public function down(): void
    {
        Schema::table('students', function (Blueprint $table) {
            $table->dropIndex(['program']);
            $table->dropIndex(['year_level']);
            $table->dropIndex(['gpa']);
        });

        Schema::table('users', function (Blueprint $table) {
            $table->dropIndex(['role', 'is_active']);
            $table->dropIndex(['gender']);
        });
    }
};
