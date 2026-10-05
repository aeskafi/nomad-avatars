/**
 * Thrown when a color in the style definition references itself, directly or
 * indirectly. The {@link chain} field reproduces the resolution path.
 */
export class CircularColorReferenceError extends Error {
  readonly chain: readonly string[];

  constructor(chain: readonly string[]) {
    const path = chain.join(' → ');

    super(`Circular color reference: ${path}`);
    this.name = 'CircularColorReferenceError';
    this.chain = chain;
  }
}
