<?php

namespace App\Services;

use App\Models\Student;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\DB;

class StudentSearchService
{
    /**
     * Search and filter students with pagination.
     */
    public function search(array $filters): array
    {
        $perPage = $filters['per_page'] ?? 15;

        $query = Student::with('user')
            ->whereHas('user', fn ($q) => $q->where('role', 'student'));

        if (!empty($filters['search'])) {
            $query->search($filters['search']);
        }

        if (!empty($filters['program'])) {
            $query->filterByProgram($filters['program']);
        }

        if (!empty($filters['year_level'])) {
            $query->filterByYearLevel($filters['year_level']);
        }

        if (!empty($filters['gender'])) {
            $query->filterByGender($filters['gender']);
        }

        $gpaMin = $filters['gpa_min'] ?? null;
        $gpaMax = $filters['gpa_max'] ?? null;
        if ($gpaMin !== null || $gpaMax !== null) {
            $query->filterByGpaRange($gpaMin, $gpaMax);
        }

        if (!empty($filters['sports'])) {
            $query->filterBySports($filters['sports']);
        }

        if (!empty($filters['organizations'])) {
            $query->filterByOrganizations($filters['organizations']);
        }

        $paginated = $query->orderBy('id', 'desc')->paginate($perPage);

        $students = $paginated->getCollection()->map(function ($student) {
            return [
                'user' => $student->user->only([
                    'id', 'firstname', 'middlename', 'lastname', 'user_id',
                    'email', 'birth_date', 'contact_number', 'gender',
                    'address', 'profile_picture', 'is_active', 'last_login_at',
                ]),
                'student' => $student,
            ];
        });

        return [
            'students' => $students,
            'meta' => [
                'current_page' => $paginated->currentPage(),
                'last_page'    => $paginated->lastPage(),
                'per_page'     => $paginated->perPage(),
                'total'        => $paginated->total(),
            ],
        ];
    }

    /**
     * Get distinct sports from all students.
     */
    public function getDistinctSports(): array
    {
        return DB::table('students')
            ->whereNotNull('sports_activities')
            ->pluck('sports_activities')
            ->flatMap(function ($json) {
                $data = is_string($json) ? json_decode($json, true) : $json;
                return $data['sportsPlayed'] ?? [];
            })
            ->unique()
            ->sort()
            ->values()
            ->toArray();
    }

    /**
     * Get distinct organizations from all students.
     */
    public function getDistinctOrganizations(): array
    {
        return DB::table('students')
            ->whereNotNull('organizations')
            ->pluck('organizations')
            ->flatMap(function ($json) {
                $data = is_string($json) ? json_decode($json, true) : $json;
                return $data['clubs'] ?? [];
            })
            ->unique()
            ->sort()
            ->values()
            ->toArray();
    }
}
