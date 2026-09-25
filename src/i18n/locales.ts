/** Locale configuration (MASTER_PROJECT_PLAN §13). */
export const locales = ['en', 'ar', 'zh'] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = 'en';

export const localeMeta: Record<Locale, { htmlLang: string; dir: 'ltr' | 'rtl'; nativeName: string; shortLabel: string }> = {
  en: { htmlLang: 'en', dir: 'ltr', nativeName: 'English', shortLabel: 'EN' },
  ar: { htmlLang: 'ar', dir: 'rtl', nativeName: 'العربية', shortLabel: 'ع' },
  zh: { htmlLang: 'zh-Hans', dir: 'ltr', nativeName: '中文', shortLabel: '中' },
};

export function isLocale(value: string | undefined): value is Locale {
  return !!value && (locales as readonly string[]).includes(value);
}
