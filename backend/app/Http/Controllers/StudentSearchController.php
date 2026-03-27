<?php

namespace App\Http\Controllers;

use App\Services\StudentSearchService;
use Illuminate\Http\Request;

class StudentSearchController extends Controller
{
    public function __construct(
        private readonly StudentSearchService $searchService
    ) {}

    /**
     * Paginated search with full filtering support.
     */
    public function search(Request $request)
    {
        $validated = $request->validate([
            'search'          => 'nullable|string|max:255',
            'program'         => 'nullable|string|in:BSIT,BSCS',
            'year_level'      => 'nullable|integer|min:1|max:4',
            'gender'          => 'nullable|string|in:male,female,other',
            'gpa_min'         => 'nullable|numeric|min:0|max:4',
            'gpa_max'         => 'nullable|numeric|min:0|max:4',
            'sports'          => 'nullable|array',
            'sports.*'        => 'string|max:100',
            'organizations'   => 'nullable|array',
            'organizations.*' => 'string|max:100',
            'per_page'        => 'nullable|integer|min:5|max:100',
        ]);

        return response()->json($this->searchService->search($validated));
    }

    /**
     * List distinct sports from students' sports_activities JSON.
     */
    public function sports()
    {
        return response()->json(['sports' => $this->searchService->getDistinctSports()]);
    }

    /**
     * List distinct organizations (clubs) from students' organizations JSON.
     */
    public function organizations()
    {
        return response()->json(['organizations' => $this->searchService->getDistinctOrganizations()]);
    }
}
