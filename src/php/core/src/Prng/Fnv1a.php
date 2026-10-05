<?php

declare(strict_types=1);

namespace DiceBear\Prng;

/**
 * FNV-1a 32-bit hash.
 *
 * Offset basis: 0x811c9dc5, prime: 0x01000193.
 *
 * @see https://en.wikipedia.org/wiki/Fowler%E2%80%93Noll%E2%80%93Vo_hash_function
 *
 * @internal
 */
class Fnv1a
{
    /**
     * Returns the unsigned 32-bit FNV-1a hash of `$input`. The input is
     * decomposed into UTF-16 code units before hashing so the result is
     * identical across language ports.
     */
    public static function hash(string $input): int
    {
        $hash = 0x811C9DC5;

        // FNV prime is small enough that hash * prime fits in 64-bit.
        foreach (self::utf16CodeUnits($input) as $code) {
            $hash = (($hash ^ $code) * 0x01000193) & 0xFFFFFFFF;
        }

        return $hash;
    }

    /**
     * Returns the FNV-1a hash of `$input` as an 8-character lowercase hex
     * string.
     */
    public static function hex(string $input): string
    {
        return str_pad(dechex(self::hash($input)), 8, '0', STR_PAD_LEFT);
    }

    /**
     * Converts a UTF-8 string to an array of UTF-16 code units,
     * matching JavaScript's charCodeAt() behavior.
     *
     * @return list<int>
     */
    private static function utf16CodeUnits(string $input): array
    {
        if ($input === '') {
            return [];
        }

        return array_values(unpack('v*', mb_convert_encoding($input, 'UTF-16LE', 'UTF-8')));
    }
}
