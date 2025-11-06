<?php

namespace App\Actions\Role;

use App\Data\Role\CreateRoleData;
use App\Http\Requests\Role\StoreRoleRequest;
use App\Models\Role;

final class CreateRoleAction
{
    /**
     * @param StoreRoleRequest $request
     * @return Role
     */
    public function handle(StoreRoleRequest $request): Role
    {
        $data = CreateRoleData::from($request);

        $role = Role::create($data->except('permissions')->toArray());

        $role->syncPermissions($data->permissions);

        return $role;
    }
}
