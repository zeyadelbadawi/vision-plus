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
  '/solutions/access-control',
  '/solutions/networking-ict',
  '/solutions/elv-systems',
  '/solutions/audio-visual',
  '/solutions/smart-building-home-automation',
  '/solutions/fire-alarm-systems',
  '/industries',
  '/services',
  '/projects',
  '/projects/sample-corporate-workplace',
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
    ['/en/services', 'system-design-consultancy'],
    ['/en/industries', 'banking-finance'],
    ['/en/industries', 'industrial-manufacturing'],
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

// P5A-02 Solutions hub (MASTER_PROJECT_PLAN §26.3, §55.3): built from the shared section library.
test.describe('Solutions hub (§26.3)', () => {
  const ORDER = [
    'mobile-nvr-mobile-surveillance',
    'cctv-security-systems',
    'access-control',
    'networking-ict',
    'elv-systems',
    'audio-visual',
    'smart-building-home-automation',
    'fire-alarm-systems',
  ];

  for (const l of LOCALES) {
    test(`/${l.code}/solutions: the 8 solutions in order, Mobile NVR first and featured, each linking to its page`, async ({ page }) => {
      const errors: string[] = [];
      page.on('pageerror', (e) => errors.push(e.message));
      await page.goto(`/${l.code}/solutions`);
      const rows = page.locator('.index-list__item');
      await expect(rows).toHaveCount(8);
      const hrefs = await page.locator('.index-list__link').evaluateAll((as) => as.map((a) => a.getAttribute('href')));
      expect(hrefs).toEqual(ORDER.map((s) => `/${l.code}/solutions/${s}`));
      await expect(rows.first().locator('.index-list__marker')).toHaveCount(1);
      await expect(page.locator('.index-list__marker')).toHaveCount(1);
      // every row has its approved one-line summary and its card image slot
      for (const r of await rows.all()) {
        await expect(r.locator('.index-list__summary')).not.toBeEmpty();
        await expect(r.locator('.index-list__media [data-slot$="-CARD"]')).toHaveCount(1);
      }
      await expect(page.locator('#integration-title')).not.toBeEmpty();
      await expect(page.locator('.statement-band a[href$="/solutions/elv-systems"]')).toBeVisible();
      await expect(page.locator('ol.lifecycle--compact > li')).toHaveCount(8);
      await expect(page.locator('main a[href$="/services#approach"]')).toBeVisible();
      await expect(page.locator('main a[href$="/contact?type=consultation"].btn--primary')).toBeVisible();
      expect(errors).toEqual([]);
    });
  }

  test('the card image is revealed on hover or keyboard focus at desktop width, and always visible on mobile', async ({ page }, info) => {
    await page.goto('/en/solutions');
    const row = page.locator('.index-list__item').nth(2);
    const media = row.locator('.index-list__media');
    await row.scrollIntoViewIfNeeded();
    const opacity = () => media.evaluate((el) => Number(getComputedStyle(el).opacity));
    if ((info.project.use.viewport?.width ?? 0) >= 1024) {
      expect(await opacity()).toBe(0);
      await row.hover();
      await expect.poll(opacity).toBe(1);
      await page.mouse.move(0, 0);
      await expect.poll(opacity).toBe(0);
      await row.locator('.index-list__link').focus();
      await expect.poll(opacity).toBe(1);
    } else {
      expect(await opacity()).toBe(1);
      await expect(media).toBeVisible();
    }
  });

  test('reduced motion: everything is shown with no reveal transition', async ({ browser }) => {
    const ctx = await browser.newContext({ reducedMotion: 'reduce' });
    const page = await ctx.newPage();
    await page.goto('/en/solutions');
    await expect(page.locator('html')).not.toHaveClass(/(^|\s)motion-ok(\s|$)/);
    await expect(page.locator('.index-list__item')).toHaveCount(8);
    const transition = await page
      .locator('.index-list__media')
      .first()
      .evaluate((el) => getComputedStyle(el).transitionDuration);
    // the global reduced-motion rule makes every transition effectively instant (0.01 ms)
    expect(transition.split(',').every((d) => parseFloat(d) * (d.trim().endsWith('ms') ? 1 : 1000) <= 0.01)).toBe(true);
    // the process track shows every step complete
    await expect(page.locator('ol.lifecycle--compact > li')).toHaveCount(8);
    await ctx.close();
  });

  test('RTL: rows and arrows mirror, text order unchanged', async ({ page }) => {
    await page.goto('/ar/solutions');
    await expect(page.locator('html')).toHaveAttribute('dir', 'rtl');
    const row = page.locator('.index-list__item').first();
    const text = await row.locator('.index-list__text').boundingBox();
    const box = await row.boundingBox();
    // the text block starts at the inline start (the right edge in RTL)
    expect(Math.abs(box!.x + box!.width - (text!.x + text!.width))).toBeLessThan(box!.width / 2);
  });
});

// P5A-04 Solution detail template (MASTER_PROJECT_PLAN §26.2, §55.3) for the seven solutions without a dedicated page.
// Sections follow the approved copy: Context only with a second body paragraph, the scene beat texts only for scenes
// with step texts, Capabilities only where an approved list exists.
test.describe('Solution detail template (§26.2)', () => {
  const PAGES = [
    { slug: 'cctv-security-systems', context: true, beats: 3, capabilities: 10, module: true },
    { slug: 'access-control', context: false, beats: 3, capabilities: 10, module: true },
    { slug: 'networking-ict', context: true, beats: 0, capabilities: 9, module: true },
    { slug: 'elv-systems', context: true, beats: 4, capabilities: 0, module: false },
    { slug: 'audio-visual', context: false, beats: 0, capabilities: 10, module: true },
    { slug: 'smart-building-home-automation', context: false, beats: 5, capabilities: 10, module: true },
    { slug: 'fire-alarm-systems', context: false, beats: 4, capabilities: 8, module: true },
  ];
  for (const p of PAGES) {
    test(`/en/solutions/${p.slug}: sections follow the approved copy, CTA pre-filled, related links resolve`, async ({ page }) => {
      const errors: string[] = [];
      page.on('pageerror', (e) => errors.push(e.message));
      const res = await page.goto(`/en/solutions/${p.slug}`);
      expect(res?.status()).toBe(200);
      await expect(page.locator('main h1')).toHaveCount(1);
      await expect(page.locator('.solution__headline')).not.toBeEmpty();
      await expect(page.locator('#context-title')).toHaveCount(p.context ? 1 : 0);
      await expect(page.locator('.scene-steps__beat')).toHaveCount(p.beats);
      await expect(page.locator('.spec-list > li')).toHaveCount(p.capabilities);
      await expect(page.locator('#module-title')).toHaveCount(p.module ? 1 : 0);
      await expect(page.locator('ol.lifecycle--compact > li')).toHaveCount(8);
      await expect(page.locator(`main a.btn--primary[href="/en/contact?type=consultation&solution=${p.slug}"]`)).toBeVisible();
      // related: two neighbouring solutions, no product categories while Products is hidden (Q-02)
      const related = page.locator('.related a');
      expect(await related.count()).toBeGreaterThanOrEqual(2);
      await expect(page.locator('.related a[href*="/products"]')).toHaveCount(0);
      for (const href of await related.evaluateAll((as) => as.map((a) => a.getAttribute('href')!))) {
        const target = await page.request.get(href.split('#')[0]!);
        expect(target.status(), href).toBe(200);
      }
      expect(errors).toEqual([]);
    });
  }

  test('hero: on mobile the image comes first, on desktop the text (§26.2 #1)', async ({ page }, info) => {
    await page.goto('/en/solutions/fire-alarm-systems');
    const band = await page.locator('.solution-hero .page-band').boundingBox();
    const title = await page.locator('main h1').boundingBox();
    if ((info.project.use.viewport?.width ?? 0) < 768) expect(band!.y).toBeLessThan(title!.y);
    else expect(band!.y).toBeGreaterThan(title!.y);
  });

  test('scene beat texts come from the approved copy, in order, also without JavaScript', async ({ browser }) => {
    const ctx = await browser.newContext({ javaScriptEnabled: false });
    const page = await ctx.newPage();
    await page.goto('/en/solutions/elv-systems');
    await expect(page.locator('.scene-steps__beat h3')).toHaveText(['Coordination', 'Integration', 'Reliability', 'Scalability']);
    await page.goto('/en/solutions/smart-building-home-automation');
    await expect(page.locator('.scene-steps__beat h3')).toHaveText(['Comfort', 'Efficiency', 'Control', 'Security', 'Experience']);
    await expect(page.locator('.pillar-strip li')).toHaveText(['Comfort', 'Efficiency', 'Control', 'Security', 'Experience']);
    await ctx.close();
  });
});

// P5A-03 Localized 404 (MASTER_PROJECT_PLAN §26.13, §36): the nearest 404.html is served with a 404 status, as the
// Worker's "404-page" handling does (verified in the Cloudflare runtime by scripts/worker-smoke.mjs).
test.describe('Localized 404 (§26.13)', () => {
  for (const l of LOCALES) {
    test(`/${l.code}/… unknown: 404 status, ${l.code} page, key sections linked, no serious axe issues`, async ({ page }) => {
      const res = await page.goto(`/${l.code}/does-not-exist`);
      expect(res?.status()).toBe(404);
      await expect(page.locator('html')).toHaveAttribute('lang', l.lang);
      await expect(page.locator('html')).toHaveAttribute('dir', l.dir);
      await expect(page.locator('main h1')).toHaveCount(1);
      await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', /noindex/);
      await expect(page.locator(`main a.btn--primary[href="/${l.code}"]`)).toBeVisible();
      const links = await page.locator('.not-found__links a').evaluateAll((as) => as.map((a) => a.getAttribute('href')));
      expect(links).toEqual(['solutions', 'industries', 'services', 'about', 'contact'].map((x) => `/${l.code}/${x}`));
      await expect(page.locator('main img, main picture')).toHaveCount(0);
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
      expect(overflow).toBeLessThanOrEqual(0);
      const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa']).exclude('.wordmark__plus').analyze();
      const serious = results.violations.filter((v) => v.impact === 'serious' || v.impact === 'critical');
      expect(serious.map((v) => `${v.id}: ${v.nodes.length} × ${v.help}`)).toEqual([]);
    });
  }

  test('outside a locale the trilingual root 404 is served', async ({ page }) => {
    const res = await page.goto('/does-not-exist');
    expect(res?.status()).toBe(404);
    await expect(page.locator('a[href="/ar"]')).toBeVisible();
    await expect(page.locator('a[href="/zh"]')).toBeVisible();
  });
});

// P5A-05 Services (MASTER_PROJECT_PLAN §26.5, §55.3.7): approach spine, 6 services with D-19 stages, sticky stage rail.
test.describe('Services lifecycle (§26.5)', () => {
  const SERVICES = [
    'system-design-consultancy',
    'project-management',
    'installation-commissioning',
    'testing-integration',
    'maintenance-support',
    'technical-training-support',
  ];
  const STAGES: Record<string, string[]> = {
    'system-design-consultancy': ['understand', 'design', 'select'],
    'project-management': ['deliver'],
    'installation-commissioning': ['deliver'],
    'testing-integration': ['integrate', 'verify'],
    'maintenance-support': ['support'],
    'technical-training-support': ['enable'],
  };

  for (const l of LOCALES) {
    test(`/${l.code}/services: approach with 8 step texts, 6 services in order with their stages, closing and CTA`, async ({ page }) => {
      const errors: string[] = [];
      page.on('pageerror', (e) => errors.push(e.message));
      await page.goto(`/${l.code}/services`);
      const steps = page.locator('#approach ol.lifecycle > li');
      await expect(steps).toHaveCount(8);
      for (const st of await steps.all()) await expect(st.locator('h3 + p')).not.toBeEmpty();
      // R-2: only the Understand step text awaits client review, and the preview build says so
      await expect(page.locator('#approach .pending-note')).toHaveCount(1);
      await expect(page.locator('#step-understand .pending-note')).toHaveCount(1);
      const ids = await page.locator('.services-flow > section.split').evaluateAll((els) => els.map((e) => e.id));
      expect(ids).toEqual(SERVICES);
      for (const slug of SERVICES) {
        const section = page.locator(`#${slug}`);
        await expect(section.locator('h2')).not.toBeEmpty();
        await expect(section.locator('p.t-body')).toHaveCount(2);
        await expect(section.locator('[data-slot^="SRV-"]')).toHaveCount(1);
        const links = await section.locator('.service-stages a').evaluateAll((as) => as.map((a) => a.getAttribute('href')));
        expect(links).toEqual(STAGES[slug]!.map((k) => `/${l.code}/services#step-${k}`));
        for (const k of STAGES[slug]!) await expect(page.locator(`#step-${k}`)).toHaveCount(1);
      }
      // R-3: Supply & Procurement is not built
      await expect(page.locator('#supply-procurement')).toHaveCount(0);
      await expect(page.locator('#closing-title')).not.toBeEmpty();
      await expect(page.locator('main a[href$="/contact?type=consultation"].btn--primary')).toBeVisible();
      expect(errors).toEqual([]);
    });
  }

  test('the stage rail sticks on desktop and lights up the stages of the service in view; no rail on mobile', async ({ page }, info) => {
    await page.goto('/en/services');
    const rail = page.locator('.stage-rail');
    if ((info.project.use.viewport?.width ?? 0) < 1024) {
      await expect(rail).toBeHidden();
      return;
    }
    await expect(page.locator('.services-flow')).toHaveAttribute('data-live', '');
    const lit = () =>
      page
        .locator('.stage-rail__item')
        .evaluateAll((els) =>
          els.flatMap((e, i) =>
            getComputedStyle(e).boxShadow.includes('inset') && !getComputedStyle(e).boxShadow.includes('rgba(0, 0, 0, 0)') ? [i + 1] : [],
          ),
        );
    for (const [slug, expected] of [
      ['system-design-consultancy', [1, 2, 3]],
      ['testing-integration', [5, 6]],
      ['technical-training-support', [7]],
    ] as const) {
      await page.evaluate((id) => scrollTo(0, document.getElementById(id)!.getBoundingClientRect().top + scrollY - 200), slug);
      await expect.poll(lit).toEqual(expected);
      if (slug === 'system-design-consultancy') continue; // the rail sits in flow until it reaches the header
      const box = await rail.boundingBox();
      expect(box?.y).toBeGreaterThanOrEqual(60);
      expect(box?.y).toBeLessThanOrEqual(84);
    }
  });

  test('a service anchor lands below the header and the stage rail', async ({ page }) => {
    await page.goto('/en/services#installation-commissioning');
    const heading = page.locator('#installation-commissioning-title');
    await expect(heading).toBeInViewport();
    const rail = await page.locator('.stage-rail').boundingBox();
    const top = (await heading.boundingBox())!.y;
    expect(top).toBeGreaterThan(rail ? rail.y + rail.height : 64);
  });

  test('reduced motion and no JavaScript: all stages shown, none highlighted, all content present', async ({ browser }) => {
    for (const opts of [{ reducedMotion: 'reduce' as const }, { javaScriptEnabled: false }]) {
      const ctx = await browser.newContext({ ...opts, viewport: { width: 1440, height: 900 } });
      const page = await ctx.newPage();
      await page.goto('/en/services');
      await page.evaluate(() => scrollTo(0, document.getElementById('testing-integration')!.offsetTop));
      await expect(page.locator('.services-flow')).not.toHaveAttribute('data-current', /./);
      await expect(page.locator('.stage-rail__item')).toHaveCount(8);
      await expect(page.locator('.services-flow > section.split')).toHaveCount(6);
      await ctx.close();
    }
  });
});

// P5A-06 Industries explorer (MASTER_PROJECT_PLAN §26.4, §55.3.8): SSR anchored sections; master–detail on desktop.
test.describe('Industries explorer (§26.4)', () => {
  const ORDER = [
    'transportation-fleet',
    'government-public-sector',
    'commercial-corporate',
    'banking-finance',
    'hospitality',
    'retail',
    'education',
    'healthcare',
    'real-estate-property-development',
    'residential',
    'logistics-warehousing',
    'industrial-manufacturing',
  ];
  const isDesktop = (info: TestInfo) => (info.project.use.viewport?.width ?? 0) >= 1024;
  const selectedId = (page: import('@playwright/test').Page) => page.evaluate(() => document.querySelector('.ix__slot[data-selected] section')?.id ?? null);

  for (const l of LOCALES) {
    test(`/${l.code}/industries: 12 industries in order with summary, related solutions and a pre-filled CTA`, async ({ page }) => {
      const errors: string[] = [];
      page.on('pageerror', (e) => errors.push(e.message));
      await page.goto(`/${l.code}/industries`);
      const ids = await page.locator('.ix__panel').evaluateAll((els) => els.map((e) => e.id));
      expect(ids).toEqual(ORDER);
      const index = await page.locator('.ix__link').evaluateAll((as) => as.map((a) => a.getAttribute('href')));
      expect(index).toEqual(ORDER.map((s) => `#${s}`));
      for (const slug of ORDER) {
        const panel = page.locator(`#${slug}`);
        await expect(panel.locator('h3')).not.toBeEmpty();
        await expect(panel.locator('p.t-lede')).not.toBeEmpty();
        await expect(panel.locator(`a[href="/${l.code}/contact?type=consultation&industry=${slug}"]`)).toHaveCount(1);
        await expect(panel.locator('[data-slot^="IND-"]')).toHaveCount(1);
      }
      // R-1: the drafted Real Estate summary is marked in preview and has no derived relation; R-4: the order is marked
      await expect(page.locator('.ix__panel .pending-note')).toHaveCount(1);
      await expect(page.locator('#real-estate-property-development .pending-note')).toHaveCount(1);
      await expect(page.locator('#real-estate-property-development .related__list')).toHaveCount(0);
      await expect(page.locator('#banking-finance .related__list a')).toHaveCount(3);
      await expect(page.locator('.pending-note', { hasText: /./ })).toHaveCount(2);
      const across = await page.locator('.ix__across a').evaluateAll((as) => as.map((a) => a.getAttribute('href')));
      expect(across).toEqual([`/${l.code}/solutions/elv-systems`, `/${l.code}/solutions/fire-alarm-systems`]);
      await expect(page.locator('main a[href$="/contact?type=consultation"].btn--primary')).toBeVisible();
      expect(errors).toEqual([]);
    });
  }

  test('desktop: one panel at a time; selecting moves focus, updates the hash and adds no history entry', async ({ page }, info) => {
    test.skip(!isDesktop(info), 'master–detail is desktop only');
    await page.goto('/en/industries');
    await expect(page.locator('.ix')).toHaveAttribute('data-live', '');
    expect(await selectedId(page)).toBe('transportation-fleet');
    await expect(page.locator('.ix__panel:visible')).toHaveCount(1);
    const before = await page.evaluate(() => history.length);
    await page.locator('.ix__link[href="#healthcare"]').click();
    expect(await selectedId(page)).toBe('healthcare');
    await expect(page).toHaveURL(/#healthcare$/);
    await expect(page.locator('#healthcare-title')).toBeFocused();
    await expect(page.locator('.ix__link[aria-current="true"]')).toHaveAttribute('href', '#healthcare');
    expect(await page.evaluate(() => history.length)).toBe(before);
    // keyboard: Enter on a link selects too
    await page.locator('.ix__link[href="#retail"]').focus();
    await page.keyboard.press('Enter');
    await expect.poll(() => selectedId(page)).toBe('retail');
  });

  test('desktop: a hash on load, the header menu and back/forward select the industry and show the explorer', async ({ page }, info) => {
    test.skip(!isDesktop(info), 'master–detail is desktop only');
    await page.goto('/en/industries#banking-finance');
    await expect.poll(() => selectedId(page)).toBe('banking-finance');
    await expect(page.locator('#banking-finance-title')).toBeInViewport();
    // same-page navigation through the header mega menu (Next pushState, no hashchange event)
    await page.locator('header button', { hasText: 'Industries' }).click();
    await page.locator('header a[href="/en/industries#education"]').first().click();
    await expect.poll(() => selectedId(page)).toBe('education');
    await expect(page.locator('#education-title')).toBeInViewport();
    await page.goBack();
    await expect.poll(() => selectedId(page)).toBe('banking-finance');
  });

  test('mobile: all industries stacked under a sticky chip index; a chip jumps to its section', async ({ page }, info) => {
    test.skip(isDesktop(info), 'stacked layout below 1024 px');
    await page.goto('/en/industries');
    await expect(page.locator('.ix')).not.toHaveAttribute('data-live', /.*/);
    await expect(page.locator('.ix__panel:visible')).toHaveCount(12);
    await page.locator('.ix__link[href="#education"]').click();
    await expect(page).toHaveURL(/#education$/);
    const index = (await page.locator('.ix__index').boundingBox())!;
    const title = (await page.locator('#education-title').boundingBox())!;
    expect(title.y).toBeGreaterThanOrEqual(index.y + index.height);
    await expect(page.locator('#education-title')).toBeInViewport();
  });

  test('without JavaScript every industry is a visible anchored section', async ({ browser }) => {
    const ctx = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 1440, height: 900 } });
    const page = await ctx.newPage();
    await page.goto('/en/industries');
    await expect(page.locator('.ix__panel:visible')).toHaveCount(12);
    await expect(page.locator('.ix[data-live]')).toHaveCount(0);
    await ctx.close();
  });
});

// P5A-07 About (MASTER_PROJECT_PLAN §26.8, §55.3.9). Q-04: Vision, Mission and Core Values render their labels only.
test.describe('About (§26.8)', () => {
  const SECTIONS = ['who-we-are', 'journey', 'vision', 'mission', 'values', 'philosophy', 'why-vision-plus'];
  // Withheld under Q-04: none of these may appear anywhere in the page, including the RSC payload.
  const WITHHELD = [
    'To Make Technology Work as One',
    'From Requirement to Reality',
    'We envision environments',
    'Our mission is to understand',
    'Make complex technology easier',
    'Think Before We Build',
    'Purpose Before Technology',
    'Partnership Beyond Projects',
  ];

  for (const l of LOCALES) {
    test(`/${l.code}/about: sections in order, in-page index, journey, philosophy, 8 reasons, links out`, async ({ page }) => {
      const errors: string[] = [];
      page.on('pageerror', (e) => errors.push(e.message));
      const res = await page.goto(`/${l.code}/about`);
      const ids = await page.locator('main section[id]').evaluateAll((els) => els.map((e) => e.id));
      expect(ids).toEqual(SECTIONS);
      const index = await page.locator('.page-index a').evaluateAll((as) => as.map((a) => a.getAttribute('href')));
      expect(index).toEqual(SECTIONS.map((s) => `#${s}`));
      await expect(page.locator('#who-we-are p.t-h1')).not.toBeEmpty();
      await expect(page.locator('#journey .journey__step')).toHaveCount(3);
      await expect(page.locator('#journey [data-slot^="ABOUT-JOURNEY-"]')).toHaveCount(3);
      await expect(page.locator('#philosophy .about__lines li')).toHaveCount(4);
      await expect(page.locator('#why-vision-plus .editorial-list__item')).toHaveCount(8);
      const out = await page.locator('.link-blocks a').evaluateAll((as) => as.map((a) => a.getAttribute('href')));
      expect(out).toEqual([`/${l.code}/partners`, `/${l.code}/company-profile`]);
      // Q-04: label only, with the preview note; no body under the heading
      for (const id of ['vision', 'mission', 'values']) {
        await expect(page.locator(`#${id} h2`)).not.toBeEmpty();
        await expect(page.locator(`#${id} .pending-note`)).toHaveCount(1);
        await expect(page.locator(`#${id} p:not(.pending-note), #${id} li`)).toHaveCount(0);
      }
      const html = (await res!.text()) + (await page.content());
      for (const w of WITHHELD) expect(html, w).not.toContain(w);
      expect(errors).toEqual([]);
    });
  }

  test('the in-page index and the header menu anchors land on their sections', async ({ page }) => {
    await page.goto('/en/about');
    await page.locator('.page-index a[href="#philosophy"]').click();
    await expect(page.locator('#philosophy-title')).toBeInViewport();
    for (const id of ['vision', 'values', 'journey']) {
      await page.goto(`/en/about#${id}`);
      await expect(page.locator(`#${id}-title`)).toBeInViewport();
    }
  });
});

// P5A-08 Projects (MASTER_PROJECT_PLAN §26.7, §35, §55.3.11). Preview: the four Q-12 illustrative samples, labelled.
test.describe('Projects (§26.7)', () => {
  const SAMPLES = ['sample-fleet-surveillance', 'sample-corporate-workplace', 'sample-hospitality-venue', 'sample-logistics-site'];

  for (const l of LOCALES) {
    test(`/${l.code}/projects: the 4 labelled samples link to their pages; no filter bar below 6 projects`, async ({ page }) => {
      await page.goto(`/${l.code}/projects`);
      const cards = page.locator('.project-card');
      await expect(cards).toHaveCount(4);
      for (const c of await cards.all()) {
        await expect(c).toHaveAttribute('data-sample', '');
        await expect(c.locator('.sample-tag')).toHaveCount(1);
      }
      const hrefs = await page.locator('.project-card__link').evaluateAll((as) => as.map((a) => a.getAttribute('href')));
      expect(hrefs).toEqual(SAMPLES.map((s) => `/${l.code}/projects/${s}`));
      await expect(page.locator('.project-note')).toHaveCount(1);
      await expect(page.locator('select, [role="radiogroup"], .filters')).toHaveCount(0);
    });

    test(`/${l.code}/projects/<sample>: facts, scope, gallery, related solutions, next project`, async ({ page }) => {
      const errors: string[] = [];
      page.on('pageerror', (e) => errors.push(e.message));
      await page.goto(`/${l.code}/projects/sample-corporate-workplace`);
      await expect(page.locator('main')).toHaveAttribute('data-sample', '');
      await expect(page.locator('main .sample-tag')).toHaveCount(1);
      await expect(page.locator('.project-facts > div')).toHaveCount(4);
      const solutions = await page.locator('.project-facts__links a').evaluateAll((as) => as.map((a) => a.getAttribute('href')));
      expect(solutions).toEqual(['cctv-security-systems', 'access-control', 'networking-ict', 'audio-visual'].map((s) => `/${l.code}/solutions/${s}`));
      await expect(page.locator('#scope-title + p')).not.toBeEmpty();
      await expect(page.locator('.gallery__thumb')).toHaveCount(4);
      await expect(page.locator('.project-next a')).toHaveAttribute('href', `/${l.code}/projects/sample-hospitality-venue`);
      expect(errors).toEqual([]);
    });
  }

  test('the last sample wraps to the first as "next project"', async ({ page }) => {
    await page.goto('/en/projects/sample-logistics-site');
    await expect(page.locator('.project-next a')).toHaveAttribute('href', '/en/projects/sample-fleet-surveillance');
  });

  for (const l of [LOCALES[0], LOCALES[1]]) {
    test(`/${l.code} gallery lightbox: modal, arrows mirrored in ${l.dir.toUpperCase()}, Esc returns focus`, async ({ page }) => {
      await page.goto(`/${l.code}/projects/sample-corporate-workplace`);
      const thumb = page.locator('.gallery__thumb').nth(1);
      await thumb.click();
      const dialog = page.locator('dialog.lightbox');
      await expect(dialog).toBeVisible();
      await expect(page.locator('.lightbox__count')).toHaveText('2 / 4');
      expect(await page.evaluate(() => !!document.activeElement?.closest('dialog'))).toBe(true);
      // forward = toward the inline end: ArrowRight in LTR, ArrowLeft in RTL
      await page.keyboard.press(l.dir === 'rtl' ? 'ArrowLeft' : 'ArrowRight');
      await expect(page.locator('.lightbox__count')).toHaveText('3 / 4');
      await page.keyboard.press(l.dir === 'rtl' ? 'ArrowRight' : 'ArrowLeft');
      await page.keyboard.press(l.dir === 'rtl' ? 'ArrowRight' : 'ArrowLeft');
      await expect(page.locator('.lightbox__count')).toHaveText('1 / 4');
      await page.keyboard.press(l.dir === 'rtl' ? 'ArrowRight' : 'ArrowLeft');
      await expect(page.locator('.lightbox__count')).toHaveText('4 / 4');
      await expect(page.locator('.lightbox__slide:visible')).toHaveCount(1);
      await page.keyboard.press('Escape');
      await expect(dialog).toBeHidden();
      await expect(thumb).toBeFocused();
    });
  }

  test('the lightbox buttons step and close; the previous arrow points toward the inline start', async ({ page }) => {
    for (const code of ['en', 'ar']) {
      await page.goto(`/${code}/projects/sample-hospitality-venue`);
      await page.locator('.gallery__thumb').first().click();
      // net horizontal direction of each arrow (svg + wrappers): previous points to the inline start, next to the end
      const [prev, next] = await page.locator('.lightbox__nav svg').evaluateAll((svgs) =>
        svgs.map((svg) => {
          let sign = 1;
          for (let el: Element | null = svg; el && !el.matches('button'); el = el.parentElement)
            sign *= new DOMMatrix(getComputedStyle(el).transform === 'none' ? undefined : getComputedStyle(el).transform).a < 0 ? -1 : 1;
          return sign; // 1 = points right
        }),
      );
      const rtl = code === 'ar';
      expect([prev, next]).toEqual(rtl ? [1, -1] : [-1, 1]);
      await page.locator('.lightbox__nav .lightbox__btn').nth(1).click();
      await expect(page.locator('.lightbox__count')).toHaveText('2 / 4');
      await page.locator('.lightbox__bar .lightbox__btn').click();
      await expect(page.locator('dialog.lightbox')).toBeHidden();
    }
  });

  test('the placeholder detail entry is never served', async ({ page }) => {
    const res = await page.goto('/en/projects/_unpublished');
    expect(res?.status()).toBe(404);
  });
});

// P5A-09 Partners (MASTER_PROJECT_PLAN §26.9, §34, §55.3.12): the 17 client-confirmed partners (D-08 update, A-30).
test.describe('Partners (§26.9)', () => {
  const ALPHABETICAL = [
    'Axis',
    'Bosch',
    'Dahua',
    'Genetec',
    'Hanwha',
    'HID',
    'Hikvision',
    'Honeywell',
    'ITC',
    'Johnson Controls',
    'Milestone',
    'Philips',
    'Schneider Electric',
    'Siemens',
    'Suprema',
    'UNV',
    'ZKTeco',
  ];

  for (const l of LOCALES) {
    test(`/${l.code}/partners: 17 confirmed partners, alphabetical, name captions, no logos invented`, async ({ page }) => {
      await page.goto(`/${l.code}/partners`);
      const names = await page.locator('.partner-cell__name').allTextContents();
      expect(names).toEqual(ALPHABETICAL);
      await expect(page.locator('.partner-cell img')).toHaveCount(0);
      // the wordmark repeats the caption, so it is hidden from assistive technology; preview labels the missing logo
      await expect(page.locator('.partner-cell__wordmark[aria-hidden="true"]')).toHaveCount(17);
      await expect(page.locator('.partner-cell__pending')).toHaveCount(17);
      await expect(page.locator('#partners-closing')).not.toBeEmpty();
    });

    test(`/${l.code} homepage strip: the 17 partners set in type, once for assistive technology`, async ({ page }) => {
      await page.goto(`/${l.code}`);
      const strip = page.locator('section[aria-labelledby="partners-title"]');
      const visible = strip.locator('.marquee__group:not([aria-hidden]) .logo-cell--name');
      await expect(visible).toHaveCount(17);
      expect(await visible.allTextContents()).toEqual(ALPHABETICAL);
      await expect(strip.locator('.marquee__group[aria-hidden="true"]')).toHaveCount(1);
      await expect(strip.locator('.logo-cell--placeholder, .placeholder-note')).toHaveCount(0);
      await expect(strip.locator('.marquee__toggle')).toBeVisible();
    });
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
