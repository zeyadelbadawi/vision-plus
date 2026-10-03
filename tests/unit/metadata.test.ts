import { describe, expect, it } from 'vitest';
import { OG_LOCALE, ogImagePath, pageMetadata, solutionMetadata } from '@/lib/metadata';

// Open Graph / Twitter metadata (§36, P5A-14). The cards themselves are built by scripts/og.mjs and checked by site:check.
describe('social metadata', () => {
  it('gives every page its own localized card with the page title and description', () => {
    const m = pageMetadata('ar', 'contact');
    const og = m.openGraph as Record<string, unknown>;
    expect(og.title).toBe(m.title);
    expect(og.description).toBe(m.description);
    expect(og.locale).toBe('ar_QA');
    expect(og.alternateLocale).toEqual(['en_US', 'zh_CN']);
    expect(og.images).toEqual([{ url: '/og/ar/contact.png', width: 1200, height: 630, alt: m.title, type: 'image/png' }]);
    expect(m.twitter).toMatchObject({ card: 'summary_large_image', images: ['/og/ar/contact.png'] });
  });

  it('keys solution cards by slug', () => {
    const og = solutionMetadata('zh', 'access-control').openGraph as Record<string, unknown>;
    expect(og.locale).toBe('zh_CN');
    expect((og.images as { url: string }[])[0]!.url).toBe('/og/zh/solution-access-control.png');
  });

  it('uses language_TERRITORY locales (Q-23 decides the Arabic territory)', () => {
    for (const v of Object.values(OG_LOCALE)) expect(v).toMatch(/^[a-z]{2}_[A-Z]{2}$/);
    expect(ogImagePath('en', 'home')).toBe('/og/en/home.png');
  });
});
