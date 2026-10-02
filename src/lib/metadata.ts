import type { Metadata } from 'next';
import type { Locale } from '@/i18n/locales';
import { getSeoCopy } from '@/content';

type Seo = ReturnType<typeof getSeoCopy>;
type PageKey = Exclude<keyof Seo, '_meta' | 'solutions'>;

/** Per-page <title>/<meta description> from copy/<locale>/seo.json (§36). Robots come from the locale layout. */
export function pageMetadata(locale: Locale, key: PageKey): Metadata {
  const { title, description } = getSeoCopy(locale)[key];
  return { title, description };
}

export function solutionMetadata(locale: Locale, slug: keyof Seo['solutions']): Metadata {
  const { title, description } = getSeoCopy(locale).solutions[slug];
  return { title, description };
}
