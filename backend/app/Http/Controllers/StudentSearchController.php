<?php

namespace App\Http\Controllers;

use App\Http\Requests\SearchStudentsRequest;
use App\Services\StudentSearchService;

class StudentSearchController extends Controller
{
    public function __construct(
        private readonly StudentSearchService $searchService
    ) {}

    /**
     * Paginated search with full filtering support.
     */
    public function search(SearchStudentsRequest $request)
    {
        return response()->json($this->searchService->search($request->validated()));
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
