<?php

namespace App\Actions\User;

use App\Data\User\UpdateUserData;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

final class UpdateUserAction
{
    public function handle(User $user, UpdateUserData $data): User
    {
        $payload = [
            'name' => $data->name,
            'email' => $data->email,
        ];

        if (! empty($data->password)) {
            $payload['password'] = Hash::make($data->password);
        }

        $user->update($payload);

        if ($data->roles && is_array($data->roles)) {
            $user->syncRoles(...$data->roles);
        }

        return $user->fresh();
    }
}
