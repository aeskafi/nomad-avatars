import { Style } from '@dicebear/core';
import { createRequire } from 'node:module';
import * as path from 'node:path';
import * as fs from 'node:fs';

const require = createRequire(import.meta.url);

/**
 * Loads every minified definition shipped by `@dicebear/styles`, wraps
 * each in a {@link Style}, and returns them keyed by style name.
 */
export function loadStyles(): Map<string, Style> {
  const definitionsDir = path.dirname(
    require.resolve('@dicebear/styles/initials.json'),
  );
  const styles = new Map<string, Style>();

  for (const file of fs.readdirSync(definitionsDir)) {
    if (!file.endsWith('.min.json')) {
      continue;
    }

    const name = file.replace('.min.json', '');
    const definition = JSON.parse(
      fs.readFileSync(path.join(definitionsDir, file), 'utf-8'),
    );

    styles.set(name, new Style(definition));
  }

  return styles;
}
