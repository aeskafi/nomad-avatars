/// Read-only view over the `meta.license` block of a style definition.
library;

/// The license descriptor of a style's metadata.
///
/// Accessors return `null` for absent fields, distinguishing them from fields
/// explicitly set to the empty string, matching the JS nullish and the
/// Go `*string` / Rust Option logic. Never coalesce `''` to `null` here — the
/// license builder treats the two differently.
class MetaLicense {
  final Map<String, Object?> _data;

  MetaLicense(Map<String, Object?> data) : _data = data;

  /// Returns the license name (e.g. `'CC BY 4.0'`), or `null` when not set.
  String? name() => _data['name'] as String?;

  /// Returns the license URL, or `null` when not set.
  String? url() => _data['url'] as String?;

  /// Returns the full license text, or `null` when not set.
  String? text() => _data['text'] as String?;
}
