<?php

namespace App\Actions\User;

use Illuminate\Http\Request;
use Google2FA;
use PragmaRX\Google2FA\Exceptions\IncompatibleWithGoogleAuthenticatorException;
use PragmaRX\Google2FA\Exceptions\InvalidCharactersException;
use PragmaRX\Google2FA\Exceptions\SecretKeyTooShortException;

class ConfirmTwoFactorAuthAction
{
    /**
     * @throws IncompatibleWithGoogleAuthenticatorException
     * @throws InvalidCharactersException
     * @throws SecretKeyTooShortException
     */
    public function handle(Request $request)
    {
        $request->validate(['code' => 'required|digits:6']);

        $user = $request->user();
        $code = $request->input('code');

        $isVerified = Google2FA::verifyKey($user->two_factor_secret, $code);

        if (empty($user->two_factor_secret) || empty($code) || !$isVerified) {
            return false;
        }

        $request->session()->put('two_factor_verified', true);

        return $user->forceFill([
            'two_factor_confirmed_at' => now()
        ])->save();
    }
}
