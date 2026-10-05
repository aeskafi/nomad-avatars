<?php

declare(strict_types=1);

namespace DiceBear;

use DiceBear\Error\StyleValidationError;
use DiceBear\Style\Canvas;
use DiceBear\Style\Color;
use DiceBear\Style\Component;
use DiceBear\Style\Meta;
use DiceBear\Validator\StyleValidator;

/**
 * Validated, lazily-decomposed wrapper around a style definition. Construction
 * runs the JSON Schema validator and stores a deep copy of the input so that
 * later mutation of the source object cannot leak into the rendered avatar.
 */
class Style
{
    /** @var array<string, mixed> */
    private array $data;
    private ?Meta $meta = null;
    private ?Canvas $canvas = null;
    /** @var array<string, Component>|null */
    private ?array $components = null;
    /** @var array<string, Color>|null */
    private ?array $colors = null;

    public function __construct(mixed $data)
    {
        StyleValidator::validate($data);

        $this->data = is_array($data) ? $data : json_decode(json_encode($data), true);

        $this->validateAliases();
    }

    /**
     * Parses and validates a style definition from its raw JSON string.
     *
     * The string counterpart to the constructor, for the common case where the
     * definition is raw JSON, such as a file shipped by the `dicebear/styles`
     * package. Throws a {@see \JsonException} when $json is not valid JSON, and
     * a {@see StyleValidationError} when the decoded value is not a valid style
     * definition. Pass an already-decoded array to the constructor instead.
     */
    public static function fromJson(string $json): self
    {
        return new self(json_decode($json, true, flags: JSON_THROW_ON_ERROR));
    }

    /**
     * Returns the definition's `$id`, or `null` when not set.
     */
    public function id(): ?string
    {
        return $this->data['$id'] ?? null;
    }

    /**
     * Returns the definition's `$schema` URI, or `null` when not set.
     */
    public function schema(): ?string
    {
        return $this->data['$schema'] ?? null;
    }

    /**
     * Returns the definition's `$comment`, or `null` when not set.
     */
    public function comment(): ?string
    {
        return $this->data['$comment'] ?? null;
    }

    /**
     * Returns the {@see Meta} view, lazily constructed on first access.
     */
    public function meta(): Meta
    {
        return $this->meta ??= new Meta($this->data['meta'] ?? []);
    }

    /**
     * Returns the root SVG attributes from the definition, defaulting to an
     * empty array.
     *
     * @return array<string, mixed>
     */
    public function attributes(): array
    {
        return $this->data['attributes'] ?? [];
    }

    /**
     * Returns the {@see Canvas} view, lazily constructed on first access.
     */
    public function canvas(): Canvas
    {
        return $this->canvas ??= new Canvas($this->data['canvas']);
    }

    /**
     * Returns a name → {@see Component} map for all defined components, built
     * lazily on first access.
     *
     * @return array<string, Component>
     */
    public function components(): array
    {
        if ($this->components !== null) {
            return $this->components;
        }

        $entries = $this->data['components'] ?? [];
        $this->components = [];

        foreach ($entries as $name => $data) {
            if (!self::isAlias($data)) {
                $this->components[$name] = new Component($name, $data);
            }
        }

        foreach ($entries as $name => $data) {
            if (self::isAlias($data)) {
                $this->components[$name] = new Component(
                    $name,
                    $data,
                    $this->components[$data['extends']] ?? null,
                );
            }
        }

        return $this->components;
    }

    /**
     * Verifies that every component declared via `extends` references an
     * existing, non-alias component in the same `components` map. The schema
     * itself cannot enforce cross-references between sibling keys.
     */
    private function validateAliases(): void
    {
        $components = $this->data['components'] ?? null;

        if ($components === null) {
            return;
        }

        $errors = [];

        foreach ($components as $name => $data) {
            if (!self::isAlias($data)) {
                continue;
            }

            $target = $data['extends'];
            $targetData = $components[$target] ?? null;

            if ($targetData === null) {
                $errors[] = [
                    'instancePath' => "/components/{$name}/extends",
                    'message' => "references unknown component \"{$target}\"",
                ];

                continue;
            }

            if (self::isAlias($targetData)) {
                $errors[] = [
                    'instancePath' => "/components/{$name}/extends",
                    'message' => "references alias \"{$target}\" — alias chains are not allowed",
                ];
            }
        }

        if (count($errors) > 0) {
            throw new StyleValidationError($errors);
        }
    }

    /**
     * @param array<string, mixed> $data
     */
    private static function isAlias(array $data): bool
    {
        return array_key_exists('extends', $data);
    }

    /**
     * Returns a name → {@see Color} map for all defined colors, built lazily
     * on first access.
     *
     * @return array<string, Color>
     */
    public function colors(): array
    {
        if ($this->colors === null) {
            $this->colors = [];

            foreach ($this->data['colors'] ?? [] as $name => $data) {
                $this->colors[$name] = new Color($data);
            }
        }

        return $this->colors;
    }
}
