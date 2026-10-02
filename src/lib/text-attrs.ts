import type { Locale } from '@/i18n/locales';

/**
 * Untranslated (placeholder) copy on /ar and /zh is still the English source (P4-05). Rendering it with the
 * page's language and direction breaks bidi punctuation ("Driven by What's Next." → ".Driven…") and
 * selects the wrong line-breaking rules. When a string contains none of the locale's own script it is
 * marked as English/LTR; real translations contain their script, so this becomes a no-op as they arrive.
 */
const SCRIPT: Partial<Record<Locale, RegExp>> = { ar: /[؀-ۿ]/, zh: /[㐀-鿿　-〿]/ };

export function textAttrs(locale: Locale, text: string | undefined): { lang?: string; dir?: 'ltr' } {
  const script = SCRIPT[locale];
  if (!script || !text || script.test(text)) return {};
  return { lang: 'en', dir: 'ltr' };
}
