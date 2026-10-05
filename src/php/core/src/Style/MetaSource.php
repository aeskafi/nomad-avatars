<?php

declare(strict_types=1);

namespace DiceBear\Style;

/**
 * Read-only view over the `meta.source` block of a style definition.
 */
class MetaSource
{
    /**
     * @param array<string, mixed> $data
     */
    public function __construct(private readonly array $data) {}

    /**
     * Returns the source name (e.g. the original work title), or `null` when
     * not set.
     */
    public function name(): ?string
    {
        return $this->data['name'] ?? null;
    }

    /**
     * Returns the URL of the source, or `null` when not set.
     */
    public function url(): ?string
    {
        return $this->data['url'] ?? null;
    }
}
