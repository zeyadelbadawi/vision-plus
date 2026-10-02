import { defineRouting } from 'next-intl/routing';
import { defaultLocale, locales } from './locales';

// Static export: locale prefix always present, no proxy-based detection (§11, §13).
export const routing = defineRouting({
  locales,
  defaultLocale,
  localePrefix: 'always',
  localeDetection: false,
});
