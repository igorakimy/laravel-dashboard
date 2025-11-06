<?php

namespace App\Actions\Role;

use App\Enums\RolesEnum;
use App\Models\Role;
use App\Models\User;

final class DeleteRoleAction
{
    public function handle(Role $role): void
    {
        $role->delete();

        $usersWithThisRole = User::whereRelation('roles', 'name', $role->name)->get('id');

        foreach ($usersWithThisRole as $user) {
            $user->assignRole(RolesEnum::USER);
        }
    }
}
