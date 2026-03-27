<?php

namespace App\Services;

use App\Models\Course;

class CourseService
{
    /**
     * Get all courses.
     */
    public function getAll(): \Illuminate\Database\Eloquent\Collection
    {
        return Course::select('course_id', 'credits', 'course_code', 'course_title')->get();
    }

    /**
     * Find a course by ID or course_code.
     */
    public function findByIdentifier(string $identifier): Course
    {
        return Course::select('course_id', 'credits', 'course_code', 'course_title')
            ->where('course_id', $identifier)
            ->orWhere('course_code', $identifier)
            ->firstOrFail();
    }

    /**
     * Create a new course.
     */
    public function create(array $data): Course
    {
        return Course::create([
            'credits'      => $data['credits'],
            'course_code'  => $data['course_code'],
            'course_title' => $data['course_title'],
        ]);
    }

    /**
     * Update an existing course.
     */
    public function update(int $id, array $data): Course
    {
        $course = Course::findOrFail($id);
        $course->update($data);
        return $course;
    }

    /**
     * Delete a course.
     */
    public function delete(int $id): void
    {
        $course = Course::findOrFail($id);
        $course->delete();
    }
}
