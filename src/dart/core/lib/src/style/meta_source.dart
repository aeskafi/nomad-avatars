/// Read-only view over the `meta.source` block of a style definition.
library;

/// The source descriptor of a style's metadata.
///
/// Accessors return `null` for absent fields, distinguishing them from fields
/// explicitly set to the empty string — the license builder relies on that
/// distinction.
class MetaSource {
  final Map<String, Object?> _data;

  MetaSource(Map<String, Object?> data) : _data = data;

  /// Returns the source name (e.g. the original work title), or `null` when
  /// not set.
  String? name() => _data['name'] as String?;

  /// Returns the URL of the source, or `null` when not set.
  String? url() => _data['url'] as String?;
}
