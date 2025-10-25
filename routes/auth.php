<?php

use App\Http\Controllers\Auth\LoginController;
use App\Http\Controllers\Auth\LogoutController;
use App\Http\Controllers\Auth\NewPasswordController;
use App\Http\Controllers\Auth\PasswordResetLinkController;
use App\Http\Controllers\Auth\RegisterController;
use App\Http\Controllers\Auth\TwoFactorAuthController;
use App\Http\Controllers\Auth\VerifyEmailController;
use Illuminate\Support\Facades\Route;

Route::middleware(['guest'])->group(function () {
    // Login
    Route::get('login', [LoginController::class, 'show'])
        ->name('login.show');

    Route::post('login', [LoginController::class, 'login'])
        ->name('login');

    // Register
    Route::get('register', [RegisterController::class, 'show'])
        ->name('register.show');

    Route::post('register', [RegisterController::class, 'register'])
        ->name('register');

    // Reset Password
    Route::get('forgot-password', [PasswordResetLinkController::class, 'show'])
        ->name('password.forgot');

    Route::post('forgot-password', [PasswordResetLinkController::class, 'send'])
        ->name('password.email');

    Route::get('reset-password/{token}', [NewPasswordController::class, 'show'])
        ->name('password.reset');

    Route::post('reset-password', [NewPasswordController::class, 'store'])
        ->name('password.store');

    // Two-Factor Authentication
    Route::get('two-factor', [TwoFactorAuthController::class, 'show'])
        ->name('two-factor.login');

    Route::post('two-factor/verify', [TwoFactorAuthController::class, 'verify'])
        ->name('two-factor.verify');

    Route::post('two-factor/recovery', [TwoFactorAuthController::class, 'recovery'])
        ->name('two-factor.recovery');
});

Route::middleware(['auth'])->group(function () {
    // Email Verification
    Route::get('email/verify', [VerifyEmailController::class, 'show'])
        ->name('verification.notice');

    Route::get('email/verify/{id}/{hash}', [VerifyEmailController::class, 'verify'])
        ->middleware('throttle:6,1')
        ->name('verification.verify');

    Route::post('email/verification-notification', [VerifyEmailController::class, 'send'])
        ->middleware('throttle:6,1')
        ->name('verification.send');

    // Logout
    Route::get('logout', LogoutController::class)
        ->name('logout');
});
