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
        'sports_activities' => 'array',
        'organizations' => 'array',
        'behavior_discipline_records' => 'array',
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

    // --- Query Scopes for Search & Filtering ---

    /**
     * Global text search across user name, student ID, and program.
     */
    public function scopeSearch($query, string $term)
    {
        return $query->whereHas('user', function ($q) use ($term) {
            $q->where('firstname', 'LIKE', "%{$term}%")
              ->orWhere('lastname', 'LIKE', "%{$term}%")
              ->orWhere('user_id', 'LIKE', "%{$term}%");
        });
    }

    public function scopeFilterByProgram($query, string $program)
    {
        return $query->where('program', $program);
    }

    public function scopeFilterByYearLevel($query, int $yearLevel)
    {
        return $query->where('year_level', $yearLevel);
    }

    public function scopeFilterByGender($query, string $gender)
    {
        return $query->whereHas('user', fn ($q) => $q->where('gender', $gender));
    }

    public function scopeFilterByGpaRange($query, $min = null, $max = null)
    {
        if ($min !== null) {
            $query->where('gpa', '>=', $min);
        }
        if ($max !== null) {
            $query->where('gpa', '<=', $max);
        }
        return $query;
    }

    /**
     * Filter by sports within sports_activities JSON -> sportsPlayed array.
     */
    public function scopeFilterBySports($query, array $sports)
    {
        return $query->where(function ($q) use ($sports) {
            foreach ($sports as $sport) {
                $q->whereRaw(
                    "JSON_CONTAINS(sports_activities, ?, '$.sportsPlayed')",
                    [json_encode($sport)]
                );
            }
        });
    }

    /**
     * Filter by organizations within organizations JSON -> clubs array.
     */
    public function scopeFilterByOrganizations($query, array $orgs)
    {
        return $query->where(function ($q) use ($orgs) {
            foreach ($orgs as $org) {
                $q->whereRaw(
                    "JSON_CONTAINS(organizations, ?, '$.clubs')",
                    [json_encode($org)]
                );
            }
        });
    }
}