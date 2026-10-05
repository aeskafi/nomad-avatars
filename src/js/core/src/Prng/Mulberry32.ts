const UINT32_MAX_PLUS_1 = 2 ** 32;

/**
 * Mulberry32 PRNG — stateful, matching the C reference by Tommy Ettinger.
 *
 * C original:
 * ```c
 * uint32_t z = (x += 0x6D2B79F5UL);
 * z = (z ^ (z >> 15)) * (z | 1UL);
 * z ^= z + (z ^ (z >> 7)) * (z | 61UL);
 * return z ^ (z >> 14);
 * ```
 *
 * @see https://gist.github.com/tommyettinger/46a874533244883189143505d203312c
 */
export class Mulberry32 {
  #state: number;

  constructor(seed: number) {
    this.#state = seed;
  }

  /**
   * Advances the state and returns the next unsigned 32-bit value.
   */
  next(): number {
    const z = (this.#state = (this.#state + 0x6d2b79f5) | 0);

    let t = Math.imul(z ^ (z >>> 15), z | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);

    return (t ^ (t >>> 14)) >>> 0;
  }

  /**
   * Advances the state and returns the next value in `[0, 1)`.
   */
  nextFloat(): number {
    return this.next() / UINT32_MAX_PLUS_1;
  }

  /**
   * Returns the current internal state, useful for snapshotting.
   */
  state(): number {
    return this.#state;
  }
}
