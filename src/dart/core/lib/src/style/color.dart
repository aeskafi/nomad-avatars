/// Read-only view over an entry in a style definition's `colors` block.
library;

/// A named color of a style: the candidate values plus the contrast and
/// exclusion constraints the resolver applies. The color math itself lives in
/// the public `Color` utility class.
///
/// Named `ColorDefinition` (not `Color`) to keep it distinct from the public
/// color-math class — the renderer imports both.
class ColorDefinition {
  final Map<String, Object?> _data;
  List<String>? _values;
  List<String>? _notEqualTo;

  ColorDefinition(Map<String, Object?> data) : _data = data;

  /// Returns the candidate color values, in definition order.
  List<String> values() => _values ??= List.unmodifiable(
        (_data['values'] as List<Object?>).cast<String>(),
      );

  /// Returns the names of the colors that the resolver should avoid picking,
  /// or an empty list when the field is unset.
  List<String> notEqualTo() => _notEqualTo ??= List.unmodifiable(
        (_data['notEqualTo'] as List<Object?>? ?? const []).cast<String>(),
      );

  /// Returns the name of another color that this one should contrast
  /// against, or `null` when no contrast constraint is defined.
  String? contrastTo() => _data['contrastTo'] as String?;
}
