// Performance budget (MASTER_PROJECT_PLAN §37 as corrected by IMPLEMENTATION_NOTES I-04):
// module JS per route ≤ framework baseline + app allowance; CSS and HTML caps. Fails CI on breach.
import { readFileSync } from 'node:fs';
import { gzipSync } from 'node:zlib';

const BUDGET = { jsKb: 160, cssKb: 30, htmlKb: 40 }; // home: JS 142.8 · CSS 12.4 · HTML 22.9–25.1; scene page measured in docs (gzip)
const ROUTES = ['en', 'ar', 'zh', 'en/solutions/mobile-nvr-mobile-surveillance', 'ar/solutions/mobile-nvr-mobile-surveillance', 'en/services'];
let failed = false;
for (const r of ROUTES) {
  const html = readFileSync(`out/${r}.html`, 'utf8');
  const tags = [...html.matchAll(/<script([^>]*)>/g)].map((m) => m[1]).filter((a) => /src="/.test(a) && !/noModule/i.test(a));
  const js = tags.map((a) => a.match(/src="([^"]+)"/)[1]);
  // Stylesheets: linked files (if any) + CSS inlined into the HTML (experimental.inlineCss).
  const css = [...new Set([...html.matchAll(/<link[^>]*rel="stylesheet"[^>]*href="(\/_next\/static\/[^"]+\.css)"/g)].map((m) => m[1]))];
  const inlineCss = [...html.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/g)].map((m) => m[1]).join('');
  const gz = (files) => files.reduce((n, f) => n + gzipSync(readFileSync(`out${f}`)).length, 0) / 1024;
  const sizes = { jsKb: gz(js), cssKb: gz(css) + gzipSync(inlineCss).length / 1024, htmlKb: gzipSync(html).length / 1024 };
  const over = Object.entries(BUDGET).filter(([k, max]) => sizes[k] > max);
  if (over.length) failed = true;
  console.log(
    `budget /${r}: JS ${sizes.jsKb.toFixed(1)}/${BUDGET.jsKb} KB · CSS ${sizes.cssKb.toFixed(1)}/${BUDGET.cssKb} KB · HTML ${sizes.htmlKb.toFixed(1)}/${BUDGET.htmlKb} KB ${over.length ? '✗ OVER: ' + over.map(([k]) => k).join(', ') : '✓'}`,
  );
}
process.exit(failed ? 1 : 0);
