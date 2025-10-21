<?php

namespace App\Actions\User;

use App\Data\User\CreateUserData;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

final class CreateUserAction
{
    public function handle(CreateUserData $data): User
    {
        $user = User::create([
            'name' => $data->name,
            'email' => $data->email,
            'password' => Hash::make($data->password),
        ]);

        return $user;
    }
}
