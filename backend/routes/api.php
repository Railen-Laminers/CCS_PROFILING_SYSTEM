<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\CourseController;
use App\Http\Controllers\EventController;
use App\Http\Controllers\StudentSearchController;

Route::post('/auth/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/auth/me', [AuthController::class, 'me']);
    Route::post('/auth/logout', [AuthController::class, 'logout']);

    Route::middleware('role:admin')->group(function () {
        // User management
        Route::get('/users', [UserController::class, 'index']);
        Route::get('/users/{id}', [UserController::class, 'show']);
        Route::post('/users', [UserController::class, 'store']);
        Route::put('/users/{id}', [UserController::class, 'update']);
        Route::delete('/users/{id}', [UserController::class, 'destroy']);

        // Student search & filter (must be before /students to avoid route conflicts)
        Route::get('/students/search', [StudentSearchController::class, 'search']);
        Route::get('/students/sports', [StudentSearchController::class, 'sports']);
        Route::get('/students/organizations', [StudentSearchController::class, 'organizations']);

        // Specific lists for frontend
        Route::get('/students', [UserController::class, 'getStudents']);
        Route::get('/faculty', [UserController::class, 'getFaculty']);

        // Course management
        Route::apiResource('courses', CourseController::class)->except(['edit', 'create']);

        // Event management
        Route::apiResource('events', EventController::class)->except(['edit', 'create']);

        // Academic Records for a user/student
        Route::get('/users/{id}/academic-records', [\App\Http\Controllers\AcademicRecordController::class, 'index']);
        Route::post('/users/{id}/academic-records', [\App\Http\Controllers\AcademicRecordController::class, 'store']);
        Route::apiResource('academic-records', \App\Http\Controllers\AcademicRecordController::class)->except(['index', 'store', 'edit', 'create']);
    });
});