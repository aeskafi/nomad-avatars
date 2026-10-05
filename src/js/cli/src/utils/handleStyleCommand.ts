import { Style, Avatar } from '@dicebear/core';
import { toJpeg, toPng, toWebp, toAvif } from '@dicebear/converter';
import type { ArgumentsCamelCase } from 'yargs';
import cliProgress from 'cli-progress';
import PQueue from 'p-queue';
import os from 'node:os';
import * as path from 'node:path';
import fs from 'fs-extra';
import { exiftool } from 'exiftool-vendored';

import { extractStyleOptions } from './extractStyleOptions.js';
import { outputStyleLicenseBanner } from './outputStyleLicenseBanner.js';
import { createRandomSeed } from './createRandomSeed.js';
import { writeFile } from './writeFile.js';

/**
 * Handles a single style subcommand: renders the requested number of avatars
 * in the chosen format, writes them to the output directory, and reports
 * progress on a CLI progress bar.
 */
export async function handleStyleCommand(
  argv: ArgumentsCamelCase<Record<string, unknown>>,
  name: string,
  style: Style,
) {
  const bar = new cliProgress.SingleBar({}, cliProgress.Presets.shades_classic);

  const format = (argv.format as string) ?? 'svg';
  const count = (argv.count as number) ?? 1;
  const includeExif = (argv.exif as boolean) ?? false;
  const json = (argv.json as boolean) ?? false;

  outputStyleLicenseBanner(name, style);

  bar.start(count, 0);

  const queue = new PQueue({ concurrency: os.cpus().length || 1 });
  const errors: Error[] = [];

  queue.on('next', () => {
    bar.update(count - queue.size - queue.pending);
  });

  const outputPath = path.resolve(process.cwd(), argv.outputPath as string);

  await fs.ensureDir(outputPath);

  for (let i = 0; i < count; i++) {
    queue.add(async () => {
      try {
        const fileName = path.resolve(
          process.cwd(),
          outputPath,
          `${name}-${i}.${format}`,
        );

        const seed =
          count <= 1
            ? ((argv.seed as string) ?? createRandomSeed())
            : createRandomSeed();

        const avatar = new Avatar(style, {
          ...extractStyleOptions(argv, style),
          seed,
        });

        switch (format) {
          case 'svg':
            await writeFile(fileName, avatar.toString());
            break;

          case 'png':
            await writeFile(
              fileName,
              await toPng(avatar.toString(), {
                includeExif,
                size: argv.size as number,
              }).toArrayBuffer(),
            );
            break;

          case 'jpg':
          case 'jpeg':
            await writeFile(
              fileName,
              await toJpeg(avatar.toString(), {
                includeExif,
                size: argv.size as number,
              }).toArrayBuffer(),
            );
            break;

          case 'webp':
            await writeFile(
              fileName,
              await toWebp(avatar.toString(), {
                includeExif,
                size: argv.size as number,
              }).toArrayBuffer(),
            );
            break;

          case 'avif':
            await writeFile(
              fileName,
              await toAvif(avatar.toString(), {
                includeExif,
                size: argv.size as number,
              }).toArrayBuffer(),
            );
            break;

          case 'json':
            await writeFile(fileName, JSON.stringify(avatar.toJSON(), null, 2));
            break;
        }

        if (json && 'json' !== format) {
          const jsonFileName = path.resolve(
            process.cwd(),
            outputPath,
            `${name}-${i}.json`,
          );

          await fs.writeJSON(jsonFileName, avatar.toJSON(), { spaces: 2 });
        }

        bar.increment();
      } catch (error) {
        errors.push(error instanceof Error ? error : new Error(String(error)));
      }
    });
  }

  await queue.onIdle();

  bar.stop();

  exiftool.end();

  if (errors.length > 0) {
    throw errors[0];
  }
}
