<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\MotorcycleController;
use App\Http\Controllers\Api\BookingController;
use App\Http\Controllers\Api\DashboardController;

// Public Routes
Route::post('/login', [AuthController::class, 'login']);
Route::get('/motorcycles', [MotorcycleController::class, 'index']);
Route::get('/motorcycles/{id}', [MotorcycleController::class, 'show']);
Route::post('/bookings', [BookingController::class, 'store']);

// Protected Routes
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', function (Request $request) {
        return $request->user();
    });

    // Admin Routes
    Route::post('/motorcycles', [MotorcycleController::class, 'store']);
    Route::put('/motorcycles/{id}', [MotorcycleController::class, 'update']);
    Route::delete('/motorcycles/{id}', [MotorcycleController::class, 'destroy']);
    
    Route::get('/bookings', [BookingController::class, 'index']);
    Route::get('/bookings/{id}', [BookingController::class, 'show']);
    Route::put('/bookings/{id}', [BookingController::class, 'update']);
    Route::delete('/bookings/{id}', [BookingController::class, 'destroy']);

    Route::get('/dashboard', [DashboardController::class, 'index']);
});
