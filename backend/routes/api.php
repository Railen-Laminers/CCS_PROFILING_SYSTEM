<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\CourseController;
use App\Http\Controllers\EventController;

// Public routes
Route::post('/auth/login', [AuthController::class, 'login']);

// Protected routes - requires authentication
Route::middleware('auth:sanctum')->group(function () {
    // Auth routes
    Route::get('/auth/me', [AuthController::class, 'me']);
    Route::post('/auth/logout', [AuthController::class, 'logout']);

    // User management routes - admin only
    Route::middleware('role:admin')->group(function () {
        Route::post('/users', [UserController::class, 'store']);
        Route::get('/users', [UserController::class, 'index']);
        Route::get('/users/{id}', [UserController::class, 'show']);
        Route::put('/users/{id}', [UserController::class, 'update']);
        Route::delete('/users/{id}', [UserController::class, 'destroy']);

        // Role-specific lists
        Route::get('/students', [UserController::class, 'getStudents']);
        Route::get('/faculty', [UserController::class, 'getFaculty']);

        // Course CRUD
        Route::post('/courses', [CourseController::class, 'store']);
        Route::get('/courses', [CourseController::class, 'index']);
        Route::get('/courses/{id}', [CourseController::class, 'show']);
        Route::put('/courses/{id}', [CourseController::class, 'update']);
        Route::delete('/courses/{id}', [CourseController::class, 'destroy']);

        //routes for getting the events
        Route::post('/events', [EventController::class, 'store']);
        Route::get('/events', [EventController::class, 'index']);
        Route::get('/events/{search}', [EventController::class, 'show']);
        Route::put('/events/{id}', [EventController::class, 'update']);
        Route::delete('/events/{id}', [EventController::class, 'destroy']);
    });
});