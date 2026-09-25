// Dev utility: viewport screenshots at a given scroll anchor (selector) per locale/width.
import { chromium } from '@playwright/test';
const [,, locales = 'en', widths = '1440', anchor = 'top', mode = 'motion'] = process.argv;
const browser = await chromium.launch();
for (const l of locales.split(',')) for (const w of widths.split(',').map(Number)) {
  const ctx = await browser.newContext({ viewport: { width: w, height: w < 768 ? 844 : 900 }, reducedMotion: mode === 'reduce' ? 'reduce' : 'no-preference' });
  const p = await ctx.newPage();
  await p.goto(`http://localhost:4173/${l}`, { waitUntil: 'networkidle' });
  if (anchor !== 'top') { await p.evaluate((s) => document.querySelector(s)?.scrollIntoView({ block: 'start' }), anchor); await p.waitForTimeout(2600); }
  else await p.waitForTimeout(2600);
  const name = `tests/screenshots/vp-${l}-${w}-${anchor.replace(/[^a-z0-9]/gi, '')}-${mode}.png`;
  await p.screenshot({ path: name });
  console.log(name);
  await ctx.close();
}
await browser.close();
