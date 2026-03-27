<?php

namespace App\Http\Controllers;

use App\Services\CourseService;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class CourseController extends Controller
{
    public function __construct(
        private readonly CourseService $courseService
    ) {}

    // List all courses
    public function index()
    {
        return response()->json(['courses' => $this->courseService->getAll()], 200);
    }

    // Show a single course based on course_id or course_code
    public function show($id)
    {
        return response()->json(['course' => $this->courseService->findByIdentifier($id)], 200);
    }

    // Create a new course
    public function store(Request $request)
    {
        $request->validate([
            'credits'      => 'required|integer|min:1|max:6',
            'course_code'  => 'required|string|max:20|unique:courses,course_code',
            'course_title' => 'required|string|max:100|unique:courses,course_title',
        ]);

        $course = $this->courseService->create($request->only(['credits', 'course_code', 'course_title']));

        return response()->json([
            'message' => 'Course created successfully',
            'course'  => $course->only(['course_id', 'credits', 'course_code', 'course_title']),
        ], 201);
    }

    // Update an existing course
    public function update(Request $request, $id)
    {
        $course = \App\Models\Course::findOrFail($id);

        $request->validate([
            'credits' => 'sometimes|integer|min:1|max:6',
            'course_code' => [
                'sometimes', 'string', 'max:20',
                Rule::unique('courses', 'course_code')->ignore($course->course_id, 'course_id'),
            ],
            'course_title' => [
                'sometimes', 'string', 'max:100',
                Rule::unique('courses', 'course_title')->ignore($course->course_id, 'course_id'),
            ],
        ]);

        $updated = $this->courseService->update($id, $request->only(['credits', 'course_code', 'course_title']));

        return response()->json([
            'message' => 'Course updated successfully',
            'course'  => $updated->only(['course_id', 'credits', 'course_code', 'course_title']),
        ], 200);
    }

    // Delete a course
    public function destroy($id)
    {
        $this->courseService->delete($id);

        return response()->json(['message' => 'Course deleted successfully'], 200);
    }
}