import { ValidationError } from './ValidationError.js';
import type { ValidationErrorDetail } from './ValidationError.js';

/**
 * Thrown when avatar options fail schema validation.
 */
export class OptionsValidationError extends ValidationError {
  constructor(details: readonly ValidationErrorDetail[]) {
    super('Invalid options', details);
    this.name = 'OptionsValidationError';
  }
}
