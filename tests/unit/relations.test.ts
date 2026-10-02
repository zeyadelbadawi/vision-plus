import { describe, expect, it } from 'vitest';
import { getCatalog, getServicesCopy, getSolutionsCopy } from '@/content';
import { aliases, pendingAliases } from '@/content/data/aliases';
import { industries, productCategories, services, solutions } from '@/content/data/registry';
import {
  acrossEnvironments,
  approachSteps,
  categoriesForSolution,
  categorySolutions,
  industriesForSolution,
  industrySolutions,
  serviceStages,
  type IndustryLink,
} from '@/content/data/relations';

const solutionSlugs = new Set<string>(solutions.map((s) => s.slug));
const en = getCatalog('en');

describe('relations (§12.4, §26.5, §9.2)', () => {
  it('links every industry only through words its approved sentence actually contains', () => {
    for (const { slug } of industries) {
      const links: IndustryLink[] = industrySolutions.map[slug];
      // Q-08's new industry has no approved sentence yet, so it has no derived link (needs client review).
      if (slug === 'real-estate-property-development') expect(links).toEqual([]);
      else expect(links.length, slug).toBeGreaterThan(0);
      const sentence = en.industries[slug].summary.toLowerCase();
      for (const link of links) {
        expect(solutionSlugs.has(link.solution), `${slug} → ${link.solution}`).toBe(true);
        expect(link.evidence.length).toBeGreaterThan(0);
        for (const word of link.evidence) expect(sentence, `${slug}: "${word}"`).toContain(word.toLowerCase());
      }
      expect(new Set(links.map((l) => l.solution)).size, `${slug} has duplicate links`).toBe(links.length);
    }
  });

  it('never force-links the solutions no industry sentence names', () => {
    for (const slug of acrossEnvironments) expect(industriesForSolution(slug)).toEqual([]);
    const linked = new Set<string>(Object.values(industrySolutions.map).flatMap((l) => l.map((x) => x.solution)));
    expect(
      solutions
        .filter((s) => !linked.has(s.slug))
        .map((s) => s.slug)
        .sort(),
    ).toEqual([...acrossEnvironments].sort());
  });

  it('maps every service to known approach steps, and the steps match the approved titles', () => {
    expect(approachSteps.map((k) => k)).toEqual(en.approach.map((s) => s.title.toLowerCase()));
    for (const slug of services) {
      expect(serviceStages.map[slug].length, slug).toBeGreaterThan(0);
      for (const step of serviceStages.map[slug]) expect(approachSteps).toContain(step);
    }
    expect(Object.keys(getServicesCopy('en').items).sort()).toEqual([...services].sort());
  });

  it('maps product categories only to existing solutions', () => {
    for (const slug of productCategories) {
      for (const s of categorySolutions.map[slug].solutions) expect(solutionSlugs.has(s), `${slug} → ${s}`).toBe(true);
    }
    expect(categoriesForSolution('access-control').sort()).toEqual(['access-control', 'time-attendance']);
    // "Time & Attendance" is linked because it is an approved Access Control capability.
    expect(getSolutionsCopy('en').items['access-control'].capabilities.items).toContain('Time & Attendance');
  });

  it('records every relation as approved by the client (D-19, 2026-10-02)', () => {
    for (const r of [industrySolutions, serviceStages, categorySolutions]) expect(r.status).toBe('approved');
  });

  it('has full detail copy for every registered solution', () => {
    expect(Object.keys(getSolutionsCopy('en').items).sort()).toEqual([...solutionSlugs].sort());
  });
});

describe('sitemap aliases (§9.2, §11)', () => {
  const canonicalPages = new Set([
    '/solutions',
    ...solutions.map((s) => `/solutions/${s.slug}`),
    '/products',
    '/industries',
    '/services',
    '/projects',
    '/about',
    '/partners',
    '/company-profile',
    '/contact',
    '/privacy',
  ]);
  const anchors: Record<string, Set<string>> = {
    '/services': new Set([...services, 'approach']),
    '/industries': new Set(industries.map((i) => i.slug)),
    '/about': new Set(['who-we-are', 'journey', 'vision', 'mission', 'values', 'philosophy', 'why-vision-plus']),
    '/contact': new Set(['inquiry', 'locations']),
  };

  it('points every alias at a canonical page, a known anchor or a known filter value', () => {
    for (const a of aliases) {
      const [path = '', rest = ''] = a.to.split(/(?=[?#])/);
      expect(canonicalPages.has(path), `${a.from} → ${a.to}`).toBe(true);
      if (rest.startsWith('#')) expect(anchors[path]?.has(rest.slice(1)), `${a.from} → ${a.to}`).toBe(true);
      if (rest.startsWith('?sector=')) expect(industries.map((i) => i.slug)).toContain(rest.slice(8));
      if (rest.startsWith('?type=')) expect(['consultation', 'product', 'general', 'partnership']).toContain(rest.slice(6));
    }
  });

  it('never shadows a canonical page, never chains, and has no duplicates', () => {
    const froms = aliases.map((a) => a.from);
    expect(new Set(froms).size).toBe(froms.length);
    for (const a of aliases) {
      expect(canonicalPages.has(a.from), a.from).toBe(false);
      expect(froms).not.toContain(a.to.split(/[?#]/)[0]);
      expect(a.from).toMatch(/^\/[a-z0-9/-]+$/);
    }
  });

  it('keeps Supply & Procurement out until its description is approved (Q-09), and maps Real Estate (Q-08)', () => {
    expect(pendingAliases.map((p) => p.from)).toEqual(['/services/supply-procurement']);
    for (const p of pendingAliases) expect(aliases.map((a) => a.from)).not.toContain(p.from);
    expect(aliases.find((a) => a.from === '/industries/real-estate-compounds')?.to).toBe('/industries#real-estate-property-development');
  });
});
