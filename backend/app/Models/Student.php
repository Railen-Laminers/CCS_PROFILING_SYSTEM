<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Student extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'parent_guardian_name',
        'emergency_contact',
        'section',
        'program',
        'year_level',
        'gpa',
        'current_subjects',
        'academic_awards',
        'events_participated',
        'blood_type',
        'disabilities',
        'medical_condition',
        'allergies',
        'sports_activities',
        'organizations',
        'behavior_discipline_records',
    ];

    protected $casts = [
        'current_subjects' => 'array',
        'academic_awards' => 'array',
        'events_participated' => 'array',
        'year_level' => 'integer',
        'gpa' => 'float',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function academicRecords()
    {
        return $this->hasMany(AcademicRecord::class);
    }
}