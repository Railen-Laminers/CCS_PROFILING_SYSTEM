<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('students', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');

            // Student‑specific fields
            $table->string('parent_guardian_name')->nullable();
            $table->string('emergency_contact', 20)->nullable();

            $table->string('section')->nullable();
            $table->string('program')->nullable();
            $table->integer('year_level')->nullable();
            $table->decimal('gpa', 3, 2)->nullable();
            $table->json('current_subjects')->nullable();
            $table->json('academic_awards')->nullable();
            $table->json('events_participated')->nullable();

            $table->string('blood_type', 3)->nullable();
            $table->text('disabilities')->nullable();
            $table->text('medical_condition')->nullable();
            $table->text('allergies')->nullable();

            $table->text('sports_activities')->nullable();
            $table->text('organizations')->nullable();
            $table->text('behavior_discipline_records')->nullable();

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('students');
    }
};