import { ValidationError } from './ValidationError.js';
import type { ValidationErrorDetail } from './ValidationError.js';

/**
 * Thrown when a style definition fails schema validation.
 */
export class StyleValidationError extends ValidationError {
  constructor(details: readonly ValidationErrorDetail[]) {
    super('Invalid style definition', details);
    this.name = 'StyleValidationError';
  }
}
