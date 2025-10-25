<?php

namespace App\Actions\Auth;

use App\Http\Requests\Auth\TwoFactorChallengeRequest;
use Illuminate\Auth\AuthenticationException;

class TwoFactorVerifyRecoveryCodeAction
{
    /**
     * @param TwoFactorChallengeRequest $request
     * @return void
     * @throws AuthenticationException
     */
    public function handle(TwoFactorChallengeRequest $request): void
    {
        $user = $request->challengedUser();

        $user->replaceRecoveryCode($request->input('recovery_code'));

        auth()->login($user, $request->remember());

        $request->session()->regenerate();
    }
}
