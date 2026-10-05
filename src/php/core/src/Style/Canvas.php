<?php

declare(strict_types=1);

namespace DiceBear\Style;

/**
 * Read-only view over a style definition's `canvas` block, exposing the
 * drawing area dimensions and the top-level element list.
 */
class Canvas
{
    /** @var list<Element>|null */
    private ?array $elements = null;

    /**
     * @param array<string, mixed> $data
     */
    public function __construct(private readonly array $data) {}

    /**
     * Returns the canvas width — the `width` value of the SVG `viewBox`.
     */
    public function width(): int|float
    {
        return $this->data['width'];
    }

    /**
     * Returns the canvas height — the `height` value of the SVG `viewBox`.
     */
    public function height(): int|float
    {
        return $this->data['height'];
    }

    /**
     * Returns the top-level elements rendered onto the canvas, lazily wrapped
     * as {@see Element} instances on first access.
     *
     * @return list<Element>
     */
    public function elements(): array
    {
        return $this->elements ??= array_map(
            fn(array $el) => new Element($el),
            $this->data['elements'],
        );
    }
}
