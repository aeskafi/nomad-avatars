import type { StyleDefinitionMetaSource } from '../StyleDefinition.js';

/**
 * Read-only view over the `meta.source` block of a style definition.
 */
export class MetaSource {
  #data: StyleDefinitionMetaSource;

  constructor(data: StyleDefinitionMetaSource) {
    this.#data = data;
  }

  /**
   * Returns the source name (e.g. the original work title), or `undefined`
   * when not set.
   */
  name(): string | undefined {
    return this.#data.name;
  }

  /**
   * Returns the URL of the source, or `undefined` when not set.
   */
  url(): string | undefined {
    return this.#data.url;
  }
}
