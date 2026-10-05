<?php

declare(strict_types=1);

namespace DiceBear\Error;

/**
 * Thrown when a style definition fails schema validation.
 */
class StyleValidationError extends ValidationError
{
    /**
     * @param list<array{message?: string, instancePath?: string}> $details
     */
    public function __construct(array $details)
    {
        parent::__construct('Invalid style definition', $details);
    }
}
