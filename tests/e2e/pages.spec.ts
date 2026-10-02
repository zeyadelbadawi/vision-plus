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

// React #418 root cause (2026-10-02): <head> must hydrate from inline data. The boot script used to be exported from
// the 'use client' motion controller, so it reached the client as a reference to that module's JS chunk. When the
// chunk arrived mid-hydration React re-entered <head>, resumed <body> at <meta charset> and threw #418, re-rendering
// <html> without motion-ok (static fallback, no motion). Checked on the served payload, so it never depends on timing.
for (const route of ['', MNVR, '/solutions/cctv-security-systems']) {
  test(`/en${route}: <head> hydrates without waiting on a JS chunk and the motion controller starts`, async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', (e) => errors.push(e.message));
    await page.goto(`/en${route}`);
    const head = await page.evaluate(() => {
      const flight = [...document.scripts]
        .map((s) => s.text.match(/^self\.__next_f\.push\((.*)\)$/s)?.[1])
        .filter((json): json is string => !!json)
        .map((json) => JSON.parse(json) as [number, string?])
        .filter(([type]) => type === 1)
        .map(([, text]) => text)
        .join('');
      const at = flight.indexOf('["$","head",null,');
      return at < 0 ? '' : flight.slice(at, flight.indexOf('["$","body",null,', at));
    });
    expect(head).toContain(`"dangerouslySetInnerHTML":{"__html":"(function(){`);
    // no reference to another row (a client module, a lazy element or an outlined value) inside <head>
    expect(head).not.toMatch(/"\$L?[0-9a-f]+"/);
    await expect(page.locator('html')).toHaveClass(/(^|\s)motion-ok(\s|$)/);
    if (route === MNVR) await expect(page.locator('.sys')).toHaveAttribute('data-live', '');
    expect(errors).toEqual([]);
  });
}

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

test.describe('Mobile NVR page — On board scene (Concept A cutaway)', () => {
  type Page = import('@playwright/test').Page;
  const layerOpacity = (page: Page, n: number) =>
    page
      .locator(`.cut-layer[data-layer="${n}"]`)
      .first()
      .evaluate((el) => Number(getComputedStyle(el).opacity));
  // Zoom of the view group (the "camera"): the matrix scale of its computed transform, 1 when none.
  const viewScale = (page: Page) =>
    page.locator('.cut-view').evaluate((el) => {
      const t = getComputedStyle(el).transform;
      return t === 'none' ? 1 : new DOMMatrixReadOnly(t).a;
    });
  // Put a step's top at 40 % of the viewport (above the 60 % line where it becomes current), as a reader would.
  const readStep = async (page: Page, n: number) => {
    await page.evaluate((step) => {
      const el = document.querySelector(`.sys__step[data-step="${step}"]`)!;
      window.scrollTo(0, window.scrollY + el.getBoundingClientRect().top - window.innerHeight * 0.4);
    }, n);
    await expect(page.locator('.sys')).toHaveAttribute('data-current', String(n));
    await page.waitForTimeout(1200); // layer opacity (600 ms) and view (1100 ms) transitions
  };

  test('each step builds its part of the system as it is read, and the artwork is visible', async ({ page }) => {
    await page.goto(`/en${MNVR}`);
    await expect(page.locator('.sys')).toHaveAttribute('data-live', ''); // the step state exists only once the controller runs
    await page.locator('.sys').scrollIntoViewIfNeeded();
    await page.waitForTimeout(900);
    expect(await layerOpacity(page, 5)).toBeLessThan(0.5); // later steps are still waiting
    for (const n of [1, 2, 3, 4, 5]) {
      await readStep(page, n);
      expect(await layerOpacity(page, n), `layer ${n} at step ${n}`).toBe(1);
      if (n < 5) expect(await layerOpacity(page, n + 1), `layer ${n + 1} at step ${n}`).toBeLessThan(0.5);
      await expect(page.locator(`.sys__caption > [data-layer="${n}"]`)).toBeVisible();
      const art = await page.locator('svg.cut').boundingBox();
      expect(art!.height).toBeGreaterThan(150);
    }
    for (const n of [1, 2, 3, 4, 5]) expect(await layerOpacity(page, n), `layer ${n}`).toBe(1);
    await expect(page.locator('.sys')).toHaveAttribute('data-reached', '1 2 3 4 5');
  });

  test('the view eases to the component being read and back out to the whole system', async ({ page }) => {
    await page.goto(`/en${MNVR}`);
    await readStep(page, 2);
    await expect.poll(() => viewScale(page)).toBeGreaterThan(1.5); // the recorder, close up
    await readStep(page, 5);
    await expect.poll(() => viewScale(page)).toBeCloseTo(1, 2); // the complete system
  });

  test('scrolling back returns the scene to the earlier step', async ({ page }) => {
    await page.goto(`/en${MNVR}`);
    await readStep(page, 5);
    await readStep(page, 2);
    await expect(page.locator('.sys')).toHaveAttribute('data-reached', '1 2');
    expect(await layerOpacity(page, 2)).toBe(1);
    for (const n of [3, 4, 5]) expect(await layerOpacity(page, n), `layer ${n}`).toBeLessThan(0.5);
    await expect.poll(() => viewScale(page)).toBeGreaterThan(1.5);
  });

  test('reduced motion: the complete system at the overall view, no waiting states', async ({ browser }) => {
    const ctx = await browser.newContext({ reducedMotion: 'reduce' });
    const page = await ctx.newPage();
    await page.goto(`/en${MNVR}`);
    for (const n of [1, 2, 3, 4, 5]) expect(await layerOpacity(page, n), `layer ${n}`).toBe(1);
    await expect(page.locator('.sys')).not.toHaveAttribute('data-live', /.*/);
    expect(await viewScale(page)).toBe(1);
    await expect(page.locator('.sys__caption')).toBeHidden();
    await ctx.close();
  });

  test('without JavaScript: the complete system and every step', async ({ browser }) => {
    const ctx = await browser.newContext({ javaScriptEnabled: false });
    const page = await ctx.newPage();
    await page.goto(`/en${MNVR}`);
    for (const n of [1, 2, 3, 4, 5]) expect(await layerOpacity(page, n), `layer ${n}`).toBe(1);
    await expect(page.locator('svg.cut')).toBeVisible();
    await expect(page.locator('.sys__step h3')).toHaveCount(5);
    await ctx.close();
  });

  test('RTL mirrors the artwork but never the step numbers', async ({ page }) => {
    await page.goto(`/ar${MNVR}`);
    await expect(page.locator('svg.cut .cut-view > g').first()).toHaveAttribute('transform', 'translate(960 0) scale(-1 1)');
    await expect(page.locator('.cut-callout').first()).not.toHaveAttribute('transform', /scale/);
    await expect(page.locator('.sys__step')).toHaveCount(5);
  });
});

test.describe('Mobile NVR Route scene (Concept B architecture)', () => {
  // The scene's mode is chosen by the layout breakpoint (scenes.css: pinned stage at ≥ 1024 px, stepped frames below),
  // not by the browser engine. Tests therefore select by the project's viewport, so every desktop project (Chromium,
  // Firefox, WebKit) runs the pinned checks and every mobile project (Chromium, WebKit) runs the stepped checks.
  const LG = 1024;
  const isDesktop = (info: TestInfo) => (info.project.use.viewport?.width ?? 0) >= LG;
  type Page = import('@playwright/test').Page;
  const opacity = (page: Page, sel: string) =>
    page
      .locator(sel)
      .first()
      .evaluate((el) => Number(getComputedStyle(el).opacity));
  const centreBeat = (page: Page, n: number) =>
    page.evaluate((step) => {
      const el = document.querySelector(`.scene__step[data-step="${step}"]`)!;
      const r = el.getBoundingClientRect();
      window.scrollTo(0, window.scrollY + r.top + r.height / 2 - window.innerHeight / 2);
    }, n);

  test('desktop pinned: --p drives the beats (test hook, §40)', async ({ page }, info) => {
    test.skip(!isDesktop(info), 'pinned mode exists only at ≥ 1024 px; below that the page renders stepped frames (covered by the mobile tests)');
    await page.goto(`/en${MNVR}`);
    const scene = page.locator('.scene');
    await scene.scrollIntoViewIfNeeded();
    await page.waitForTimeout(300);
    const opacityAt = (p: number) =>
      scene.evaluate((el, value) => {
        (el as HTMLElement).style.setProperty('--p', String(value));
        return Number(getComputedStyle(el.querySelector('.scene__stage .ax-node--alert')!).opacity);
      }, p);
    expect(await opacityAt(0)).toBeLessThan(0.2); // beat 5 not reached: waiting outline only
    expect(await opacityAt(1)).toBe(1); // final state
    await expect(page.locator('.scene__stage')).toBeVisible();
    await expect(page.locator('.scene__stage svg.ax')).toBeVisible();
    await expect(page.locator('.scene__frame').first()).toBeHidden();
    await expect(page.locator('.scene__step h3')).toHaveCount(6);
  });

  test('desktop pinned: scrolling builds the diagram forwards and unbuilds it backwards', async ({ page }, info) => {
    test.skip(!isDesktop(info), 'pinned mode exists only at ≥ 1024 px; the stepped frames are covered by the mobile tests');
    await page.goto(`/en${MNVR}`);
    // Scroll only once the MotionController runs, and read the artwork only after it has processed each position.
    // Before hydration the stage shows the complete no-JS state, and on start-up the controller holds --p at 0 until
    // its first viewport update (≈ 0.3–0.7 s in WebKit, matrix runs 37016803278 / 37022617134); assertions made
    // during those states pass or fail by chance.
    await expect(page.locator('.scene')).toHaveAttribute('data-live', '');
    await centreBeat(page, 5);
    await expect(page.locator('.scene')).toHaveAttribute('data-current', '5');
    await expect.poll(() => opacity(page, '.scene__stage .ax-node--alert')).toBeGreaterThan(0.95);
    // beat 6 has only started at beat 5's centre (--b6 ≈ 0.4, opacity ≈ 0.49): not built
    await expect.poll(() => opacity(page, '.scene__stage .ax-node--fleet')).toBeLessThan(0.9);
    await centreBeat(page, 2);
    await expect(page.locator('.scene')).toHaveAttribute('data-current', '2');
    await expect.poll(() => opacity(page, '.scene__stage .ax-node--alert')).toBeLessThan(0.5);
    await expect.poll(() => opacity(page, '.scene__stage .ax-node[data-beat="2"]')).toBeGreaterThan(0.95); // GPS stays built
  });

  test('mobile stepped: one full-width frame per beat, each showing its own beat built', async ({ page }, info) => {
    test.skip(isDesktop(info), 'stepped frames exist only below 1024 px; at ≥ 1024 px the page renders the pinned stage (covered by the desktop tests)');
    await page.goto(`/en${MNVR}`);
    await expect(page.locator('.scene__stage')).toBeHidden();
    await expect(page.locator('.scene__frame')).toHaveCount(6);
    await expect(page.locator('.scene__frame').first()).toBeVisible();
    await expect(page.locator('.scene__frame svg.ax[data-layout="tall"]')).toHaveCount(6);
    const frame4 = page.locator('.scene__frame[data-frame="4"]');
    await frame4.scrollIntoViewIfNeeded();
    await expect.poll(() => opacity(page, '.scene__frame[data-frame="4"] .ax-node--view')).toBeGreaterThan(0.95);
    expect(await opacity(page, '.scene__frame[data-frame="4"] .ax-node--alert')).toBeLessThan(0.5); // beat 5 not yet
    expect((await frame4.boundingBox())!.height).toBeGreaterThan(150);
  });

  test('reduced motion: final composition and every beat text, nothing animates', async ({ browser }, info) => {
    const ctx = await browser.newContext({ ...info.project.use, reducedMotion: 'reduce' });
    const page = await ctx.newPage();
    await page.goto(`/en${MNVR}`);
    expect(await page.evaluate(() => document.documentElement.classList.contains('motion-ok'))).toBe(false);
    const stepTexts = await page.locator('.scene__step h3').allTextContents();
    expect(stepTexts).toEqual(['Video', 'Location', 'Connectivity', 'Monitoring', 'Intelligence', 'Management']);
    // Check the artwork actually shown at this viewport (stage ≥ 1024 px, frame 5 below).
    const alert = isDesktop(info) ? '.scene__stage .ax-node--alert' : '.scene__frame[data-frame="5"] .ax-node--alert';
    await page.locator(alert).scrollIntoViewIfNeeded();
    await expect(page.locator(alert)).toBeVisible();
    expect(await opacity(page, alert)).toBe(1);
    await ctx.close();
  });

  test('RTL mirrors the diagram but never the text', async ({ page }, info) => {
    // Checked on the artwork shown at this viewport: the pinned stage (≥ 1024 px) or the stepped frames (below).
    const art = isDesktop(info) ? '.scene__stage' : '.scene__frame[data-frame="1"]';
    const width = isDesktop(info) ? 1000 : 420; // wide and stacked artboards
    await page.goto(`/ar${MNVR}`);
    await expect(page.locator(`${art} svg.ax`)).toBeVisible();
    expect(await page.locator(`${art} svg.ax > g`).first().getAttribute('transform')).toBe(`translate(${width} 0) scale(-1 1)`);
    const label = page.locator(`${art} .ax-label`).first();
    expect(await label.evaluate((el) => el.parentElement?.tagName.toLowerCase())).toBe('svg');
    // the cameras label anchors at the mirrored x and starts from the inline start (the right edge in RTL)
    expect(await label.getAttribute('x')).toBe(String(isDesktop(info) ? 1000 - 52 : 420 - 36));
    expect(await label.getAttribute('text-anchor')).toBe('start');
  });
});

test.describe('Mobile NVR Route scene — data flow (Concept B)', () => {
  const LG = 1024;
  const artFor = (info: TestInfo, beat: number) => ((info.project.use.viewport?.width ?? 0) >= LG ? '.scene__stage' : `.scene__frame[data-frame="${beat}"]`);
  const readBeat = (page: import('@playwright/test').Page, n: number) =>
    page.evaluate((step) => {
      const el = document.querySelector(`.scene__step[data-step="${step}"]`)!;
      window.scrollTo(0, window.scrollY + el.getBoundingClientRect().top - window.innerHeight * 0.4);
    }, n);
  const running = (page: import('@playwright/test').Page, selector: string) =>
    page.locator(selector).evaluateAll((els) => els.reduce((n, el) => n + el.getAnimations().filter((a) => a.playState === 'running').length, 0));

  test('data pulses run only on the current beat’s connections, in both scroll directions', async ({ page }, info) => {
    await page.goto(`/en${MNVR}`);
    await readBeat(page, 3);
    await expect(page.locator('.scene')).toHaveAttribute('data-current', '3');
    await expect.poll(() => running(page, `${artFor(info, 3)} [data-beat="3"] .ax-flow`)).toBeGreaterThan(0);
    expect(await running(page, `${artFor(info, 3)} [data-beat="6"] .ax-flow`)).toBe(0); // beat 6 not reached
    await readBeat(page, 6);
    await expect(page.locator('.scene')).toHaveAttribute('data-current', '6');
    await expect.poll(() => running(page, `${artFor(info, 6)} [data-beat="6"] .ax-flow`)).toBeGreaterThan(0);
    await readBeat(page, 1);
    await expect(page.locator('.scene')).toHaveAttribute('data-current', '1');
    await expect.poll(() => running(page, `${artFor(info, 1)} [data-beat="1"] .ax-flow`)).toBeGreaterThan(0);
    expect(await running(page, `${artFor(info, 1)} :is([data-beat="3"], [data-beat="6"]) .ax-flow`)).toBe(0);
  });

  test('reduced motion: no pulses, no step state', async ({ browser }, info) => {
    const ctx = await browser.newContext({ ...info.project.use, reducedMotion: 'reduce' });
    const page = await ctx.newPage();
    await page.goto(`/en${MNVR}`);
    await readBeat(page, 3);
    await page.waitForTimeout(600);
    await expect(page.locator('.scene')).not.toHaveAttribute('data-live', /.*/);
    expect(await running(page, 'svg.ax *')).toBe(0);
    await ctx.close();
  });
});
