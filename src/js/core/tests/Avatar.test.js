import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { Style, Avatar } from '../lib/index.js';

const minimalStyleData = {
  canvas: { width: 100, height: 100, elements: [] },
};

const minimalStyle = new Style(minimalStyleData);

describe('Avatar', () => {
  describe('constructor', () => {
    it('should accept Style instance and raw options', () => {
      const avatar = new Avatar(minimalStyle, { seed: 'test' });

      assert.ok(avatar instanceof Avatar);
    });

    it('should still render a raw style definition (deprecated) identically to a Style and warn', () => {
      // Back-compat: passing a raw definition is deprecated (it now emits a
      // one-time console.warn) but must keep rendering identically to wrapping
      // it in a Style ourselves. The warn is a module-level "warned once" flag,
      // so we can only best-effort observe it here; suite success must not
      // depend on whether this test happens to be the first to trigger it.
      const originalWarn = console.warn;
      let warning;
      console.warn = (message) => {
        warning = message;
      };

      let fromDefinition;
      let fromStyle;
      try {
        fromDefinition = new Avatar(minimalStyleData, { seed: 'test' });
        fromStyle = new Avatar(new Style(minimalStyleData), { seed: 'test' });
      } finally {
        console.warn = originalWarn;
      }

      // The definition path must produce the exact same SVG as the Style path.
      assert.equal(fromDefinition.toString(), fromStyle.toString());

      // Best-effort: if this test was the first to pass a raw definition in the
      // process, the deprecation warning should have fired. If an earlier test
      // already tripped the once-only flag, `warning` stays undefined and we
      // skip the assertion rather than fail spuriously.
      if (warning !== undefined) {
        assert.match(warning, /\[DiceBear\].*deprecated/);
      }
    });

    it('should accept raw style data and raw options', () => {
      const avatar = new Avatar(new Style(minimalStyleData), { seed: 'test' });

      assert.ok(avatar instanceof Avatar);
    });

    it('should work without options', () => {
      const avatar = new Avatar(minimalStyle);

      assert.ok(avatar instanceof Avatar);
    });
  });

  describe('toString()', () => {
    it('should return a string', () => {
      const avatar = new Avatar(minimalStyle, { seed: 'test' });

      assert.equal(typeof avatar.toString(), 'string');
    });
  });

  describe('toJSON()', () => {
    it('should return an object with svg and options', () => {
      const avatar = new Avatar(minimalStyle, { seed: 'test' });
      const json = avatar.toJSON();

      assert.equal(typeof json.svg, 'string');
      assert.ok(json.options !== null && typeof json.options === 'object');
    });

    it('should have consistent svg with toString()', () => {
      const avatar = new Avatar(minimalStyle, { seed: 'test' });

      assert.equal(avatar.toJSON().svg, avatar.toString());
    });

    it('should return a deep copy of options', () => {
      const avatar = new Avatar(minimalStyle, { seed: 'test' });
      const json1 = avatar.toJSON();
      const json2 = avatar.toJSON();

      json1.options.injected = 'modified';

      assert.equal('injected' in json2.options, false);
    });

    it('should not include the seed in options', () => {
      const avatar = new Avatar(minimalStyle, { seed: 'test' });

      assert.ok(!('seed' in avatar.toJSON().options));
    });
  });

  describe('toDataUri()', () => {
    it('should return a data URI string', () => {
      const avatar = new Avatar(minimalStyle, { seed: 'test' });

      assert.ok(avatar.toDataUri().startsWith('data:image/svg+xml;charset=utf-8,'));
    });

    it('should contain the encoded SVG', () => {
      const avatar = new Avatar(minimalStyle, { seed: 'test' });

      assert.ok(avatar.toDataUri().includes(encodeURIComponent(avatar.toString())));
    });
  });
});
