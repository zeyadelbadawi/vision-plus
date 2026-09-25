// Dev utility: full-page screenshots per locale × width (review aid, not a test).
import { chromium } from '@playwright/test';
const [,, locales = 'en', widths = '1440', mode = 'motion'] = process.argv;
const browser = await chromium.launch();
for (const l of locales.split(',')) {
  for (const w of widths.split(',').map(Number)) {
    const ctx = await browser.newContext({ viewport: { width: w, height: w < 768 ? 844 : 900 }, deviceScaleFactor: 1, reducedMotion: mode === 'reduce' ? 'reduce' : 'no-preference' });
    const page = await ctx.newPage();
    await page.goto(`http://localhost:4173/${l}`, { waitUntil: 'networkidle' });
    // scroll through so in-view motion settles, then back to top
    const h = await page.evaluate(() => document.body.scrollHeight);
    for (let y = 0; y < h; y += 600) { await page.evaluate((yy) => window.scrollTo(0, yy), y); await page.waitForTimeout(120); }
    await page.waitForTimeout(2200);
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(400);
    await page.screenshot({ path: `tests/screenshots/${l}-${w}-${mode}.png`, fullPage: true });
    console.log(`shot ${l} ${w} ${mode} (${h}px)`);
    await ctx.close();
  }
}
await browser.close();
