import type { StyleDefinitionMeta } from '../StyleDefinition.js';
import { MetaLicense } from './MetaLicense.js';
import { MetaCreator } from './MetaCreator.js';
import { MetaSource } from './MetaSource.js';

/**
 * Lazily-constructed view over a style definition's `meta` block, exposing
 * the license, creator, and source descriptors.
 */
export class Meta {
  #data: StyleDefinitionMeta;
  #license?: MetaLicense;
  #creator?: MetaCreator;
  #source?: MetaSource;

  constructor(data: StyleDefinitionMeta) {
    this.#data = data;
  }

  /**
   * Returns the license descriptor, defaulting to an empty object when the
   * style definition omits the field.
   */
  license(): MetaLicense {
    this.#license ??= new MetaLicense(this.#data.license ?? {});

    return this.#license;
  }

  /**
   * Returns the creator descriptor, defaulting to an empty object when the
   * style definition omits the field.
   */
  creator(): MetaCreator {
    this.#creator ??= new MetaCreator(this.#data.creator ?? {});

    return this.#creator;
  }

  /**
   * Returns the source descriptor, defaulting to an empty object when the
   * style definition omits the field.
   */
  source(): MetaSource {
    this.#source ??= new MetaSource(this.#data.source ?? {});

    return this.#source;
  }
}
