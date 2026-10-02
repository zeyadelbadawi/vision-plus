import localFont from 'next/font/local';

/**
 * Self-hosted, build-time fonts (T-05; zero-cost, no runtime Google Fonts requests).
 * - IBM Plex Sans (variable wght) — Latin, preloaded.
 * - IBM Plex Sans Arabic — requested only where Arabic text renders (not preloaded).
 * - Noto Sans SC — linked only on /zh (see scripts/fonts.mjs and [locale]/layout.tsx).
 */
export const plexSans = localFont({
  src: '../../node_modules/@fontsource-variable/ibm-plex-sans/files/ibm-plex-sans-latin-wght-normal.woff2',
  weight: '100 700',
  style: 'normal',
  display: 'swap',
  variable: '--font-plex',
  preload: true,
  adjustFontFallback: 'Arial',
  fallback: ['ui-sans-serif', 'system-ui', 'Arial', 'sans-serif'],
});

export const plexArabic = localFont({
  src: [
    { path: '../../node_modules/@fontsource/ibm-plex-sans-arabic/files/ibm-plex-sans-arabic-arabic-400-normal.woff2', weight: '400', style: 'normal' },
    { path: '../../node_modules/@fontsource/ibm-plex-sans-arabic/files/ibm-plex-sans-arabic-arabic-500-normal.woff2', weight: '500', style: 'normal' },
    { path: '../../node_modules/@fontsource/ibm-plex-sans-arabic/files/ibm-plex-sans-arabic-arabic-600-normal.woff2', weight: '600', style: 'normal' },
  ],
  display: 'swap',
  variable: '--font-plex-arabic',
  preload: false,
  adjustFontFallback: false,
  fallback: ['Segoe UI', 'Tahoma', 'sans-serif'],
});
