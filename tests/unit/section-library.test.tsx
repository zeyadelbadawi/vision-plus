import { describe, expect, it } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { IndexList } from '@/components/sections/shared/index-list';
import { ProcessTrack } from '@/components/sections/shared/process-track';
import { StatementBand } from '@/components/sections/shared/statement-band';
import { CtaBand } from '@/components/sections/shared/cta-band';

// Shared section library (MASTER_PROJECT_PLAN §20.8, §27; P5A-01): markup contracts the pages rely on.
describe('IndexList', () => {
  const html = renderToStaticMarkup(
    <IndexList
      locale="ar"
      items={[
        { href: '/solutions/a', name: 'Name A', summary: 'Summary A', image: 'SOL-MNVR-CARD', marker: 'Featured' },
        { href: '/solutions/b', name: 'Name B', summary: 'Summary B' },
      ]}
    />,
  );
  it('renders one row per item, each a heading with a single locale-prefixed link', () => {
    expect(html.match(/<li class="index-list__item">/g)).toHaveLength(2);
    expect(html.match(/<h3 class="index-list__name">/g)).toHaveLength(2);
    expect(html).toMatch(/href="\/[a-z]{2}\/solutions\/a"/); // locale prefix from the next-intl context
    expect(html.match(/<a /g)).toHaveLength(2);
  });
  it('shows the marker only where given and hides the image from assistive technology', () => {
    expect(html.match(/index-list__marker/g)).toHaveLength(1);
    expect(html).toContain('<div class="index-list__media" aria-hidden="true">');
    expect(html.match(/index-list__media/g)).toHaveLength(1);
  });
  it('marks English placeholder text inside a non-English page (A-11)', () => {
    expect(html).toContain('lang="en" dir="ltr"');
  });
});

describe('ProcessTrack', () => {
  const html = renderToStaticMarkup(<ProcessTrack locale="en" label="Lifecycle steps" steps={[{ title: 'Understand' }, { title: 'Design' }]} />);
  it('is a labelled ordered list driven by the scroll progress track', () => {
    expect(html).toMatch(/^<ol class="lifecycle lifecycle--compact" aria-label="Lifecycle steps" data-progress="track"/);
    expect(html.match(/<li class="lifecycle__step"/g)).toHaveLength(2);
  });
  it('numbers the steps (a real sequence) without exposing the numbers twice', () => {
    expect(html).toContain('<span class="lifecycle__n t-num" aria-hidden="true">01</span>');
    expect(html).toContain('<span class="lifecycle__n t-num" aria-hidden="true">02</span>');
  });
});

describe('StatementBand and CtaBand', () => {
  it('statement band labels its section with the statement', () => {
    const html = renderToStaticMarkup(<StatementBand locale="en" id="s" statement="Make it work." />);
    expect(html).toMatch(/^<section aria-labelledby="s"/);
    expect(html).toContain('<h2 id="s" class="t-display statement-band__text">Make it work.</h2>');
  });
  it('CTA band has exactly one primary action', () => {
    const html = renderToStaticMarkup(<CtaBand locale="en" id="c" lead="Lead." title="Title." action={{ href: '/contact', label: 'Go' }} />);
    expect(html.match(/btn--primary/g)).toHaveLength(1);
    expect(html).toContain('href="/en/contact"');
    expect(html).toContain('<h2 id="c"');
  });
});
