import 'validation_error.dart';

/// Thrown when a style definition fails schema validation.
class StyleValidationError extends ValidationError {
  StyleValidationError(List<ValidationErrorDetail> details)
      : super('Invalid style definition', details);
}
