import type {
  Range,
  StyleDefinitionComponentTranslate,
} from '../StyleDefinition.js';

/**
 * Read-only view over a component's `translate` block, providing the X and Y
 * offset ranges.
 */
export class ComponentTranslate {
  #data: StyleDefinitionComponentTranslate;

  constructor(data: StyleDefinitionComponentTranslate) {
    this.#data = data;
  }

  x(): Range | undefined {
    return this.#data.x;
  }

  y(): Range | undefined {
    return this.#data.y;
  }
}
