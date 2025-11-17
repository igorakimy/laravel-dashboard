<?php

namespace App\Http\Controllers\Auth;

use App\Enums\RolesEnum;
use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Laravel\Socialite\Facades\Socialite;
use Exception;

class GithubAuthController extends Controller
{
    /**
     * Перенаправить пользователя на страницу авторизации в Github.
     *
     * @return RedirectResponse
     */
    public function redirect(): RedirectResponse
    {
        try {
            return Socialite::driver('github')->redirect();
        } catch (Exception $e) {
            return redirect()
                ->route('login')
                ->with('error', $e->getMessage());
        }
    }

    /**
     * Авторизовав пользователя в Github, попытка авторизовать его в системе.
     *
     * @return RedirectResponse
     */
    public function callback(): RedirectResponse
    {
        try {
            $socialUser = Socialite::driver('github')->user();
            $user = User::where('github_id', $socialUser->getId())->first();

            if (! $user) {
                $user = User::updateOrCreate(['email' => $socialUser->getEmail()], [
                    'name' => $socialUser->getName(),
                    'github_id' => $socialUser->getId(),
                    'password' => Hash::make(Str::random(8)),
                    'email_verified_at' => now(),
                ]);

                if ($user->roles->count() === 0) {
                    $user->assignRole(RolesEnum::USER);
                }
            }

            auth()->login($user);

            return redirect()->intended();
        } catch (Exception $e) {
            return redirect()
                ->route('login')
                ->with('error', $e->getMessage());
        }
    }
}
