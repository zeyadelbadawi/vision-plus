// Mobile NVR visual concepts (preview prototype for review, 2026-10-02): screenshots of /_lab/mnvr-concepts.
// Serve the build first (`pnpm build && pnpm serve`). Writes docs/review/p2-mnvr-concepts/*.webp:
//   a-{locale}-{width}-step-{n}  Concept A (On board cutaway) with motion, each step current
//   b-{locale}-{width}-beat-{n}  Concept B (system architecture) with motion, each beat current
//   {a,b}-{locale}-{width}-static  reduced motion: the complete, still state
import { mkdirSync } from 'node:fs';
import { chromium } from '@playwright/test';
import sharp from 'sharp';

const OUT = process.env.OUT ?? 'docs/review/p2-mnvr-concepts';
const BASE = process.env.BASE_URL ?? 'http://localhost:4173';
mkdirSync(OUT, { recursive: true });
const browser = await chromium.launch();
const save = async (buf, name, width) => {
  await sharp(buf)
    .resize({ width: Math.min(width, 1440), withoutEnlargement: true })
    .webp({ quality: 70 })
    .toFile(`${OUT}/${name}.webp`);
  console.log(`${OUT}/${name}.webp`);
};
const SETS = [
  ['en', 1440],
  ['ar', 1440],
  ['zh', 1440],
  ['en', 390],
  ['ar', 390],
  ['zh', 390],
];
for (const [locale, width] of SETS) {
  const ctx = await browser.newContext({ viewport: { width, height: width < 768 ? 844 : 900 } });
  const page = await ctx.newPage();
  await page.goto(`${BASE}/${locale}/_lab/mnvr-concepts`, { waitUntil: 'networkidle' });
  await page.waitForFunction(() => document.querySelector('[data-steps]')?.hasAttribute('data-live'));
  for (const [key, sel, n] of [
    ['a', '.cx__step', 5],
    ['b', '.ax__step', 6],
  ]) {
    for (let i = 1; i <= n; i++) {
      await page.evaluate(
        ([s, k]) => {
          const el = document.querySelector(`${s}[data-step="${k}"]`);
          window.scrollTo(0, window.scrollY + el.getBoundingClientRect().top - innerHeight * 0.4);
        },
        [sel, i],
      );
      await page.waitForTimeout(1700);
      await save(await page.screenshot(), `${key}-${locale}-${width}-${key === 'a' ? 'step' : 'beat'}-${i}`, width);
    }
  }
  await ctx.close();
  // reduced motion: each concept's stage (desktop) or the whole section (mobile), complete and still
  const rm = await browser.newContext({ viewport: { width, height: width < 768 ? 844 : 900 }, reducedMotion: 'reduce' });
  const p2 = await rm.newPage();
  await p2.goto(`${BASE}/${locale}/_lab/mnvr-concepts`, { waitUntil: 'networkidle' });
  for (const [key, sel] of [
    ['a', width < 1024 ? '.concept-a' : '.cx__stage'],
    ['b', width < 1024 ? '.ax__step[data-step="6"] .ax__frame' : '.ax__stage'],
  ]) {
    await save(await p2.locator(sel).first().screenshot(), `${key}-${locale}-${width}-static`, width);
  }
  await rm.close();
}
await browser.close();
