<?php

declare(strict_types=1);

namespace DiceBear\Tests;

use DiceBear\Avatar;
use DiceBear\Style;
use PHPUnit\Framework\TestCase;

class AvatarTest extends TestCase
{
    private static function minimalStyleData(): array
    {
        return ['canvas' => ['width' => 100, 'height' => 100, 'elements' => []]];
    }

    // constructor

    public function testAcceptsStyleInstanceAndRawOptions(): void
    {
        $style = new Style(self::minimalStyleData());
        $avatar = new Avatar($style, ['seed' => 'test']);
        $this->assertInstanceOf(Avatar::class, $avatar);
    }

    public function testAcceptsRawStyleDataButEmitsDeprecation(): void
    {
        // Back-compat: passing a raw definition still renders, but is
        // deprecated in favor of wrapping it in a Style first. This is the
        // single test that intentionally exercises the E_USER_DEPRECATED.
        //
        // A temporary error handler fully captures (and thereby consumes) the
        // deprecation so it does not surface as a reported PHPUnit issue,
        // while still letting us assert that it fired and that rendering works.
        $captured = [];
        set_error_handler(static function (int $errno, string $errstr) use (&$captured): bool {
            $captured[] = $errstr;
            return true;
        }, E_USER_DEPRECATED);

        try {
            $avatar = new Avatar(self::minimalStyleData(), ['seed' => 'test']);
        } finally {
            restore_error_handler();
        }

        $this->assertCount(1, $captured, 'passing a raw definition must emit exactly one deprecation');
        $this->assertSame(
            'Passing a style definition to ' . Avatar::class . ' is deprecated and '
                . 'will be removed in v11. Wrap it in a Style first: '
                . 'new Avatar(new Style($definition), $options).',
            $captured[0],
        );

        // The deprecated definition path must still render identically.
        $this->assertInstanceOf(Avatar::class, $avatar);
        $this->assertStringStartsWith('<svg ', $avatar->toString());
    }

    public function testAcceptsRawStyleDataAndRawOptions(): void
    {
        $avatar = new Avatar(new Style(self::minimalStyleData()), ['seed' => 'test']);
        $this->assertInstanceOf(Avatar::class, $avatar);
    }

    public function testWorksWithoutOptions(): void
    {
        $style = new Style(self::minimalStyleData());
        $avatar = new Avatar($style);
        $this->assertInstanceOf(Avatar::class, $avatar);
    }

    // toString

    public function testToStringReturnsString(): void
    {
        $style = new Style(self::minimalStyleData());
        $avatar = new Avatar($style, ['seed' => 'test']);
        $this->assertIsString($avatar->toString());
    }

    // toJSON

    public function testToJsonReturnsObjectWithSvgAndOptions(): void
    {
        $style = new Style(self::minimalStyleData());
        $avatar = new Avatar($style, ['seed' => 'test']);
        $json = $avatar->toJSON();

        $this->assertIsString($json['svg']);
        $this->assertIsArray($json['options']);
    }

    public function testToJsonConsistentWithToString(): void
    {
        $style = new Style(self::minimalStyleData());
        $avatar = new Avatar($style, ['seed' => 'test']);

        $this->assertSame($avatar->toJSON()['svg'], $avatar->toString());
    }

    public function testToJsonReturnsDeepCopyOfOptions(): void
    {
        $style = new Style(self::minimalStyleData());
        $avatar = new Avatar($style, ['seed' => 'test']);

        $json1 = $avatar->toJSON();
        $json2 = $avatar->toJSON();
        $json1['options']['injected'] = 'modified';

        $this->assertArrayNotHasKey('injected', $json2['options']);
    }

    public function testToJsonDoesNotIncludeSeed(): void
    {
        $style = new Style(self::minimalStyleData());
        $avatar = new Avatar($style, ['seed' => 'test']);

        $this->assertArrayNotHasKey('seed', $avatar->toJSON()['options']);
    }

    // toDataUri

    public function testToDataUriReturnsDataUri(): void
    {
        $style = new Style(self::minimalStyleData());
        $avatar = new Avatar($style, ['seed' => 'test']);

        $this->assertStringStartsWith('data:image/svg+xml;charset=utf-8,', $avatar->toDataUri());
    }

    public function testToDataUriContainsEncodedSvg(): void
    {
        $style = new Style(self::minimalStyleData());
        $avatar = new Avatar($style, ['seed' => 'test']);

        // The exact byte-level encoding (JS encodeURIComponent) is pinned by
        // the parity fixtures; here only the round-trip is asserted.
        $payload = substr($avatar->toDataUri(), strlen('data:image/svg+xml;charset=utf-8,'));
        $this->assertSame($avatar->toString(), rawurldecode($payload));
    }
}
