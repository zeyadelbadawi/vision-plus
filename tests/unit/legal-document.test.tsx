import { describe, expect, it } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { readFileSync } from 'node:fs';
import { LegalDocument, formatPolicyDate } from '@/components/sections/legal/legal-document';
import { getPrivacyCopy, type PrivacyCopy } from '@/content';
import { schemas } from '@/content/schema';

// Privacy (§26.12, P5A-12). The fixture is structural test text only: the real policy comes from the client's legal
// adviser (D-16) and is never written by the team.
const fixture: PrivacyCopy = {
  labels: { contents: 'Contents', updated: 'Last updated' },
  updated: '2026-10-03',
  sections: [
    { id: 'section-a', title: 'Section A', paragraphs: ['Paragraph A1.', 'Paragraph A2.'] },
    { id: 'section-b', title: 'Section B', paragraphs: ['Paragraph B1.'], list: ['Item 1', 'Item 2'] },
  ],
};
const schema = schemas({ solutions: [], services: [], industries: [], productCategories: [] })['privacy.json']!;
const file = (l: string) => JSON.parse(readFileSync(`src/content/copy/${l}/privacy.json`, 'utf8'));

describe('LegalDocument', () => {
  const html = renderToStaticMarkup(<LegalDocument locale="en" doc={fixture} />);

  it('links every table-of-contents entry to its section heading, in order', () => {
    const toc = [...html.matchAll(/class="legal__toc-link"[^>]*href="#([^"]+)"|href="#([^"]+)"[^>]*class="legal__toc-link"/g)].map((m) => m[1] ?? m[2]);
    expect(toc).toEqual(['section-a', 'section-b']);
    for (const id of toc) {
      expect(html).toContain(`<section id="${id}" aria-labelledby="${id}-title"`);
      expect(html).toContain(`<h2 id="${id}-title"`);
    }
    expect(html).toMatch(/<nav class="legal__toc" aria-labelledby="legal-toc-title"><h2 id="legal-toc-title"[^>]*>Contents<\/h2><ol>/);
  });

  it('renders paragraphs, optional lists and a machine-readable effective date', () => {
    expect(html.match(/<p class="t-body measure"/g)).toHaveLength(3);
    expect(html).toContain('<ul class="legal__list measure"><li>Item 1</li><li>Item 2</li></ul>');
    expect(html).toContain('<time dateTime="2026-10-03">3 October 2026</time>');
  });

  it('renders nothing for an empty document (the page shows the pending line instead)', () => {
    expect(renderToStaticMarkup(<LegalDocument locale="en" doc={{ ...fixture, sections: [] }} />)).toBe('');
  });

  it('omits the date line when no effective date is set', () => {
    expect(renderToStaticMarkup(<LegalDocument locale="en" doc={{ ...fixture, updated: '' }} />)).not.toContain('<time');
  });

  it('formats the date per locale with Latin digits (Q-17), in UTC', () => {
    expect(formatPolicyDate('en', '2026-01-01')).toBe('1 January 2026');
    expect(formatPolicyDate('ar', '2026-01-01')).toMatch(/^1 .+ 2026$/);
    expect(formatPolicyDate('zh', '2026-01-01')).toBe('2026年1月1日');
  });
});

describe('privacy.json', () => {
  it('has no policy text yet in any locale (D-16), so the page stays on the pending line', () => {
    for (const l of ['en', 'ar', 'zh'] as const) {
      expect(getPrivacyCopy(l).sections).toEqual([]);
      expect(getPrivacyCopy(l).updated).toBe('');
      expect(schema.safeParse(file(l)).success).toBe(true);
    }
  });

  it('accepts a well-formed document and rejects bad anchors, duplicate ids, empty sections and bad dates', () => {
    const base = { _meta: { status: 'draft' }, ...fixture };
    expect(schema.safeParse(base).success).toBe(true);
    const bad = (sections: unknown, updated = '2026-10-03') => schema.safeParse({ ...base, sections, updated }).success;
    expect(bad([{ id: 'Section A', title: 'T', paragraphs: ['P.'] }])).toBe(false);
    expect(
      bad([
        { id: 'a', title: 'T', paragraphs: ['P.'] },
        { id: 'a', title: 'U', paragraphs: ['Q.'] },
      ]),
    ).toBe(false);
    expect(bad([{ id: 'a', title: 'T', paragraphs: [] }])).toBe(false);
    expect(bad(fixture.sections, '03/10/2026')).toBe(false);
  });
});
