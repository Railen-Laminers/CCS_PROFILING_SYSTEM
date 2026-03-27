<?php

namespace App\Http\Controllers;

use App\Services\AcademicRecordService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class AcademicRecordController extends Controller
{
    public function __construct(
        private readonly AcademicRecordService $academicRecordService
    ) {}

    /**
     * Fetch all academic records for a given student (by user_id/student_id).
     */
    public function index($userId)
    {
        $result = $this->academicRecordService->getByUserId($userId);

        if (!$result['found']) {
            return response()->json(['message' => 'Student profile not found.'], 404);
        }

        return response()->json(['academic_records' => $result['records']], 200);
    }

    /**
     * Store a newly created academic record.
     */
    public function store(Request $request, $userId)
    {
        $validator = Validator::make($request->all(), [
            'course_name'             => 'nullable|string|max:255',
            'year_level'              => 'nullable|string|max:50',
            'semester'                => 'nullable|string|max:50',
            'gpa'                     => 'nullable|numeric|min:0|max:5',
            'current_subjects'        => 'nullable|array',
            'academic_awards'         => 'nullable|array',
            'quiz_bee_participations' => 'nullable|array',
            'programming_contests'    => 'nullable|array',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $result = $this->academicRecordService->create($userId, $validator->validated());

        if (!$result['found']) {
            return response()->json(['message' => 'Student profile not found.'], 404);
        }

        return response()->json([
            'message'         => 'Academic record created.',
            'academic_record' => $result['record'],
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $record = $this->academicRecordService->findById($id);

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
        $validator = Validator::make($request->all(), [
            'course_name'             => 'nullable|string|max:255',
            'year_level'              => 'nullable|string|max:50',
            'semester'                => 'nullable|string|max:50',
            'gpa'                     => 'nullable|numeric|min:0|max:5',
            'current_subjects'        => 'nullable|array',
            'academic_awards'         => 'nullable|array',
            'quiz_bee_participations' => 'nullable|array',
            'programming_contests'    => 'nullable|array',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $record = $this->academicRecordService->update($id, $validator->validated());

        if (!$record) {
            return response()->json(['message' => 'Record not found.'], 404);
        }

        return response()->json([
            'message'         => 'Academic record updated.',
            'academic_record' => $record,
        ], 200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $deleted = $this->academicRecordService->delete($id);

        if (!$deleted) {
            return response()->json(['message' => 'Record not found.'], 404);
        }

        return response()->json(['message' => 'Academic record deleted.'], 200);
    }
}
