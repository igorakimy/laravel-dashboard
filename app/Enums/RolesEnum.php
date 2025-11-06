<?php

namespace App\Enums;

use App\Traits\EnumToArray;

enum RolesEnum: string
{
    use EnumToArray;

    case ADMIN = 'admin';
    case USER = 'user';

    public function displayName(): string
    {
        return match ($this) {
            self::ADMIN => 'Администратор',
            self::USER => 'Пользователь',
        };
    }
}
