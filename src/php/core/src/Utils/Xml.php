<?php

declare(strict_types=1);

namespace DiceBear\Utils;

/**
 * Minimal XML escaping helper for SVG/XML text and attribute content.
 *
 * @internal
 */
class Xml
{
    private const ENTITIES = [
        '&' => '&amp;',
        "'" => '&apos;',
        '"' => '&quot;',
        '<' => '&lt;',
        '>' => '&gt;',
    ];

    /**
     * Returns `$value` with the five XML predefined entities escaped.
     */
    public static function escape(string $value): string
    {
        return strtr($value, self::ENTITIES);
    }
}
