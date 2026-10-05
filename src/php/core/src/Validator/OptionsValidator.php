<?php

declare(strict_types=1);

namespace DiceBear\Validator;

use DiceBear\Error\OptionsValidationError;

/**
 * Validates avatar options against the shared `options.json` schema.
 *
 * @internal
 */
class OptionsValidator extends AbstractValidator
{
    /**
     * @inheritDoc
     */
    protected static function schemaFile(): string
    {
        return 'options.json';
    }

    /**
     * @inheritDoc
     *
     * Empty arrays are coerced to `stdClass` so they validate as JSON objects
     * rather than empty arrays.
     */
    protected static function toObject(mixed $data): mixed
    {
        if (!is_array($data)) {
            return $data;
        }

        return empty($data) ? new \stdClass() : json_decode(json_encode($data));
    }

    /**
     * @inheritDoc
     */
    protected static function throwError(array $details): never
    {
        throw new OptionsValidationError($details);
    }
}
