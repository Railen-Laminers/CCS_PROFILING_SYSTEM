<?php

namespace App\Http\Controllers;

use App\Models\Student;
use App\Http\Requests\SearchStudentsRequest;
use Illuminate\Support\Facades\DB;

class StudentSearchController extends Controller
{
    /**
     * Paginated search with full filtering support.
     */
    public function search(SearchStudentsRequest $request)
    {
        $validated = $request->validated();
        $perPage = $validated['per_page'] ?? 15;

        $query = Student::with('user')
            ->whereHas('user', fn ($q) => $q->where('role', 'student'));

        // Global text search
        if (!empty($validated['search'])) {
            $term = $validated['search'];
            $query->search($term);
        }

        // Scalar filters
        if (!empty($validated['program'])) {
            $query->filterByProgram($validated['program']);
        }

        if (!empty($validated['year_level'])) {
            $query->filterByYearLevel($validated['year_level']);
        }

        if (!empty($validated['gender'])) {
            $query->filterByGender($validated['gender']);
        }

        // GPA range
        $gpaMin = $validated['gpa_min'] ?? null;
        $gpaMax = $validated['gpa_max'] ?? null;
        if ($gpaMin !== null || $gpaMax !== null) {
            $query->filterByGpaRange($gpaMin, $gpaMax);
        }

        // JSON array filters
        if (!empty($validated['sports'])) {
            $query->filterBySports($validated['sports']);
        }

        if (!empty($validated['organizations'])) {
            $query->filterByOrganizations($validated['organizations']);
        }

        $paginated = $query->orderBy('id', 'desc')->paginate($perPage);

        // Transform results to match existing frontend format
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

        return response()->json([
            'students' => $students,
            'meta' => [
                'current_page' => $paginated->currentPage(),
                'last_page'    => $paginated->lastPage(),
                'per_page'     => $paginated->perPage(),
                'total'        => $paginated->total(),
            ],
        ]);
    }

    /**
     * List distinct sports from students' sports_activities JSON.
     */
    public function sports()
    {
        $sports = DB::table('students')
            ->whereNotNull('sports_activities')
            ->pluck('sports_activities')
            ->flatMap(function ($json) {
                $data = is_string($json) ? json_decode($json, true) : $json;
                return $data['sportsPlayed'] ?? [];
            })
            ->unique()
            ->sort()
            ->values();

        return response()->json(['sports' => $sports]);
    }

    /**
     * List distinct organizations (clubs) from students' organizations JSON.
     */
    public function organizations()
    {
        $orgs = DB::table('students')
            ->whereNotNull('organizations')
            ->pluck('organizations')
            ->flatMap(function ($json) {
                $data = is_string($json) ? json_decode($json, true) : $json;
                return $data['clubs'] ?? [];
            })
            ->unique()
            ->sort()
            ->values();

        return response()->json(['organizations' => $orgs]);
    }
}
