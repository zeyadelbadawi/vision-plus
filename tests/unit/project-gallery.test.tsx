import { describe, expect, it } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { ProjectGallery } from '@/components/sections/projects/project-gallery';

// P5A-08 (MASTER_PROJECT_PLAN §26.7, §35): server markup of the gallery island. The lightbox behaviour (modal,
// arrows mirrored in RTL, Esc returning focus) is covered in tests/e2e/pages.spec.ts.
describe('ProjectGallery server markup', () => {
  const html = renderToStaticMarkup(
    <ProjectGallery
      thumbs={['a', 'b'].map((x) => (
        <span key={x}>{x}</span>
      ))}
      slides={['A', 'B'].map((x) => (
        <span key={x}>{x}</span>
      ))}
      captions={[undefined, 'Second']}
      labels={{ label: 'Project gallery', open: ['Open image 1 of 2', 'Open image 2 of 2'], previous: 'Prev', next: 'Next', close: 'Close' }}
    />,
  );

  it('lists the thumbnails as labelled buttons', () => {
    expect(html).toContain('<ul class="gallery__grid" aria-label="Project gallery">');
    expect(html).toContain('aria-label="Open image 1 of 2"');
    expect(html.match(/<button type="button" class="gallery__thumb"/g)).toHaveLength(2);
  });

  it('renders the lightbox closed, showing only the first slide, with captions where given', () => {
    expect(html).toMatch(/<dialog class="lightbox" aria-label="Project gallery">/);
    expect(html).not.toMatch(/<dialog[^>]*\sopen/);
    expect(html.match(/<figure class="lightbox__slide" hidden="">/g)).toHaveLength(1);
    expect(html.match(/<figcaption/g)).toHaveLength(1);
    expect(html).toContain('<p class="lightbox__count t-num" aria-live="polite" dir="ltr">1 / 2</p>');
  });
});
