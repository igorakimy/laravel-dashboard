<?php

namespace App\Http\Controllers\Auth;

use App\Actions\Auth\VerifyEmailAction;
use App\Http\Controllers\Controller;
use Illuminate\Foundation\Auth\EmailVerificationRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

final class VerifyEmailController extends Controller
{
    /**
     * Отобразить кнопку для верификации email адреса.
     *
     * @param Request $request
     * @return Response
     */
    public function show(Request $request): Response
    {
        return Inertia::render('auth/verify-email', [
            'status' => $request->session()->get('status')
        ]);
    }

    /**
     * Обработать запрос на верификацию email адреса пользователя.
     *
     * @param EmailVerificationRequest $request
     * @param VerifyEmailAction $verifyEmail
     * @return RedirectResponse
     */
    public function verify(EmailVerificationRequest $request, VerifyEmailAction $verifyEmail): RedirectResponse
    {
        if ($request->user()->hasVerifiedEmail()) {
            return $this->redirectToDashboardWithVerification();
        }

        $verifyEmail->handle($request);

        return $this->redirectToDashboardWithVerification();
    }

    /**
     * Отправить ссылку для верификации email.
     *
     * @param Request $request
     * @return RedirectResponse
     */
    public function send(Request $request): RedirectResponse
    {
        $request->user()->sendEmailVerificationNotification();

        return back()->with('status', __('verification-link-sent'));
    }

    /**
     * Перенаправить пользователя на страницу панели управления
     * с подтверждённой верификацией.
     *
     * @return RedirectResponse
     */
    private function redirectToDashboardWithVerification(): RedirectResponse
    {
        return redirect()->intended(route(
            'dashboard',
            ['verified' => 1],
            false
        ));
    }
}
