<?php

namespace App\Http\Controllers\Auth;

use App\Actions\Auth\LoginAction;
use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Inertia\Response;

final class LoginController extends Controller
{
    /**
     * Показать форму для входа в аккаунт.
     *
     * @param Request $request
     * @return Response
     */
    public function show(Request $request): Response
    {
        return Inertia::render('auth/login', [
            'status' => $request->session()->get('status'),
            'canResetPassword' => Route::has('password.forgot'),
        ]);
    }

    /**
     * Обработать входящий запрос на авторизацию.
     *
     * @param LoginRequest $request
     * @param LoginAction $loginAction
     * @return RedirectResponse
     */
    public function login(LoginRequest $request, LoginAction $loginAction): RedirectResponse
    {
        $loginAction->handle($request);

        $request->session()->regenerate();

        return redirect()->intended(route(
            'dashboard',
            absolute: false
        ));
    }
}
