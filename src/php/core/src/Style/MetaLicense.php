<?php

declare(strict_types=1);

namespace DiceBear\Style;

/**
 * Read-only view over the `meta.license` block of a style definition.
 */
class MetaLicense
{
    /**
     * @param array<string, mixed> $data
     */
    public function __construct(private readonly array $data) {}

    /**
     * Returns the license name (e.g. `"CC BY 4.0"`), or `null` when not set.
     */
    public function name(): ?string
    {
        return $this->data['name'] ?? null;
    }

    /**
     * Returns the license URL, or `null` when not set.
     */
    public function url(): ?string
    {
        return $this->data['url'] ?? null;
    }

    /**
     * Returns the full license text, or `null` when not set.
     */
    public function text(): ?string
    {
        return $this->data['text'] ?? null;
    }
}
