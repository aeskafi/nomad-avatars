import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { resolveDefinitionPath } from '../lib/utils/resolveDefinitionPath.js';

describe('resolveDefinitionPath', () => {
  it('returns the path when it is the first argument', () => {
    assert.equal(resolveDefinitionPath(['my-style.json']), 'my-style.json');
  });

  it('returns the path when followed by an output path and flags', () => {
    assert.equal(
      resolveDefinitionPath(['my-style.json', 'out', '--count', '2']),
      'my-style.json',
    );
  });

  it('ignores flags and their values that precede the path', () => {
    assert.equal(
      resolveDefinitionPath(['--count', '2', '--seed', 'abc', 'my-style.json']),
      'my-style.json',
    );
  });

  it('does not mistake a flag value for the path', () => {
    // Regression: `--count 2 file` used to resolve to "2" (the value of
    // --count) instead of the definition file.
    assert.notEqual(resolveDefinitionPath(['--count', '2', 'file.json']), '2');
  });

  it('ignores a boolean flag that precedes the path', () => {
    // Regression: a no-config parser treats `--json` as a value flag and
    // swallows the path, so `--json my-style.json` resolved to the wrong
    // positional (or undefined) instead of the definition file.
    assert.equal(
      resolveDefinitionPath(['--json', 'my-style.json']),
      'my-style.json',
    );
    assert.equal(
      resolveDefinitionPath(['--exif', 'my-style.json', 'out']),
      'my-style.json',
    );
  });

  it('returns undefined for --version', () => {
    // Regression: `--version` used to be treated as a file path, causing
    // `ENOENT ... open '.../--version'`.
    assert.equal(resolveDefinitionPath(['--version']), undefined);
  });

  it('returns undefined for --help', () => {
    assert.equal(resolveDefinitionPath(['--help']), undefined);
  });

  it('returns undefined when no arguments are given', () => {
    assert.equal(resolveDefinitionPath([]), undefined);
  });

  it('returns undefined when only flags are given', () => {
    assert.equal(
      resolveDefinitionPath(['--format', 'png', '--size', '128']),
      undefined,
    );
  });

  it('always returns a string for a numeric-looking path', () => {
    const result = resolveDefinitionPath(['123.json']);
    assert.equal(typeof result, 'string');
    assert.equal(result, '123.json');
  });

  it('coerces a bare numeric positional to a string', () => {
    const result = resolveDefinitionPath(['42']);
    assert.equal(typeof result, 'string');
    assert.equal(result, '42');
  });
});
