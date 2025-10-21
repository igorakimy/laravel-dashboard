<?php

namespace App\Data\Auth;

use App\Data\User\CreateUserData;

final class RegisterData extends CreateUserData
{
    public function __construct(
        public string $name,
        public string $email,
        public string $password,
    ) {
        parent::__construct(
            name: $name,
            email: $email,
            password: $password,
        );
    }
}
