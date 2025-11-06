<?php

namespace Database\Seeders;

use App\Enums\PermissionGroupsEnum;
use App\Enums\PermissionsEnum;
use App\Enums\RolesEnum;
use App\Models\Permission;
use App\Models\Role;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class RolePermissionSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $permissionGroups = PermissionGroupsEnum::cases();

        foreach ($permissionGroups as $group) {
            foreach ($group->permissions() as $permission) {
                Permission::firstOrCreate([
                    'name' => $permission->value,
                    'display_name' => $permission->displayName(),
                    'group' => $group->value,
                ]);
            }
        }

        $rolesList = RolesEnum::cases();

        foreach ($rolesList as $roleItem) {
            /** @var Role $role */
            $role = Role::firstOrCreate([
                'name' => $roleItem->value,
                'display_name' => $roleItem->displayName(),
            ]);

            if ($roleItem === RolesEnum::USER) {
                $role->syncPermissions(
                    PermissionsEnum::DASHBOARD_VIEW
                );
            }
        }
    }
}
