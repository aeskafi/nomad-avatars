<?php

declare(strict_types=1);

namespace DiceBear\Style;

/**
 * Read-only view over an entry in a style definition's `colors` block.
 */
class Color
{
    /**
     * @param array<string, mixed> $data
     */
    public function __construct(private readonly array $data) {}

    /**
     * Returns the candidate color values, in definition order.
     *
     * @return list<string>
     */
    public function values(): array
    {
        return $this->data['values'];
    }

    /**
     * Returns the colors that the resolver should avoid picking, or an empty
     * list when the field is unset.
     *
     * @return list<string>
     */
    public function notEqualTo(): array
    {
        return $this->data['notEqualTo'] ?? [];
    }

    /**
     * Returns the name of another color that this one should contrast against,
     * or `null` when no contrast constraint is defined.
     */
    public function contrastTo(): ?string
    {
        return $this->data['contrastTo'] ?? null;
    }
}
