<?php

declare(strict_types=1);

namespace DiceBear\Style;

/**
 * Read-only view over an entry in a style definition's `components` block.
 *
 * An entry is either a base component with its own dimensions and variants
 * or an alias declared via `extends`. Aliases are pure references — they
 * inherit dimensions, variants, and all transforms from the source.
 */
class Component
{
    private ?ComponentTranslate $translate = null;
    /** @var array<string, ComponentVariant>|null */
    private ?array $variants = null;

    /**
     * @param array<string, mixed> $data
     */
    public function __construct(
        private readonly string $name,
        private readonly array $data,
        private readonly ?Component $source = null,
    ) {}

    /**
     * Returns the entry's own name as declared in the style definition. For
     * aliases this is the alias key, not the source component's name (use
     * {@see sourceName} for the canonical user-option key prefix).
     */
    public function name(): string
    {
        return $this->name;
    }

    /**
     * Returns the source component name when this entry is an alias, or
     * `null` for a base component.
     */
    public function extendsName(): ?string
    {
        return $this->data['extends'] ?? null;
    }

    /**
     * Returns the canonical user-option key prefix: the source component's
     * name when this entry is an alias, otherwise the entry's own name.
     */
    public function sourceName(): string
    {
        return $this->extendsName() ?? $this->name;
    }

    /**
     * Returns the component's intrinsic width in canvas coordinates. For
     * aliases the source component's width is returned.
     */
    public function width(): int|float
    {
        return $this->source !== null ? $this->source->width() : $this->data['width'];
    }

    /**
     * Returns the component's intrinsic height in canvas coordinates. For
     * aliases the source component's height is returned.
     */
    public function height(): int|float
    {
        return $this->source !== null ? $this->source->height() : $this->data['height'];
    }

    /**
     * Returns the probability (0–100) that this component is rendered.
     * Aliases delegate to the source; defaults to 100 (always visible).
     */
    public function probability(): int|float
    {
        if ($this->source !== null) {
            return $this->source->probability();
        }

        return $this->data['probability'] ?? 100;
    }

    /**
     * Returns the rotation range, or `null` when unset.
     * Aliases delegate to the source.
     *
     * @return array{min: int|float, max: int|float, step?: int|float}|null
     */
    public function rotate(): ?array
    {
        if ($this->source !== null) {
            return $this->source->rotate();
        }

        return $this->data['rotate'] ?? null;
    }

    /**
     * Returns the scale range, or `null` when unset.
     * Aliases delegate to the source.
     *
     * @return array{min: int|float, max: int|float, step?: int|float}|null
     */
    public function scale(): ?array
    {
        if ($this->source !== null) {
            return $this->source->scale();
        }

        return $this->data['scale'] ?? null;
    }

    /**
     * Returns the translate descriptor. Aliases delegate to the source.
     */
    public function translate(): ComponentTranslate
    {
        if ($this->source !== null) {
            return $this->source->translate();
        }

        return $this->translate ??= new ComponentTranslate($this->data['translate'] ?? []);
    }

    /**
     * Returns a name → {@see ComponentVariant} map for all defined variants.
     * Aliases delegate to the source component's variants.
     *
     * @return array<string, ComponentVariant>
     */
    public function variants(): array
    {
        if ($this->source !== null) {
            return $this->source->variants();
        }

        if ($this->variants === null) {
            $this->variants = [];

            foreach ($this->data['variants'] as $name => $data) {
                $this->variants[$name] = new ComponentVariant($data);
            }
        }

        return $this->variants;
    }
}
