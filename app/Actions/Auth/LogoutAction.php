<?php

namespace App\Actions\Auth;

use Illuminate\Http\Request;

final class LogoutAction
{
    public function handle(Request $request, $guard = 'web'): void
    {
        auth($guard)->logout();

        $request->session()->invalidate();
        $request->session()->regenerateToken();
    }
}
