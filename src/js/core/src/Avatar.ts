import { Style } from './Style.js';
import { Options } from './Options.js';
import { Resolver } from './Resolver.js';
import { Renderer } from './Renderer.js';
import type { StyleOptions } from './StyleOptions.js';

type UnwrapStyle<D> = D extends Style<infer S> ? S : D;

interface AvatarJson<D = unknown> {
  readonly svg: string;
  readonly options: StyleOptions<UnwrapStyle<D>>;
}

// Emitted at most once per process: passing a raw definition is deprecated, but
// it was the documented usage for a long time, so a per-call warning would be
// noisy.
let definitionInputWarned = false;

/**
 * Top-level entry point for rendering an avatar from a style and options.
 *
 * Construction immediately resolves and renders the SVG; the various
 * accessor methods return different serializations of that result.
 */
export class Avatar<D = unknown> {
  #svg: string;
  #resolvedOptions: StyleOptions<UnwrapStyle<D>>;

  /**
   * Pass a {@link Style} instance. Passing a raw style definition is
   * deprecated and will be removed in v11; wrap it with `new Style(...)` and
   * reuse the instance across avatars.
   */
  constructor(styleInput: D, optionsInput?: StyleOptions<UnwrapStyle<D>>) {
    if (!(styleInput instanceof Style) && !definitionInputWarned) {
      definitionInputWarned = true;
      console.warn(
        '[DiceBear] Passing a style definition to `new Avatar()` is deprecated ' +
          'and will be removed in v11. Wrap it in a Style first: ' +
          '`new Avatar(new Style(definition), options)`.',
      );
    }

    const style =
      styleInput instanceof Style ? styleInput : new Style(styleInput);
    const options = new Options<UnwrapStyle<D>>(optionsInput);
    const resolver = new Resolver(style, options);

    this.#svg = new Renderer(style, resolver).render();
    this.#resolvedOptions = resolver.resolved();
  }

  /**
   * Returns the rendered SVG markup.
   */
  toString(): string {
    return this.#svg;
  }

  /**
   * Returns the avatar as a JSON-serializable object containing the SVG and
   * the fully resolved options used to render it.
   */
  toJSON(): AvatarJson<D> {
    return {
      svg: this.#svg,
      options: structuredClone(this.#resolvedOptions),
    };
  }

  /**
   * Returns the SVG encoded as a `data:image/svg+xml` URI.
   */
  toDataUri(): string {
    return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(this.#svg)}`;
  }
}
