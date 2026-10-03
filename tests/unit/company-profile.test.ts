import { describe, expect, it } from 'vitest';
import { companyProfile, embedFor } from '@/content/company-profile';
import { parseCanvaEmbed } from '@/features/company-profile/canva';

// P5A-11 (MASTER_PROJECT_PLAN §33, §55.3.14): only a validated Canva src and ratio are ever kept; nothing until D-06.
const CANVA_HTML =
  '<div style="position: relative; width: 100%; height: 0; padding-top: 56.2500%;"><iframe loading="lazy" ' +
  'style="position: absolute;" src="https://www.canva.com/design/DAGabc123/xyz789/view?embed" ' +
  'allowfullscreen="allowfullscreen" allow="fullscreen"></iframe></div><a href="https://www.canva.com/x">link</a>';

describe('Canva embed parser', () => {
  it('keeps only the validated src and the aspect ratio', () => {
    expect(parseCanvaEmbed(CANVA_HTML)).toEqual({ src: 'https://www.canva.com/design/DAGabc123/xyz789/view?embed', aspectRatio: '16 / 9' });
    expect(parseCanvaEmbed('<iframe src="https://www.canva.cn/design/DAG1/view?embed&amp;utm=x"></iframe>').src).toBe(
      'https://www.canva.cn/design/DAG1/view?embed&utm=x',
    );
    expect(parseCanvaEmbed('<div style="padding-top: 141.4286%"><iframe src="https://www.canva.com/design/A/view?embed"></iframe></div>').aspectRatio).toBe(
      '10000 / 14143',
    );
  });

  it('rejects anything that is not a Canva design embed', () => {
    expect(() => parseCanvaEmbed('<p>no iframe</p>')).toThrow(/No <iframe/);
    expect(() => parseCanvaEmbed('<iframe src="http://www.canva.com/design/A/view?embed"></iframe>')).toThrow(/https/);
    expect(() => parseCanvaEmbed('<iframe src="https://canva.com.evil.example/design/A/view?embed"></iframe>')).toThrow(/host/);
    expect(() => parseCanvaEmbed('<iframe src="https://www.canva.com/design/A/edit?embed"></iframe>')).toThrow(/path/);
    expect(() => parseCanvaEmbed('<iframe src="https://www.canva.com/design/A/view"></iframe>')).toThrow(/embed/);
    expect(() => parseCanvaEmbed('<iframe src="javascript:alert(1)"></iframe>')).toThrow();
  });
});

describe('company profile configuration', () => {
  it('stores no embed until the client supplies one (D-06)', () => {
    expect(companyProfile.embeds).toEqual({ en: null, ar: null, zh: null });
    expect(embedFor('ar')).toBeNull();
    expect(companyProfile.poster).toBe('CP-POSTER');
  });
});
