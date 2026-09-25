'use client';

import NextLink from 'next/link';
import { useParams, usePathname as useNextPathname } from 'next/navigation';
import { createElement, type ComponentProps } from 'react';
import { defaultLocale, isLocale, type Locale } from './locales';

/**
 * Locale-aware navigation without shipping next-intl's client runtime (~13 KB gz incl. a message
 * formatter). All strings are resolved on the server and passed as props, so client islands only
 * need to prefix links with the active locale, which they read from the [locale] route segment.
 */
export function localizeHref(locale: Locale, href: string): string {
  if (/^(https?:|mailto:|tel:|#)/.test(href)) return href;
  return href === '/' ? `/${locale}` : `/${locale}${href.startsWith('/') ? href : `/${href}`}`;
}

function useActiveLocale(): Locale {
  const params = useParams<{ locale?: string }>();
  return isLocale(params?.locale) ? params.locale : defaultLocale;
}

type LinkProps = Omit<ComponentProps<typeof NextLink>, 'href' | 'locale'> & {
  href: string;
  /** Target locale (language switcher). Defaults to the active locale. */
  locale?: Locale;
};

export function Link({ href, locale, ...rest }: LinkProps) {
  const active = useActiveLocale();
  return createElement(NextLink, { href: localizeHref(locale ?? active, href), ...rest });
}

/** Current pathname without the locale prefix (e.g. "/solutions/access-control"). */
export function usePathname(): string {
  const path = useNextPathname() ?? '/';
  const stripped = path.replace(/^\/(en|ar|zh)(?=\/|$)/, '');
  return stripped === '' ? '/' : stripped;
}
