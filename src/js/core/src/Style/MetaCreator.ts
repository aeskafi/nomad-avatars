import type { StyleDefinitionMetaCreator } from '../StyleDefinition.js';

/**
 * Read-only view over the `meta.creator` block of a style definition.
 */
export class MetaCreator {
  #data: StyleDefinitionMetaCreator;

  constructor(data: StyleDefinitionMetaCreator) {
    this.#data = data;
  }

  /**
   * Returns the creator's display name, or `undefined` when not set.
   */
  name(): string | undefined {
    return this.#data.name;
  }

  /**
   * Returns the creator's homepage URL, or `undefined` when not set.
   */
  url(): string | undefined {
    return this.#data.url;
  }
}
