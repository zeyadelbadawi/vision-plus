// Runs the real Workers runtime locally (wrangler dev --local / workerd) against out/ and verifies the
// P3 platform behaviour: run_worker_first routing, root negotiation, health route, _headers on assets,
// html_handling, 404 handling. Requires a prior `pnpm build`. No Cloudflare account needed.
import { spawn } from 'node:child_process';

const PORT = 8787;
const BASE = `http://127.0.0.1:${PORT}`;
const proc = spawn('npx', ['wrangler', 'dev', '--local', '--port', String(PORT), '--ip', '127.0.0.1', '--show-interactive-dev-session=false'], {
  stdio: ['ignore', 'pipe', 'pipe'],
  env: { ...process.env, WRANGLER_SEND_METRICS: 'false', CI: '1' },
  detached: true, // own process group, so wrangler AND its workerd child are stopped together
});
const stop = () => {
  try {
    process.kill(-proc.pid, 'SIGTERM');
  } catch {}
};
process.on('exit', stop);
let log = '';
proc.stdout.on('data', (d) => (log += d));
proc.stderr.on('data', (d) => (log += d));

const results = [];
const check = (name, ok, detail = '') => results.push({ name, ok, detail });
const get = (path, init = {}) => fetch(BASE + path, { redirect: 'manual', ...init });

async function waitReady() {
  for (let i = 0; i < 120; i++) {
    try {
      await fetch(`${BASE}/api/contact/health`);
      return;
    } catch {
      await new Promise((r) => setTimeout(r, 500));
    }
  }
  throw new Error('wrangler dev did not start:\n' + log);
}

try {
  await waitReady();

  let r = await get('/');
  check('/ (no hints) → 302 /en', r.status === 302 && r.headers.get('location') === '/en', `${r.status} ${r.headers.get('location')}`);
  check('/ varies on Accept-Language and Cookie', /Accept-Language/.test(r.headers.get('vary') ?? '') && /Cookie/.test(r.headers.get('vary') ?? ''));
  check('/ (worker response) has security headers', r.headers.get('x-content-type-options') === 'nosniff' && !!r.headers.get('x-robots-tag'));

  r = await get('/', { headers: { 'Accept-Language': 'ar-QA,ar;q=0.9,en;q=0.8' } });
  check('/ Accept-Language ar → /ar', r.headers.get('location') === '/ar', r.headers.get('location'));
  r = await get('/', { headers: { 'Accept-Language': 'zh-CN,zh;q=0.9' } });
  check('/ Accept-Language zh-CN → /zh', r.headers.get('location') === '/zh', r.headers.get('location'));
  r = await get('/', { headers: { 'Accept-Language': 'ar', Cookie: 'NEXT_LOCALE=zh' } });
  check('/ cookie NEXT_LOCALE=zh wins over Accept-Language', r.headers.get('location') === '/zh', r.headers.get('location'));
  r = await get('/?utm_source=test', { headers: { 'Accept-Language': 'fr-FR' } });
  check('/ unsupported language → /en, query kept', r.headers.get('location') === '/en?utm_source=test', r.headers.get('location'));

  for (const [l, lang, dir] of [
    ['en', 'en', 'ltr'],
    ['ar', 'ar', 'rtl'],
    ['zh', 'zh-Hans', 'ltr'],
  ]) {
    r = await get(`/${l}`);
    const html = await r.text();
    check(`/${l} 200 with lang="${lang}" dir="${dir}"`, r.status === 200 && html.includes(`<html lang="${lang}" dir="${dir}"`), String(r.status));
    check(
      `/${l} asset response carries _headers (CSP, nosniff, noindex)`,
      !!r.headers.get('content-security-policy') &&
        r.headers.get('x-content-type-options') === 'nosniff' &&
        /noindex/.test(r.headers.get('x-robots-tag') ?? ''),
    );
  }

  r = await get('/en/');
  check(
    '/en/ → redirect to /en (html_handling)',
    [301, 307, 308].includes(r.status) && r.headers.get('location')?.endsWith('/en'),
    `${r.status} ${r.headers.get('location')}`,
  );

  r = await get('/api/contact/health');
  const body = await r.json();
  check('GET /api/contact/health → 200 {status:"ok"}', r.status === 200 && body.status === 'ok' && body.environment === 'preview', JSON.stringify(body));
  check('health is no-store', r.headers.get('cache-control') === 'no-store');
  r = await get('/api/contact/health', { method: 'POST' });
  check('POST /api/contact/health → 405 + Allow', r.status === 405 && r.headers.get('allow') === 'GET, HEAD', String(r.status));
  r = await get('/api/unknown');
  check('/api/unknown → 404 JSON (worker)', r.status === 404 && /json/.test(r.headers.get('content-type') ?? ''), String(r.status));

  r = await get('/en/does-not-exist');
  const nf = await r.text();
  check('unknown page → 404 with the site 404 page', r.status === 404 && nf.includes('Page not found'), String(r.status));
  // P5A-03: "404-page" serves the NEAREST 404.html, so unknown paths under a locale get that locale's 404 page
  check('unknown page under /en → the English 404 page', r.status === 404 && /<html lang="en"/.test(nf) && nf.includes('Popular sections'), String(r.status));
  r = await get('/ar/does-not-exist');
  const nfAr = await r.text();
  check(
    'unknown page under /ar → 404, Arabic RTL 404 page',
    r.status === 404 && /<html lang="ar" dir="rtl"/.test(nfAr) && nfAr.includes('الصفحة غير موجودة'),
    String(r.status),
  );
  r = await get('/zh/solutions/does-not-exist');
  const nfZh = await r.text();
  check(
    'unknown nested page under /zh → 404, Chinese 404 page',
    r.status === 404 && /<html lang="zh-Hans"/.test(nfZh) && nfZh.includes('页面未找到'),
    String(r.status),
  );
  r = await get('/does-not-exist');
  check('unknown page outside a locale → 404, trilingual root page', r.status === 404 && (await r.text()).includes('返回首页'), String(r.status));

  const html = await (await get('/en')).text();
  const asset = html.match(/\/_next\/static\/[^"]+\.js/)?.[0];
  r = await get(asset);
  check(
    '/_next/static/* is immutable-cached',
    r.status === 200 && /immutable/.test(r.headers.get('cache-control') ?? ''),
    `${asset} ${r.headers.get('cache-control')}`,
  );
  r = await get('/ar/solutions/mobile-nvr-mobile-surveillance');
  check(
    'solution page /ar/solutions/mobile-nvr-mobile-surveillance → 200 rtl',
    r.status === 200 && (await r.text()).includes('<html lang="ar" dir="rtl"'),
    String(r.status),
  );
  r = await get('/zh/contact');
  check('template page /zh/contact → 200', r.status === 200, String(r.status));
  r = await get('/en/solutions/video-surveillance');
  check(
    'sitemap alias → 301 to the canonical page',
    r.status === 301 && /\/en\/solutions\/cctv-security-systems$/.test(r.headers.get('location') ?? ''),
    `${r.status} ${r.headers.get('location')}`,
  );
  r = await get('/ar/services/security-consultation');
  check(
    'sitemap alias keeps the #anchor',
    r.status === 301 && /\/ar\/services#system-design-consultancy$/.test(r.headers.get('location') ?? ''),
    `${r.status} ${r.headers.get('location')}`,
  );
  r = await get('/fonts/noto-sans-sc/noto-sans-sc.css');
  check('/fonts/* cached 30 days', r.status === 200 && /max-age=2592000/.test(r.headers.get('cache-control') ?? ''), r.headers.get('cache-control'));
} catch (e) {
  check('smoke run', false, String(e));
} finally {
  stop();
}

const failed = results.filter((r) => !r.ok);
for (const r of results) console.log(`${r.ok ? '✓' : '✗'} ${r.name}${r.ok ? '' : `  [${r.detail}]`}`);
console.log(`worker:smoke — ${results.length - failed.length}/${results.length} passed`);
process.exit(failed.length ? 1 : 0);
