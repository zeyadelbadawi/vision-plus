import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

const LOCALES = [
  { code: 'en', lang: 'en', dir: 'ltr' },
  { code: 'ar', lang: 'ar', dir: 'rtl' },
  { code: 'zh', lang: 'zh-Hans', dir: 'ltr' },
] as const;

for (const l of LOCALES) {
  test.describe(`homepage /${l.code}`, () => {
    test('renders with correct language, direction and structure', async ({ page }) => {
      await page.goto(`/${l.code}`);
      await expect(page.locator('html')).toHaveAttribute('lang', l.lang);
      await expect(page.locator('html')).toHaveAttribute('dir', l.dir);
      await expect(page.locator('h1')).toHaveCount(1);
      // all 11 homepage sections are present in preview
      for (const id of ['hero', 'positioning', 'integration', 'mnvr', 'approach', 'industries', 'why', 'projects', 'partners', 'journey', 'closing']) {
        await expect(page.locator(`#${id}-title`)).toHaveCount(1);
      }
      await expect(page.locator('footer')).toBeVisible();
    });

    test('has no horizontal overflow', async ({ page }) => {
      await page.goto(`/${l.code}`);
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
      expect(overflow).toBeLessThanOrEqual(0);
    });

    test('has no serious or critical accessibility violations', async ({ page }) => {
      await page.goto(`/${l.code}`);
      const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa']).analyze();
      const serious = results.violations.filter((v) => v.impact === 'serious' || v.impact === 'critical');
      expect(serious.map((v) => `${v.id}: ${v.nodes.length} × ${v.help}`)).toEqual([]);
    });
  });
}

test('image placeholders are hidden from assistive technology and carry manifest IDs', async ({ page }) => {
  await page.goto('/en');
  const slots = page.locator('[data-slot]');
  expect(await slots.count()).toBeGreaterThan(10);
  for (const s of await slots.all()) await expect(s).toHaveAttribute('aria-hidden', 'true');
});

test('the supplied hero banner renders as a responsive picture with localized alt text', async ({ page }) => {
  for (const [code, fragment] of [
    ['en', 'VP monogram carrying CCTV cameras'],
    ['ar', 'شعار VP بلونين فحمي وذهبي'],
    ['zh', 'VP 字母造型'],
  ] as const) {
    await page.goto(`/${code}`);
    const img = page.locator('.hero picture img');
    await expect(img).toHaveAttribute('alt', new RegExp(fragment));
    expect(await img.evaluate((el: HTMLImageElement) => el.complete && el.naturalWidth > 0)).toBe(true);
    await expect(page.locator('[data-slot="HOME-HERO"]')).toHaveCount(0);
    await expect(page.locator('.hero-art')).toHaveCount(0);
  }
});

test.describe('desktop navigation', () => {
  test.skip(({ viewport }) => (viewport?.width ?? 0) < 1200, 'desktop only');

  test('mega menu opens with the keyboard and closes with Escape, returning focus', async ({ page }) => {
    await page.goto('/en');
    const trigger = page.getByRole('button', { name: 'Solutions' });
    await trigger.focus();
    await page.keyboard.press('Enter');
    await expect(trigger).toHaveAttribute('aria-expanded', 'true');
    const panel = page.locator(`#${await trigger.getAttribute('aria-controls')}`.replace(/:/g, '\\:'));
    await expect(panel.getByRole('link', { name: /Access Control/ })).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(trigger).toHaveAttribute('aria-expanded', 'false');
    await expect(trigger).toBeFocused();
  });

  test('language switcher keeps the page and switches direction', async ({ page }) => {
    await page.goto('/en');
    await page.locator('.lang-trigger').click();
    await page.getByRole('link', { name: 'العربية' }).first().click();
    await expect(page).toHaveURL(/\/ar$/);
    await expect(page.locator('html')).toHaveAttribute('dir', 'rtl');
  });
});

test.describe('mobile navigation', () => {
  test.skip(({ viewport }) => (viewport?.width ?? 0) >= 1200, 'mobile only');

  test('drawer traps focus, closes on Escape and restores focus', async ({ page }) => {
    await page.goto('/en');
    const menu = page.locator('.menu-button').first();
    await menu.click();
    const dialog = page.getByRole('dialog', { name: 'Site menu' });
    await expect(dialog).toBeVisible();
    await expect(dialog.getByRole('button', { name: 'Close menu' })).toBeFocused();
    await page.keyboard.press('Shift+Tab');
    expect(await dialog.evaluate((d) => d.contains(document.activeElement))).toBe(true);
    await page.keyboard.press('Escape');
    await expect(menu).toBeFocused();
    await expect(menu).toHaveAttribute('aria-expanded', 'false');
  });

  test('accordion sections expose aria-expanded', async ({ page }) => {
    await page.goto('/en');
    await page.locator('.menu-button').first().click();
    const section = page.locator('.drawer__trigger').first();
    await section.click();
    await expect(section).toHaveAttribute('aria-expanded', 'true');
  });
});

test.describe('reduced motion', () => {
  test.use({ contextOptions: { reducedMotion: 'reduce' } });
  test('motion styles are never enabled and diagrams render their final state', async ({ page }) => {
    await page.goto('/en');
    await expect(page.locator('html')).not.toHaveClass(/motion-ok/);
    const fill = page.locator('.isys__rail-fill');
    const transform = await fill.evaluate((el) => getComputedStyle(el).transform);
    expect(['none', 'matrix(1, 0, 0, 1, 0, 0)']).toContain(transform);
  });
});
