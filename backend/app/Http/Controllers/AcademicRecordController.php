<?php

namespace App\Http\Controllers;

use App\Models\AcademicRecord;
use App\Models\Student;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class AcademicRecordController extends Controller
{
    /**
     * Fetch all academic records for a given student (by user_id/student_id).
     * Since the frontend uses the User ID (/users/{id}) for the Student details page,
     * we will get the student based on the user_id.
     */
    public function index($userId)
    {
        $student = Student::where('user_id', $userId)->first();

        if (!$student) {
            return response()->json(['message' => 'Student profile not found.'], 404);
        }

        $records = $student->academicRecords()->latest()->get();

        return response()->json(['academic_records' => $records], 200);
    }

    /**
     * Store a newly created academic record.
     */
    public function store(Request $request, $userId)
    {
        $student = Student::where('user_id', $userId)->first();

        if (!$student) {
            return response()->json(['message' => 'Student profile not found.'], 404);
        }

        $validator = Validator::make($request->all(), [
            'course_name' => 'nullable|string|max:255',
            'year_level' => 'nullable|string|max:50',
            'semester' => 'nullable|string|max:50',
            'gpa' => 'nullable|numeric|min:0|max:5',
            'current_subjects' => 'nullable|array',
            'academic_awards' => 'nullable|array',
            'quiz_bee_participations' => 'nullable|array',
            'programming_contests' => 'nullable|array',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $record = $student->academicRecords()->create($validator->validated());

        return response()->json(['message' => 'Academic record created.', 'academic_record' => $record], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $record = AcademicRecord::find($id);

        if (!$record) {
            return response()->json(['message' => 'Record not found.'], 404);
        }

        return response()->json(['academic_record' => $record], 200);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $record = AcademicRecord::find($id);

        if (!$record) {
            return response()->json(['message' => 'Record not found.'], 404);
        }

        $validator = Validator::make($request->all(), [
            'course_name' => 'nullable|string|max:255',
            'year_level' => 'nullable|string|max:50',
            'semester' => 'nullable|string|max:50',
            'gpa' => 'nullable|numeric|min:0|max:5',
            'current_subjects' => 'nullable|array',
            'academic_awards' => 'nullable|array',
            'quiz_bee_participations' => 'nullable|array',
            'programming_contests' => 'nullable|array',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $record->update($validator->validated());

        return response()->json(['message' => 'Academic record updated.', 'academic_record' => $record], 200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $record = AcademicRecord::find($id);

        if (!$record) {
            return response()->json(['message' => 'Record not found.'], 404);
        }

        $record->delete();

        return response()->json(['message' => 'Academic record deleted.'], 200);
    }
}
