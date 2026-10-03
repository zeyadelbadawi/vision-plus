// Content gate (MASTER_PROJECT_PLAN §12.3, §13.6).
//  - every locale mirrors the English shape (keys, types, array lengths)
//  - statuses are known; CONTENT_MODE=production refuses draft-mt / placeholder copy and
//    placeholder office data, and (per §12.3) any non-approved copy on published routes.
import { readFileSync, readdirSync } from 'node:fs';
// Zod schemas (MASTER_PROJECT_PLAN §12.1, §40). Node 22 loads these TypeScript modules directly (type stripping).
import { aliases as aliasesSchema, copyFile, finalImages, locations as locationsSchema, schemas, text } from '../src/content/schema/index.ts';
import { industries, productCategories, services, solutions } from '../src/content/data/registry.ts';

const mode = process.env.CONTENT_MODE === 'production' ? 'production' : 'preview';
const LOCALES = ['en', 'ar', 'zh'];
const STATUSES = new Set(['approved', 'derived', 'draft', 'placeholder', 'draft-mt']);
const errors = [];
const blockers = [];
const read = (p) => JSON.parse(readFileSync(p, 'utf8'));

function compare(a, b, path, file) {
  if (Array.isArray(a)) {
    if (!Array.isArray(b)) return errors.push(`${file}: ${path} should be an array`);
    if (a.length !== b.length) errors.push(`${file}: ${path} has ${b.length} items, English has ${a.length}`);
    a.forEach((v, i) => b[i] !== undefined && compare(v, b[i], `${path}[${i}]`, file));
  } else if (a && typeof a === 'object') {
    if (!b || typeof b !== 'object') return errors.push(`${file}: ${path} should be an object`);
    for (const k of Object.keys(a)) {
      if (k === '_meta') continue;
      if (!(k in b)) errors.push(`${file}: missing key ${path}.${k}`);
      else compare(a[k], b[k], `${path}.${k}`, file);
    }
    for (const k of Object.keys(b)) if (!(k in a) && k !== '_meta') errors.push(`${file}: unexpected key ${path}.${k}`);
  } else if (typeof a !== typeof b) {
    errors.push(`${file}: ${path} type ${typeof b}, expected ${typeof a}`);
  } else if (typeof b === 'string' && !b.trim() && a.trim()) {
    errors.push(`${file}: ${path} is empty`);
  }
}

const sets = [
  ...readdirSync('src/content/copy/en').map((f) => ({ name: f, path: (l) => `src/content/copy/${l}/${f}` })),
  { name: 'messages', path: (l) => `messages/${l}.json` },
];
for (const set of sets) {
  const en = read(set.path('en'));
  for (const l of LOCALES) {
    const file = set.path(l);
    const data = read(file);
    const status = data._meta?.status;
    if (!STATUSES.has(status)) errors.push(`${file}: unknown or missing _meta.status "${status}"`);
    if (l !== 'en') compare(en, data, '$', file);
    // samples.json is preview-only illustrative content (Q-12): it never blocks by status; instead site:check fails a
    // production build that renders any [data-sample] element.
    if (status !== 'approved' && set.name !== 'samples.json') blockers.push(`${file}: status "${status}"`);
  }
}

// _meta.review (MASTER_PROJECT_PLAN §12.3, §12.5): a file that is not fully client-approved lists every
// derived / draft / placeholder entry with its source. Paths must resolve, and such a file cannot claim "approved".
const get = (obj, path) => path.split('.').reduce((o, k) => (o == null ? undefined : o[k]), obj);
for (const f of readdirSync('src/content/copy/en')) {
  const data = read(`src/content/copy/en/${f}`);
  const review = data._meta?.review ?? {};
  for (const [path, entry] of Object.entries(review)) {
    if (get(data, path) === undefined) errors.push(`copy/en/${f}: _meta.review path "${path}" does not exist`);
    if (!['derived', 'draft', 'placeholder'].includes(entry?.status)) errors.push(`copy/en/${f}: _meta.review "${path}" has invalid status "${entry?.status}"`);
    if (!entry?.source) errors.push(`copy/en/${f}: _meta.review "${path}" needs a source`);
  }
  if (Object.keys(review).length && data._meta.status === 'approved') errors.push(`copy/en/${f}: has pending review items but claims status "approved"`);
}

// SEO length budgets (§36): rendered "<title> — VISION PLUS" ≤ 60 characters, description ≤ 155.
const SUFFIX = ' — VISION PLUS'.length;
for (const l of LOCALES) {
  const seo = read(`src/content/copy/${l}/seo.json`);
  const walk = (o, path) => {
    for (const [k, v] of Object.entries(o)) {
      if (k === '_meta' || !v || typeof v !== 'object') continue;
      if (typeof v.title === 'string') {
        if (v.title.length + SUFFIX > 60) errors.push(`copy/${l}/seo.json: ${path}${k}.title renders at ${v.title.length + SUFFIX} chars (max 60)`);
        if (v.description.length > 155) errors.push(`copy/${l}/seo.json: ${path}${k}.description is ${v.description.length} chars (max 155)`);
      } else walk(v, `${path}${k}.`);
    }
  };
  walk(seo, '');
}

// The same approved English sentence can appear on several pages (e.g. the homepage selection and the full
// page). Once a locale's files are approved, each such sentence must be translated identically everywhere.
const strings = (o, path, out) => {
  if (typeof o === 'string') out.push([path, o]);
  else if (o && typeof o === 'object') for (const [k, v] of Object.entries(o)) if (k !== '_meta') strings(v, path ? `${path}.${k}` : k, out);
  return out;
};
const copyFiles = readdirSync('src/content/copy/en');
const byEnglish = new Map();
for (const f of copyFiles)
  for (const [path, text] of strings(read(`src/content/copy/en/${f}`), '', [])) {
    if (!byEnglish.has(text)) byEnglish.set(text, []);
    byEnglish.get(text).push([f, path]);
  }
for (const l of LOCALES.filter((x) => x !== 'en')) {
  const files = Object.fromEntries(copyFiles.map((f) => [f, read(`src/content/copy/${l}/${f}`)]));
  for (const [text, uses] of byEnglish) {
    const approved = uses.filter(([f]) => files[f]._meta?.status === 'approved');
    const variants = new Set(approved.map(([f, path]) => get(files[f], path)));
    if (variants.size > 1) errors.push(`copy/${l}: "${text.slice(0, 50)}…" is translated differently in ${approved.map(([f, p]) => `${f}:${p}`).join(', ')}`);
  }
}

// Zod: per-file schemas (exact registry key sets, SEO budgets, shapes) and visible-text rules for every leaf.
const fileSchemas = schemas({
  solutions: solutions.map((s) => s.slug),
  services,
  industries: industries.map((i) => i.slug),
  productCategories,
});
const issues = (file, result) => {
  if (!result.success) for (const i of result.error.issues) errors.push(`${file}: ${i.path.join('.') || '$'} — ${i.message}`);
};
for (const f of copyFiles) {
  const en = read(`src/content/copy/en/${f}`);
  for (const l of LOCALES) {
    const file = `src/content/copy/${l}/${f}`;
    const data = read(file);
    issues(file, (fileSchemas[f] ?? copyFile).safeParse(data));
    // every visible string is non-empty trimmed text, except where English itself is intentionally empty
    for (const [path, value] of strings(data, '', [])) if (get(en, path) !== '') issues(`${file} ${path}`, text.safeParse(value));
  }
}
issues('src/content/data/locations.json', locationsSchema.safeParse(read('src/content/data/locations.json')));
issues('src/content/data/aliases.json', aliasesSchema.safeParse(read('src/content/data/aliases.json')));
issues('src/content/media/images.json', finalImages.safeParse(read('src/content/media/images.json').assets));

const loc = read('src/content/data/locations.json');
for (const o of loc.offices) {
  for (const k of ['address', 'phone', 'email', 'mapUrl', 'mapEmbedSrc']) if (!o[k]) blockers.push(`locations: ${o.key}.${k} pending client (D-01/D-02/D-03)`);
}

if (errors.length) {
  console.error(`content:check — ${errors.length} structural error(s):\n  ` + errors.join('\n  '));
  process.exit(1);
}
if (mode === 'production' && blockers.length) {
  console.error(`content:check [production] — publication blocked by ${blockers.length} item(s):\n  ` + blockers.join('\n  '));
  process.exit(1);
}
console.log(`content:check [${mode}] — structure OK across ${LOCALES.join('/')}; ${blockers.length} item(s) would block production.`);
