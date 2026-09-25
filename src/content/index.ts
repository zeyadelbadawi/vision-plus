import type { Locale } from '@/i18n/locales';
import enCatalog from './copy/en/catalog.json';
import arCatalog from './copy/ar/catalog.json';
import zhCatalog from './copy/zh/catalog.json';
import enCompany from './copy/en/company.json';
import arCompany from './copy/ar/company.json';
import zhCompany from './copy/zh/company.json';
import enHome from './copy/en/home.json';
import arHome from './copy/ar/home.json';
import zhHome from './copy/zh/home.json';
import locationsJson from './data/locations.json';

export type ContentStatus = 'approved' | 'derived' | 'draft' | 'placeholder' | 'draft-mt';
type Meta = { _meta: { status: string } };
/** English defines the shape; every locale must match it (minus provenance notes in `_meta`). */
type Shape<T> = Omit<T, '_meta'> & Meta;
export type CatalogCopy = Shape<typeof enCatalog>;
export type CompanyCopy = Shape<typeof enCompany>;
export type HomeCopy = Shape<typeof enHome>;

// `satisfies` enforces key parity across locales at compile time; scripts/content-check.mjs
// additionally checks array lengths and the content-status gate.
const catalog = { en: enCatalog, ar: arCatalog, zh: zhCatalog } satisfies Record<Locale, CatalogCopy>;
const company = { en: enCompany, ar: arCompany, zh: zhCompany } satisfies Record<Locale, CompanyCopy>;
const home = { en: enHome, ar: arHome, zh: zhHome } satisfies Record<Locale, HomeCopy>;

export const getCatalog = (locale: Locale): CatalogCopy => catalog[locale];
export const getCompany = (locale: Locale): CompanyCopy => company[locale];
export const getHome = (locale: Locale): HomeCopy => home[locale];

/** Aggregate status of the copy shown for a locale (drives the preview notice). */
export function copyStatus(locale: Locale): ContentStatus {
  return [catalog[locale], company[locale], home[locale]].some((c) => c._meta.status === 'draft-mt') ? 'draft-mt' : 'approved';
}

export interface Office {
  key: 'qatar' | 'egypt';
  address: string | null;
  phone: string | null;
  email: string | null;
  mapUrl: string | null;
  mapEmbedSrc: string | null;
}
export const offices = locationsJson.offices as Office[];
