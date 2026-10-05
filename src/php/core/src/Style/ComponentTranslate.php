<?php

declare(strict_types=1);

namespace DiceBear\Style;

/**
 * Read-only view over a component's `translate` block, providing the X and Y
 * offset ranges.
 */
class ComponentTranslate
{
    /**
     * @param array<string, mixed> $data
     */
    public function __construct(private readonly array $data) {}

    /** @return array{min: int|float, max: int|float, step?: int|float}|null */
    public function x(): ?array
    {
        return $this->data['x'] ?? null;
    }

    /** @return array{min: int|float, max: int|float, step?: int|float}|null */
    public function y(): ?array
    {
        return $this->data['y'] ?? null;
    }
}
