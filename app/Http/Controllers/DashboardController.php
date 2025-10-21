<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Inertia\Response;

final class DashboardController extends Controller
{
    /**
     * Отобразить главную страницу панели управления.
     *
     * @return Response
     */
    public function index(): Response
    {
        return Inertia::render('dashboard');
    }
}
