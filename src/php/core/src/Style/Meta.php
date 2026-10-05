<?php

declare(strict_types=1);

namespace DiceBear\Style;

/**
 * Lazily-constructed view over a style definition's `meta` block, exposing
 * the license, creator, and source descriptors.
 */
class Meta
{
    private ?MetaLicense $license = null;
    private ?MetaCreator $creator = null;
    private ?MetaSource $source = null;

    /**
     * @param array<string, mixed> $data
     */
    public function __construct(private readonly array $data) {}

    /**
     * Returns the license descriptor, defaulting to an empty object when the
     * style definition omits the field.
     */
    public function license(): MetaLicense
    {
        return $this->license ??= new MetaLicense($this->data['license'] ?? []);
    }

    /**
     * Returns the creator descriptor, defaulting to an empty object when the
     * style definition omits the field.
     */
    public function creator(): MetaCreator
    {
        return $this->creator ??= new MetaCreator($this->data['creator'] ?? []);
    }

    /**
     * Returns the source descriptor, defaulting to an empty object when the
     * style definition omits the field.
     */
    public function source(): MetaSource
    {
        return $this->source ??= new MetaSource($this->data['source'] ?? []);
    }
}
