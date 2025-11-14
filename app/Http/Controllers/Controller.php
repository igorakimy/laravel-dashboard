<?php

namespace App\Http\Controllers;

use App\Models\User;

abstract class Controller
{
    public function isCurrentUser(User $user): bool
    {
        return $user->id === auth()->id();
    }
}
