<?php

namespace App\Http\Controllers\Auth;

use App\Actions\Auth\ResetPasswordAction;
use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\PasswordResetRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Password;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

final class NewPasswordController extends Controller
{
    /**
     * Отобразить форму сброса пароля для ввода нового пароля.
     *
     * @param Request $request
     * @return Response
     */
    public function show(Request $request): Response
    {
        return Inertia::render('auth/reset-password', [
            'email' => $request->input('email'),
            'token' => $request->route('token')
        ]);
    }

    /**
     * Сбросить пароль пользователя, если он существует.
     *
     * @param PasswordResetRequest $request
     * @param ResetPasswordAction $resetPassword
     * @return RedirectResponse
     */
    public function store(PasswordResetRequest $request, ResetPasswordAction $resetPassword): RedirectResponse
    {
        $status = $resetPassword->handle($request);

        if ($status == Password::PasswordReset) {
            return to_route('login')->with('status', __($status));
        }

        throw ValidationException::withMessages([
            'email' => [__($status)],
        ]);
    }
}
