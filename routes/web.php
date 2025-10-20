<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return redirect()->intended('/dashboard');
});

Route::get('/dashboard', function () {
    return Inertia::render('dashboard');
})->name('dashboard');
