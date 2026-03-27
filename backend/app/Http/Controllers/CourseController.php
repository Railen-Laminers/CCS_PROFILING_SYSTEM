<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreCourseRequest;
use App\Http\Requests\UpdateCourseRequest;
use App\Services\CourseService;

class CourseController extends Controller
{
    public function __construct(
        private readonly CourseService $courseService
    ) {}

    /**
     * List all courses.
     */
    public function index()
    {
        return response()->json(['courses' => $this->courseService->getAll()], 200);
    }

    /**
     * Show a single course based on course_id or course_code.
     */
    public function show($id)
    {
        return response()->json(['course' => $this->courseService->findByIdentifier($id)], 200);
    }

    /**
     * Create a new course.
     */
    public function store(StoreCourseRequest $request)
    {
        $course = $this->courseService->create($request->validated());

        return response()->json([
            'message' => 'Course created successfully',
            'course'  => $course->only(['course_id', 'credits', 'course_code', 'course_title']),
        ], 201);
    }

    /**
     * Update an existing course.
     */
    public function update(UpdateCourseRequest $request, $id)
    {
        $updated = $this->courseService->update($id, $request->validated());

        return response()->json([
            'message' => 'Course updated successfully',
            'course'  => $updated->only(['course_id', 'credits', 'course_code', 'course_title']),
        ], 200);
    }

    /**
     * Delete a course.
     */
    public function destroy($id)
    {
        $this->courseService->delete($id);

        return response()->json(['message' => 'Course deleted successfully'], 200);
    }
}