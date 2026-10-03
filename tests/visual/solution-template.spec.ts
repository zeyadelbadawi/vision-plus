import { expect, test } from '@playwright/test';

// P5-T1 first scope (MASTER_PROJECT_PLAN §55.3.10): the §26.2 solution template on its 7 pages
// × 3 locales × 4 widths × default/reduced motion. Run with `pnpm test:visual` (Playwright Docker image only).
const SLUGS = [
  'cctv-security-systems',
  'access-control',
  'networking-ict',
  'elv-systems',
  'audio-visual',
  'smart-building-home-automation',
  'fire-alarm-systems',
];
const LOCALES = ['en', 'ar', 'zh'];
const WIDTHS = [390, 768, 1440, 1920];
const MOTION = ['default', 'reduce'] as const;

for (const slug of SLUGS) {
  for (const locale of LOCALES) {
    for (const width of WIDTHS) {
      for (const motion of MOTION) {
        const name = `solution-${slug}-${locale}-${width}-${motion}`;
        test(name, async ({ browser }) => {
          const context = await browser.newContext({
            viewport: { width, height: 900 },
            reducedMotion: motion === 'reduce' ? 'reduce' : 'no-preference',
          });
          const page = await context.newPage();
          await page.goto(`/${locale}/solutions/${slug}`, { waitUntil: 'networkidle' });
          await page.evaluate(() => document.fonts.ready);
          // let the motion controller start and the first viewport's reveals apply (two frames), deterministically
          await page.evaluate(() => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r))));
          await expect(page).toHaveScreenshot(`${name}.png`, { fullPage: true });
          await context.close();
        });
      }
    }
  }
}
