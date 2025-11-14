<?php

namespace App\Data\Common;

use Spatie\LaravelData\Data;

final class SortingData extends Data
{
    public function __construct(
        public string|null $sort_by = '',
        public string|null $sort_dir = 'asc',
    ) {
    }
}
