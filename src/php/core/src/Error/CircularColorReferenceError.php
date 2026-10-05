<?php

declare(strict_types=1);

namespace DiceBear\Error;

/**
 * Thrown when a color in the style definition references itself, directly or
 * indirectly. The {@see $chain} field reproduces the resolution path.
 */
class CircularColorReferenceError extends \RuntimeException
{
    /** @var list<string> */
    public readonly array $chain;

    /**
     * @param list<string> $chain
     */
    public function __construct(array $chain)
    {
        $path = implode(' → ', $chain);

        parent::__construct("Circular color reference: {$path}");
        $this->chain = $chain;
    }
}
