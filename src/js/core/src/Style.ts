import { StyleValidator } from './Validator/StyleValidator.js';
import { StyleValidationError } from './Error/StyleValidationError.js';
import type {
  StyleDefinition,
  StyleDefinitionAttributes,
  StyleDefinitionComponent,
} from './StyleDefinition.js';
import { Meta } from './Style/Meta.js';
import { Canvas } from './Style/Canvas.js';
import { Component } from './Style/Component.js';
import { Color } from './Style/Color.js';

export type { StyleDefinition } from './StyleDefinition.js';

/**
 * Validated, lazily-decomposed wrapper around a style definition. Construction
 * runs the JSON Schema validator and stores a deep clone of the input so that
 * later mutation of the source object cannot leak into the rendered avatar.
 */
export class Style<D = unknown> {
  #data: StyleDefinition;
  #meta?: Meta;
  #canvas?: Canvas;
  #components?: ReadonlyMap<string, Component>;
  #colors?: ReadonlyMap<string, Color>;

  constructor(data: D) {
    StyleValidator.validate(data);

    this.#data = structuredClone(data) as StyleDefinition;

    this.#validateAliases();
  }

  /**
   * Returns the definition's `$id`, or `undefined` when not set.
   */
  id(): string | undefined {
    return this.#data.$id;
  }

  /**
   * Returns the definition's `$schema` URI, or `undefined` when not set.
   */
  schema(): string | undefined {
    return this.#data.$schema;
  }

  /**
   * Returns the definition's `$comment`, or `undefined` when not set.
   */
  comment(): string | undefined {
    return this.#data.$comment;
  }

  /**
   * Returns the {@link Meta} view, lazily constructed on first access.
   */
  meta(): Meta {
    this.#meta ??= new Meta(this.#data.meta ?? {});

    return this.#meta;
  }

  /**
   * Returns a deep clone of the root SVG attributes from the definition,
   * defaulting to an empty object.
   */
  attributes(): StyleDefinitionAttributes {
    return structuredClone(this.#data.attributes ?? {});
  }

  /**
   * Returns a deep clone of the underlying definition.
   */
  definition(): StyleDefinition {
    return structuredClone(this.#data);
  }

  /**
   * Returns the {@link Canvas} view, lazily constructed on first access.
   */
  canvas(): Canvas {
    this.#canvas ??= new Canvas(this.#data.canvas);

    return this.#canvas;
  }

  /**
   * Returns a name → {@link Component} map for all defined components, built
   * lazily on first access.
   */
  components(): ReadonlyMap<string, Component> {
    if (this.#components) {
      return this.#components;
    }

    const entries = Object.entries(this.#data.components ?? {});
    const map = new Map<string, Component>();

    for (const [name, data] of entries) {
      if (!Style.#isAlias(data)) {
        map.set(name, new Component(name, data));
      }
    }

    for (const [name, data] of entries) {
      if (Style.#isAlias(data)) {
        map.set(name, new Component(name, data, map.get(data.extends)));
      }
    }

    this.#components = map;

    return this.#components;
  }

  /**
   * Verifies that every component declared via `extends` references an
   * existing, non-alias component in the same `components` map. The schema
   * itself cannot enforce cross-references between sibling keys.
   */
  #validateAliases(): void {
    const components = this.#data.components;

    if (!components) {
      return;
    }

    const errors: { instancePath: string; message: string }[] = [];

    for (const [name, data] of Object.entries(components)) {
      if (!Style.#isAlias(data)) {
        continue;
      }

      const target = data.extends;
      const targetData = components[target];

      if (!targetData) {
        errors.push({
          instancePath: `/components/${name}/extends`,
          message: `references unknown component "${target}"`,
        });

        continue;
      }

      if (Style.#isAlias(targetData)) {
        errors.push({
          instancePath: `/components/${name}/extends`,
          message: `references alias "${target}" — alias chains are not allowed`,
        });
      }
    }

    if (errors.length > 0) {
      throw new StyleValidationError(errors);
    }
  }

  static #isAlias(
    data: StyleDefinitionComponent,
  ): data is Extract<StyleDefinitionComponent, { extends: string }> {
    return 'extends' in data;
  }

  /**
   * Returns a name → {@link Color} map for all defined colors, built lazily
   * on first access.
   */
  colors(): ReadonlyMap<string, Color> {
    this.#colors ??= new Map(
      Object.entries(this.#data.colors ?? {}).map(([name, data]) => [
        name,
        new Color(data),
      ]),
    );

    return this.#colors;
  }
}
