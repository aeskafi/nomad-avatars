/**
 * Minimal XML escaping helper for SVG/XML text and attribute content.
 */
export class Xml {
  static #entities: Record<string, string> = {
    '&': '&amp;',
    "'": '&apos;',
    '"': '&quot;',
    '<': '&lt;',
    '>': '&gt;',
  };

  static #pattern = new RegExp(`[${Object.keys(Xml.#entities).join('')}]`, 'g');

  /**
   * Returns `value` with the five XML predefined entities escaped.
   */
  static escape(value: string): string {
    return value.replace(Xml.#pattern, (ch) => Xml.#entities[ch]);
  }
}
