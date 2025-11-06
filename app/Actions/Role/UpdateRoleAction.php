<?php

namespace App\Actions\Role;

use App\Data\Role\UpdateRoleData;
use App\Enums\RolesEnum;
use App\Http\Requests\Role\UpdateRoleRequest;
use App\Models\Role;

final class UpdateRoleAction
{
    /**
     * @param Role $role
     * @param UpdateRoleRequest $request
     * @return Role
     */
    public function handle(Role $role, UpdateRoleRequest $request): Role
    {
        $data = UpdateRoleData::from($request);

        $role->update($data->except('permissions')->toArray());

        if ($role->name !== RolesEnum::ADMIN->value) {
            $role->syncPermissions($data->permissions);
        }

        return $role->fresh();
    }
}
