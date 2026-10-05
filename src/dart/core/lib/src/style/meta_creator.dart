/// Read-only view over the `meta.creator` block of a style definition.
library;

/// The creator descriptor of a style's metadata.
///
/// Accessors return `null` for absent fields, distinguishing them from fields
/// explicitly set to the empty string — the license builder relies on that
/// distinction (the JS nullish `?? 'Unknown'`; Go/Rust use `*string`/Option
/// for the same reason).
class MetaCreator {
  final Map<String, Object?> _data;

  MetaCreator(Map<String, Object?> data) : _data = data;

  /// Returns the creator's display name, or `null` when not set.
  String? name() => _data['name'] as String?;

  /// Returns the creator's homepage URL, or `null` when not set.
  String? url() => _data['url'] as String?;
}
