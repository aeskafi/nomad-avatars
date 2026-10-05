import type { Meta } from '../Style/Meta.js';
import { Xml } from './Xml.js';

/**
 * Builds attribution strings and embedded RDF/Dublin Core metadata from a
 * style's {@link Meta} block.
 */
export class License {
  /**
   * Returns a single-line attribution string suitable for `<title>` or
   * `<desc>` content. Returns an empty string when no attribution data is
   * available.
   */
  static text(meta: Meta): string {
    const sourceName = meta.source().name();
    const sourceUrl = meta.source().url();
    const creatorName = meta.creator().name();
    const licenseName = meta.license().name();
    const licenseUrl = meta.license().url();

    if (!sourceName && !creatorName && !licenseName) {
      return '';
    }

    let title = sourceName ? `“${sourceName}”` : 'Design';

    if (sourceUrl) {
      title += ` (${sourceUrl})`;
    }

    const creator = `“${creatorName ?? 'Unknown'}”`;

    let result = '';

    // Skip "Remix of" prefix for MIT-licensed or DiceBear-original styles.
    if (licenseName !== 'MIT' && creatorName !== 'DiceBear' && sourceName) {
      result += 'Remix of ';
    }

    result += `${title} by ${creator}`;

    if (licenseName) {
      result += `, licensed under “${licenseName}”`;

      if (licenseUrl) {
        result += ` (${licenseUrl})`;
      }
    }

    return result;
  }

  /**
   * Builds an embedded `<metadata>` block with Dublin Core terms describing
   * the style's source, creator, license, and rights statement. Returns an
   * empty string when no metadata fields are populated.
   */
  static xml(meta: Meta): string {
    const title = meta.source().name();
    const creatorName = meta.creator().name();
    const sourceUrl = meta.source().url();
    const licenseUrl = meta.license().url();
    const rights = this.text(meta);

    if (!title && !creatorName && !sourceUrl && !licenseUrl && !rights) {
      return '';
    }

    const fields: string[] = [];

    if (title) {
      fields.push(`<dc:title>${Xml.escape(title)}</dc:title>`);
    }

    if (creatorName) {
      fields.push(`<dc:creator>${Xml.escape(creatorName)}</dc:creator>`);
    }

    if (sourceUrl) {
      fields.push(
        `<dc:source xsi:type="dcterms:URI">${Xml.escape(sourceUrl)}</dc:source>`,
      );
    }

    if (licenseUrl) {
      fields.push(
        `<dcterms:license xsi:type="dcterms:URI">${Xml.escape(licenseUrl)}</dcterms:license>`,
      );
    }

    if (rights) {
      fields.push(`<dc:rights>${Xml.escape(rights)}</dc:rights>`);
    }

    return (
      '<metadata' +
      ' xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"' +
      ' xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"' +
      ' xmlns:dc="http://purl.org/dc/elements/1.1/"' +
      ' xmlns:dcterms="http://purl.org/dc/terms/">' +
      `<rdf:RDF><rdf:Description>${fields.join('')}</rdf:Description></rdf:RDF>` +
      '</metadata>'
    );
  }
}
