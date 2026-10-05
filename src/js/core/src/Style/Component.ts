import type {
  Range,
  StyleDefinitionComponent,
  StyleDefinitionComponentBase,
} from '../StyleDefinition.js';
import { ComponentTranslate } from './ComponentTranslate.js';
import { ComponentVariant } from './ComponentVariant.js';

/**
 * Read-only view over an entry in a style definition's `components` block.
 *
 * An entry is either a base component with its own dimensions and variants
 * or an alias declared via `extends`. Aliases are pure references — they
 * inherit dimensions, variants, and all transforms from the source.
 */
export class Component {
  #data: StyleDefinitionComponent;
  #name: string;
  #source?: Component;
  #translate?: ComponentTranslate;
  #variants?: ReadonlyMap<string, ComponentVariant>;

  constructor(
    name: string,
    data: StyleDefinitionComponent,
    source?: Component,
  ) {
    this.#data = data;
    this.#name = name;
    this.#source = source;
  }

  /**
   * Returns the entry's own name as declared in the style definition. For
   * aliases this is the alias key, not the source component's name (use
   * {@link sourceName} for the canonical user-option key prefix).
   */
  name(): string {
    return this.#name;
  }

  /**
   * Returns the source component name when this entry is an alias, or
   * `undefined` for a base component.
   */
  extendsName(): string | undefined {
    return 'extends' in this.#data ? this.#data.extends : undefined;
  }

  /**
   * Returns the canonical user-option key prefix: the source component's
   * name when this entry is an alias, otherwise the entry's own name.
   */
  sourceName(): string {
    return this.extendsName() ?? this.#name;
  }

  /**
   * Returns the component's intrinsic width in canvas coordinates. For
   * aliases the source component's width is returned.
   */
  width(): number {
    return this.#source ? this.#source.width() : this.#asBase().width;
  }

  /**
   * Returns the component's intrinsic height in canvas coordinates. For
   * aliases the source component's height is returned.
   */
  height(): number {
    return this.#source ? this.#source.height() : this.#asBase().height;
  }

  /**
   * Returns the probability (0–100) that this component is rendered.
   * Aliases delegate to the source; defaults to 100 (always visible).
   */
  probability(): number {
    if (this.#source) {
      return this.#source.probability();
    }

    return this.#asBase().probability ?? 100;
  }

  /**
   * Returns the rotation range, or `undefined` when unset.
   * Aliases delegate to the source.
   */
  rotate(): Range | undefined {
    return this.#source ? this.#source.rotate() : this.#asBase().rotate;
  }

  /**
   * Returns the scale range, or `undefined` when unset.
   * Aliases delegate to the source.
   */
  scale(): Range | undefined {
    return this.#source ? this.#source.scale() : this.#asBase().scale;
  }

  /**
   * Returns the translate descriptor. Aliases delegate to the source.
   */
  translate(): ComponentTranslate {
    if (this.#source) {
      return this.#source.translate();
    }

    this.#translate ??= new ComponentTranslate(this.#asBase().translate ?? {});

    return this.#translate;
  }

  /**
   * Returns a name → {@link ComponentVariant} map for all defined variants.
   * Aliases delegate to the source component's variants.
   */
  variants(): ReadonlyMap<string, ComponentVariant> {
    if (this.#source) {
      return this.#source.variants();
    }

    this.#variants ??= new Map(
      Object.entries(this.#asBase().variants).map(([name, data]) => [
        name,
        new ComponentVariant(data),
      ]),
    );

    return this.#variants;
  }

  #asBase(): StyleDefinitionComponentBase {
    return this.#data as StyleDefinitionComponentBase;
  }
}
