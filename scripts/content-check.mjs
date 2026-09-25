// Content gate (MASTER_PROJECT_PLAN §12.3, §13.6).
//  - every locale mirrors the English shape (keys, types, array lengths)
//  - statuses are known; CONTENT_MODE=production refuses draft-mt / placeholder copy and
//    placeholder office data, and (per §12.3) any non-approved copy on published routes.
import { readFileSync, readdirSync } from 'node:fs';

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
    if (status !== 'approved') blockers.push(`${file}: status "${status}"`);
  }
}

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
