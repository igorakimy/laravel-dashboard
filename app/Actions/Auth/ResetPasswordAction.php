<?php

namespace App\Actions\Auth;

use App\Data\Auth\ResetPasswordData;
use App\Http\Requests\Auth\PasswordResetRequest;
use App\Models\User;
use Illuminate\Auth\Events\PasswordReset;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Str;

class ResetPasswordAction
{
    public function handle(PasswordResetRequest $request): string
    {
        $data = ResetPasswordData::from($request);

        return Password::reset($data->toArray(), function (User $user) use ($data) {
            $user->forceFill([
                'password' => $data->password,
                'remember_token' => Str::random(60),
            ])->save();

            event(new PasswordReset($user));
        });
    }
}
