import type { StyleDefinitionCanvas } from '../StyleDefinition.js';
import { Element } from './Element.js';

/**
 * Read-only view over a style definition's `canvas` block, exposing the
 * drawing area dimensions and the top-level element list.
 */
export class Canvas {
  #data: StyleDefinitionCanvas;
  #elements?: readonly Element[];

  constructor(data: StyleDefinitionCanvas) {
    this.#data = data;
  }

  /**
   * Returns the canvas width — the `width` value of the SVG `viewBox`.
   */
  width(): number {
    return this.#data.width;
  }

  /**
   * Returns the canvas height — the `height` value of the SVG `viewBox`.
   */
  height(): number {
    return this.#data.height;
  }

  /**
   * Returns the top-level elements rendered onto the canvas, lazily wrapped
   * as {@link Element} instances on first access.
   */
  elements(): readonly Element[] {
    this.#elements ??= this.#data.elements.map((el) => new Element(el));

    return this.#elements;
  }
}
