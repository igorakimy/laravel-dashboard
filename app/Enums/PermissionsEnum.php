<?php

namespace App\Enums;

use App\Traits\EnumToArray;

enum PermissionsEnum: string
{
    use EnumToArray;

    // Dashboard
    case DASHBOARD_VIEW = 'dashboard-view';

    // Access
    case ACCESS_VIEW = 'access-view';
    case USERS_VIEW = 'users-view';
    case ROLES_VIEW = 'roles-view';
    case ROLES_CREATE = 'roles-create';
    case ROLES_EDIT = 'roles-edit';
    case ROLES_DELETE = 'roles-delete';

    // Settings
    case SETTINGS_VIEW = 'settings-view';

    // Utilities
    case UTILITIES_VIEW = 'utilities-view';

    public function displayName(): string
    {
        return match ($this) {
            // Dashboard
            self::DASHBOARD_VIEW => 'Dashboard View',
            // Access
            self::ACCESS_VIEW => 'Access View',
            // Users
            self::USERS_VIEW => 'Users View',
            // Roles
            self::ROLES_VIEW => 'Roles View',
            self::ROLES_CREATE => 'Roles Create',
            self::ROLES_EDIT => 'Roles Edit',
            self::ROLES_DELETE => 'Roles Delete',
            // Settings
            self::SETTINGS_VIEW => 'Settings View',
            // Utilities
            self::UTILITIES_VIEW => 'Utilities View',
        };
    }
}
