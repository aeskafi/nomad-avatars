<?php

declare(strict_types=1);

namespace DiceBear\Error;

/**
 * Thrown when avatar options fail schema validation.
 */
class OptionsValidationError extends ValidationError
{
    /**
     * @param list<array{message?: string, instancePath?: string}> $details
     */
    public function __construct(array $details)
    {
        parent::__construct('Invalid options', $details);
    }
}
