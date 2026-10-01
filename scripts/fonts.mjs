// Chinese web font (§15.2), built for performance: Noto Sans SC (OFL, variable wght) is SUBSET at build
// time to exactly the CJK glyphs used by the zh content (src/content/copy/zh/** + messages/zh.json).
// Output: a handful of small woff2 files + one tiny stylesheet, linked only on /zh.
// Same typeface and design as before — only unused glyphs are removed. Characters added later are
// picked up on the next build; anything not in the subset falls back to the system CJK font stack.
import { mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import subsetFont from 'subset-font';

const SRC = 'node_modules/@fontsource-variable/noto-sans-sc';
const OUT = 'public/fonts/noto-sans-sc';

// 1. Collect the CJK characters actually used (CJK symbols & punctuation, kana-free ideographs, full-width forms).
const files = [...readdirSync('src/content/copy/zh').map((f) => join('src/content/copy/zh', f)), 'messages/zh.json'];
const used = new Set();
for (const f of files) for (const ch of readFileSync(f, 'utf8')) if (ch.codePointAt(0) >= 0x2e80) used.add(ch.codePointAt(0));

// 2. Parse the upstream @font-face blocks (each a numbered unicode-range slice).
const css = readFileSync(`${SRC}/index.css`, 'utf8');
const blocks = [...css.matchAll(/@font-face\s*{([^}]+)}/g)].map((m) => {
  const body = m[1];
  const file = body.match(/url\(\.\/files\/([^)]+)\)/)[1];
  const ranges = body.match(/unicode-range:\s*([^;]+);/)[1].split(',').map((r) => {
    const [a, b] = r.trim().replace(/^U\+/i, '').split('-');
    return [parseInt(a, 16), parseInt(b ?? a, 16)];
  });
  return { file, ranges };
});

// 3. Subset every slice that contains used characters.
rmSync(OUT, { recursive: true, force: true });
mkdirSync(OUT, { recursive: true });
const rules = [];
let bytes = 0;
const toRange = (cps) => cps.map((c) => `U+${c.toString(16)}`).join(',');
for (const b of blocks) {
  const cps = [...used].filter((c) => b.ranges.some(([lo, hi]) => c >= lo && c <= hi)).sort((x, y) => x - y);
  if (!cps.length) continue;
  const text = String.fromCodePoint(...cps);
  const out = await subsetFont(readFileSync(`${SRC}/files/${b.file}`), text, { targetFormat: 'woff2' }); // keeps the wght axis
  const name = b.file.replace('noto-sans-sc-', 'nssc-').replace('-wght-normal', '');
  writeFileSync(`${OUT}/${name}`, out);
  bytes += out.length;
  rules.push(`@font-face{font-family:'Noto Sans SC Variable';font-style:normal;font-display:swap;font-weight:100 900;src:url(./${name}) format('woff2-variations');unicode-range:${toRange(cps)}}`);
}
writeFileSync(
  `${OUT}/noto-sans-sc.css`,
  `/* Noto Sans SC Variable — © Google, SIL OFL 1.1 (via @fontsource-variable/noto-sans-sc). Build-time subset: ${used.size} glyphs. */\n${rules.join('\n')}\n`,
);
console.log(`fonts: Noto Sans SC subset — ${used.size} glyphs in ${rules.length} file(s), ${(bytes / 1024).toFixed(0)} KB total`);
