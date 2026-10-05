/// Minimal XML escaping helper for SVG/XML text and attribute content.
library;

const _entities = <String, String>{
  '&': '&amp;',
  "'": '&apos;',
  '"': '&quot;',
  '<': '&lt;',
  '>': '&gt;',
};

final _pattern = RegExp('[&\'"<>]');

/// Returns [value] with the five XML predefined entities escaped, in a
/// single pass like the JS port's regex replace.
String escapeXml(String value) {
  return value.replaceAllMapped(_pattern, (match) => _entities[match[0]]!);
}
