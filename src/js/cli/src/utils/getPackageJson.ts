import fs from 'fs-extra';
import type { Package } from 'update-notifier';

/**
 * Reads the CLI's own `package.json` from disk. Used by `update-notifier` to
 * compare the running version against the latest published one.
 */
export function getPackageJson(): Promise<Package> {
  const packageJson = new URL('../../package.json', import.meta.url).pathname;

  return fs.readJson(packageJson);
}
