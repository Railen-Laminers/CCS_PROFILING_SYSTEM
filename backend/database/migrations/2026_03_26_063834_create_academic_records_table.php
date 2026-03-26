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
        Schema::create('academic_records', function (Blueprint $table) {
            $table->id();
            $table->foreignId('student_id')->constrained('students')->onDelete('cascade');
            $table->string('course_name')->nullable();
            $table->string('year_level')->nullable();
            $table->string('semester')->nullable();
            $table->decimal('gpa', 4, 2)->nullable();
            $table->json('current_subjects')->nullable();
            $table->json('academic_awards')->nullable();
            $table->json('quiz_bee_participations')->nullable();
            $table->json('programming_contests')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('academic_records');
    }
};
