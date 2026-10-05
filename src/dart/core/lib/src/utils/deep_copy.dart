/// A `structuredClone` equivalent for decoded-JSON value trees, shared by the
/// model and resolver layers so the cloning contract lives in one place.
library;

/// Deep-copies a decoded-JSON [value]: maps and lists are cloned recursively
/// with insertion order preserved, immutable scalars are returned as-is.
///
/// This mirrors the JS port's `structuredClone` for JSON-shaped data, so that
/// later mutation of a caller's input (or of a returned snapshot) cannot leak
/// into or out of the engine's internal state. The preserved insertion order
/// is load-bearing: SVG attributes, `<defs>` entries, and the resolved-options
/// snapshot all emit in source/first-recorded order.
Object? deepCopyJsonValue(Object? value) {
  if (value is Map) {
    return <String, Object?>{
      for (final entry in value.entries)
        entry.key as String: deepCopyJsonValue(entry.value),
    };
  }

  if (value is List) {
    return <Object?>[for (final item in value) deepCopyJsonValue(item)];
  }

  return value;
}

/// Deep-copies a decoded-JSON map, preserving insertion order.
Map<String, Object?> deepCopyJsonMap(Map<String, Object?> map) =>
    deepCopyJsonValue(map) as Map<String, Object?>;
