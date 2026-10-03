import { expect, test } from '@playwright/test';

// P5-T1, second scope (MASTER_PROJECT_PLAN §55.3.10): the approved pages × 3 locales × default/reduced motion. The
// Mobile NVR page (P2) at all 4 widths; home at 390 and 1440 only, because its full-page photographs make each shot up
// to 5 MB in Git LFS (Ziad, 2026-10-03). Further templates join as they pass client review. Run with
// `pnpm test:visual` (Playwright Docker image only).
const PAGES = [
  ['home', '', [390, 1440]],
  ['mobile-nvr', '/solutions/mobile-nvr-mobile-surveillance', [390, 768, 1440, 1920]],
] as const;
const LOCALES = ['en', 'ar', 'zh'];
const MOTION = ['default', 'reduce'] as const;

for (const [key, path, widths] of PAGES) {
  for (const locale of LOCALES) {
    for (const width of widths) {
      for (const motion of MOTION) {
        const name = `${key}-${locale}-${width}-${motion}`;
        test(name, async ({ browser }) => {
          const context = await browser.newContext({
            viewport: { width, height: 900 },
            reducedMotion: motion === 'reduce' ? 'reduce' : 'no-preference',
          });
          const page = await context.newPage();
          await page.goto(`/${locale}${path}`, { waitUntil: 'networkidle' });
          // A full-page capture does not scroll, so lazy images below the fold would load mid-capture: switch them to eager
          // and wait until every image has real pixels (`complete` alone is true before a deferred image is fetched).
          await page.evaluate(() => {
            for (const img of document.images) img.loading = 'eager';
          });
          await page.waitForFunction(() => [...document.images].every((img) => img.complete && img.naturalWidth > 0), null, { timeout: 30_000 });
          await page.evaluate(() => document.fonts.ready);
          // let the motion controller start and the first viewport's reveals apply (two frames), deterministically
          await page.evaluate(() => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r))));
          await expect(page).toHaveScreenshot(`${name}.png`, { fullPage: true, timeout: 20_000 });
          await context.close();
        });
      }
    }
  }
}
