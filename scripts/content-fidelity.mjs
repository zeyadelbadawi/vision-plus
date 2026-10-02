// Content fidelity check (MASTER_PROJECT_PLAN §49 P4, §12.5): approved source `01` ↔ English copy files.
//
//  1. Every approved sentence, heading and list item in 01 must appear in src/content/copy/en/*.json
//     (case-, quote- and whitespace-insensitive; typographic normalisation only — §12.5).
//  2. Every English copy string must come from 01, or be declared in its file's `_meta.review` as
//     derived / draft / placeholder with a source (those are what the client signs off in D-18).
//
// `pnpm content:fidelity` checks and fails on any gap; `--write` also regenerates docs/CONTENT_FIDELITY_REPORT.md.
import { readFileSync, readdirSync, writeFileSync } from 'node:fs';

const SOURCE = 'client-materials/01_Vision_Plus_Approved_Content.txt';
const COPY = 'src/content/copy/en';
const write = process.argv.includes('--write');

// Text in 01 that is deliberately not website copy. Each entry needs a reason; nothing else may be skipped.
const EXCLUDED = new Map([
  [
    'Selected projects can be presented according to:',
    'Instruction for the profile deck; the six field labels that follow are encoded (projects.json `fields`)',
  ],
]);
// 01 text the client has since changed by decision. The replacement must be declared in `_meta.review`.
const AMENDED = new Map([
  [
    'We begin with the objective, environment, users, and operational requirements.',
    'Q-09 (client, 2026-10-02): Site Survey is included in the Understand stage — catalog.json `approach.0.text`',
  ],
]);
const isPlaceholder = (t) => /^\[[^\]]+\]$/.test(t);

const norm = (s) => s.normalize('NFKC').replace(/[‘’]/g, "'").replace(/[“”]/g, '"').replace(/\*\*/g, '').replace(/\s+/g, ' ').trim().toLowerCase();

// ---------- 1. Units of approved text in 01 ----------
const units = []; // { section, kind, text }
let section = 'preamble';
const sectionTitles = new Map([['preamble', 'Title block']]);
const push = (kind, text) => {
  const t = text.replace(/\*\*/g, '').trim();
  if (t) units.push({ section, kind, text: t });
};
for (const raw of readFileSync(SOURCE, 'utf8').split('\n')) {
  let line = raw.trim();
  if (!line || line === '---') continue;
  const head = line.match(/^# (\d\d) — (.+)$/);
  if (head) {
    section = `§${head[1]}`;
    sectionTitles.set(section, head[2]);
    push('section-title', head[2]);
    continue;
  }
  line = line
    .replace(/^#+\s*/, '')
    .replace(/^•\s*/, '')
    .replace(/^\d\d — /, '');
  const plain = line.replace(/\*\*/g, '').trim();
  if (isPlaceholder(plain)) {
    units.push({ section, kind: 'placeholder', text: plain });
    continue;
  }
  // Composite lines (separators) → each part must exist on its own.
  const sep = [' | ', ' • ', ' + ', ' → '].find((s) => plain.includes(s));
  if (sep) {
    units.push({ section, kind: 'composite', text: plain }); // kept whole for the reverse check only
    for (const part of plain.split(sep)) push('item', part);
    continue;
  }
  // Paragraphs → sentences.
  const sentences = plain.split(/(?<=[.!?])\s+(?=[A-Z“"'])/);
  for (const s of sentences) push(sentences.length > 1 || /[.!?:]$/.test(s) ? 'sentence' : 'heading', s);
}

// ---------- 2. The English copy corpus ----------
const files = readdirSync(COPY)
  .filter((f) => f.endsWith('.json'))
  .sort();
const strings = []; // { file, path, text }
const reviews = []; // { file, path, status, source }
const walk = (o, file, path) => {
  if (typeof o === 'string') {
    if (o.trim()) strings.push({ file, path, text: o });
  } else if (o && typeof o === 'object') {
    for (const [k, v] of Object.entries(o)) if (k !== '_meta') walk(v, file, path ? `${path}.${k}` : k);
  }
};
for (const file of files) {
  const data = JSON.parse(readFileSync(`${COPY}/${file}`, 'utf8'));
  walk(data, file, '');
  for (const [path, r] of Object.entries(data._meta?.review ?? {})) reviews.push({ file, path, ...r });
}
const corpus = strings.map((s) => norm(s.text));
const found = (text) => {
  const n = norm(text);
  return corpus.some((c) => c.includes(n));
};

// ---------- 3. Check both directions ----------
const required = units.filter((u) => !['placeholder', 'section-title', 'composite'].includes(u.kind) && !EXCLUDED.has(u.text) && !AMENDED.has(u.text));
const missing = required.filter((u) => !found(u.text));
const titles = units.filter((u) => u.kind === 'section-title').map((u) => ({ ...u, used: found(u.text) }));

const sourceText = norm(units.map((u) => u.text).join('\n'));
const declared = (file, path) => reviews.some((r) => r.file === file && (path === r.path || path.startsWith(`${r.path}.`)));
const undeclared = strings.filter((s) => !sourceText.includes(norm(s.text)) && !declared(s.file, s.path));
const fromReview = strings.filter((s) => declared(s.file, s.path));
const uiReviews = Object.entries(JSON.parse(readFileSync('messages/en.json', 'utf8'))._meta?.review ?? {}).map(([path, r]) => ({
  file: 'messages/en.json',
  path,
  ...r,
}));
const approvedReviews = reviews.filter((r) => r.approved);
const pendingReviews = [...reviews, ...uiReviews].filter((r) => !r.approved && r.status !== 'withheld');
const withheld = reviews.filter((r) => r.status === 'withheld');

const byText = new Map();
for (const s of strings) byText.set(s.text, [...(byText.get(s.text) ?? []), `${s.file.replace('.json', '')}:${s.path}`]);
const shared = [...byText].filter(([, keys]) => keys.length > 1);
const uiCount = (() => {
  let n = 0;
  const count = (o) => (typeof o === 'string' ? n++ : o && typeof o === 'object' && Object.entries(o).forEach(([k, v]) => k !== '_meta' && count(v)));
  count(JSON.parse(readFileSync('messages/en.json', 'utf8')));
  return n;
})();

// ---------- 4. Output ----------
const ok = missing.length === 0 && undeclared.length === 0;
console.log(
  `content:fidelity — 01: ${required.length} approved units, ${required.length - missing.length} found, ${missing.length} missing; ` +
    `copy: ${strings.length} English strings, ${undeclared.length} undeclared non-source string(s)`,
);
for (const u of missing) console.error(`  MISSING ${u.section} ${u.kind}: "${u.text}"`);
for (const s of undeclared) console.error(`  UNDECLARED ${s.file}:${s.path}: "${s.text}"`);

if (write) {
  const sections = [...sectionTitles.keys()];
  const row = (sec) => {
    const all = units.filter((u) => u.section === sec);
    const req = all.filter((u) => required.includes(u));
    const miss = req.filter((u) => missing.includes(u)).length;
    return `| ${sec} | ${sectionTitles.get(sec)} | ${req.length} | ${req.length - miss} | ${miss} | ${all.filter((u) => u.kind === 'placeholder' || EXCLUDED.has(u.text)).length} |`;
  };
  const esc = (t) => t.replace(/\|/g, '\\|');
  const md = `# Content Fidelity Report

Generated by \`pnpm content:fidelity --write\` (\`scripts/content-fidelity.mjs\`). Do not edit by hand.

**Source:** \`${SOURCE}\` (approved for website use, A-01). **Target:** \`${COPY}/*.json\`.
**Rule (MASTER_PROJECT_PLAN §12.5):** approved text is used verbatim. The only changes allowed are typographic: curly quotes and apostrophes, title case for headings set in capitals in 01 (the brand stays “VISION PLUS”), and dropping the deck’s bold markers and numbering. Matching ignores exactly those differences.

## Result

| Check | Result |
|---|---|
| Approved units in 01 (sentences, headings, list items) | **${required.length}** |
| Found verbatim in the English copy | **${required.length - missing.length}** |
| Missing | **${missing.length}** |
| English copy strings checked | **${strings.length}** |
| Strings not from 01 and not declared for review | **${undeclared.length}** |
| Strings declared derived / draft / withheld | **${fromReview.length}** in ${reviews.length} declared group(s) |
| Declared groups approved by client sign-off (D-18) | **${approvedReviews.length}** |
| Declared groups pending client review (added after D-18) | **${pendingReviews.length}** |
| Declared groups withheld from publication | **${withheld.length}** |
| UI microcopy in \`messages/en.json\` | **${uiCount}** (approved with D-18, except ${uiReviews.length} listed below) |
| 01 sentences amended by client decision | **${AMENDED.size}** |

**Status: ${ok ? '✅ PASS — every approved sentence is present, and every other string is declared.' : '❌ FAIL — see the console output.'}**

## Coverage by 01 section

| Section | Title in 01 | Approved units | Found | Missing | Excluded / placeholders |
|---|---|---|---|---|---|
${sections.map(row).join('\n')}

${missing.length ? `## Missing\n\n${missing.map((u) => `- ${u.section} (${u.kind}): “${esc(u.text)}”`).join('\n')}\n` : ''}
## Deliberately not encoded

| 01 text | Why |
|---|---|
${units
  .filter((u) => u.kind === 'placeholder' || EXCLUDED.has(u.text))
  .map(
    (u) =>
      `| ${u.section}: “${esc(u.text)}” | ${u.kind === 'placeholder' ? 'Placeholder in 01 — filled from client data (D-01–D-04, D-08, D-10) or not website copy' : EXCLUDED.get(u.text)} |`,
  )
  .join('\n')}

### Deck section titles

The section titles of 01 are slide names. They are used as page eyebrows or navigation where they fit; the rest are not website copy.

| Section | Title | Used in copy |
|---|---|---|
${titles.map((t) => `| ${t.section} | ${esc(t.text)} | ${t.used ? 'yes' : 'no (slide name only)'} |`).join('\n')}

## Amended by client decision

| 01 text | Decision |
|---|---|
${[...AMENDED].map(([t, why]) => `| “${esc(t)}” | ${esc(why)} |`).join('\n')}

## Pending client review (added after D-18)

These strings are **not** client-approved. The production build refuses their files until the client approves them.

| File | Key | Status | Source |
|---|---|---|---|
${pendingReviews.map((r) => `| ${r.file} | \`${r.path}\` | ${r.status} | ${esc(r.source)} |`).join('\n')}

## Withheld — not to be published

| File | Key | Reason |
|---|---|---|
${withheld.map((r) => `| ${r.file} | \`${r.path}\` | ${esc(r.source)} |`).join('\n')}

## Approved by sign-off D-18 (2026-10-02)

Not verbatim 01 text, but approved by the client as presented in the P4 review.

| File | Key | Status | Source |
|---|---|---|---|
${approvedReviews.map((r) => `| ${r.file} | \`${r.path}\` | ${r.status} | ${esc(r.source)} |`).join('\n')}
| messages/en.json | all ${uiCount - uiReviews.length} UI strings present at sign-off | draft | Team-authored interface microcopy (buttons, labels, form text, errors) |

## Text used in more than one place

The same approved sentence can appear on several pages (for example the homepage selection and the full page). The translation workbook gives each distinct English string **one row**, so it is translated once, and \`content:check\` requires identical translations once a locale is approved. ${shared.length} English strings are shared:

| English | Keys |
|---|---|
${shared.map(([text, keys]) => `| ${esc(text.length > 70 ? `${text.slice(0, 70)}…` : text)} | ${keys.map((k) => `\`${k}\``).join(', ')} |`).join('\n')}
`;
  writeFileSync('docs/CONTENT_FIDELITY_REPORT.md', md);
  console.log('content:fidelity — wrote docs/CONTENT_FIDELITY_REPORT.md');
}
process.exit(ok ? 0 : 1);
