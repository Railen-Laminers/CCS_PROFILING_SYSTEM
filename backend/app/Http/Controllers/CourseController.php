<?php

namespace App\Http\Controllers;

use App\Models\Course;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class CourseController extends Controller
{
    // List all courses
    public function index()
    {
        $courses = Course::select('course_id', 'credits', 'course_code', 'course_title')
            ->get();

        return response()->json(['courses' => $courses], 200);
    }

    // Show a single course based on course_id or course_code
    public function show($id)
    {
        $course = Course::select('course_id', 'credits', 'course_code', 'course_title')
            ->where('course_id', $id)
            ->orWhere('course_code', $id)
            ->firstOrFail();

        return response()->json(['course' => $course], 200);
    }

    // Create a new course
    public function store(Request $request)
    {

        // Debug: See what's actually coming in
        \Log::info('Request data:', $request->all());
        $request->validate([
            'credits' => 'required|integer|min:1|max:6',
            'course_code' => 'required|string|max:20|unique:courses,course_code',
            'course_title' => 'required|string|max:100|unique:courses,course_title',
        ]);

        $course = Course::create([
            'credits' => $request->credits,
            'course_code' => $request->course_code,
            'course_title' => $request->course_title,
        ]);

        return response()->json([
            'message' => 'Course created successfully',
            'course' => $course->only(['course_id', 'credits', 'course_code', 'course_title']),
        ], 201);
    }

    // Update an existing course
    public function update(Request $request, $id)
    {
        $course = Course::findOrFail($id);

        $rules = [
            'credits' => 'sometimes|integer|min:1|max:6',
            'course_code' => [
                'sometimes',
                'string',
                'max:20',
                Rule::unique('courses', 'course_code')->ignore($course->course_id, 'course_id'),
            ],
            'course_title' => [
                'sometimes',
                'string',
                'max:100',
                Rule::unique('courses', 'course_title')->ignore($course->course_id, 'course_id'),
            ],
        ];

        $request->validate($rules);

        $data = $request->only(['credits', 'course_code', 'course_title']);
        $course->update($data);

        return response()->json([
            'message' => 'Course updated successfully',
            'course' => $course->only(['course_id', 'credits', 'course_code', 'course_title']),
        ], 200);
    }

    // Delete a course
    public function destroy($id)
    {
        $course = Course::findOrFail($id);
        $course->delete();

        return response()->json(['message' => 'Course deleted successfully'], 200);
    }
}