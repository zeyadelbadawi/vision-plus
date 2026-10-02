import { describe, expect, it } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { IndustryExplorer } from '@/components/sections/industries/industry-explorer';

// P5A-06 (MASTER_PROJECT_PLAN §26.4): the server markup is the no-JS / mobile page — every industry present and
// anchored, nothing selected or hidden. The desktop master–detail state only appears after hydration (E2E).
describe('IndustryExplorer server markup', () => {
  const items = [
    { slug: 'retail', name: 'Retail' },
    { slug: 'education', name: 'Education', attrs: { lang: 'en', dir: 'ltr' as const } },
  ];
  const html = renderToStaticMarkup(
    <IndustryExplorer
      label="Industries"
      items={items}
      panels={items.map((i) => (
        <section key={i.slug} id={i.slug}>
          {i.name}
        </section>
      ))}
    />,
  );

  it('renders a labelled index of plain anchor links, one per industry', () => {
    expect(html).toContain('<nav class="ix__index" aria-label="Industries">');
    expect(html).toContain('<a href="#retail" class="ix__link">Retail</a>');
    expect(html).toContain('<a href="#education" class="ix__link" lang="en" dir="ltr">Education</a>');
  });

  it('renders every panel, with no live state, selection or current item', () => {
    expect(html.match(/<div class="ix__slot">/g)).toHaveLength(2);
    expect(html).toContain('<section id="retail">Retail</section>');
    expect(html).not.toMatch(/data-live|data-selected|aria-current/);
  });
});
