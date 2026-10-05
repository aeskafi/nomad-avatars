<?php

declare(strict_types=1);

namespace DiceBear\Error;

/**
 * Base class for schema validation errors. Carries the prefix in the
 * exception message and the per-field failures in {@see $details}.
 */
class ValidationError extends \RuntimeException
{
    /** @var list<array{message?: string, instancePath?: string}> */
    public readonly array $details;

    /**
     * @param list<array{message?: string, instancePath?: string}> $details
     */
    public function __construct(string $prefix, array $details)
    {
        $parts = [];

        foreach ($details as $detail) {
            $segments = [];

            if (isset($detail['instancePath']) && $detail['instancePath'] !== '') {
                $segments[] = $detail['instancePath'];
            }

            if (isset($detail['message']) && $detail['message'] !== '') {
                $segments[] = $detail['message'];
            }

            $parts[] = implode(' ', $segments);
        }

        parent::__construct($prefix . ': ' . implode(', ', $parts));
        $this->details = $details;
    }
}
