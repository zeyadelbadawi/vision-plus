// Dev utility: interactive-state screenshots (mega menu, language menu, mobile drawer).
import { chromium } from '@playwright/test';
const b = await chromium.launch();
async function page(l, w) {
  const c = await b.newContext({ viewport: { width: w, height: w < 768 ? 844 : 900 } });
  const p = await c.newPage();
  await p.goto(`http://localhost:4173/${l}`, { waitUntil: 'networkidle' });
  return p;
}
for (const [l, key] of [
  ['en', 'Solutions'],
  ['ar', 'الخدمات'],
  ['zh', '行业'],
]) {
  const p = await page(l, 1440);
  await p.getByRole('button', { name: key }).click();
  await p.waitForTimeout(500);
  await p.screenshot({ path: `tests/screenshots/state-${l}-mega.png` });
}
for (const l of ['en', 'ar']) {
  const p = await page(l, 390);
  await p.locator('.menu-button').first().click();
  await p.waitForTimeout(500);
  await p.locator('.drawer__trigger').first().click();
  await p.waitForTimeout(300);
  await p.screenshot({ path: `tests/screenshots/state-${l}-drawer.png` });
}
await b.close();
