import { describe, expect, it } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { Breadcrumbs } from '@/components/layout/breadcrumbs';

describe('Breadcrumbs', () => {
  const html = renderToStaticMarkup(
    <Breadcrumbs label="Breadcrumb" items={[{ label: 'Home', href: '/' }, { label: 'Solutions', href: '/solutions' }, { label: 'Access Control' }]} />,
  );
  it('is a labelled navigation landmark with an ordered list', () => {
    expect(html).toMatch(/^<nav aria-label="Breadcrumb" class="breadcrumbs">/);
    expect(html.match(/<li>/g)).toHaveLength(3);
  });
  it('links ancestors with locale-prefixed hrefs and marks the current page', () => {
    expect(html).toContain('href="/en"');
    expect(html).toContain('href="/en/solutions"');
    expect(html).toContain('<span aria-current="page">Access Control</span>');
  });
  it('uses decorative, RTL-mirroring separators', () => {
    expect(html.match(/class="breadcrumbs__sep icon-directional"/g)).toHaveLength(2);
    expect(html).toContain('aria-hidden="true"');
  });
});
