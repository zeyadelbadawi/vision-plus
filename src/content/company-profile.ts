import type { Locale } from '@/i18n/locales';

/**
 * Company Profile configuration (MASTER_PROJECT_PLAN §33; P5A-11 notes §55.3.14) — the single source for the Canva
 * embed. Empty until the client supplies the embed code (D-06): never store a placeholder URL here. To fill it, run
 * `pnpm canva:parse "<embed html>"` and paste the printed entry. `ar`/`zh` null → the English embed is used.
 */
export interface CompanyProfileEmbed {
  src: string;
  aspectRatio: string;
  status: 'final';
}

export const companyProfile: {
  embeds: Record<Locale, CompanyProfileEmbed | null>;
  poster: 'CP-POSTER';
  pdf: string | null;
} = {
  embeds: { en: null, ar: null, zh: null },
  poster: 'CP-POSTER',
  pdf: null,
};

/** The embed for a locale, falling back to English (§33). Null while D-06 is outstanding. */
export function embedFor(locale: Locale): CompanyProfileEmbed | null {
  return companyProfile.embeds[locale] ?? companyProfile.embeds.en;
}
