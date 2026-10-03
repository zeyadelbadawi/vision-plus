/**
 * Locale-agnostic structure (MASTER_PROJECT_PLAN §12.1): slugs, order, relations, image IDs.
 * Copy lives in src/content/copy/<locale>/*.json and is keyed by these slugs.
 */
export const solutions = [
  { slug: 'mobile-nvr-mobile-surveillance', code: 'MNVR', image: 'SOL-MNVR-CARD', hero: 'SOL-MNVR-HERO', detail: 'SOL-MNVR-DETAIL', featured: true },
  { slug: 'cctv-security-systems', code: 'CCTV', image: 'SOL-CCTV-CARD', hero: 'SOL-CCTV-HERO', detail: 'SOL-CCTV-DETAIL' },
  { slug: 'access-control', code: 'ACCESS', image: 'SOL-ACCESS-CARD', hero: 'SOL-ACCESS-HERO', detail: 'SOL-ACCESS-DETAIL' },
  { slug: 'networking-ict', code: 'ICT', image: 'SOL-ICT-CARD', hero: 'SOL-ICT-HERO', detail: 'SOL-ICT-DETAIL' },
  { slug: 'elv-systems', code: 'ELV', image: 'SOL-ELV-CARD', hero: 'SOL-ELV-HERO', detail: 'SOL-ELV-DETAIL' },
  { slug: 'audio-visual', code: 'AV', image: 'SOL-AV-CARD', hero: 'SOL-AV-HERO', detail: 'SOL-AV-DETAIL' },
  { slug: 'smart-building-home-automation', code: 'SMART', image: 'SOL-SMART-CARD', hero: 'SOL-SMART-HERO', detail: 'SOL-SMART-DETAIL' },
  { slug: 'fire-alarm-systems', code: 'FIRE', image: 'SOL-FIRE-CARD', hero: 'SOL-FIRE-HERO', detail: 'SOL-FIRE-DETAIL' },
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

/** Services page section images (§26.5, F4, P2). Literal IDs so `assets:check` sees them. */
export const serviceMedia = {
  'system-design-consultancy': { image: 'SRV-DESIGN' },
  'project-management': { image: 'SRV-PM' },
  'installation-commissioning': { image: 'SRV-INSTALL' },
  'testing-integration': { image: 'SRV-TEST' },
  'maintenance-support': { image: 'SRV-MAINT' },
  'technical-training-support': { image: 'SRV-TRAIN' },
} as const satisfies Record<ServiceSlug, { image: string }>;

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
 * Partners (MASTER_PROJECT_PLAN §34). D-08 update (2026-10-03, A-30): the client confirmed these 17 technology partners
 * and permission to display their names; spelling as supplied, in the order supplied (pages sort alphabetically).
 * Logos (`PARTNER-{slug}-LOGO`, P1) come from the designer: until then each partner renders as its name in type.
 * Never add a partner, or a logo, without the client's confirmation and display permission (R-11).
 */
export interface Partner {
  slug: string;
  name: string;
  status: 'confirmed';
  /** Monochrome logo (required for the logo variant) and optional colour version for hover/focus (Q-13). */
  logo?: { mono: string; color?: string };
  website?: string;
}
export const partners: Partner[] = [
  { slug: 'hikvision', name: 'Hikvision', status: 'confirmed' },
  { slug: 'unv', name: 'UNV', status: 'confirmed' },
  { slug: 'dahua', name: 'Dahua', status: 'confirmed' },
  { slug: 'axis', name: 'Axis', status: 'confirmed' },
  { slug: 'bosch', name: 'Bosch', status: 'confirmed' },
  { slug: 'itc', name: 'ITC', status: 'confirmed' },
  { slug: 'hanwha', name: 'Hanwha', status: 'confirmed' },
  { slug: 'zkteco', name: 'ZKTeco', status: 'confirmed' },
  { slug: 'suprema', name: 'Suprema', status: 'confirmed' },
  { slug: 'hid', name: 'HID', status: 'confirmed' },
  { slug: 'honeywell', name: 'Honeywell', status: 'confirmed' },
  { slug: 'johnson-controls', name: 'Johnson Controls', status: 'confirmed' },
  { slug: 'genetec', name: 'Genetec', status: 'confirmed' },
  { slug: 'milestone', name: 'Milestone', status: 'confirmed' },
  { slug: 'siemens', name: 'Siemens', status: 'confirmed' },
  { slug: 'schneider-electric', name: 'Schneider Electric', status: 'confirmed' },
  { slug: 'philips', name: 'Philips', status: 'confirmed' },
];

/** Partners sorted for display (§26.9: alphabetical). */
export const partnersAlphabetical = [...partners].sort((a, b) => a.name.localeCompare(b.name, 'en'));

/**
 * Projects: EMPTY until the client supplies real, confirmed data (D-10). Nothing here may be invented; sections that
 * depend on them are hidden in production.
 */
export interface Project {
  slug: string;
  featured?: boolean;
}
export const projects: Project[] = [];

/** Preview-only structural slots so the section layouts can be reviewed without fabricating data. */
export const previewSlots = { partners: 8, projects: 3 } as const;
