<?php

namespace App\Actions\Auth;

use App\Http\Requests\Auth\TwoFactorChallengeRequest;
use Illuminate\Auth\AuthenticationException;

class TwoFactorVerifyCodeAction
{
    /**
     * @param TwoFactorChallengeRequest $request
     * @return void
     * @throws AuthenticationException
     */
    public function handle(TwoFactorChallengeRequest $request): void
    {
        $user = $request->challengedUser();

        auth()->login($user, $request->remember());

        $request->session()->regenerate();
    }
}
