<?php

namespace App\Actions\Auth;

use App\Data\Auth\LoginData;
use App\Http\Requests\Auth\LoginRequest;
use Illuminate\Auth\Events\Lockout;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

final class LoginAction
{
    public const int MAX_LOGIN_ATTEMPTS = 5;

    public string $throttleKey = 'throttle-key';

    public function handle(LoginRequest $request): void
    {
        $this->throttleKey = $this->createThrottleKey($request);

        $this->ensureIsNotRateLimited($request);

        $this->authenticate(LoginData::from($request));
    }

    private function authenticate(LoginData $data): void
    {
        $credentials = $data->only('email', 'password')->all();

        if (! Auth::attempt($credentials, $data->remember)) {
            RateLimiter::hit($this->throttleKey);

            throw ValidationException::withMessages([
                'email' => __('auth.failed'),
            ]);
        }

        RateLimiter::clear($this->throttleKey);
    }

    private function ensureIsNotRateLimited(Request $request): void
    {
        if (! RateLimiter::tooManyAttempts($this->throttleKey, self::MAX_LOGIN_ATTEMPTS)) {
            return;
        }

        event(new Lockout($request));

        $seconds = RateLimiter::availableIn($this->throttleKey);

        throw ValidationException::withMessages([
            'email' => __('auth.throttle', [
                'seconds' => $seconds,
                'minutes' => ceil($seconds / 60),
            ]),
        ]);
    }

    private function createThrottleKey(Request $request): string
    {
        return Str::transliterate(
            Str::lower($request->input('email') . '|' . $request->ip()),
        );
    }
}
