/// Builds attribution strings and embedded RDF/Dublin Core metadata from a
/// style's meta block. Mirrors the JS, PHP, Python, Go and Rust ports,
/// including the nullish creator fallback and the empty-string-as-absent
/// treatment.
library;

import '../style/meta.dart';
import 'xml.dart';

/// Returns `true` when [value] is absent or empty, mirroring the JS falsy
/// checks (`!sourceName` is true for both a missing field and `''`).
bool _unset(String? value) => value == null || value.isEmpty;

/// Returns a single-line attribution string suitable for `<title>` or
/// `<desc>` content, or an empty string when no attribution data is
/// available. The typographic quotes (U+201C/U+201D) are part of the
/// cross-language byte-parity contract.
String licenseText(Meta meta) {
  final sourceName = meta.source().name();
  final sourceUrl = meta.source().url();
  final creatorName = meta.creator().name();
  final licenseName = meta.license().name();
  final licenseUrl = meta.license().url();

  if (_unset(sourceName) && _unset(creatorName) && _unset(licenseName)) {
    return '';
  }

  var title = _unset(sourceName) ? 'Design' : '“$sourceName”';

  if (!_unset(sourceUrl)) {
    title += ' ($sourceUrl)';
  }

  // JS uses `creatorName ?? 'Unknown'` (nullish): an empty creator name stays
  // empty; only a missing one becomes "Unknown".
  final creator = '“${creatorName ?? 'Unknown'}”';

  var result = '';

  // Skip the "Remix of" prefix for MIT-licensed or DiceBear-original styles.
  if (licenseName != 'MIT' &&
      creatorName != 'DiceBear' &&
      !_unset(sourceName)) {
    result += 'Remix of ';
  }

  result += '$title by $creator';

  if (!_unset(licenseName)) {
    result += ', licensed under “$licenseName”';

    if (!_unset(licenseUrl)) {
      result += ' ($licenseUrl)';
    }
  }

  return result;
}

/// Builds an embedded `<metadata>` block with Dublin Core terms describing
/// the style's source, creator, license, and rights statement. Returns an
/// empty string when no metadata fields are populated.
String licenseXml(Meta meta) {
  final title = meta.source().name();
  final creatorName = meta.creator().name();
  final sourceUrl = meta.source().url();
  final licenseUrl = meta.license().url();
  final rights = licenseText(meta);

  if (_unset(title) &&
      _unset(creatorName) &&
      _unset(sourceUrl) &&
      _unset(licenseUrl) &&
      rights.isEmpty) {
    return '';
  }

  final fields = StringBuffer();

  if (!_unset(title)) {
    fields.write('<dc:title>${escapeXml(title!)}</dc:title>');
  }

  if (!_unset(creatorName)) {
    fields.write('<dc:creator>${escapeXml(creatorName!)}</dc:creator>');
  }

  if (!_unset(sourceUrl)) {
    fields.write(
      '<dc:source xsi:type="dcterms:URI">${escapeXml(sourceUrl!)}</dc:source>',
    );
  }

  if (!_unset(licenseUrl)) {
    fields.write(
      '<dcterms:license xsi:type="dcterms:URI">${escapeXml(licenseUrl!)}'
      '</dcterms:license>',
    );
  }

  if (rights.isNotEmpty) {
    fields.write('<dc:rights>${escapeXml(rights)}</dc:rights>');
  }

  return '<metadata'
      ' xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"'
      ' xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"'
      ' xmlns:dc="http://purl.org/dc/elements/1.1/"'
      ' xmlns:dcterms="http://purl.org/dc/terms/">'
      '<rdf:RDF><rdf:Description>$fields</rdf:Description></rdf:RDF>'
      '</metadata>';
}
