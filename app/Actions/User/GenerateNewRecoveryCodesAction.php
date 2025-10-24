<?php

namespace App\Actions\User;

use Illuminate\Http\Request;
use Illuminate\Support\Collection;

class GenerateNewRecoveryCodesAction
{
    public function handle(Request $request): void
    {
        $user = $request->user();

        $newRecoveryCodes = Collection::times(8, function () use ($user) {
            return $user->generateRecoveryCode();
        })->all();

        $user->forceFill([
            'two_factor_recovery_codes' => json_encode($newRecoveryCodes)
        ])->save();
    }
}
