/**
 * Derives display initials from a seed string.
 *
 * @see https://www.regular-expressions.info/unicode.html
 */
export class Initials {
  /**
   * Returns one or two uppercase initials for the given seed. By default
   * strips `@...` so email addresses yield a single initial instead of being
   * treated as two words.
   */
  static fromSeed(seed: string, discardAtSymbol = true): string {
    let input = seed;

    if (discardAtSymbol) {
      // Strip the whole @ suffix, including any line terminators (dotall `s`).
      input = seed.replace(/@.*/s, '');
    }

    input = input.replace(/[`´'ʼ]/g, '');

    const matches = input.match(/(\p{L}[\p{L}\p{M}]*)/gu);

    if (!matches) {
      return discardAtSymbol ? this.fromSeed(seed, false) : '';
    }

    if (matches.length === 1) {
      const match = matches[0].match(/^(?:\p{L}\p{M}*){1,2}/u);

      return match ? match[0].toUpperCase() : '';
    }

    const first = matches[0].match(/^(?:\p{L}\p{M}*)/u);
    const last = matches[matches.length - 1].match(/^(?:\p{L}\p{M}*)/u);

    if (!first || !last) {
      return '';
    }

    return (first[0] + last[0]).toUpperCase();
  }
}
