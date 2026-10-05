<?php

declare(strict_types=1);

namespace DiceBear\Utils;

/**
 * Derives display initials from a seed string.
 *
 * @see https://www.regular-expressions.info/unicode.html
 *
 * @internal
 */
class Initials
{
    /**
     * Returns one or two uppercase initials for the given seed. By default
     * strips `@...` so email addresses yield a single initial instead of
     * being treated as two words.
     */
    public static function fromSeed(string $seed, bool $discardAtSymbol = true): string
    {
        $input = $seed;

        if ($discardAtSymbol) {
            // Strip the entire @ suffix (e.g. an email domain), including any
            // line terminators — the /s (dotall) modifier makes . match
            // newlines too.
            $input = preg_replace('/@.*/s', '', $seed);
        }

        // The /u flag is required so the character class strips whole code
        // points; without it preg_replace removes the raw UTF-8 bytes 0xB4/0xBC
        // that also occur inside multibyte letters (e.g. ô, ü), corrupting them.
        $input = preg_replace('/[`´\'ʼ]/u', '', $input);

        if (!preg_match_all('/(\p{L}[\p{L}\p{M}]*)/u', $input, $matches)) {
            return $discardAtSymbol ? self::fromSeed($seed, false) : '';
        }

        $words = $matches[0];

        if (count($words) === 1) {
            if (preg_match('/^(?:\p{L}\p{M}*){1,2}/u', $words[0], $match)) {
                return mb_strtoupper($match[0]);
            }

            return '';
        }

        $first = null;
        $last = null;

        if (preg_match('/^(?:\p{L}\p{M}*)/u', $words[0], $match)) {
            $first = $match[0];
        }

        if (preg_match('/^(?:\p{L}\p{M}*)/u', $words[count($words) - 1], $match)) {
            $last = $match[0];
        }

        if ($first === null || $last === null) {
            return '';
        }

        return mb_strtoupper($first . $last);
    }
}
