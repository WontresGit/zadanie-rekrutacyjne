<?php
namespace App\Message;

use DateTimeImmutable;

class ClickMessage
{
    public function __construct(
        public int $shortUrlId,
        public DateTimeImmutable $clickedAt
    ) {
    }
}