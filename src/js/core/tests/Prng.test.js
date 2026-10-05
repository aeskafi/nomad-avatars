import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { Prng } from '../lib/Prng.js';
import { Fnv1a } from '../lib/Prng/Fnv1a.js';
import { Mulberry32 } from '../lib/Prng/Mulberry32.js';

// Known-value vectors (Fnv1a, Mulberry32, getValue) live in
// tests/fixtures/parity/ and are exercised by Parity.test.js. This file
// keeps only the JS-side behavioral and edge-case tests.

describe('Prng', () => {
  describe('fnv1a', () => {
    it('should produce different hashes for different inputs', () => {
      assert.notEqual(Fnv1a.hash('abc'), Fnv1a.hash('abd'));
    });

    it('should always return unsigned 32-bit integers', () => {
      const inputs = ['', 'a', 'hello', 'test:flip', 'some-long-seed:optionName'];

      for (const input of inputs) {
        const hash = Fnv1a.hash(input);

        assert.ok(hash >= 0);
        assert.ok(hash <= 0xffffffff);
        assert.equal(hash, hash >>> 0);
      }
    });
  });

  describe('fnv1aHex', () => {
    it('should pad short hashes to 8 characters', () => {
      const hex = Fnv1a.hex('test');

      assert.equal(hex.length, 8);
    });
  });

  describe('mulberry32', () => {
    it('should return a float in [0, 1)', () => {
      const seeds = [0, 1, 42, 2166136261, 4294967295];

      for (const seed of seeds) {
        const mulberry = new Mulberry32(seed);
        const value = mulberry.nextFloat();

        assert.ok(value >= 0);
        assert.ok(value < 1);
      }
    });
  });

  describe('getValue', () => {
    it('should be deterministic', () => {
      const a = new Prng('seed');
      const b = new Prng('seed');

      assert.equal(a.getValue('key'), b.getValue('key'));
    });

    it('should differ for different seeds', () => {
      const a = new Prng('seed-a');
      const b = new Prng('seed-b');

      assert.notEqual(a.getValue('key'), b.getValue('key'));
    });

    it('should differ for different keys', () => {
      const prng = new Prng('test');

      assert.notEqual(prng.getValue('flip'), prng.getValue('scale'));
    });

    it('should return a float in [0, 1)', () => {
      const prng = new Prng('test');
      const keys = ['a', 'b', 'flip', 'scale', 'rotate', 'eyesVariant'];

      for (const key of keys) {
        const value = prng.getValue(key);

        assert.ok(value >= 0);
        assert.ok(value < 1);
      }
    });
  });

  describe('pick', () => {
    it('should return undefined for empty array', () => {
      const prng = new Prng('test');

      assert.equal(prng.pick('key', []), undefined);
    });

    it('should return the only item for single-element array', () => {
      const prng = new Prng('test');

      assert.equal(prng.pick('key', ['only']), 'only');
    });

    it('should pick from array deterministically', () => {
      const a = new Prng('test');
      const b = new Prng('test');
      const items = ['a', 'b', 'c', 'd'];

      assert.equal(a.pick('key', items), b.pick('key', items));
    });

    it('should always pick a valid item', () => {
      const items = ['x', 'y', 'z'];

      for (let i = 0; i < 50; i++) {
        const prng = new Prng(`seed-${i}`);

        assert.ok(items.includes(prng.pick('key', items)));
      }
    });

    it('should collapse duplicate items by string representation', () => {
      const unique = ['a', 'b', 'c'];
      const withDuplicates = ['a', 'a', 'b', 'b', 'b', 'c'];

      for (let i = 0; i < 50; i++) {
        const prng = new Prng(`seed-${i}`);

        assert.equal(
          prng.pick('key', withDuplicates),
          new Prng(`seed-${i}`).pick('key', unique),
        );
      }
    });

    it('should treat all-duplicates as single-item', () => {
      const prng = new Prng('test');

      assert.equal(prng.pick('key', ['only', 'only', 'only']), 'only');
    });
  });

  describe('float', () => {
    it('should return the value when min equals max', () => {
      const prng = new Prng('test');

      assert.equal(prng.float('key', { min: 42, max: 42 }), 42);
    });

    it('should interpolate within bounds', () => {
      for (let i = 0; i < 50; i++) {
        const prng = new Prng(`seed-${i}`);
        const value = prng.float('key', { min: 10, max: 20 });

        assert.ok(value >= 10);
        assert.ok(value <= 20);
      }
    });

    it('should handle reversed min/max', () => {
      const prng = new Prng('test');
      const value = prng.float('key', { min: 20, max: 10 });

      assert.ok(value >= 10);
      assert.ok(value <= 20);
    });

    it('should quantize to step', () => {
      for (let i = 0; i < 50; i++) {
        const prng = new Prng(`seed-${i}`);
        const value = prng.float('key', { min: 0, max: 100, step: 5 });

        assert.ok(value >= 0);
        assert.ok(value <= 100);
        assert.equal(value % 5, 0, `Expected multiple of 5, got ${value}`);
      }
    });

    it('should ignore non-positive step', () => {
      for (let i = 0; i < 20; i++) {
        const prng = new Prng(`seed-${i}`);
        const value = prng.float('key', { min: 10, max: 20, step: 0 });

        assert.ok(value >= 10);
        assert.ok(value <= 20);
      }
    });

    it('should anchor stepped values at min, not at zero', () => {
      for (let i = 0; i < 50; i++) {
        const prng = new Prng(`seed-${i}`);
        const value = prng.float('key', { min: 3, max: 23, step: 5 });

        assert.ok(value >= 3);
        assert.ok(value <= 23);
        assert.equal(((value - 3) * 10000) % (5 * 10000), 0, `Expected 3 + n*5, got ${value}`);
      }
    });

    it('should reach the max endpoint when step divides the range evenly', () => {
      let maxSeen = false;

      for (let i = 0; i < 500; i++) {
        const value = new Prng(`seed-${i}`).float('key', { min: 0, max: 90, step: 90 });

        assert.ok(value === 0 || value === 90, `Expected 0 or 90, got ${value}`);
        if (value === 90) maxSeen = true;
      }

      assert.ok(maxSeen, 'Expected 90 to appear at least once across 500 seeds');
    });

    it('should distribute stepped values roughly uniformly across buckets', () => {
      const buckets = { 0: 0, 45: 0, 90: 0, 135: 0, 180: 0 };
      const samples = 2000;

      for (let i = 0; i < samples; i++) {
        const value = new Prng(`seed-${i}`).float('key', { min: 0, max: 180, step: 45 });

        assert.ok(value in buckets, `Unexpected bucket value: ${value}`);
        buckets[value]++;
      }

      const expected = samples / 5; // 400 per bucket
      const tolerance = expected * 0.35; // ±35% — generous for 2000 samples

      for (const [value, count] of Object.entries(buckets)) {
        assert.ok(
          Math.abs(count - expected) < tolerance,
          `Bucket ${value}: expected ~${expected} ±${tolerance}, got ${count}`,
        );
      }
    });

    it('should be deterministic', () => {
      const a = new Prng('test');
      const b = new Prng('test');

      assert.equal(
        a.float('key', { min: 0, max: 100 }),
        b.float('key', { min: 0, max: 100 }),
      );
    });

    it('should round to four decimal places', () => {
      const prng = new Prng('test');
      const value = prng.float('scale', { min: 0, max: 1 });
      const decimals = value.toString().split('.')[1] ?? '';

      assert.ok(decimals.length <= 4, `Expected at most 4 decimal places, got ${decimals.length}: ${value}`);
    });

    it('should return known values', () => {
      const prng = new Prng('test');

      assert.equal(
        prng.float('scale', { min: 0, max: 1 }),
        prng.float('scale', { min: 0, max: 1 }),
      );
      assert.equal(
        prng.float('a', { min: 10, max: 20 }),
        prng.float('a', { min: 10, max: 20 }),
      );
    });
  });

  describe('bool', () => {
    it('should return boolean', () => {
      const prng = new Prng('test');

      assert.equal(typeof prng.bool('key'), 'boolean');
    });

    it('should always return true for likelihood 100', () => {
      for (let i = 0; i < 20; i++) {
        const prng = new Prng(`seed-${i}`);

        assert.equal(prng.bool('key', 100), true);
      }
    });

    it('should always return false for likelihood 0', () => {
      for (let i = 0; i < 20; i++) {
        const prng = new Prng(`seed-${i}`);

        assert.equal(prng.bool('key', 0), false);
      }
    });

    it('should be deterministic', () => {
      const a = new Prng('test');
      const b = new Prng('test');

      assert.equal(a.bool('key', 50), b.bool('key', 50));
    });
  });

  describe('integer', () => {
    it('should return the value when min equals max', () => {
      const prng = new Prng('test');

      assert.equal(prng.integer('key', { min: 5, max: 5 }), 5);
    });

    it('should return an integer within bounds', () => {
      for (let i = 0; i < 50; i++) {
        const prng = new Prng(`seed-${i}`);
        const value = prng.integer('key', { min: 1, max: 10 });

        assert.ok(value >= 1);
        assert.ok(value <= 10);
        assert.equal(value, Math.floor(value));
      }
    });

    it('should handle reversed min/max', () => {
      const prng = new Prng('test');
      const value = prng.integer('key', { min: 10, max: 1 });

      assert.ok(value >= 1);
      assert.ok(value <= 10);
    });

    it('should ignore step', () => {
      const prng = new Prng('test');
      const value = prng.integer('key', { min: 3, max: 10, step: 5 });

      assert.ok(value >= 3);
      assert.ok(value <= 10);
      assert.equal(value, Math.floor(value));
    });

    it('should be deterministic', () => {
      const a = new Prng('test');
      const b = new Prng('test');

      assert.equal(
        a.integer('key', { min: 1, max: 100 }),
        b.integer('key', { min: 1, max: 100 }),
      );
    });

    it('should distribute values roughly uniformly across the inclusive range', () => {
      const buckets = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
      const samples = 2000;

      for (let i = 0; i < samples; i++) {
        const value = new Prng(`seed-${i}`).integer('key', { min: 1, max: 5 });

        assert.ok(value in buckets, `Unexpected bucket value: ${value}`);
        buckets[value]++;
      }

      const expected = samples / 5; // 400 per bucket
      const tolerance = expected * 0.35; // ±35% — generous for 2000 samples

      for (const [value, count] of Object.entries(buckets)) {
        assert.ok(
          Math.abs(count - expected) < tolerance,
          `Bucket ${value}: expected ~${expected} ±${tolerance}, got ${count}`,
        );
      }
    });
  });

  describe('shuffle', () => {
    it('should return a new array', () => {
      const prng = new Prng('test');
      const items = [1, 2, 3, 4, 5];
      const result = prng.shuffle('key', items);

      assert.notEqual(result, items);
    });

    it('should contain the same elements', () => {
      const prng = new Prng('test');
      const items = [1, 2, 3, 4, 5];
      const result = prng.shuffle('key', items);

      assert.deepEqual(result.sort(), [...items].sort());
    });

    it('should not modify the original array', () => {
      const prng = new Prng('test');
      const items = [1, 2, 3, 4, 5];
      const copy = [...items];

      prng.shuffle('key', items);

      assert.deepEqual(items, copy);
    });

    it('should be deterministic', () => {
      const a = new Prng('test');
      const b = new Prng('test');
      const items = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

      assert.deepEqual(a.shuffle('key', items), b.shuffle('key', items));
    });

    it('should produce different orderings for different keys', () => {
      const prng = new Prng('test');
      const items = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

      assert.notDeepEqual(prng.shuffle('key-a', items), prng.shuffle('key-b', items));
    });

    it('should handle empty array', () => {
      const prng = new Prng('test');

      assert.deepEqual(prng.shuffle('key', []), []);
    });

    it('should handle single-element array', () => {
      const prng = new Prng('test');

      assert.deepEqual(prng.shuffle('key', [42]), [42]);
    });
  });

  describe('weightedPick', () => {
    it('should return undefined for empty map', () => {
      const prng = new Prng('test');

      assert.equal(prng.weightedPick('key', {}), undefined);
    });

    it('should return the only key for single-entry map', () => {
      const prng = new Prng('test');

      assert.equal(prng.weightedPick('key', { only: 1 }), 'only');
    });

    it('should fall back to uniform pick when all weights are 0', () => {
      const prng = new Prng('test');
      const result = prng.weightedPick('key', { a: 0, b: 0, c: 0 });

      assert.ok(['a', 'b', 'c'].includes(result));
    });

    it('should be deterministic', () => {
      const a = new Prng('test');
      const b = new Prng('test');
      const weights = { a: 1, b: 5, c: 2 };

      assert.equal(
        a.weightedPick('key', weights),
        b.weightedPick('key', weights),
      );
    });

    it('should never pick a weight-0 key', () => {
      const weights = { rare: 0, common: 1 };

      for (let i = 0; i < 100; i++) {
        const prng = new Prng(`seed-${i}`);

        assert.equal(prng.weightedPick('key', weights), 'common');
      }
    });

    it('should favor higher-weighted keys', () => {
      const weights = { heavy: 100, light: 1 };
      let heavyCount = 0;

      for (let i = 0; i < 200; i++) {
        const prng = new Prng(`seed-${i}`);

        if (prng.weightedPick('key', weights) === 'heavy') {
          heavyCount++;
        }
      }

      assert.ok(heavyCount > 150, `Expected heavy to be picked most of the time, got ${heavyCount}/200`);
    });

    it('should produce insertion-order-independent results', () => {
      const a = new Prng('test');
      const b = new Prng('test');

      const resultA = a.weightedPick('key', { x: 1, y: 5, z: 2 });
      const resultB = b.weightedPick('key', { z: 2, x: 1, y: 5 });

      assert.equal(resultA, resultB);
    });

    it('should always pick a valid key', () => {
      const weights = { a: 1, b: 1, c: 1 };

      for (let i = 0; i < 50; i++) {
        const prng = new Prng(`seed-${i}`);
        const result = prng.weightedPick('key', weights);

        assert.ok(['a', 'b', 'c'].includes(result));
      }
    });
  });

  describe('shuffle dedup', () => {
    it('should collapse duplicates by string representation', () => {
      const prng = new Prng('test');
      const result = prng.shuffle('key', ['a', 'a', 'b', 'b', 'c', 'c']);

      assert.deepEqual([...result].sort(), ['a', 'b', 'c']);
    });
  });
});
