<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AcademicRecord extends Model
{
    use HasFactory;

    protected $fillable = [
        'student_id',
        'course_name',
        'year_level',
        'semester',
        'gpa',
        'current_subjects',
        'academic_awards',
        'quiz_bee_participations',
        'programming_contests',
    ];

    protected $casts = [
        'gpa'                     => 'decimal:2',
        'current_subjects'        => 'array',
        'academic_awards'         => 'array',
        'quiz_bee_participations' => 'array',
        'programming_contests'    => 'array',
    ];

    public function student()
    {
        return $this->belongsTo(Student::class);
    }
}
