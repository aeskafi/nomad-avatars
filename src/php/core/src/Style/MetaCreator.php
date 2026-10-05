<?php

declare(strict_types=1);

namespace DiceBear\Style;

/**
 * Read-only view over the `meta.creator` block of a style definition.
 */
class MetaCreator
{
    /**
     * @param array<string, mixed> $data
     */
    public function __construct(private readonly array $data) {}

    /**
     * Returns the creator's display name, or `null` when not set.
     */
    public function name(): ?string
    {
        return $this->data['name'] ?? null;
    }

    /**
     * Returns the creator's homepage URL, or `null` when not set.
     */
    public function url(): ?string
    {
        return $this->data['url'] ?? null;
    }
}
