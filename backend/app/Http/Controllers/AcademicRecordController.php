<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreAcademicRecordRequest;
use App\Http\Requests\UpdateAcademicRecordRequest;
use App\Services\AcademicRecordService;

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
    public function store(StoreAcademicRecordRequest $request, $userId)
    {
        $result = $this->academicRecordService->create($userId, $request->validated());

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
    public function update(UpdateAcademicRecordRequest $request, string $id)
    {
        $record = $this->academicRecordService->update($id, $request->validated());

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
