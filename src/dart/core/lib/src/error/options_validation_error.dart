import 'validation_error.dart';

/// Thrown when avatar options fail schema validation.
class OptionsValidationError extends ValidationError {
  OptionsValidationError(List<ValidationErrorDetail> details)
      : super('Invalid options', details);
}
