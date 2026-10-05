/// A single field failure inside a [ValidationError].
class ValidationErrorDetail {
  /// JSON pointer to the failing value (e.g. `/components/eyes/extends`),
  /// or `null` when the failure has no specific location.
  final String? instancePath;

  /// Human-readable description of the failure.
  final String? message;

  const ValidationErrorDetail({this.instancePath, this.message});
}

/// Base class for schema validation errors. Carries the per-field failures
/// in [details]; [message] is the formatted summary.
class ValidationError implements Exception {
  /// The formatted error message, e.g.
  /// `Invalid options: /size must be >= 1`.
  final String message;

  /// The per-field failures.
  final List<ValidationErrorDetail> details;

  ValidationError(String prefix, List<ValidationErrorDetail> details)
      : message = _format(prefix, details),
        details = List.unmodifiable(details);

  // Matches the JS port: empty-string paths and messages are skipped like
  // absent ones.
  static String _format(String prefix, List<ValidationErrorDetail> details) {
    final parts = <String>[];

    for (final detail in details) {
      final segments = <String>[];
      final path = detail.instancePath;
      final message = detail.message;

      if (path != null && path.isNotEmpty) {
        segments.add(path);
      }

      if (message != null && message.isNotEmpty) {
        segments.add(message);
      }

      parts.add(segments.join(' '));
    }

    return '$prefix: ${parts.join(', ')}';
  }

  @override
  String toString() => message;
}
