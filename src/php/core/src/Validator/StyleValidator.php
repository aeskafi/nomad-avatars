<?php

declare(strict_types=1);

namespace DiceBear\Validator;

use DiceBear\Error\StyleValidationError;

/**
 * Validates style definitions against the shared `definition.json` schema.
 *
 * @internal
 */
class StyleValidator extends AbstractValidator
{
    /**
     * @inheritDoc
     */
    protected static function schemaFile(): string
    {
        return 'definition.json';
    }

    /**
     * @inheritDoc
     */
    protected static function toObject(mixed $data): mixed
    {
        return is_array($data) ? json_decode(json_encode($data)) : $data;
    }

    /**
     * @inheritDoc
     */
    protected static function throwError(array $details): never
    {
        throw new StyleValidationError($details);
    }
}
