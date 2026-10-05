/// Read-only view over a component's `translate` block.
library;

import '../range.dart';

/// The X and Y offset ranges of a component's `translate` block. Both are
/// `null` when the corresponding axis is unset.
class ComponentTranslate {
  final Range? _x;
  final Range? _y;

  ComponentTranslate(Map<String, Object?> data)
      : _x = rangeFromDefinition(data['x']),
        _y = rangeFromDefinition(data['y']);

  /// Returns the X offset range (percent of the component's width), or
  /// `null` when unset.
  Range? x() => _x;

  /// Returns the Y offset range (percent of the component's height), or
  /// `null` when unset.
  Range? y() => _y;
}

/// Builds a [Range] from a style definition value, or returns `null` when the
/// field is unset.
///
/// In a style definition a range is always a `{min, max, step?}` object (the
/// definition schema pins that shape) — the bare-number and `[min, max]`
/// array shorthands exist only in the user-facing options and are normalized
/// by `Options`, not here.
Range? rangeFromDefinition(Object? value) {
  if (value == null) {
    return null;
  }

  final data = value as Map<String, Object?>;
  final step = data['step'];

  return Range(
    min: (data['min'] as num).toDouble(),
    max: (data['max'] as num).toDouble(),
    step: step == null ? null : (step as num).toDouble(),
  );
}
