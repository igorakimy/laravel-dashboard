<?php

namespace App\Actions\Auth;

use Throwable;
use App\Models\User;
use Illuminate\Auth\AuthenticationException;
use Illuminate\Support\Facades\Session;

class TwoFactorPrepareChallengeAction
{
    /**
     * @throws Throwable
     */
    public function handle(): void
    {
        /** @var User $authProvider */
        $authProvider = auth()->getProvider();
        $modelClass = $authProvider->getModel();

        $challengedUser = Session::has('two_factor.login.id')
            && $modelClass::find(Session::get('two_factor.login.id', 0));

        throw_unless($challengedUser, AuthenticationException::class);
    }
}
