/**
 * Cross-entity relations (MASTER_PROJECT_PLAN §9.1, §9.2, §12.4, §26.5).
 *
 * Every relation here is DERIVED, never invented:
 *  - industry → solution links exist only where the approved industry sentence (01 §18, catalog.json)
 *    names the technology; `evidence` quotes those words and a unit test checks they really appear;
 *  - service → approach-step and product-category → solution links follow the plan's mapping.
 * All of them await client confirmation (Q-10 / D-19; Q-02 for products) before they count as approved.
 */
import type { IndustrySlug, ProductCategorySlug, ServiceSlug, SolutionSlug } from './registry';

export type RelationStatus = 'derived' | 'approved';

export interface IndustryLink {
  solution: SolutionSlug;
  /** Words from the approved industry sentence that justify the link. */
  evidence: string[];
}

export const industrySolutions = {
  status: 'derived' as RelationStatus,
  source: '01 §18 wording → MASTER_PROJECT_PLAN §12.4; awaiting client confirmation (Q-10, D-19)',
  map: {
    'transportation-fleet': [{ solution: 'mobile-nvr-mobile-surveillance', evidence: ['Mobile NVR'] }],
    'government-public-sector': [
      { solution: 'cctv-security-systems', evidence: ['surveillance', 'security'] },
      { solution: 'access-control', evidence: ['access management'] },
      { solution: 'networking-ict', evidence: ['networking'] },
    ],
    'commercial-corporate': [
      { solution: 'networking-ict', evidence: ['ICT'] },
      { solution: 'cctv-security-systems', evidence: ['security'] },
      { solution: 'access-control', evidence: ['access control'] },
      { solution: 'audio-visual', evidence: ['AV'] },
      { solution: 'smart-building-home-automation', evidence: ['automation'] },
    ],
    'banking-finance': [
      { solution: 'cctv-security-systems', evidence: ['surveillance', 'centralized monitoring'] },
      { solution: 'access-control', evidence: ['controlled access'] },
      { solution: 'networking-ict', evidence: ['connectivity'] },
    ],
    hospitality: [
      { solution: 'cctv-security-systems', evidence: ['security'] },
      { solution: 'audio-visual', evidence: ['communication', 'entertainment'] },
      { solution: 'networking-ict', evidence: ['connectivity'] },
    ],
    retail: [
      { solution: 'cctv-security-systems', evidence: ['Security', 'monitoring', 'analytics'] },
      { solution: 'networking-ict', evidence: ['connectivity'] },
      { solution: 'audio-visual', evidence: ['digital communication'] },
    ],
    education: [
      { solution: 'cctv-security-systems', evidence: ['security'] },
      { solution: 'networking-ict', evidence: ['networking'] },
      { solution: 'access-control', evidence: ['access'] },
      { solution: 'mobile-nvr-mobile-surveillance', evidence: ['transportation monitoring'] },
    ],
    healthcare: [
      { solution: 'cctv-security-systems', evidence: ['security'] },
      { solution: 'access-control', evidence: ['access'] },
      { solution: 'networking-ict', evidence: ['networking'] },
    ],
    residential: [
      { solution: 'cctv-security-systems', evidence: ['security'] },
      { solution: 'networking-ict', evidence: ['networking'] },
      { solution: 'audio-visual', evidence: ['entertainment'] },
      { solution: 'access-control', evidence: ['access'] },
      { solution: 'smart-building-home-automation', evidence: ['smart home automation'] },
    ],
    'logistics-warehousing': [
      { solution: 'cctv-security-systems', evidence: ['surveillance'] },
      { solution: 'access-control', evidence: ['access management'] },
      { solution: 'networking-ict', evidence: ['ICT infrastructure'] },
      { solution: 'mobile-nvr-mobile-surveillance', evidence: ['fleet monitoring', 'mobile surveillance'] },
    ],
    'industrial-manufacturing': [
      { solution: 'cctv-security-systems', evidence: ['security', 'monitoring'] },
      { solution: 'networking-ict', evidence: ['networking'] },
    ],
  } satisfies Record<IndustrySlug, IndustryLink[]>,
};

/**
 * Named by no approved industry sentence, so shown as "applies across environments" instead of being
 * force-linked to industries (§12.4).
 */
export const acrossEnvironments: SolutionSlug[] = ['elv-systems', 'fire-alarm-systems'];

/** Approach step keys, in order (01 §17; titles live in catalog.json `approach`). */
export const approachSteps = ['understand', 'design', 'select', 'deliver', 'integrate', 'verify', 'enable', 'support'] as const;
export type ApproachStep = (typeof approachSteps)[number];

/** Service → approach stages shown as "Stages: …" on /services (§26.5). Derived; awaiting D-19. */
export const serviceStages = {
  status: 'derived' as RelationStatus,
  source: 'MASTER_PROJECT_PLAN §26.5; awaiting client confirmation (D-19)',
  map: {
    'system-design-consultancy': ['understand', 'design', 'select'],
    'project-management': ['deliver'],
    'installation-commissioning': ['deliver'],
    'testing-integration': ['integrate', 'verify'],
    'maintenance-support': ['support'],
    'technical-training-support': ['enable'],
  } satisfies Record<ServiceSlug, ApproachStep[]>,
};

export interface CategoryLink {
  solutions: SolutionSlug[];
  /** Why the link exists (approved wording or the plan's mapping). */
  basis: string;
}

/** Product category → related solution (§9.2). Derived; awaiting Q-02 / D-19. Empty = no approved link. */
export const categorySolutions = {
  status: 'derived' as RelationStatus,
  source: 'MASTER_PROJECT_PLAN §9.2; awaiting client confirmation (Q-02, D-19)',
  map: {
    'cctv-surveillance': { solutions: ['cctv-security-systems'], basis: 'Same technology as the CCTV & Security Systems solution (01 §09)' },
    'access-control': { solutions: ['access-control'], basis: 'Same name as the Access Control solution (01 §10)' },
    'time-attendance': { solutions: ['access-control'], basis: '“Time & Attendance” is an Access Control capability (01 §10)' },
    'video-intercom': { solutions: [], basis: 'Appears only in the 02 market research; no approved copy (D-09)' },
    'intrusion-alarm': { solutions: [], basis: 'Appears only in the 02 market research; no approved copy (D-09)' },
    'fire-life-safety': { solutions: ['fire-alarm-systems'], basis: 'Life-safety solutions (01 §15)' },
    'security-networking': { solutions: ['networking-ict'], basis: 'Network infrastructure (01 §11)' },
  } satisfies Record<ProductCategorySlug, CategoryLink>,
};

/** Reverse lookup used by the solution "Related" rail (§26.2). */
export function industriesForSolution(slug: SolutionSlug): IndustrySlug[] {
  return (Object.entries(industrySolutions.map) as [IndustrySlug, IndustryLink[]][])
    .filter(([, links]) => links.some((l) => l.solution === slug))
    .map(([industry]) => industry);
}

export function categoriesForSolution(slug: SolutionSlug): ProductCategorySlug[] {
  return (Object.entries(categorySolutions.map) as [ProductCategorySlug, CategoryLink][])
    .filter(([, link]) => link.solutions.includes(slug))
    .map(([category]) => category);
}
