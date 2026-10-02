import { test } from '@playwright/test';

// TEMPORARY DIAGNOSTIC (2026-10-02) for matrix run 37025609848: in firefox-desktop the On board container did not get
// data-live within 5 s of load. This records, from inside the page, when the MotionController marks each scene, plus
// page errors, over repeated loads in every project. It never fails. To be removed with the fix.
const MNVR = '/solutions/mobile-nvr-mobile-surveillance';

test('DIAG (temporary): MotionController start-up time and errors', async ({ page }, info) => {
  test.setTimeout(240_000);
  const errors: string[] = [];
  page.on('pageerror', (e) => errors.push(`pageerror: ${e.message}`));
  page.on('console', (m) => m.type() === 'error' && errors.push(`console: ${m.text().slice(0, 200)}`));
  page.on('requestfailed', (r) => errors.push(`requestfailed: ${r.url().slice(-80)} ${r.failure()?.errorText}`));
  await page.addInitScript(() => {
    const marks: Record<string, number> = {};
    (window as unknown as { __marks: Record<string, number> }).__marks = marks;
    new MutationObserver(() => {
      const now = Math.round(performance.now());
      if (!marks.motionOk && document.documentElement.classList.contains('motion-ok')) marks.motionOk = now;
      if (!marks.sysLive && document.querySelector('.sys[data-live]')) marks.sysLive = now;
      if (!marks.sceneLive && document.querySelector('.scene[data-live]')) marks.sceneLive = now;
    }).observe(document, { attributes: true, subtree: true, childList: true });
  });
  for (let i = 0; i < 12; i++) {
    errors.length = 0;
    const t0 = Date.now();
    await page.goto(`/en${MNVR}`);
    const loadMs = Date.now() - t0;
    let live = true;
    try {
      await page.waitForFunction(() => document.querySelector('.sys[data-live]') && document.querySelector('.scene[data-live]'), null, { timeout: 15_000 });
    } catch {
      live = false;
    }
    const state = await page.evaluate(() => {
      const nav = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming | undefined;
      const sys = document.querySelector('.sys')!;
      return {
        marks: (window as unknown as { __marks: Record<string, number> }).__marks,
        dcl: Math.round(nav?.domContentLoadedEventEnd ?? -1),
        load: Math.round(nav?.loadEventEnd ?? -1),
        now: Math.round(performance.now()),
        sysAttrs: Array.from(sys.attributes).map((a) => a.name),
        html: document.documentElement.className.includes('motion-ok'),
        reduce: matchMedia('(prefers-reduced-motion: reduce)').matches,
      };
    });
    console.log(`DIAG2 ${info.project.name} ${JSON.stringify({ i, loadMs, live, ...state, errors: [...errors] })}`);
  }
});
