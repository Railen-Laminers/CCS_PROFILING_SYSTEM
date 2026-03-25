<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Faculty extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'department',
        'specialization',
        'subjects_handled',
        'teaching_schedule',
        'research_projects',
    ];

    protected $casts = [
        'subjects_handled' => 'array',
        'teaching_schedule' => 'array',
        'research_projects' => 'array',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}