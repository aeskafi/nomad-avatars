import { Fnv1a } from './Prng/Fnv1a.js';
import { Mulberry32 } from './Prng/Mulberry32.js';
import type { Range } from './StyleDefinition.js';

/**
 * Key-based pseudorandom number generator.
 *
 * Each method takes a key that, combined with the seed, produces a
 * deterministic value. The same seed + key always yields the same result,
 * regardless of call order.
 */
export class Prng {
  #seed: string;

  constructor(seed: string) {
    this.#seed = seed;
  }

  /**
   * Picks a single item from `items` deterministically. Returns `undefined`
   * for an empty list. Duplicate values (by string representation) are
   * collapsed before picking so that input order and duplication do not
   * affect the result.
   */
  pick<T>(key: string, items: readonly T[]): T | undefined {
    if (items.length === 0) {
      return undefined;
    }

    if (items.length === 1) {
      return items[0];
    }

    const unique = this.#uniqueByCodePoint(items);

    if (unique.length === 1) {
      return unique[0];
    }

    const sorted = unique.sort(this.#compareByCodePoint);
    const index = Math.floor(this.getValue(key) * sorted.length);

    return sorted[index];
  }

  /**
   * Picks a key from `weights` proportional to its weight. When all weights
   * are zero, falls back to an unweighted {@link pick}. Returns `undefined`
   * for an empty map.
   */
  weightedPick(
    key: string,
    weights: Readonly<Record<string, number>>,
  ): string | undefined {
    const keys = Object.keys(weights);

    if (keys.length === 0) {
      return undefined;
    }

    if (keys.length === 1) {
      return keys[0];
    }

    const sorted = keys.sort(this.#compareByCodePoint);
    const totalWeight = sorted.reduce((sum, k) => sum + weights[k], 0);

    if (totalWeight === 0) {
      return this.pick(key, sorted);
    }

    const threshold = this.getValue(key) * totalWeight;

    let cumulative = 0;

    for (const k of sorted) {
      cumulative += weights[k];

      if (threshold < cumulative) {
        return k;
      }
    }

    return sorted[sorted.length - 1];
  }

  /**
   * Returns `true` with the given probability (0–100, default 50).
   */
  bool(key: string, likelihood: number = 50): boolean {
    return this.getValue(key) * 100 < likelihood;
  }

  /**
   * Returns a deterministic float in `range`, rounded to four decimal places.
   * With `range.step > 0`, the result is drawn uniformly from
   * `{ min + i*step | 0 ≤ i ≤ floor((max - min) / step) }`, so both endpoints
   * of an evenly-divisible range are equally likely. Non-positive or absent
   * step means continuous. `min`/`max` are sorted internally, so a reversed
   * pair is tolerated.
   */
  float(key: string, range: Range): number {
    const min = Math.min(range.min, range.max);
    const max = Math.max(range.min, range.max);
    const step = range.step ?? 0;
    let value: number;

    if (step > 0) {
      const buckets = Math.floor((max - min) / step) + 1;
      const i = Math.floor(this.getValue(key) * buckets);
      value = min + i * step;
    } else {
      value = min + this.getValue(key) * (max - min);
    }

    return Math.round(value * 10000) / 10000;
  }

  /**
   * Returns a deterministic integer in `range`. `min`/`max` are sorted
   * internally, so a reversed pair is tolerated. `range.step` is accepted
   * for symmetry with {@link float} but ignored — integers already step by 1.
   */
  integer(key: string, range: Range): number {
    const min = Math.min(range.min, range.max);
    const max = Math.max(range.min, range.max);

    return Math.floor(this.getValue(key) * (max - min + 1)) + min;
  }

  /**
   * Fisher-Yates shuffle with chained Mulberry32 state. Duplicate values
   * (by string representation) are collapsed before shuffling, so a
   * caller's slice off the front cannot accidentally produce a repeated
   * value.
   */
  shuffle<T>(key: string, items: readonly T[]): T[] {
    if (items.length <= 1) {
      return [...items];
    }

    const result = this.#uniqueByCodePoint(items).sort(
      this.#compareByCodePoint,
    );
    const prng = new Mulberry32(Fnv1a.hash(this.#seed + ':' + key));

    for (let i = result.length - 1; i > 0; i--) {
      const j = Math.floor(prng.nextFloat() * (i + 1));
      const temp = result[i];

      result[i] = result[j];
      result[j] = temp;
    }

    return result;
  }

  /**
   * Returns a single float in `[0, 1)` derived from `seed:key`. The same
   * seed/key pair always produces the same value.
   */
  getValue(key: string): number {
    return new Mulberry32(Fnv1a.hash(this.#seed + ':' + key)).nextFloat();
  }

  /**
   * Deduplicates by string representation, keeping the first occurrence.
   * Mirrors the cross-language sort key used by {@link #compareByCodePoint}
   * so that every port collapses the same set of inputs. `keyFn` lets
   * callers (e.g. {@link weightedPick}) extract the sort key from a
   * compound element.
   */
  #uniqueByCodePoint<T>(
    items: readonly T[],
    keyFn: (item: T) => string = String,
  ): T[] {
    const seen = new Set<string>();
    const result: T[] = [];

    for (const item of items) {
      const repr = keyFn(item);

      if (!seen.has(repr)) {
        seen.add(repr);
        result.push(item);
      }
    }

    return result;
  }

  /**
   * Cross-language deterministic sort: compare by UTF-16 code units of
   * the string representation. Every language can reproduce this by
   * converting values to strings and comparing code unit by code unit.
   */
  #compareByCodePoint<T>(a: T, b: T): number {
    const sa = String(a);
    const sb = String(b);

    if (sa < sb) {
      return -1;
    }

    if (sa > sb) {
      return 1;
    }

    return 0;
  }
}
