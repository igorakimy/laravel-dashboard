<?php

namespace App\Data\Common;

use Spatie\LaravelData\Data;

final class FilteringData extends Data
{
    public function __construct(
        public string|null $search = '',
    ) {
    }
}
