// Build-time Open Graph cards (MASTER_PROJECT_PLAN §36, P5A-14): typographic brand cards, 1200×630, one per page and
// locale, written to public/og/<locale>/<key>.png and referenced by src/lib/metadata.ts. No photos (none may be
// fabricated) and no logo file (D-05 outstanding): the name is set in type exactly like the interim header wordmark.
//
// Text is shaped by Pango + HarfBuzz + FriBidi inside sharp, so Arabic joins and mixed-direction lines are correct.
// The site's own typefaces (IBM Plex Sans, IBM Plex Sans Arabic, Noto Sans SC) are subset to the card text and loaded
// through a private fontconfig, so the result never depends on fonts installed on the build machine.
import { createHash } from 'node:crypto';
import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { tmpdir } from 'node:os';
import subsetFont from 'subset-font';
import { pageVisibility } from '../src/content/data/visibility.ts';

const OUT = 'public/og';
const W = 1200;
const H = 630;
const PAD = 80;
const LOCALES = ['en', 'ar', 'zh'];
const C = { bg: '#1f1f1f', fg: '#ffffff', muted: '#a3a3a3', gold: '#d4af37', line: '#3a3a3a' }; // Option B tokens
// Pango family lists per locale (Latin falls back to Plex). The static Arabic SemiBold registers as its own family, so
// titles name it; the variable Latin and Chinese faces take the weight from the markup.
const FAMILY = {
  en: { body: 'IBM Plex Sans', title: 'IBM Plex Sans' },
  ar: { body: 'IBM Plex Sans Arabic, IBM Plex Sans', title: 'IBM Plex Sans Arabic SemiBold, IBM Plex Sans' },
  zh: { body: 'Noto Sans SC, IBM Plex Sans', title: 'Noto Sans SC, IBM Plex Sans' },
};

const read = (p) => JSON.parse(readFileSync(p, 'utf8'));
const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

/** Every card: key → title lines per locale. Keys match ogImagePath() in src/lib/metadata.ts. */
export function cardList(locale) {
  const seo = read(`src/content/copy/${locale}/seo.json`);
  const company = read(`src/content/copy/${locale}/company.json`);
  const hidden = new Set(
    Object.entries(pageVisibility)
      .filter(([, v]) => !v)
      .map(([k]) => k),
  );
  const cards = [{ key: 'home', lines: company.tagline }];
  for (const [key, v] of Object.entries(seo)) {
    if (key === '_meta' || key === 'notFound' || hidden.has(key)) continue;
    if (key === 'solutions') for (const [slug, s] of Object.entries(v)) cards.push({ key: `solution-${slug}`, lines: [s.title] });
    else cards.push({ key, lines: [v.title] });
  }
  return { cards, descriptor: company.descriptor, markets: company.markets.join('  •  ') };
}

// ---- fonts: subset to the exact card text, register only these with a private fontconfig ----
const data = Object.fromEntries(LOCALES.map((l) => [l, cardList(l)]));
const allText = new Set(`VISION PLUS${JSON.stringify(data)}`);
const text = [...allText].join('');
const sources = [
  'node_modules/@fontsource-variable/ibm-plex-sans/files/ibm-plex-sans-latin-wght-normal.woff2',
  ...[400, 600].map((w) => `node_modules/@fontsource/ibm-plex-sans-arabic/files/ibm-plex-sans-arabic-arabic-${w}-normal.woff2`),
];
// Noto Sans SC ships as unicode-range slices; take the ones that hold a character of the cards.
const scDir = 'node_modules/@fontsource-variable/noto-sans-sc';
for (const m of readFileSync(`${scDir}/index.css`, 'utf8').matchAll(/@font-face\s*{([^}]+)}/g)) {
  const file = m[1].match(/url\(\.\/files\/([^)]+)\)/)[1];
  const ranges = m[1]
    .match(/unicode-range:\s*([^;]+);/)[1]
    .split(',')
    .map((r) =>
      r
        .trim()
        .replace(/^U\+/i, '')
        .split('-')
        .map((x) => parseInt(x, 16)),
    );
  if ([...allText].some((ch) => ranges.some(([a, b = a]) => ch.codePointAt(0) >= a && ch.codePointAt(0) <= b))) sources.push(`${scDir}/files/${file}`);
}

// Skip the work when neither the text, the fonts nor this script changed since the last run.
const hash = createHash('sha256')
  .update(text)
  .update(readFileSync(new URL(import.meta.url)))
  .update(sources.join())
  .digest('hex')
  .slice(0, 16);
const stamp = join(OUT, '.stamp');
if (existsSync(stamp) && readFileSync(stamp, 'utf8') === hash) {
  console.log(`og: ${LOCALES.length} locales up to date (${hash}).`);
  process.exit(0);
}

const fontDir = join(tmpdir(), `vp-og-${hash}`);
mkdirSync(join(fontDir, 'fonts'), { recursive: true });
for (const [i, src] of sources.entries()) {
  const sfnt = await subsetFont(readFileSync(src), text, { targetFormat: 'sfnt' });
  writeFileSync(join(fontDir, 'fonts', `${i}.ttf`), sfnt);
}
const conf = join(fontDir, 'fonts.conf');
writeFileSync(
  conf,
  `<?xml version="1.0"?><!DOCTYPE fontconfig SYSTEM "fonts.dtd"><fontconfig><dir>${resolve(fontDir, 'fonts')}</dir><cachedir>${resolve(fontDir, 'cache')}</cachedir></fontconfig>`,
);
process.env.FONTCONFIG_FILE = conf; // read once, when sharp first touches fontconfig
const sharp = (await import('sharp')).default;

// ---- drawing ----
const textImage = async (markup, { family, size, width, align }) => {
  const buf = await sharp({ text: { text: markup, font: `${family} ${size}`, width, align, wrap: 'word-char', rgba: true, spacing: Math.round(size * 0.18) } })
    .png()
    .toBuffer();
  const { width: w, height: h } = await sharp(buf).metadata();
  return { buf, w, h };
};
const rect = (w, h, fill) =>
  Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}"><rect width="${w}" height="${h}" fill="${fill}"/></svg>`);

async function card(locale, { key, lines }, { descriptor, markets }) {
  const rtl = locale === 'ar';
  const family = FAMILY[locale];
  const align = rtl ? 'right' : 'left';
  const x = (w) => (rtl ? W - PAD - w : PAD); // inline-start edge
  const xEnd = (w) => (rtl ? PAD : W - PAD - w);
  const layers = [];

  const mark = await textImage(`<span weight="700" foreground="${C.fg}">VISION <span foreground="${C.gold}">PLUS</span></span>`, {
    family: 'IBM Plex Sans',
    size: 30,
    width: 600,
    align: 'left',
  });
  layers.push({ input: mark.buf, top: 72, left: x(mark.w) });

  // Title: the largest size (76 → 48) at which it fits three lines and the title band.
  const markup = lines.map((l, i) => `<span weight="600" foreground="${i === 1 ? C.gold : C.fg}">${esc(l)}</span>`).join('\n');
  let title;
  for (let size = 76; size >= 48; size -= 4) {
    title = await textImage(markup, { family: family.title, size, width: W - PAD * 2, align });
    if (title.h <= 270) break;
  }
  const seamTop = 196;
  layers.push({ input: rect(64, 3, C.gold), top: seamTop, left: x(64) });
  layers.push({ input: title.buf, top: seamTop + 28, left: x(title.w) });

  layers.push({ input: rect(W - PAD * 2, 1, C.line), top: 520, left: PAD });
  const desc = await textImage(`<span foreground="${C.muted}">${esc(descriptor)}</span>`, { family: family.body, size: 24, width: 700, align });
  const mk = await textImage(`<span foreground="${C.muted}">${esc(markets)}</span>`, {
    family: family.body,
    size: 24,
    width: 360,
    align: rtl ? 'left' : 'right',
  });
  layers.push({ input: desc.buf, top: 546, left: x(desc.w) });
  layers.push({ input: mk.buf, top: 546, left: xEnd(mk.w) });

  const file = join(OUT, locale, `${key}.png`);
  await sharp({ create: { width: W, height: H, channels: 3, background: C.bg } })
    .composite(layers)
    .png({ compressionLevel: 9 })
    .toFile(file);
}

rmSync(OUT, { recursive: true, force: true });
let n = 0;
for (const l of LOCALES) {
  mkdirSync(join(OUT, l), { recursive: true });
  for (const c of data[l].cards) {
    await card(l, c, data[l]);
    n++;
  }
}
writeFileSync(stamp, hash);
rmSync(fontDir, { recursive: true, force: true });
console.log(`og: ${n} cards (${LOCALES.length} locales × ${data.en.cards.length}) written to ${OUT}/.`);
