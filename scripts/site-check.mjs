// Built-site check (MASTER_PROJECT_PLAN §40 "SEO" row + internal-link integrity), run on out/ after `pnpm build`.
// For every generated page:
//  - every internal link resolves to a built page, and every #anchor exists on its target page
//  - exactly one <h1>; <title> ≤ 60 characters and a meta description ≤ 155 (the 404 page is exempt)
//  - <html lang/dir> match the locale prefix (en/ltr, ar/rtl, zh-Hans/ltr)
// and every out/_redirects target resolves. Exits 1 on any error.
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

const OUT = 'out';
if (!existsSync(OUT)) {
  console.error('site:check — out/ not found; run pnpm build first');
  process.exit(1);
}
const LOCALES = { en: ['en', 'ltr'], ar: ['ar', 'rtl'], zh: ['zh-Hans', 'ltr'] };
const pages = [];
const walk = (dir) => {
  for (const f of readdirSync(dir)) {
    const p = join(dir, f);
    if (statSync(p).isDirectory()) {
      if (f !== '_next' && f !== '_img' && f !== 'fonts' && f !== 'images') walk(p);
    } else if (f.endsWith('.html')) pages.push(p);
  }
};
walk(OUT);

const routeOf = (file) => '/' + file.slice(OUT.length + 1).replace(/\.html$/, '').replace(/^index$/, '');
const fileOf = (route) => {
  const r = route.replace(/\/$/, '') || '/';
  return r === '/' ? join(OUT, 'index.html') : join(OUT, `${r}.html`);
};
const html = new Map(pages.map((p) => [routeOf(p), readFileSync(p, 'utf8')]));
const ids = new Map([...html].map(([r, h]) => [r, new Set([...h.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1]))]));
const decode = (s) => s.replace(/&amp;/g, '&').replace(/&#x27;|&#39;/g, "'").replace(/&quot;/g, '"').replace(/&lt;/g, '<').replace(/&gt;/g, '>');

const errors = [];
let links = 0;
for (const [route, h] of html) {
  if (route === '/404' || route === '/_not-found') continue;
  const where = route || '/';

  for (const m of h.matchAll(/<a\s[^>]*href="([^"]+)"/g)) {
    const href = decode(m[1]);
    if (!href.startsWith('/') || href.startsWith('//')) continue;
    links++;
    const [pathAndQuery, anchor] = href.split('#');
    const path = pathAndQuery.split('?')[0];
    if (!existsSync(fileOf(path))) errors.push(`${where}: link to missing page ${href}`);
    else if (anchor && !ids.get(path.replace(/\/$/, '') || '/')?.has(anchor)) errors.push(`${where}: anchor #${anchor} not found on ${path}`);
  }
  for (const m of h.matchAll(/href="#([^"]+)"/g)) if (!ids.get(route)?.has(m[1])) errors.push(`${where}: in-page anchor #${m[1]} missing`);

  if (route === '/') continue; // the root page is a locale redirect
  const h1 = (h.match(/<h1[\s>]/g) ?? []).length;
  if (h1 !== 1) errors.push(`${where}: ${h1} <h1> elements (expected 1)`);
  const title = decode(h.match(/<title>([^<]*)<\/title>/)?.[1] ?? '');
  if (!title) errors.push(`${where}: missing <title>`);
  else if (title.length > 60 && !route.endsWith('/_lab')) errors.push(`${where}: title is ${title.length} chars (max 60): ${title}`);
  const desc = decode(h.match(/<meta name="description" content="([^"]*)"/)?.[1] ?? '');
  if (!desc && !route.endsWith('/_lab')) errors.push(`${where}: missing meta description`);
  else if (desc.length > 155) errors.push(`${where}: description is ${desc.length} chars (max 155)`);

  const locale = route.split('/')[1];
  if (LOCALES[locale]) {
    const [lang, dir] = LOCALES[locale];
    if (!h.includes(`<html lang="${lang}" dir="${dir}"`)) errors.push(`${where}: expected <html lang="${lang}" dir="${dir}">`);
  }
}

let redirects = 0;
if (existsSync(join(OUT, '_redirects'))) {
  for (const line of readFileSync(join(OUT, '_redirects'), 'utf8').split('\n')) {
    if (!line.trim() || line.startsWith('#')) continue;
    const [from, to, code] = line.split(/\s+/);
    redirects++;
    if (code !== '301') errors.push(`_redirects: ${from} uses ${code}, expected 301`);
    if (existsSync(fileOf(from))) errors.push(`_redirects: ${from} collides with a real page`);
    const [path, anchor] = to.split('?')[0].split('#');
    if (!existsSync(fileOf(path))) errors.push(`_redirects: ${from} → missing ${to}`);
    else if (anchor && !ids.get(path)?.has(anchor)) errors.push(`_redirects: ${from} → anchor #${anchor} not on ${path}`);
  }
}

console.log(`site:check — ${html.size} pages, ${links} internal links, ${redirects} redirects checked; ${errors.length} error(s)`);
for (const e of errors) console.error(`  ${e}`);
process.exit(errors.length ? 1 : 0);
