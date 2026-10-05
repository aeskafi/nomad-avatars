/// A numeric range with an optional quantization step, normalized from the
/// user-facing scalar-or-array option shapes by `Options`.
class Range {
  final double min;
  final double max;
  final double? step;

  const Range({required this.min, required this.max, this.step});
}
