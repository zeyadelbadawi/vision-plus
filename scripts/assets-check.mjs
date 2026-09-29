// Asset gate (IMAGE_ASSET_MANIFEST §5–6).
//  - registry (manifest.generated.json) is in sync with docs/image-asset-manifest.csv
//  - every slot referenced in source exists in the manifest
//  - final assets: file exists, pixel size matches the manifest (±1% ratio), alt text in all locales
//  - production: P0/P1 slots referenced by the site must be final
import { execSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import sharp from 'sharp';

const mode = process.env.CONTENT_MODE === 'production' ? 'production' : 'preview';
const manifest = JSON.parse(readFileSync('src/content/media/manifest.generated.json', 'utf8'));
const finals = JSON.parse(readFileSync('src/content/media/images.json', 'utf8')).assets;
const errors = [];
const warnings = [];
const blockers = [];

// 1. manifest sync
const before = readFileSync('src/content/media/manifest.generated.json', 'utf8');
execSync('node scripts/sync-image-manifest.mjs', { stdio: 'ignore' });
if (readFileSync('src/content/media/manifest.generated.json', 'utf8') !== before) errors.push('manifest.generated.json was stale — regenerated; commit the change');

// 2. referenced slot IDs (string literals in source matching manifest ID shapes)
const src = execSync(`grep -rhoE "(id|image)[=:] ?['\\"][A-Z][A-Z0-9{}-]+['\\"]" src || true`, { encoding: 'utf8' });
const idsFromData = execSync(`grep -rhoE "image: '[A-Z0-9-]+'" src/content/data || true`, { encoding: 'utf8' });
const referenced = new Set(
  [...src.split('\n'), ...idsFromData.split('\n')]
    .map((l) => l.match(/['"]([A-Z][A-Z0-9{}-]+)['"]/)?.[1])
    .filter(Boolean),
);
for (const id of referenced) if (!manifest[id]) errors.push(`source references unknown slot "${id}"`);

// 3. finals
for (const [id, f] of Object.entries(finals)) {
  const slot = manifest[id];
  if (!slot) { errors.push(`images.json: unknown slot ${id}`); continue; }
  for (const l of ['en', 'ar', 'zh']) if (!f.alt?.[l]) errors.push(`${id}: missing ${l} alt text`);
  const check = async (path, want, declared) => {
    if (!existsSync(path)) return errors.push(`${id}: missing file ${path}`);
    if (!want) return;
    const m = await sharp(path).metadata();
    const r = m.width / m.height, w = want.width / want.height;
    // Ratio is structural (the layout reserves it) → error. Resolution is quality → warning.
    if (Math.abs(r - w) / w > 0.01) errors.push(`${id}: ${path} ratio ${m.width}×${m.height} ≠ manifest ${want.width}×${want.height}`);
    if (m.width < want.width) warnings.push(`${id}: ${path} is ${m.width}×${m.height}; manifest master is ${want.width}×${want.height} (soft on high-DPI screens — request the full-size master)`);
    if (declared && (declared.width !== m.width || declared.height !== m.height)) errors.push(`${id}: images.json declares ${declared.width}×${declared.height} but ${path} is ${m.width}×${m.height}`);
  };
  await check(slot.path, slot.desktop, f.size);
  if (slot.mobilePath) await check(slot.mobilePath, slot.mobile, f.mobileSize);
}

// 4. production gate
for (const id of referenced) {
  const slot = manifest[id];
  if (slot && !slot.templated && ['P0', 'P1'].includes(slot.priority) && !finals[id]) blockers.push(`${id} (${slot.priority}) still a placeholder`);
}
blockers.push('BRAND-LOGO (P0): official logo not supplied (D-05) — interim wordmark in use');

if (warnings.length) console.warn(`assets:check — ${warnings.length} warning(s):\n  ` + warnings.join('\n  '));
if (errors.length) {
  console.error(`assets:check — ${errors.length} error(s):\n  ` + errors.join('\n  '));
  process.exit(1);
}
if (mode === 'production' && blockers.length) {
  console.error(`assets:check [production] — publication blocked:\n  ` + blockers.join('\n  '));
  process.exit(1);
}
console.log(`assets:check [${mode}] — ${referenced.size} slots referenced, ${Object.keys(finals).length} final; ${blockers.length} item(s) would block production.`);
