/// Thrown when a color in the style definition references itself, directly
/// or indirectly. [chain] reproduces the resolution path.
class CircularColorReferenceError implements Exception {
  /// The resolution path that closed the cycle, e.g. `[a, b, a]`.
  final List<String> chain;

  /// The formatted error message.
  final String message;

  CircularColorReferenceError(List<String> chain)
      : chain = List.unmodifiable(chain),
        message = 'Circular color reference: ${chain.join(' → ')}';

  @override
  String toString() => message;
}
