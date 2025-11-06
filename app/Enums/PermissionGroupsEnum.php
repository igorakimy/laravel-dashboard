<?php

namespace App\Enums;

enum PermissionGroupsEnum: string
{
    case DASHBOARD = 'dashboard';
    case ACCESS = 'access';
    case SETTINGS = 'settings';
    case UTILITIES = 'utilities';

    /**
     * @return array<PermissionsEnum>
     */
    public function permissions(): array
    {
        return match ($this) {
            self::DASHBOARD => [
                PermissionsEnum::DASHBOARD_VIEW,
            ],
            self::ACCESS => [
                PermissionsEnum::ACCESS_VIEW,
                PermissionsEnum::ROLES_VIEW,
                PermissionsEnum::ROLES_CREATE,
                PermissionsEnum::ROLES_EDIT,
                PermissionsEnum::ROLES_DELETE,
            ],
            self::SETTINGS => [
                PermissionsEnum::SETTINGS_VIEW,
            ],
            self::UTILITIES => [
                PermissionsEnum::UTILITIES_VIEW,
            ],
        };
    }
}
