<?php

namespace App\Actions\Auth;

use App\Http\Requests\Auth\PasswordResetLinkRequest;
use Illuminate\Support\Facades\Password;

class SendPasswordResetLinkAction
{
    /**
     * Отправить ссылку для сброса пароля.
     *
     * @param PasswordResetLinkRequest $request
     * @return void
     */
    public function handle(PasswordResetLinkRequest $request): void
    {
        Password::sendResetLink($request->only('email'));
    }
}
