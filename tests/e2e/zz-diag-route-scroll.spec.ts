import { test, type Page } from '@playwright/test';

// TEMPORARY DIAGNOSTIC (2026-10-02) for the WebKit-desktop matrix failure of
// "desktop pinned: scrolling builds the diagram forwards and unbuilds it backwards" (run 37016803278).
// It repeats the failing sequence and logs the scene's real state over time; it never fails. To be removed with the fix.
const MNVR = '/solutions/mobile-nvr-mobile-surveillance';

const snap = (page: Page, label: string) =>
  page.evaluate((label) => {
    const s = document.querySelector<HTMLElement>('.scene')!;
    const r = s.getBoundingClientRect();
    const cs = getComputedStyle(s);
    const st = document.querySelector('.scene__stage')!;
    const gps = st.querySelector('.ax-node[data-beat="2"]')!;
    const alert = st.querySelector('.ax-node--alert')!;
    return {
      label,
      t: Math.round(performance.now()),
      scrollY: Math.round(window.scrollY),
      vh: window.innerHeight,
      top: Math.round(r.top),
      h: Math.round(r.height),
      p: s.style.getPropertyValue('--p'),
      b2: cs.getPropertyValue('--b2').trim(),
      b5: cs.getPropertyValue('--b5').trim(),
      gps: getComputedStyle(gps).opacity,
      gpsK: getComputedStyle(gps).getPropertyValue('--k').trim(),
      alert: getComputedStyle(alert).opacity,
      current: s.dataset.current,
      steps: Array.from(document.querySelectorAll('.scene__step')).map((e) => Math.round(e.getBoundingClientRect().top)),
      header: Math.round(document.querySelector('header')!.getBoundingClientRect().height),
      docH: document.documentElement.scrollHeight,
    };
  }, label);

const centreBeat = (page: Page, n: number) =>
  page.evaluate((step) => {
    const el = document.querySelector(`.scene__step[data-step="${step}"]`)!;
    const r = el.getBoundingClientRect();
    const target = window.scrollY + r.top + r.height / 2 - window.innerHeight / 2;
    window.scrollTo(0, target);
    return { target: Math.round(target), after: Math.round(window.scrollY) };
  }, n);

test('DIAG (temporary): pinned scene state while scrolling to beat 5 and back to beat 2', async ({ page }, info) => {
  test.skip((info.project.use.viewport?.width ?? 0) < 1024, 'desktop only');
  await page.goto(`/en${MNVR}`);
  const rows: unknown[] = [await snap(page, 'loaded')];
  rows.push({ scroll5: await centreBeat(page, 5) });
  for (const ms of [0, 50, 150, 400, 1000]) {
    await page.waitForTimeout(ms);
    rows.push(await snap(page, `beat5+${ms}`));
  }
  rows.push({ scroll2: await centreBeat(page, 2) });
  for (let i = 0; i < 12; i++) {
    rows.push(await snap(page, `beat2 poll ${i}`));
    await page.waitForTimeout(100);
  }
  await page.waitForTimeout(1500);
  rows.push(await snap(page, 'beat2 +2.7s'));
  for (const row of rows) console.log(`DIAG ${info.project.name} ${JSON.stringify(row)}`);
});
