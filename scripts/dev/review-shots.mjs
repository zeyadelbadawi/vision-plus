// P2 review screenshot set (MASTER_PROJECT_PLAN §49.1 P2 output: "screenshots at 390, 768, 1440 and 1920 in
// 3 locales"). Needed while no preview URL exists (D-22). Serve the build first: `pnpm build && pnpm serve`.
// Writes docs/review/p2/*.webp — final (reduced-motion) states plus the six pinned beats of the Route scene.
import { mkdirSync } from 'node:fs';
import { chromium } from '@playwright/test';
import sharp from 'sharp';

const OUT = 'docs/review/p2';
const BASE = 'http://localhost:4173';
mkdirSync(OUT, { recursive: true });
const browser = await chromium.launch();
const save = async (buf, name, width) => {
  await sharp(buf)
    .resize({ width: Math.min(width, 1440), withoutEnlargement: true })
    .webp({ quality: 68 })
    .toFile(`${OUT}/${name}.webp`);
  console.log(`${OUT}/${name}.webp`);
};

for (const [slug, path] of [
  ['mnvr', '/solutions/mobile-nvr-mobile-surveillance'],
  ['styleguide', '/_lab'],
]) {
  for (const locale of ['en', 'ar', 'zh']) {
    for (const width of [390, 768, 1440, 1920]) {
      const ctx = await browser.newContext({ viewport: { width, height: width < 768 ? 844 : 900 }, reducedMotion: 'reduce' });
      const page = await ctx.newPage();
      await page.goto(`${BASE}/${locale}${path}`, { waitUntil: 'networkidle' });
      await page.evaluate(() => document.fonts.ready);
      await save(await page.screenshot({ fullPage: true }), `${slug}-${locale}-${width}`, width);
      await ctx.close();
    }
  }
}

// Pinned Route scene at each beat (desktop, motion allowed), en and ar
for (const locale of ['en', 'ar']) {
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  await page.goto(`${BASE}/${locale}/solutions/mobile-nvr-mobile-surveillance`, { waitUntil: 'networkidle' });
  for (let beat = 1; beat <= 6; beat++) {
    const y = await page.evaluate((n) => {
      const step = document.querySelector(`.scene__step[data-step="${n}"]`);
      const r = step.getBoundingClientRect();
      return window.scrollY + r.top + r.height / 2 - innerHeight / 2;
    }, beat);
    await page.evaluate((yy) => window.scrollTo(0, yy), y);
    await page.waitForTimeout(600);
    await save(await page.screenshot(), `route-${locale}-beat-${beat}`, 1440);
  }
  await ctx.close();
}
await browser.close();
