// Build-time image pipeline (T-10): masters in public/images/** → AVIF + WebP width sets in
// public/_img/** (widths must match IMAGE_WIDTHS in src/content/media/index.ts). Only slots marked
// final in images.json are processed. Skips up-to-date outputs. Zero runtime cost, no image CDN.
import { existsSync, mkdirSync, readFileSync, statSync } from 'node:fs';
import { dirname } from 'node:path';
import sharp from 'sharp';

const WIDTHS = [390, 640, 828, 1080, 1280, 1620, 1920, 2400, 2880];
const manifest = JSON.parse(readFileSync('src/content/media/manifest.generated.json', 'utf8'));
const finals = JSON.parse(readFileSync('src/content/media/images.json', 'utf8')).assets;

const widthsFor = (master) => [...WIDTHS.filter((w) => w < master), master];
const outBase = (p) => p.replace(/^public\/images\//, 'public/_img/').replace(/\.(jpe?g|png|webp)$/i, '');

let made = 0;
for (const id of Object.keys(finals)) {
  const slot = manifest[id];
  const f = finals[id];
  for (const [path, spec] of [
    [slot.path, f.size ?? slot.desktop],
    [slot.mobilePath, f.mobileSize ?? slot.mobile],
  ]) {
    if (!path || !spec || !existsSync(path)) continue;
    const base = outBase(path);
    mkdirSync(dirname(base), { recursive: true });
    const srcTime = statSync(path).mtimeMs;
    for (const w of widthsFor(spec.width)) {
      for (const [fmt, opts] of [
        ['avif', { quality: 48, effort: 5 }],
        ['webp', { quality: 78 }],
      ]) {
        const out = `${base}-${w}.${fmt}`;
        if (existsSync(out) && statSync(out).mtimeMs > srcTime) continue;
        await sharp(path).resize({ width: w, withoutEnlargement: true }).toFormat(fmt, opts).toFile(out);
        made++;
      }
    }
  }
}
console.log(`images: ${Object.keys(finals).length} final asset(s); ${made} variant(s) generated.`);
