import AxeBuilder from '@axe-core/playwright';
import { expect, test, type TestInfo } from '@playwright/test';

// Inner pages (P2 Mobile NVR page + style guide, P3 empty templates) in every locale and at both
// viewports (the desktop/mobile Playwright projects). §40: axe on every template × locale × 2 viewports.
const LOCALES = [
  { code: 'en', lang: 'en', dir: 'ltr' },
  { code: 'ar', lang: 'ar', dir: 'rtl' },
  { code: 'zh', lang: 'zh-Hans', dir: 'ltr' },
] as const;
const ROUTES = [
  '/solutions',
  '/solutions/mobile-nvr-mobile-surveillance',
  '/solutions/cctv-security-systems',
  '/industries',
  '/services',
  '/projects',
  '/about',
  '/partners',
  '/company-profile',
  '/contact',
  '/privacy',
  '/_lab',
];
const MNVR = '/solutions/mobile-nvr-mobile-surveillance';

for (const l of LOCALES) {
  for (const route of ROUTES) {
    test(`${route} /${l.code}: language, structure, overflow and accessibility`, async ({ page }) => {
      const res = await page.goto(`/${l.code}${route}`);
      expect(res?.status()).toBe(200);
      await expect(page.locator('html')).toHaveAttribute('lang', l.lang);
      await expect(page.locator('html')).toHaveAttribute('dir', l.dir);
      await expect(page.locator('h1')).toHaveCount(1);
      await expect(page.locator('nav.breadcrumbs [aria-current="page"]')).toHaveCount(1);
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
      expect(overflow).toBeLessThanOrEqual(0);
      // The interim text wordmark is a logotype: WCAG 1.4.3 sets no contrast requirement for "text that is part of
      // a logo or brand name", so its gold "PLUS" on the light header is excluded (and only it). The official
      // logo (D-05) must still ship a light-background variant.
      const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa']).exclude('.wordmark__plus').analyze();
      const serious = results.violations.filter((v) => v.impact === 'serious' || v.impact === 'critical');
      expect(serious.map((v) => `${v.id}: ${v.nodes.length} × ${v.help} — ${v.nodes[0]?.target.join(' ')}`)).toEqual([]);
    });
  }
}

test('every navigation anchor lands on a section of its page', async ({ page }) => {
  for (const [path, id] of [
    ['/en/services', 'approach'],
    ['/en/industries', 'banking-finance'],
    ['/en/about', 'why-vision-plus'],
    ['/en/contact', 'locations'],
  ] as const) {
    await page.goto(`${path}#${id}`);
    await expect(page.locator(`#${id}`)).toBeInViewport();
  }
});

test('Products is hidden (Q-02): not built, not linked from the navigation', async ({ page }) => {
  for (const l of ['en', 'ar', 'zh']) {
    const res = await page.goto(`/${l}/products`);
    expect(res?.status()).toBe(404);
  }
  await page.goto('/en');
  await expect(page.locator('a[href$="/products"], a[href*="/products#"]')).toHaveCount(0);
});

test('illustrative samples are labelled on every rendering (Q-12, D-01/D-02)', async ({ page }) => {
  for (const l of ['en', 'ar', 'zh']) {
    await page.goto(`/${l}`);
    const samples = page.locator('[data-sample]');
    expect(await samples.count()).toBe(5); // 3 project cards + 2 office blocks
    for (const el of await samples.all()) await expect(el.locator('.sample-tag')).toHaveCount(1);
    // dummy contact details are never actionable (D-04)
    await expect(page.locator('footer a[href^="tel:"], footer a[href^="mailto:"]')).toHaveCount(0);
  }
});

test.describe('Mobile NVR page — On board system diagram (P2 revision)', () => {
  const layerOpacity = (page: import('@playwright/test').Page, n: number) =>
    page.locator(`.sys-layer[data-layer="${n}"]`).evaluate((el) => Number(getComputedStyle(el).opacity));

  test('steps light their part of the vehicle as they scroll into view', async ({ page }) => {
    await page.goto(`/en${MNVR}`);
    await page.locator('.sys').scrollIntoViewIfNeeded();
    await page.waitForTimeout(900);
    expect(await layerOpacity(page, 5)).toBeLessThan(0.5); // later steps are still waiting
    for (const n of [1, 2, 3, 4, 5]) await page.locator(`.sys__step[data-step="${n}"]`).scrollIntoViewIfNeeded();
    await page.waitForTimeout(1200);
    for (const n of [1, 2, 3, 4, 5]) expect(await layerOpacity(page, n), `layer ${n}`).toBe(1);
  });

  test('reduced motion: the complete diagram, no waiting states', async ({ browser }) => {
    const ctx = await browser.newContext({ reducedMotion: 'reduce' });
    const page = await ctx.newPage();
    await page.goto(`/en${MNVR}`);
    for (const n of [1, 2, 3, 4, 5]) expect(await layerOpacity(page, n), `layer ${n}`).toBe(1);
    await ctx.close();
  });

  test('RTL mirrors the diagram but never the step numbers', async ({ page }) => {
    await page.goto(`/ar${MNVR}`);
    await expect(page.locator('.sys-art > g').first()).toHaveAttribute('transform', /scale\(-1 1\)/);
    await expect(page.locator('.sys-callout').first()).not.toHaveAttribute('transform', /scale/);
    await expect(page.locator('.sys__step')).toHaveCount(5);
  });
});

test.describe('Mobile NVR Route scene (P2 first cut)', () => {
  // The scene's mode is chosen by the layout breakpoint (scenes.css: pinned stage at ≥ 1024 px, stepped frames below),
  // not by the browser engine. Tests therefore select by the project's viewport, so every desktop project (Chromium,
  // Firefox, WebKit) runs the pinned checks and every mobile project (Chromium, WebKit) runs the stepped checks.
  const LG = 1024;
  const isDesktop = (info: TestInfo) => (info.project.use.viewport?.width ?? 0) >= LG;

  test('desktop pinned: --p drives the beats (test hook, §40)', async ({ page }, info) => {
    test.skip(!isDesktop(info), 'pinned mode exists only at ≥ 1024 px; below that the page renders stepped frames (covered by the next test)');
    await page.goto(`/en${MNVR}`);
    const scene = page.locator('.scene');
    await scene.scrollIntoViewIfNeeded();
    await page.waitForTimeout(300);
    const opacityAt = (p: number) =>
      scene.evaluate((el, value) => {
        (el as HTMLElement).style.setProperty('--p', String(value));
        return Number(getComputedStyle(el.querySelector('.scene__stage .ra-zone')!).opacity);
      }, p);
    expect(await opacityAt(0)).toBe(0); // beat 5 not reached
    expect(await opacityAt(1)).toBe(1); // final state
    await expect(page.locator('.scene__stage')).toBeVisible();
    await expect(page.locator('.scene__frame').first()).toBeHidden();
    await expect(page.locator('.scene__step h3')).toHaveCount(6);
  });

  test('mobile stepped: one frame per beat, no pinned stage', async ({ page }, info) => {
    test.skip(isDesktop(info), 'stepped frames exist only below 1024 px; at ≥ 1024 px the page renders the pinned stage (covered by the previous test)');
    await page.goto(`/en${MNVR}`);
    await expect(page.locator('.scene__stage')).toBeHidden();
    await expect(page.locator('.scene__frame')).toHaveCount(6);
    await expect(page.locator('.scene__frame').first()).toBeVisible();
  });

  test('reduced motion: final composition and every beat text, nothing animates', async ({ browser }, info) => {
    const ctx = await browser.newContext({ ...info.project.use, reducedMotion: 'reduce' });
    const page = await ctx.newPage();
    await page.goto(`/en${MNVR}`);
    expect(await page.evaluate(() => document.documentElement.classList.contains('motion-ok'))).toBe(false);
    const stepTexts = await page.locator('.scene__step h3').allTextContents();
    expect(stepTexts).toEqual(['Video', 'Location', 'Connectivity', 'Monitoring', 'Intelligence', 'Management']);
    // Check the zone in the artwork that is actually shown at this viewport (stage ≥ 1024 px, frame 5 below).
    const zone = isDesktop(info) ? '.scene__stage .ra-zone' : '.scene__frame[data-frame="5"] .ra-zone';
    await expect(page.locator(zone)).toBeVisible();
    expect(Number(await page.locator(zone).evaluate((el) => getComputedStyle(el).opacity))).toBe(1);
    await ctx.close();
  });

  test('RTL mirrors the route but never the text', async ({ page }, info) => {
    // Checked on the artwork shown at this viewport: the pinned stage (≥ 1024 px) or the stepped frames (below).
    const art = isDesktop(info) ? '.scene__stage' : '.scene__frame[data-frame="1"]';
    await page.goto(`/ar${MNVR}`);
    await expect(page.locator(`${art} .route-art`)).toBeVisible();
    const mirrored = await page.locator(`${art} .route-art > g`).first().getAttribute('transform');
    expect(mirrored).toBe('translate(1440 0) scale(-1 1)');
    const labelParent = await page
      .locator(`${art} .ra-label`)
      .first()
      .evaluate((el) => el.parentElement?.tagName.toLowerCase());
    expect(labelParent).toBe('svg');
    // Stepped frames crop the mirrored artwork: frame 1 is FRAMES[0] (20 300 480 600) mirrored across the 1440 artboard.
    if (!isDesktop(info)) expect(await page.locator(`${art} .route-art`).getAttribute('viewBox')).toBe('940 300 480 600');
  });
});
