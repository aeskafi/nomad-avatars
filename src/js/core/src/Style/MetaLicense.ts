import type { StyleDefinitionMetaLicense } from '../StyleDefinition.js';

/**
 * Read-only view over the `meta.license` block of a style definition.
 */
export class MetaLicense {
  #data: StyleDefinitionMetaLicense;

  constructor(data: StyleDefinitionMetaLicense) {
    this.#data = data;
  }

  /**
   * Returns the license name (e.g. `"CC BY 4.0"`), or `undefined` when not set.
   */
  name(): string | undefined {
    return this.#data.name;
  }

  /**
   * Returns the license URL, or `undefined` when not set.
   */
  url(): string | undefined {
    return this.#data.url;
  }

  /**
   * Returns the full license text, or `undefined` when not set.
   */
  text(): string | undefined {
    return this.#data.text;
  }
}
