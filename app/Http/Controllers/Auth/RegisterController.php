<?php

namespace App\Http\Controllers\Auth;

use App\Actions\Auth\RegisterAction;
use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\RegisterRequest;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

final class RegisterController extends Controller
{
    /**
     * Отобразить форму для регистрации аккаунта.
     *
     * @return Response
     */
    public function show(): Response
    {
        return Inertia::render('auth/register');
    }

    /**
     * Обработать запрос на регистрацию нового пользователя.
     *
     * @param RegisterRequest $request
     * @param RegisterAction $register
     * @return RedirectResponse
     */
    public function register(RegisterRequest $request, RegisterAction $register): RedirectResponse
    {
        $register->handle($request);

        return to_route('dashboard');
    }
}
