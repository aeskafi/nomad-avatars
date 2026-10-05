<?php

declare(strict_types=1);

namespace DiceBear\Prng;

/**
 * Mulberry32 PRNG — stateful, matching the C reference by Tommy Ettinger.
 *
 * C original:
 * ```c
 * uint32_t z = (x += 0x6D2B79F5UL);
 * z = (z ^ (z >> 15)) * (z | 1UL);
 * z ^= z + (z ^ (z >> 7)) * (z | 61UL);
 * return z ^ (z >> 14);
 * ```
 *
 * All arithmetic is unsigned 32-bit. PHP's 64-bit ints hold uint32
 * natively; only multiply needs a half-decomposition because
 * uint32 * uint32 can exceed PHP_INT_MAX.
 *
 * @see https://gist.github.com/tommyettinger/46a874533244883189143505d203312c
 *
 * @internal
 */
class Mulberry32
{
    private const UINT32_MAX_PLUS_1 = 2 ** 32;

    private int $state;

    public function __construct(int $seed = 0)
    {
        $this->state = $seed & 0xFFFFFFFF;
    }

    /**
     * Advances the state and returns the next unsigned 32-bit value.
     */
    public function next(): int
    {
        $z = ($this->state + 0x6D2B79F5) & 0xFFFFFFFF;
        $this->state = $z;

        $z = self::mul($z ^ ($z >> 15), $z | 1);
        $z ^= self::add($z, self::mul($z ^ ($z >> 7), $z | 61));

        return ($z ^ ($z >> 14)) & 0xFFFFFFFF;
    }

    /**
     * Advances the state and returns the next value in `[0, 1)`.
     */
    public function nextFloat(): float
    {
        return $this->next() / self::UINT32_MAX_PLUS_1;
    }

    /**
     * Returns the current state as a signed 32-bit value (for JS compat).
     */
    public function state(): int
    {
        return $this->state >= 0x80000000
            ? (int) ($this->state - self::UINT32_MAX_PLUS_1)
            : (int) $this->state;
    }

    /**
     * Unsigned 32-bit multiply. Splits one operand into 16-bit halves
     * because uint32 * uint32 can exceed PHP_INT_MAX (2^63-1).
     */
    private static function mul(int $a, int $b): int
    {
        $al = $a & 0xFFFF;
        $ah = ($a >> 16) & 0xFFFF;

        return ($al * $b + ((($ah * $b) & 0xFFFF) << 16)) & 0xFFFFFFFF;
    }

    /**
     * Unsigned 32-bit add. The mask collapses the 64-bit PHP int back into
     * uint32 range so the value matches the C/JS reference.
     */
    private static function add(int $a, int $b): int
    {
        return ($a + $b) & 0xFFFFFFFF;
    }
}
