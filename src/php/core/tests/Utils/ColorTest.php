<?php

declare(strict_types=1);

namespace DiceBear\Tests\Utils;

use DiceBear\Utils\Color;
use PHPUnit\Framework\TestCase;

class ColorTest extends TestCase
{
    // toRgbHex

    public function testToRgbHexNormalizes6Digit(): void
    {
        $this->assertSame('#ff0000', Color::toRgbHex('#ff0000'));
    }

    public function testToRgbHexNormalizes3Digit(): void
    {
        $this->assertSame('#ff0000', Color::toRgbHex('#f00'));
    }

    public function testToRgbHexStripsAlpha4Digit(): void
    {
        $this->assertSame('#ff0000', Color::toRgbHex('#f008'));
    }

    public function testToRgbHexStripsAlpha8Digit(): void
    {
        $this->assertSame('#ff0000', Color::toRgbHex('#ff000080'));
    }

    public function testToRgbHexLowercases(): void
    {
        $this->assertSame('#ff0000', Color::toRgbHex('#FF0000'));
        $this->assertSame('#ff0000', Color::toRgbHex('#F00'));
    }

    public function testToRgbHexHandlesMissingPrefix(): void
    {
        $this->assertSame('#ff0000', Color::toRgbHex('ff0000'));
        $this->assertSame('#ff0000', Color::toRgbHex('f00'));
    }

    // parseHex

    public function testParseHex6Digit(): void
    {
        $this->assertSame([255, 0, 0], Color::parseHex('#ff0000'));
        $this->assertSame([0, 255, 0], Color::parseHex('#00ff00'));
        $this->assertSame([0, 0, 255], Color::parseHex('#0000ff'));
    }

    public function testParseHex3Digit(): void
    {
        $this->assertSame([255, 0, 0], Color::parseHex('#f00'));
        $this->assertSame([255, 255, 255], Color::parseHex('#fff'));
    }

    public function testParseHex4Digit(): void
    {
        $this->assertSame([255, 0, 0], Color::parseHex('#f008'));
    }

    public function testParseHex8Digit(): void
    {
        $this->assertSame([255, 0, 0], Color::parseHex('#ff000080'));
    }

    public function testParseHexCaseInsensitive(): void
    {
        $this->assertSame([255, 0, 0], Color::parseHex('#FF0000'));
    }

    // luminance

    public function testLuminanceBlackIsZero(): void
    {
        $this->assertSame(0.0, Color::luminance('#000000'));
    }

    public function testLuminanceWhiteIsOne(): void
    {
        $this->assertSame(1.0, Color::luminance('#ffffff'));
    }

    public function testLuminanceMidGray(): void
    {
        $lum = Color::luminance('#808080');

        $this->assertGreaterThan(0.2, $lum);
        $this->assertLessThan(0.25, $lum);
    }

    public function testLuminance3DigitHex(): void
    {
        $this->assertSame(0.0, Color::luminance('#000'));
        $this->assertSame(1.0, Color::luminance('#fff'));
    }

    // sortByContrast

    public function testSortByContrastDescending(): void
    {
        $result = Color::sortByContrast(['#ffffff', '#808080', '#000000'], '#ffffff');

        $this->assertSame('#000000', $result[0]);
        $this->assertSame('#ffffff', $result[2]);
    }

    public function testSortByContrastColoredReference(): void
    {
        $result = Color::sortByContrast(['#000000', '#ffffff'], '#f0c8a0');

        $this->assertSame('#000000', $result[0]);
    }

    public function testSortByContrastPreservesLength(): void
    {
        $result = Color::sortByContrast(['#ff0000', '#00ff00', '#0000ff'], '#ffffff');

        $this->assertCount(3, $result);
    }

    // filterNotEqualTo

    public function testFilterExactMatches(): void
    {
        $result = Color::filterNotEqualTo(['#ff0000', '#00ff00', '#0000ff'], ['#ff0000']);

        $this->assertSame(['#00ff00', '#0000ff'], $result);
    }

    public function testFilterCaseInsensitive(): void
    {
        $result = Color::filterNotEqualTo(['#ff0000', '#00ff00'], ['#FF0000']);

        $this->assertSame(['#00ff00'], $result);
    }

    public function testFilterMatchesShortAndLongHex(): void
    {
        $result = Color::filterNotEqualTo(['#ff0000', '#00ff00'], ['#f00']);

        $this->assertSame(['#00ff00'], $result);
    }

    public function testFilterKeepsAllWhenWouldEmpty(): void
    {
        $result = Color::filterNotEqualTo(['#ff0000'], ['#ff0000']);

        $this->assertSame(['#ff0000'], $result);
    }

    public function testFilterMultipleExclusions(): void
    {
        $result = Color::filterNotEqualTo(['#ff0000', '#00ff00', '#0000ff'], ['#ff0000', '#0000ff']);

        $this->assertSame(['#00ff00'], $result);
    }
}
