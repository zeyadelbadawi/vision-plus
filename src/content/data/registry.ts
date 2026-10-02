/**
 * Locale-agnostic structure (MASTER_PROJECT_PLAN §12.1): slugs, order, relations, image IDs.
 * Copy lives in src/content/copy/<locale>/*.json and is keyed by these slugs.
 */
export const solutions = [
  { slug: 'mobile-nvr-mobile-surveillance', code: 'MNVR', image: 'SOL-MNVR-CARD', featured: true },
  { slug: 'cctv-security-systems', code: 'CCTV', image: 'SOL-CCTV-CARD' },
  { slug: 'access-control', code: 'ACCESS', image: 'SOL-ACCESS-CARD' },
  { slug: 'networking-ict', code: 'ICT', image: 'SOL-ICT-CARD' },
  { slug: 'elv-systems', code: 'ELV', image: 'SOL-ELV-CARD' },
  { slug: 'audio-visual', code: 'AV', image: 'SOL-AV-CARD' },
  { slug: 'smart-building-home-automation', code: 'SMART', image: 'SOL-SMART-CARD' },
  { slug: 'fire-alarm-systems', code: 'FIRE', image: 'SOL-FIRE-CARD' },
] as const;
export type SolutionSlug = (typeof solutions)[number]['slug'];

export const services = [
  'system-design-consultancy',
  'project-management',
  'installation-commissioning',
  'testing-integration',
  'maintenance-support',
  'technical-training-support',
] as const;
export type ServiceSlug = (typeof services)[number];

export const industries = [
  { slug: 'transportation-fleet', image: 'IND-TRANSPORT' },
  { slug: 'government-public-sector', image: 'IND-GOV' },
  { slug: 'commercial-corporate', image: 'IND-COMMERCIAL' },
  { slug: 'banking-finance', image: 'IND-BANKING' },
  { slug: 'hospitality', image: 'IND-HOSPITALITY' },
  { slug: 'retail', image: 'IND-RETAIL' },
  { slug: 'education', image: 'IND-EDUCATION' },
  { slug: 'healthcare', image: 'IND-HEALTHCARE' },
  // Q-08 (client, 2026-10-02): "Real Estate & Property Development" and "Residential & Communities" are separate
  // industries. The slug `residential` is kept; its name is now "Residential & Communities".
  { slug: 'real-estate-property-development', image: 'IND-REALESTATE' },
  { slug: 'residential', image: 'IND-RESIDENTIAL' },
  { slug: 'logistics-warehousing', image: 'IND-LOGISTICS' },
  { slug: 'industrial-manufacturing', image: 'IND-INDUSTRIAL' },
] as const;
export type IndustrySlug = (typeof industries)[number]['slug'];

export const productCategories = [
  'cctv-surveillance',
  'access-control',
  'time-attendance',
  'video-intercom',
  'intrusion-alarm',
  'fire-life-safety',
  'security-networking',
] as const;
export type ProductCategorySlug = (typeof productCategories)[number];

/**
 * Partners and projects: EMPTY until the client supplies real, confirmed data (D-08, D-10).
 * Nothing here may be invented. Sections that depend on them are hidden in production.
 */
export interface Partner {
  slug: string;
  name: string;
  logo: { mono: string; color?: string };
  website?: string;
}
export const partners: Partner[] = [];

export interface Project {
  slug: string;
  featured?: boolean;
}
export const projects: Project[] = [];

/** Preview-only structural slots so the section layouts can be reviewed without fabricating data. */
export const previewSlots = { partners: 8, projects: 3 } as const;
