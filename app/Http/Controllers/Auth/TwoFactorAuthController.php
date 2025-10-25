<?php

namespace App\Http\Controllers\Auth;

use App\Actions\Auth\TwoFactorPrepareChallengeAction;
use App\Actions\Auth\TwoFactorVerifyCodeAction;
use App\Actions\Auth\TwoFactorVerifyRecoveryCodeAction;
use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\TwoFactorChallengeRequest;
use Illuminate\Auth\AuthenticationException;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;
use Psr\Container\ContainerExceptionInterface;
use Psr\Container\NotFoundExceptionInterface;
use Throwable;

class TwoFactorAuthController extends Controller
{
    /**
     * Отобразить форму для ввода кода подтверждение или кода восстановления.
     *
     * @throws ContainerExceptionInterface
     * @throws NotFoundExceptionInterface
     * @throws Throwable
     */
    public function show(TwoFactorPrepareChallengeAction $twoFactorPrepareChallenge): Response
    {
        $twoFactorPrepareChallenge->handle();

        return Inertia::render('auth/two-factor-challenge');
    }

    /**
     * Аутентифицировать пользователя по коду подтверждения
     * из приложения для аутентификации.
     *
     * @param TwoFactorChallengeRequest $request
     * @param TwoFactorVerifyCodeAction $twoFactorVerifyCode
     * @return RedirectResponse
     * @throws AuthenticationException
     */
    public function verify(
        TwoFactorChallengeRequest $request,
        TwoFactorVerifyCodeAction $twoFactorVerifyCode
    ): RedirectResponse
    {
        $twoFactorVerifyCode->handle($request);

        return redirect()->intended(route('home'));
    }

    /**
     * Аутентифицировать пользователя по коду восстановления.
     *
     * @param TwoFactorChallengeRequest $request
     * @param TwoFactorVerifyRecoveryCodeAction $twoFactorVerifyRecoveryCode
     * @return RedirectResponse
     * @throws AuthenticationException
     */
    public function recovery(
        TwoFactorChallengeRequest $request,
        TwoFactorVerifyRecoveryCodeAction $twoFactorVerifyRecoveryCode
    ): RedirectResponse
    {
        $twoFactorVerifyRecoveryCode->handle($request);

        return redirect()->intended(route('home'));
    }
}
