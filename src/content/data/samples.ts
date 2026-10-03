import type { IndustrySlug, SolutionSlug } from './registry';

/**
 * ILLUSTRATIVE SAMPLE DATA — preview builds only (client decisions Q-12, D-01, D-02, D-10, 2026-10-02).
 *
 * The client asked to show the Projects section with four complete sample projects and to use clearly labelled
 * dummy office details until verified data arrives. None of this is a Vision Plus fact: there are no client names,
 * real locations, dates, values, project photographs or outcomes (the three home-preview covers are client-approved
 * illustrative images, images.json PROJ-sample-*-COVER, not photos of delivered work). Every element rendered from
 * here carries `data-sample`
 * and a visible "sample" label; `pnpm site:check` fails a production build that contains any `data-sample`
 * element. Text lives in copy/<locale>/samples.json; replace or delete both files when verified data is supplied.
 */
export interface SampleProject {
  slug: string;
  industry: IndustrySlug;
  /** Solutions linked to the industry by the approved relations (D-19), so the sample implies no new relation. */
  solutions: SolutionSlug[];
}

export const sampleProjects: SampleProject[] = [
  { slug: 'sample-fleet-surveillance', industry: 'transportation-fleet', solutions: ['mobile-nvr-mobile-surveillance'] },
  {
    slug: 'sample-corporate-workplace',
    industry: 'commercial-corporate',
    solutions: ['cctv-security-systems', 'access-control', 'networking-ict', 'audio-visual'],
  },
  { slug: 'sample-hospitality-venue', industry: 'hospitality', solutions: ['cctv-security-systems', 'audio-visual', 'networking-ict'] },
  {
    slug: 'sample-logistics-site',
    industry: 'logistics-warehousing',
    solutions: ['cctv-security-systems', 'access-control', 'networking-ict', 'mobile-nvr-mobile-surveillance'],
  },
];

/**
 * Dummy office contact details (D-01, D-02). Formats are realistic but the values cannot reach anyone: all-zero
 * subscriber numbers and RFC 2606 `example.com` addresses. They are rendered as plain text, never as tel:/mailto:
 * links, and never used for routing inquiries (D-04).
 */
export const sampleOffices = {
  qatar: { phone: '+974 0000 0000', email: 'qatar.office@example.com' },
  egypt: { phone: '+20 00 0000 0000', email: 'egypt.office@example.com' },
} as const;
