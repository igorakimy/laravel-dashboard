<?php

namespace App\Actions\User;

use Illuminate\Http\Request;

class DisableTwoFactorAction
{
    public function handle(Request $request): void
    {
        $user = $request->user();

        if (! is_null($user->two_factor_secret) ||
            ! is_null($user->two_factor_recovery_codes) ||
            ! is_null($user->two_factor_confirmed_at)) {
            $user->forceFill([
                'two_factor_secret' => null,
                'two_factor_recovery_codes' => null,
                'two_factor_confirmed_at' => null,
            ])->save();
        }
    }
}
