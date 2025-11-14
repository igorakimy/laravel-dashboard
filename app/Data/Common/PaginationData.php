<?php

namespace App\Data\Common;

use Spatie\LaravelData\Data;

final class PaginationData extends Data
{
    public function __construct(
        public int|null $per_page = 10,
        public int|null $page = 1,
    ) {
    }
}
