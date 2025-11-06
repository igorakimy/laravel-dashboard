<?php

namespace App\Data\Role;

use Spatie\LaravelData\Data;

final class CreateRoleData extends Data
{
    public function __construct(
        public string $name,
        public string $display_name,
        public array $permissions = [],
    ) {
    }
}
