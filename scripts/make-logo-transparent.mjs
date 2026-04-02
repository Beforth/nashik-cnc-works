/**
 * Remove flat backgrounds from public/logo.png (near-black or near-white).
 * Run: node scripts/make-logo-transparent.mjs
 */
import sharp from 'sharp';
import { readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const inputPath = resolve(root, 'public', 'logo.png');
const backupPath = resolve(root, 'public', 'logo.backup.png');

function shouldBeTransparent(r, g, b) {
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const spread = max - min;
  const avg = (r + g + b) / 3;

  // Keep saturated pixels (colored logo marks)
  if (spread > 42) return false;

  // Near-black / dark gray backdrop (e.g. exported on #000)
  if (max <= 52 && spread <= 32) return true;

  // Uniform light areas = white/gray backdrop
  if (avg >= 198 && spread <= 42) return true;
  if (r >= 245 && g >= 245 && b >= 245) return true;

  return false;
}

const input = await readFile(inputPath);
await writeFile(backupPath, input);

const { data, info } = await sharp(input).ensureAlpha().raw().toBuffer({ resolveWithObject: true });

const channels = info.channels;
if (channels !== 4) {
  console.error('Expected RGBA');
  process.exit(1);
}

for (let i = 0; i < data.length; i += 4) {
  const r = data[i];
  const g = data[i + 1];
  const b = data[i + 2];
  if (shouldBeTransparent(r, g, b)) {
    data[i + 3] = 0;
  }
}

const out = await sharp(data, {
  raw: {
    width: info.width,
    height: info.height,
    channels: 4,
  },
})
  .png({ compressionLevel: 9, effort: 10 })
  .toBuffer();

await writeFile(inputPath, out);
console.log('Wrote transparent logo to public/logo.png (backup: public/logo.backup.png)');
