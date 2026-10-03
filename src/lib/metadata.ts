import type { Metadata } from 'next';
import { routing } from '@/i18n/routing';
import type { Locale } from '@/i18n/locales';
import { getSeoCopy } from '@/content';

type Seo = ReturnType<typeof getSeoCopy>;
type PageKey = Exclude<keyof Seo, '_meta' | 'solutions'>;

/**
 * og:locale needs language_TERRITORY (§36). Arabic follows the checklist default, Qatar (headquarters), until the
 * client answers Q-23 (Qatar or Egypt as the primary Arabic market); changing it is this one value.
 */
export const OG_LOCALE: Record<Locale, string> = { en: 'en_US', ar: 'ar_QA', zh: 'zh_CN' };

/** Build-time card (scripts/og.mjs) for a page: `home`, a seo.json page key, or `solution-<slug>`. */
export const ogImagePath = (locale: Locale, key: string) => `/og/${locale}/${key}.png`;

/**
 * Open Graph and Twitter fields for one page (§36). Next.js replaces `openGraph` wholesale between layout and page,
 * so every page carries the full set. Relative URLs resolve against `metadataBase` (NEXT_PUBLIC_SITE_URL).
 */
export function socialMetadata(locale: Locale, key: string, title: string, description: string): Pick<Metadata, 'openGraph' | 'twitter'> {
  const image = { url: ogImagePath(locale, key), width: 1200, height: 630, alt: title, type: 'image/png' };
  return {
    openGraph: {
      type: 'website',
      siteName: 'VISION PLUS',
      title,
      description,
      locale: OG_LOCALE[locale],
      alternateLocale: routing.locales.filter((l) => l !== locale).map((l) => OG_LOCALE[l as Locale]),
      images: [image],
    },
    twitter: { card: 'summary_large_image', title, description, images: [image.url] },
  };
}

/** Per-page <title>/<meta description> from copy/<locale>/seo.json (§36), plus the page's social card. Robots come from the locale layout. */
export function pageMetadata(locale: Locale, key: PageKey): Metadata {
  const { title, description } = getSeoCopy(locale)[key];
  return { title, description, ...socialMetadata(locale, key, title, description) };
}

export function solutionMetadata(locale: Locale, slug: keyof Seo['solutions']): Metadata {
  const { title, description } = getSeoCopy(locale).solutions[slug];
  return { title, description, ...socialMetadata(locale, `solution-${slug}`, title, description) };
}
