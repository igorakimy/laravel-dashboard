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

    // Users
    case USERS_VIEW = 'users-view';
    case USERS_CREATE = 'users-create';
    case USERS_EDIT = 'users-edit';
    case USERS_DELETE = 'users-delete';
    case USERS_BAN = 'users-ban';

    // Roles
    case ROLES_VIEW = 'roles-view';
    case ROLES_CREATE = 'roles-create';
    case ROLES_EDIT = 'roles-edit';
    case ROLES_DELETE = 'roles-delete';

    // Settings
    case SETTINGS_VIEW = 'settings-view';
    case SETTINGS_EDIT = 'settings-edit';

    // Utilities
    case UTILITIES_VIEW = 'utilities-view';

    public function displayName(): string
    {
        return match ($this) {
            // Dashboard
            self::DASHBOARD_VIEW => 'Dashboard View',
            // Access
            self::ACCESS_VIEW => 'Access View',
            // Roles
            self::ROLES_VIEW => 'Roles View',
            self::ROLES_CREATE => 'Roles Create',
            self::ROLES_EDIT => 'Roles Edit',
            self::ROLES_DELETE => 'Roles Delete',
            // Users
            self::USERS_VIEW => 'Users View',
            self::USERS_CREATE => 'Users Create',
            self::USERS_EDIT => 'Users Edit',
            self::USERS_DELETE => 'Users Delete',
            self::USERS_BAN => 'Users Ban',
            // Settings
            self::SETTINGS_VIEW => 'Settings View',
            self::SETTINGS_EDIT => 'Settings Edit',
            // Utilities
            self::UTILITIES_VIEW => 'Utilities View',
        };
    }
}
