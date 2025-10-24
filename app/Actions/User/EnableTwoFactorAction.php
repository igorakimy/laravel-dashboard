<?php

namespace App\Actions\User;

use Illuminate\Http\Request;
use Google2FA;
use Illuminate\Support\Collection;
use PragmaRX\Google2FA\Exceptions\IncompatibleWithGoogleAuthenticatorException;
use PragmaRX\Google2FA\Exceptions\InvalidCharactersException;
use PragmaRX\Google2FA\Exceptions\SecretKeyTooShortException;

class EnableTwoFactorAction
{
    /**
     * @throws IncompatibleWithGoogleAuthenticatorException
     * @throws SecretKeyTooShortException
     * @throws InvalidCharactersException
     */
    public function handle(Request $request): void
    {
        $user = $request->user();

        if (is_null($user->two_factor_secret)) {
            $user->forceFill([
                'two_factor_secret' => Google2FA::generateSecretKey(),
                'two_factor_recovery_codes' => json_encode(Collection::times(8, function () use ($user) {
                    return $user->generateRecoveryCode();
                })->all())
            ])->save();
        }
    }
}
