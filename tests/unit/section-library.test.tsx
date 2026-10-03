import { describe, expect, it } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { IndexList } from '@/components/sections/shared/index-list';
import { ProcessTrack } from '@/components/sections/shared/process-track';
import { StatementBand } from '@/components/sections/shared/statement-band';
import { CtaBand } from '@/components/sections/shared/cta-band';
import { SpecList } from '@/components/sections/shared/spec-list';
import { RelatedRail } from '@/components/sections/shared/related-rail';
import { PillarStrip } from '@/components/sections/shared/pillar-strip';
import { SceneSteps } from '@/components/sections/shared/scene-steps';
import { SplitEditorial } from '@/components/sections/shared/split-editorial';
import { Timeline } from '@/components/sections/shared/timeline';
import { scenes } from '@/content/data/scenes';

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

describe('ProcessTrack (full variant)', () => {
  const html = renderToStaticMarkup(
    <ProcessTrack
      locale="en"
      label="Lifecycle steps"
      variant="full"
      steps={[
        { title: 'Understand', text: 'Text one.', id: 'step-understand', pending: 'Wording pending client review' },
        { title: 'Design', text: 'Text two.', id: 'step-design' },
      ]}
    />,
  );
  it('shows the step texts in the full track with an anchor per step', () => {
    expect(html).toMatch(/^<ol class="lifecycle" aria-label="Lifecycle steps" data-progress="track"/);
    expect(html).toContain('<li id="step-understand" class="lifecycle__step"');
    expect(html).toContain('<h3 class="t-h3 lifecycle__title">Design</h3><p class="t-body-sm text-fg-muted">Text two.</p>');
  });
  it('carries the pending note only on the step that has one', () => {
    expect(html.match(/class="pending-note t-caption"/g)).toHaveLength(1);
    expect(html).toContain('Text one.</p><p class="pending-note t-caption">Wording pending client review</p>');
  });
  it('the compact track ignores texts, ids and notes', () => {
    const compact = renderToStaticMarkup(<ProcessTrack locale="en" label="L" steps={[{ title: 'A', text: 'T', id: 'x', pending: 'P' }]} />);
    expect(compact).not.toMatch(/id="x"|>T<|pending-note/);
  });
});

describe('SplitEditorial', () => {
  const render = (flip: boolean, image?: string) =>
    renderToStaticMarkup(
      <SplitEditorial locale="ar" id="svc" title="Service name" image={image} flip={flip} step>
        <p>Body</p>
      </SplitEditorial>,
    );
  it('is an anchored section labelled by its heading and marked as a step', () => {
    const html = render(false, 'SRV-DESIGN');
    expect(html).toMatch(/^<section id="svc" aria-labelledby="svc-title" class="split section-y" data-step="">/);
    expect(html).toContain('<h2 id="svc-title" class="t-h2" lang="en" dir="ltr">Service name</h2>');
    expect(html).toContain('data-slot="SRV-DESIGN"');
  });
  it('alternates the image side on desktop', () => {
    expect(render(false, 'SRV-DESIGN')).toMatch(/split__media[^"]*lg:col-start-7/);
    expect(render(true, 'SRV-DESIGN')).toMatch(/split__media[^"]*lg:col-start-1/);
  });
  it('without an image renders the text column only', () => {
    expect(render(true)).not.toContain('split__media');
  });
});

describe('SplitEditorial eyebrow', () => {
  it('renders the optional eyebrow above the heading only when given', () => {
    const withEyebrow = renderToStaticMarkup(
      <SplitEditorial locale="en" id="p" eyebrow="Our Philosophy" title="T">
        <p>B</p>
      </SplitEditorial>,
    );
    expect(withEyebrow).toContain('<p class="t-caption text-fg-muted mb-4">Our Philosophy</p><h2 id="p-title"');
    const without = renderToStaticMarkup(
      <SplitEditorial locale="en" id="p" title="T">
        <p>B</p>
      </SplitEditorial>,
    );
    expect(without).not.toContain('t-caption');
  });
});

describe('Timeline', () => {
  const html = renderToStaticMarkup(
    <Timeline
      locale="en"
      items={[
        { when: '2017', where: 'Qatar', title: 'One', body: ['A', 'B'], image: 'ABOUT-JOURNEY-2017' },
        { when: 'Today', where: '', title: 'Two', body: ['C'] },
      ]}
    />,
  );
  it('is an ordered list revealed once, with the journey seam on every milestone', () => {
    expect(html).toMatch(/^<ol class="journey timeline" data-reveal="">/);
    expect(html.match(/<li class="journey__step"/g)).toHaveLength(2);
    expect(html.match(/class="journey__fill"/g)).toHaveLength(2);
  });
  it('shows where only when given, the photo only when it has one, and every body paragraph', () => {
    expect(html.match(/journey__where/g)).toHaveLength(1);
    expect(html.match(/timeline__media/g)).toHaveLength(1);
    expect(html).toContain('data-slot="ABOUT-JOURNEY-2017"');
    expect(html.match(/<p class="t-body-sm mt-3/g)).toHaveLength(3);
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

describe('SpecList, RelatedRail and PillarStrip', () => {
  it('spec list renders one item per approved entry, with the plain variant on request', () => {
    const html = renderToStaticMarkup(<SpecList locale="en" items={['A', 'B', 'C']} plain />);
    expect(html).toMatch(/^<ul class="spec-list spec-list--plain">/);
    expect(html.match(/<li>/g)).toHaveLength(3);
  });
  it('related rail drops empty groups (unpublished relations do not appear)', () => {
    const html = renderToStaticMarkup(
      <RelatedRail
        locale="en"
        groups={[
          { title: 'Industries', links: [{ href: '/industries#retail', label: 'Retail' }] },
          { title: 'Product categories', links: [] },
        ]}
      />,
    );
    expect(html).toContain('Industries');
    expect(html).not.toContain('Product categories');
    expect(html).toMatch(/href="\/[a-z]{2}\/industries#retail"/);
  });
  it('pillar strip is an unnumbered list of the given words', () => {
    const html = renderToStaticMarkup(<PillarStrip locale="en" items={['Comfort', 'Efficiency']} />);
    expect(html).toMatch(/^<ul class="pillar-strip">/);
    expect(html).not.toMatch(/<ol/);
    expect(html.match(/pillar-strip__item/g)).toHaveLength(2);
  });
});

describe('SceneSteps', () => {
  const elv = scenes.find((s) => s.id === 'elv-one-infrastructure')!;
  it('renders the approved beat titles and texts from the scene registry, in order', () => {
    const html = renderToStaticMarkup(<SceneSteps locale="en" scene={elv} />);
    expect(html.match(/<li class="scene-steps__beat">/g)).toHaveLength(4);
    const titles = [...html.matchAll(/<h3 class="t-h3">([^<]+)<\/h3>/g)].map((m) => m[1]);
    expect(titles).toEqual(['Coordination', 'Integration', 'Reliability', 'Scalability']);
    expect(html).toContain('Infrastructure is engineered for dependable long-term operation.');
  });
  it('marks the English placeholder on /ar (copy not yet translated, A-11)', () => {
    const html = renderToStaticMarkup(<SceneSteps locale="ar" scene={elv} />);
    expect(html).toContain('lang="en" dir="ltr"');
  });
  it('skips beats without a step title (subtle scenes have none)', () => {
    const av = scenes.find((s) => s.id === 'av-disappear')!;
    expect(renderToStaticMarkup(<SceneSteps locale="en" scene={av} />)).toBe(`<ol class="scene-steps" data-scene="av-disappear"></ol>`);
  });
});
