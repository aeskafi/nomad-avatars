<?php

declare(strict_types=1);

namespace DiceBear\Utils;

use DiceBear\Style\Meta;

/**
 * Builds attribution strings and embedded RDF/Dublin Core metadata from a
 * style's {@see Meta} block.
 *
 * @internal
 */
class License
{
    /**
     * Returns a single-line attribution string suitable for `<title>` or
     * `<desc>` content. Returns an empty string when no attribution data is
     * available.
     */
    public static function text(Meta $meta): string
    {
        $sourceName = $meta->source()->name();
        $sourceUrl = $meta->source()->url();
        $creatorName = $meta->creator()->name();
        $licenseName = $meta->license()->name();
        $licenseUrl = $meta->license()->url();

        if ($sourceName === null && $creatorName === null && $licenseName === null) {
            return '';
        }

        $title = $sourceName !== null ? "“{$sourceName}”" : 'Design';

        if ($sourceUrl !== null) {
            $title .= " ({$sourceUrl})";
        }

        $creator = '“' . ($creatorName ?? 'Unknown') . '”';

        $result = '';

        // Skip "Remix of" prefix for MIT-licensed or DiceBear-original styles.
        if ($licenseName !== 'MIT' && $creatorName !== 'DiceBear' && $sourceName !== null) {
            $result .= 'Remix of ';
        }

        $result .= "{$title} by {$creator}";

        if ($licenseName !== null) {
            $result .= ", licensed under “{$licenseName}”";

            if ($licenseUrl !== null) {
                $result .= " ({$licenseUrl})";
            }
        }

        return $result;
    }

    /**
     * Builds an embedded `<metadata>` block with Dublin Core terms describing
     * the style's source, creator, license, and rights statement. Returns an
     * empty string when no metadata fields are populated.
     */
    public static function xml(Meta $meta): string
    {
        $title = $meta->source()->name();
        $creatorName = $meta->creator()->name();
        $sourceUrl = $meta->source()->url();
        $licenseUrl = $meta->license()->url();
        $rights = self::text($meta);

        if ($title === null && $creatorName === null && $sourceUrl === null && $licenseUrl === null && $rights === '') {
            return '';
        }

        $fields = [];

        if ($title !== null) {
            $fields[] = '<dc:title>' . Xml::escape($title) . '</dc:title>';
        }

        if ($creatorName !== null) {
            $fields[] = '<dc:creator>' . Xml::escape($creatorName) . '</dc:creator>';
        }

        if ($sourceUrl !== null) {
            $fields[] = '<dc:source xsi:type="dcterms:URI">' . Xml::escape($sourceUrl) . '</dc:source>';
        }

        if ($licenseUrl !== null) {
            $fields[] = '<dcterms:license xsi:type="dcterms:URI">' . Xml::escape($licenseUrl) . '</dcterms:license>';
        }

        if ($rights !== '') {
            $fields[] = '<dc:rights>' . Xml::escape($rights) . '</dc:rights>';
        }

        return '<metadata'
            . ' xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"'
            . ' xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"'
            . ' xmlns:dc="http://purl.org/dc/elements/1.1/"'
            . ' xmlns:dcterms="http://purl.org/dc/terms/">'
            . '<rdf:RDF><rdf:Description>' . implode('', $fields) . '</rdf:Description></rdf:RDF>'
            . '</metadata>';
    }
}
