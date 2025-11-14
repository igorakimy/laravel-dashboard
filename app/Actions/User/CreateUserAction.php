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

        if ($user && $data->roles && is_array($data->roles)) {
            $user->assignRole(...$data->roles);
        }

        return $user;
    }
}
