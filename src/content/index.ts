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
import enAbout from './copy/en/about.json';
import arAbout from './copy/ar/about.json';
import zhAbout from './copy/zh/about.json';
import enContact from './copy/en/contact.json';
import arContact from './copy/ar/contact.json';
import zhContact from './copy/zh/contact.json';
import enIndustries from './copy/en/industries.json';
import arIndustries from './copy/ar/industries.json';
import zhIndustries from './copy/zh/industries.json';
import enPartners from './copy/en/partners.json';
import arPartners from './copy/ar/partners.json';
import zhPartners from './copy/zh/partners.json';
import enProducts from './copy/en/products.json';
import arProducts from './copy/ar/products.json';
import zhProducts from './copy/zh/products.json';
import enProjects from './copy/en/projects.json';
import arProjects from './copy/ar/projects.json';
import zhProjects from './copy/zh/projects.json';
import enSeo from './copy/en/seo.json';
import arSeo from './copy/ar/seo.json';
import zhSeo from './copy/zh/seo.json';
import enServices from './copy/en/services.json';
import arServices from './copy/ar/services.json';
import zhServices from './copy/zh/services.json';
import enSolutions from './copy/en/solutions.json';
import arSolutions from './copy/ar/solutions.json';
import zhSolutions from './copy/zh/solutions.json';
import enSamples from './copy/en/samples.json';
import arSamples from './copy/ar/samples.json';
import zhSamples from './copy/zh/samples.json';
import locationsJson from './data/locations.json';

export type ContentStatus = 'approved' | 'derived' | 'draft' | 'placeholder' | 'draft-mt';
type Meta = { _meta: { status: string } };
/** English defines the shape; every locale must match it (minus provenance notes in `_meta`). */
type Shape<T> = Omit<T, '_meta'> & Meta;
export type CatalogCopy = Shape<typeof enCatalog>;
export type CompanyCopy = Shape<typeof enCompany>;
export type HomeCopy = Shape<typeof enHome>;
export type AboutCopy = Shape<typeof enAbout>;
export type ContactCopy = Shape<typeof enContact>;
export type IndustriesCopy = Shape<typeof enIndustries>;
export type PartnersCopy = Shape<typeof enPartners>;
export type ProductsCopy = Shape<typeof enProducts>;
export type ProjectsCopy = Shape<typeof enProjects>;
export type SeoCopy = Shape<typeof enSeo>;
export type ServicesCopy = Shape<typeof enServices>;
export type SolutionsCopy = Shape<typeof enSolutions>;
export type SamplesCopy = Shape<typeof enSamples>;

// `satisfies` enforces key parity across locales at compile time; scripts/content-check.mjs
// additionally checks array lengths and the content-status gate.
const catalog = { en: enCatalog, ar: arCatalog, zh: zhCatalog } satisfies Record<Locale, CatalogCopy>;
const company = { en: enCompany, ar: arCompany, zh: zhCompany } satisfies Record<Locale, CompanyCopy>;
const home = { en: enHome, ar: arHome, zh: zhHome } satisfies Record<Locale, HomeCopy>;
const aboutCopy = { en: enAbout, ar: arAbout, zh: zhAbout } satisfies Record<Locale, AboutCopy>;
const contactCopy = { en: enContact, ar: arContact, zh: zhContact } satisfies Record<Locale, ContactCopy>;
const industriesCopy = { en: enIndustries, ar: arIndustries, zh: zhIndustries } satisfies Record<Locale, IndustriesCopy>;
const partnersCopy = { en: enPartners, ar: arPartners, zh: zhPartners } satisfies Record<Locale, PartnersCopy>;
const productsCopy = { en: enProducts, ar: arProducts, zh: zhProducts } satisfies Record<Locale, ProductsCopy>;
const projectsCopy = { en: enProjects, ar: arProjects, zh: zhProjects } satisfies Record<Locale, ProjectsCopy>;
const seoCopy = { en: enSeo, ar: arSeo, zh: zhSeo } satisfies Record<Locale, SeoCopy>;
const servicesCopy = { en: enServices, ar: arServices, zh: zhServices } satisfies Record<Locale, ServicesCopy>;
const solutionsCopy = { en: enSolutions, ar: arSolutions, zh: zhSolutions } satisfies Record<Locale, SolutionsCopy>;
const samplesCopy = { en: enSamples, ar: arSamples, zh: zhSamples } satisfies Record<Locale, SamplesCopy>;

export const getCatalog = (locale: Locale): CatalogCopy => catalog[locale];
export const getCompany = (locale: Locale): CompanyCopy => company[locale];
export const getHome = (locale: Locale): HomeCopy => home[locale];
// Page copy encoded in P4 (consumed by the P5 templates).
export const getAboutCopy = (locale: Locale): AboutCopy => aboutCopy[locale];
export const getContactCopy = (locale: Locale): ContactCopy => contactCopy[locale];
export const getIndustriesCopy = (locale: Locale): IndustriesCopy => industriesCopy[locale];
export const getPartnersCopy = (locale: Locale): PartnersCopy => partnersCopy[locale];
export const getProductsCopy = (locale: Locale): ProductsCopy => productsCopy[locale];
export const getProjectsCopy = (locale: Locale): ProjectsCopy => projectsCopy[locale];
export const getSeoCopy = (locale: Locale): SeoCopy => seoCopy[locale];
export const getServicesCopy = (locale: Locale): ServicesCopy => servicesCopy[locale];
export const getSolutionsCopy = (locale: Locale): SolutionsCopy => solutionsCopy[locale];
/** Illustrative sample content (Q-12, D-01, D-02) — preview builds only; see data/samples.ts. */
export const getSamplesCopy = (locale: Locale): SamplesCopy => samplesCopy[locale];

/**
 * Whether a catalog entry still awaits client review (`_meta.review` without `approved`, e.g. `approach.0.text`, R-2).
 * Pages show a preview-only note on such entries; the production gate (`content:check`) blocks on them regardless.
 */
export function catalogPending(path: string): boolean {
  const review = (enCatalog._meta as { review?: Record<string, { approved?: string }> }).review;
  const entry = review?.[path];
  return !!entry && !entry.approved;
}

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
