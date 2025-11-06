<?php

use App\Http\Controllers\DashboardController;
use App\Http\Controllers\Role\RoleController;
use App\Http\Controllers\User\ProfileController;
use App\Http\Controllers\User\TwoFactorController;
use Illuminate\Support\Facades\Route;

// Home
Route::get('/', function () {
    return redirect()->intended('/dashboard');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    // Dashboard
    Route::get('dashboard', [DashboardController::class, 'index'])
        ->name('dashboard');

    // User
    Route::group(['prefix' => 'user', 'as' => 'user.'], function () {
        // Profile
        Route::get('profile', [ProfileController::class, 'show'])
            ->name('profile');

        Route::put('profile', [ProfileController::class, 'update'])
            ->name('profile.update');

        // Two-Factor Authentication
        Route::get('two-factor', [TwoFactorController::class, 'show'])
            ->name('two-factor');

        Route::post('two-factor/enable', [TwoFactorController::class, 'enable'])
            ->name('two-factor.enable');

        Route::delete('two-factor/disable', [TwoFactorController::class, 'disable'])
            ->name('two-factor.disable');

        Route::post('two-factor/confirm', [TwoFactorController::class, 'confirm'])
            ->name('two-factor.confirm');

        Route::get('two-factor/qr-code', [TwoFactorController::class, 'qrCode'])
            ->name('two-factor.qrcode');

        Route::get('two-factor/secret', [TwoFactorController::class, 'secretKey'])
            ->name('two-factor.secret');

        Route::get('two-factor/show-codes', [TwoFactorController::class, 'showRecoveryCodes'])
            ->name('two-factor.recovery.show');

        Route::post('two-factor/generate-codes', [TwoFactorController::class, 'generateRecoveryCodes'])
            ->name('two-factor.recovery.generate');
    });

    // Roles
    Route::resource('roles', RoleController::class);
});

require __DIR__ . '/auth.php';



