<?php

use App\Http\Controllers\Auth\LogoutController;
use App\Http\Controllers\DashboardController;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return redirect()->intended('/dashboard');
})->name('home');

Route::middleware(['auth'])->group(function () {
    Route::get('dashboard', [DashboardController::class, 'index'])
        ->name('dashboard');

    Route::get('logout', LogoutController::class)
        ->name('logout');
});

require __DIR__ . '/auth.php';



