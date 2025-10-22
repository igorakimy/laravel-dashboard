<?php

namespace App\Actions\Auth;

use Illuminate\Auth\Events\Verified;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Foundation\Auth\EmailVerificationRequest;

class VerifyEmailAction
{
    /**
     * Пометить email адрес аутентифицированного пользователя как проверенный.
     *
     * @param EmailVerificationRequest $request
     * @return void
     */
    public function handle(EmailVerificationRequest $request): void
    {
        if ($request->user()->markEmailAsVerified()) {
            /** @var MustVerifyEmail $user */
            $user = $request->user();

            event(new Verified($user));
        }
    }
}
