<?php

namespace App\Services;

use App\Models\AcademicRecord;
use App\Models\Student;

class AcademicRecordService
{
    /**
     * Get all academic records for a student by user_id.
     */
    public function getByUserId(int $userId): array
    {
        $student = Student::where('user_id', $userId)->first();

        if (!$student) {
            return ['found' => false];
        }

        return [
            'found'   => true,
            'records' => $student->academicRecords()->latest()->get(),
        ];
    }

    /**
     * Create an academic record for a student by user_id.
     */
    public function create(int $userId, array $data): array
    {
        $student = Student::where('user_id', $userId)->first();

        if (!$student) {
            return ['found' => false];
        }

        return [
            'found'  => true,
            'record' => $student->academicRecords()->create($data),
        ];
    }

    /**
     * Find an academic record by ID.
     */
    public function findById(string $id): ?AcademicRecord
    {
        return AcademicRecord::find($id);
    }

    /**
     * Update an academic record.
     */
    public function update(string $id, array $data): ?AcademicRecord
    {
        $record = AcademicRecord::find($id);

        if (!$record) {
            return null;
        }

        $record->update($data);
        return $record;
    }

    /**
     * Delete an academic record.
     */
    public function delete(string $id): bool
    {
        $record = AcademicRecord::find($id);

        if (!$record) {
            return false;
        }

        $record->delete();
        return true;
    }
}
