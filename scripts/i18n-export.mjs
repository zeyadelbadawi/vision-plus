// Translation workbook export (MASTER_PROJECT_PLAN §13 "Translation workflow", step 2).
// Writes docs/i18n/translations.xlsx from the English copy + UI messages:
//   key(s), context, status, English, max-length hints, current Arabic, current Chinese, notes.
// One row per DISTINCT English string (shared sentences are translated once; the import writes every key).
// Only human / client-approved translations are shown in the ar/zh columns — draft-mt and placeholder
// text is never pre-filled, so machine drafts cannot leak into the final copy (§13.6).
// The import side (`i18n:import`) is built with the localization phase (P8).
import { mkdirSync, readFileSync, readdirSync } from 'node:fs';
import writeExcelFile from 'write-excel-file/node';

const OUT = 'docs/i18n/translations.xlsx';
const read = (p) => JSON.parse(readFileSync(p, 'utf8'));
const get = (obj, path) => path.split('.').reduce((o, k) => (o == null ? undefined : o[k]), obj);

const PAGES = {
  'about.json': 'About page',
  'catalog.json': 'Shared names & summaries (menus, cards, lists)',
  'company.json': 'Company identity & Why Vision Plus',
  'contact.json': 'Contact page',
  'home.json': 'Homepage',
  'industries.json': 'Industries page',
  'partners.json': 'Technology Partners page',
  'products.json': 'Products page',
  'projects.json': 'Projects pages',
  'seo.json': 'Search-engine title & description',
  'services.json': 'Services page',
  'solutions.json': 'Solutions pages',
  messages: 'Interface text (buttons, labels, form, errors)',
};

const strings = (o, path = '', out = []) => {
  if (typeof o === 'string') {
    if (o.trim()) out.push([path, o]);
  } else if (o && typeof o === 'object') {
    for (const [k, v] of Object.entries(o)) if (k !== '_meta') strings(v, path ? `${path}.${k}` : k, out);
  }
  return out;
};

/** Translation shown only when that locale file is approved (never draft-mt / placeholder). */
const current = (file, locale, path) => {
  const data = read(file === 'messages' ? `messages/${locale}.json` : `src/content/copy/${locale}/${file}`);
  return data._meta?.status === 'approved' ? (get(data, path) ?? '') : '';
};

function rows(files) {
  const byEnglish = new Map();
  for (const file of files) {
    const data = read(file === 'messages' ? 'messages/en.json' : `src/content/copy/en/${file}`);
    const review = data._meta?.review ?? {};
    const fileStatus = file === 'messages' ? 'draft' : 'approved';
    for (const [path, text] of strings(data)) {
      const r = Object.entries(review).find(([p]) => path === p || path.startsWith(`${p}.`));
      const status = r ? r[1].status : fileStatus;
      const key = `${file.replace('.json', '')}:${path}`;
      const row = byEnglish.get(text) ?? { text, keys: [], pages: new Set(), statuses: new Set(), file, path };
      row.keys.push(key);
      row.pages.add(PAGES[file]);
      row.statuses.add(status);
      byEnglish.set(text, row);
    }
  }
  return [...byEnglish.values()];
}

function limits(row) {
  if (row.keys.every((k) => k.startsWith('seo:'))) {
    const isTitle = row.keys[0].endsWith('.title');
    return isTitle ? [45, 45, 'Search title: hard limit 45 characters (≤ 60 with the “ — VISION PLUS” suffix); for Chinese aim for ≤ 30'] : [155, 155, 'Search description: hard limit 155 characters; for Chinese aim for ≤ 80'];
  }
  const n = row.text.length;
  if (row.file === 'messages' || n <= 60) return [Math.ceil(n * 1.3), Math.max(2, Math.ceil(n * 0.7)), 'Short UI or heading text: keep within the hint so the layout holds'];
  return ['', '', ''];
}

function notes(row) {
  const out = [];
  if (/\{[^}]+\}/.test(row.text)) out.push('Keep {placeholders} exactly; complete every plural form your language needs (Arabic: zero/one/two/few/many/other).');
  if (/<\w+>/.test(row.text)) out.push('Keep the <tags> around the linked words.');
  if (/VISION PLUS/.test(row.text)) out.push('Keep “VISION PLUS” in Latin capitals (Q-07).');
  if (row.keys.length > 1) out.push(`Used in ${row.keys.length} places — translate once.`);
  return out.join(' ');
}

const head = (labels) => labels.map((value) => ({ value, fontWeight: 'bold', backgroundColor: '#E8E8E8', wrap: true }));
const HEAD = ['ID', 'Key(s)', 'Where it appears', 'English status', 'English (source)', 'Max length — Arabic', 'Max length — Chinese', 'Arabic (العربية)', 'Chinese (简体中文)', 'Notes'];
const columns = [{ width: 8 }, { width: 34 }, { width: 26 }, { width: 12 }, { width: 60 }, { width: 10 }, { width: 10 }, { width: 60 }, { width: 50 }, { width: 40 }];

function sheet(prefix, list) {
  return [
    head(HEAD),
    ...list.map((row, i) => {
      const [maxAr, maxZh, why] = limits(row);
      const status = [...row.statuses].join(' / ');
      return [
        { value: `${prefix}-${String(i + 1).padStart(3, '0')}` },
        { value: row.keys.join('\n'), wrap: true },
        { value: [...row.pages].join('; '), wrap: true },
        { value: status, backgroundColor: status === 'approved' ? '#E6F2E6' : '#FFF4D6' },
        { value: row.text, wrap: true },
        maxAr === '' ? null : { value: maxAr, type: Number },
        maxZh === '' ? null : { value: maxZh, type: Number },
        { value: current(row.file, 'ar', row.path), wrap: true },
        { value: current(row.file, 'zh', row.path), wrap: true },
        { value: [notes(row), why].filter(Boolean).join(' '), wrap: true },
      ];
    }),
  ];
}

const copyFiles = readdirSync('src/content/copy/en').filter((f) => f.endsWith('.json')).sort();
const copyRows = rows(copyFiles);
const uiRows = rows(['messages']);
const approved = copyRows.filter((r) => [...r.statuses].every((s) => s === 'approved')).length;

const readme = [
  [{ value: 'VISION PLUS — website translation workbook', fontWeight: 'bold', fontSize: 14 }],
  [{ value: `Generated ${new Date().toISOString().slice(0, 10)} by \`pnpm i18n:export\`. Do not reorder or delete rows, and do not edit the ID, Key(s) or English columns.` }],
  [],
  [{ value: 'What to fill in', fontWeight: 'bold' }],
  [{ value: '• Arabic: the “Arabic (العربية)” column — by a professional human translator (Q-05, D-13).', wrap: true }],
  [{ value: '• Simplified Chinese: the “Chinese (简体中文)” column — supplied by Vision Plus (D-12).', wrap: true }],
  [{ value: '• Machine translation is not accepted for the final copy. The website build refuses machine-translated text.', wrap: true }],
  [],
  [{ value: 'Which rows can start now', fontWeight: 'bold' }],
  [{ value: `• “approved” rows (${approved} of ${copyRows.length} page-copy rows) are the client-approved English and can be translated now.`, wrap: true }],
  [{ value: '• “derived” and “draft” rows (page copy and all interface text) wait for the English sign-off (D-18), because the English may still change.', wrap: true }],
  [],
  [{ value: 'Rules', fontWeight: 'bold' }],
  [{ value: '• Keep “VISION PLUS” in Latin capitals unless official Arabic / Chinese names are supplied (Q-07). See the Glossary sheet for technical terms.', wrap: true }],
  [{ value: '• Keep {placeholders} and <tags> exactly as written; complete every plural form your language needs.', wrap: true }],
  [{ value: '• Respect the max-length hints on short text (buttons, menu labels, headings, search titles) so the layout holds. Long paragraphs have no limit.', wrap: true }],
  [{ value: '• Chinese: full-width punctuation (，。：；“”). Arabic: Western digits for years, phone numbers and technical values (Q-17, pending confirmation).', wrap: true }],
  [{ value: '• A sentence used in several places appears once — translate it once.', wrap: true }],
  [],
  [{ value: 'Sheets', fontWeight: 'bold' }],
  [{ value: `• Page copy — ${copyRows.length} rows from the website pages.` }],
  [{ value: `• Interface — ${uiRows.length} rows of buttons, labels, form text and messages.` }],
  [{ value: '• Glossary — terms to keep or translate consistently.' }],
];

const glossary = [
  head(['Term', 'Rule', 'Arabic (العربية)', 'Chinese (简体中文)']),
  ...[
    ['VISION PLUS', 'Keep in Latin capitals (Q-07)'],
    ['Mobile NVR', 'Keep “NVR” (Network Video Recorder) in Latin; translate “Mobile” if natural'],
    ['CCTV, IP, HD, GPS, 4G/5G, Wi-Fi, LAN / WAN', 'Keep in Latin'],
    ['ICT, ELV, AV', 'Keep the abbreviation in Latin; spell out on first use if your language needs it (ELV = Extra-Low Voltage)'],
    ['Smart Building & Home Automation', 'One consistent translation everywhere'],
    ['Access Control', 'One consistent translation everywhere'],
    ['Fire Alarm Systems / Life Safety', 'One consistent translation everywhere'],
    ['Qatar, Egypt', 'Standard country names'],
  ].map(([term, rule]) => [{ value: term }, { value: rule, wrap: true }, { value: '' }, { value: '' }]),
];

mkdirSync('docs/i18n', { recursive: true });
await writeExcelFile([
  { sheet: 'Read me', data: readme, columns: [{ width: 120 }] },
  { sheet: 'Page copy', data: sheet('C', copyRows), columns, stickyRowsCount: 1 },
  { sheet: 'Interface', data: sheet('U', uiRows), columns, stickyRowsCount: 1 },
  { sheet: 'Glossary', data: glossary, columns: [{ width: 34 }, { width: 70 }, { width: 30 }, { width: 30 }], stickyRowsCount: 1 },
]).toFile(OUT);
console.log(`i18n:export — wrote ${OUT}: ${copyRows.length} page-copy rows (${approved} approved), ${uiRows.length} interface rows`);
