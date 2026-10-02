// P2 review screenshot set (MASTER_PROJECT_PLAN §49.1 P2 output: "screenshots at 390, 768, 1440 and 1920 in
// 3 locales"). Needed while no preview URL exists (D-22). Serve the build first: `pnpm build && pnpm serve`.
// Writes docs/review/p2/*.webp — final (reduced-motion) states plus the six pinned beats of the Route scene.
// OUT=docs/review/p2-mnvr-revision ONLY=mnvr limits the set to the Mobile NVR page and adds the "On board" steps.
// Motion shots are taken ~1.3 s after each step becomes current, i.e. while that step's finite pulses are playing.
import { mkdirSync } from 'node:fs';
import { chromium } from '@playwright/test';
import sharp from 'sharp';

const OUT = process.env.OUT ?? 'docs/review/p2';
const ONLY = process.env.ONLY;
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
].filter(([slug]) => !ONLY || slug === ONLY)) {
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

// Route scene at each beat (motion allowed): pinned stage on desktop, stepped frames on mobile; en, ar and zh
for (const [locale, width] of [
  ['en', 1440],
  ['ar', 1440],
  ['zh', 1440],
  ['en', 390],
  ['ar', 390],
  ['zh', 390],
]) {
  const ctx = await browser.newContext({ viewport: { width, height: width < 768 ? 844 : 900 } });
  const page = await ctx.newPage();
  await page.goto(`${BASE}/${locale}/solutions/mobile-nvr-mobile-surveillance`, { waitUntil: 'networkidle' });
  for (let beat = 1; beat <= 6; beat++) {
    const y = await page.evaluate((n) => {
      const step = document.querySelector(`.scene__step[data-step="${n}"]`);
      return window.scrollY + step.getBoundingClientRect().top - innerHeight * 0.4;
    }, beat);
    await page.evaluate((yy) => window.scrollTo(0, yy), y);
    await page.waitForTimeout(width < 768 ? 1700 : 1300);
    await save(await page.screenshot(), `route-${locale}-${width}-beat-${beat}`, width);
  }
  await ctx.close();
}
// "On board" system diagram, one shot per current step (motion allowed): desktop and mobile, en, ar and zh
for (const [locale, width] of [
  ['en', 1440],
  ['ar', 1440],
  ['zh', 1440],
  ['en', 390],
  ['ar', 390],
  ['zh', 390],
]) {
  const ctx = await browser.newContext({ viewport: { width, height: width < 768 ? 844 : 900 } });
  const page = await ctx.newPage();
  await page.goto(`${BASE}/${locale}/solutions/mobile-nvr-mobile-surveillance`, { waitUntil: 'networkidle' });
  for (let step = 1; step <= 5; step++) {
    const y = await page.evaluate((n) => {
      const el = document.querySelector(`.sys__step[data-step="${n}"]`);
      return window.scrollY + el.getBoundingClientRect().top - innerHeight * 0.4;
    }, step);
    await page.evaluate((yy) => window.scrollTo(0, yy), y);
    await page.waitForTimeout(1300);
    await save(await page.screenshot(), `onboard-${locale}-${width}-step-${step}`, width);
  }
  await ctx.close();
}
await browser.close();
