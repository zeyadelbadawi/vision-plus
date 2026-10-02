/**
 * Root locale negotiation (MASTER_PROJECT_PLAN §11, §13): cookie NEXT_LOCALE → Accept-Language → en.
 * Pure function so it is unit-testable outside the Workers runtime.
 */
export const LOCALES = ['en', 'ar', 'zh'] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = 'en';

const isLocale = (v: string | undefined | null): v is Locale => !!v && (LOCALES as readonly string[]).includes(v);

export function readLocaleCookie(cookieHeader: string | null): Locale | null {
  if (!cookieHeader) return null;
  for (const part of cookieHeader.split(';')) {
    const [rawName, ...rest] = part.split('=');
    if (rawName?.trim() === 'NEXT_LOCALE') {
      let value: string;
      try {
        value = decodeURIComponent(rest.join('=').trim());
      } catch {
        return null; // malformed cookie must never break the root redirect
      }
      return isLocale(value) ? value : null;
    }
  }
  return null;
}

/** Highest-q supported language from an Accept-Language header (any `zh-*` maps to `zh`). */
export function matchAcceptLanguage(header: string | null): Locale | null {
  if (!header) return null;
  const ranked = header
    .split(',')
    .map((entry, index) => {
      const [tag = '', ...params] = entry.trim().split(';');
      const q = params.map((p) => p.trim()).find((p) => p.startsWith('q='));
      const quality = q ? Number(q.slice(2)) : 1;
      return { primary: tag.toLowerCase().split('-')[0] ?? '', quality: Number.isFinite(quality) ? quality : 0, index };
    })
    .filter((e) => e.primary && e.quality > 0)
    .sort((a, b) => b.quality - a.quality || a.index - b.index);
  for (const e of ranked) if (isLocale(e.primary)) return e.primary;
  return null;
}

export function negotiateLocale(cookieHeader: string | null, acceptLanguage: string | null): Locale {
  return readLocaleCookie(cookieHeader) ?? matchAcceptLanguage(acceptLanguage) ?? DEFAULT_LOCALE;
}
