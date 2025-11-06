<?php

namespace App\Http\Controllers;

use App\Enums\PermissionsEnum;
use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Routing\Controllers\Middleware;
use Inertia\Inertia;
use Inertia\Response;

final class DashboardController extends Controller implements HasMiddleware
{
    public static function middleware(): array
    {
        return [
            new Middleware('permission:' . PermissionsEnum::DASHBOARD_VIEW->value),
        ];
    }

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
