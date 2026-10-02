// Homepage protection check for content changes made by client decision. Serve the approved baseline build on :4174
// and the current build on :4173, list the sections that legitimately changed in HIDE (comma-separated
// aria-labelledby ids), and every OTHER section is compared pixel for pixel at identical document offsets
// (en/ar/zh × 390/768/1440/1920, reduced motion). The header and footer are excluded; compare them separately.
// Usage: HIDE=approach-title,industries-title,projects-title node scripts/dev/home-unchanged-diff.mjs
import { chromium } from '@playwright/test';
import sharp from 'sharp';
const HIDE = (process.env.HIDE ?? 'approach-title,industries-title,projects-title').split(',');
const b = await chromium.launch();
const grab = async (url, w) => {
  const ctx = await b.newContext({ viewport: { width: w, height: 900 }, reducedMotion: 'reduce' });
  const p = await ctx.newPage();
  await p.goto(url, { waitUntil: 'networkidle' });
  await p.evaluate(() => document.fonts.ready);
  await p.addStyleTag({
    content:
      HIDE.map((id) => `section[aria-labelledby="${id}"]`).join(',') +
      '{display:none!important} header{visibility:hidden!important} footer{display:none!important}',
  });
  await p.waitForTimeout(100);
  const s = await p.screenshot({ fullPage: true });
  await ctx.close();
  return sharp(s).raw().toBuffer({ resolveWithObject: true });
};
for (const l of ['en', 'ar', 'zh'])
  for (const w of [390, 768, 1440, 1920]) {
    const [a, c] = await Promise.all([grab(`${process.env.BASE_URL ?? 'http://localhost:4174'}/${l}`, w), grab(`http://localhost:4173/${l}`, w)]);
    let n = 0;
    if (a.info.height !== c.info.height) {
      console.log(l, w, 'height', a.info.height, c.info.height);
      continue;
    }
    for (let i = 0; i < a.data.length; i += a.info.channels)
      if (a.data[i] !== c.data[i] || a.data[i + 1] !== c.data[i + 1] || a.data[i + 2] !== c.data[i + 2]) n++;
    console.log(`${l} ${w}: unchanged sections (8) — ${n} differing px over ${a.info.width}×${a.info.height}`);
  }
await b.close();
