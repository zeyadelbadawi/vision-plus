import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { FRAMES, PIN_SCALE, PRIMARY, beatProgress, length, mirrorFrame, pointAt } from '@/components/scenes/route-geometry';
import { scenes } from '@/content/data/scenes';
import { sceneText, sentences } from '@/content/scene-text';
import { textAttrs } from '@/lib/text-attrs';

describe('scene progress maths (§40 "scene progress math")', () => {
  it('runs the beats in order and finishes the last one before the pinned stage releases', () => {
    const beats = 6;
    // The follow-mode progress when the pinned stage releases: 1 − 0.3 / (0.7 · beats)
    const release = 1 - 0.3 / (0.7 * beats);
    expect(beatProgress(release, beats, beats)).toBe(1);
    expect(beatProgress(0, beats, 1)).toBe(0);
    for (let n = 1; n < beats; n++) {
      const p = (n - 0.5) / (beats * PIN_SCALE);
      expect(beatProgress(p, beats, n)).toBeGreaterThan(beatProgress(p, beats, n + 1));
    }
  });

  it('keeps the CSS formula in step with the TypeScript one', () => {
    const css = readFileSync('src/styles/scenes.css', 'utf8');
    for (let n = 1; n <= 8; n++) expect(css).toContain(`--b${n}: clamp(0, calc((var(--p, 1) * var(--beats) * ${PIN_SCALE} - ${n - 1}) * 1.4 - 0.1), 1);`);
    // Registered with initial value 1 → no JS / reduced motion shows the final composition
    for (let n = 1; n <= 8; n++) expect(css).toContain(`@property --b${n} { syntax: '<number>'; inherits: true; initial-value: 1; }`);
  });
});

describe('route geometry', () => {
  it('measures and walks the primary route', () => {
    expect(length(PRIMARY)).toBe(1500);
    expect(pointAt(PRIMARY, 0)).toEqual([180, 690]);
    expect(pointAt(PRIMARY, 1)).toEqual([1140, 510]);
    expect(pointAt(PRIMARY, 0.5)).toEqual([660, 420]); // 750 = 660 + 90 into the 4th segment
  });

  it('mirrors stepped-frame crops for RTL and keeps them on the artboard', () => {
    for (const f of FRAMES) {
      const [x, , w] = mirrorFrame(f);
      expect(x).toBeGreaterThanOrEqual(0);
      expect(x + w).toBeLessThanOrEqual(1440);
      expect(mirrorFrame(mirrorFrame(f))).toEqual(f);
    }
  });
});

describe('localized scene text', () => {
  const route = scenes.find((s) => s.id === 'mnvr-route')!;
  it('resolves every Route reference in every locale', () => {
    for (const locale of ['en', 'ar', 'zh'] as const)
      for (const b of route.beats) for (const r of [b.title!, b.text!, ...b.labels]) expect(sceneText(r, locale).length).toBeGreaterThan(1);
  });

  it('returns the approved English exactly', () => {
    expect(sceneText(route.beats[2]!.labels[0]!, 'en')).toBe('4G/5G Connectivity');
    expect(sceneText(route.beats[0]!.title!, 'en')).toBe('Video');
  });

  it('splits sentences in Latin and Chinese punctuation', () => {
    expect(sentences('See More. Know More. Respond Better.')).toEqual(['See More.', 'Know More.', 'Respond Better.']);
    expect(sentences('看见更多。了解更多。')).toEqual(['看见更多。', '了解更多。']);
  });
});

describe('placeholder text direction', () => {
  it('marks untranslated English inside /ar and /zh as English LTR, and leaves real translations alone', () => {
    expect(textAttrs('ar', 'Built on Experience.')).toEqual({ lang: 'en', dir: 'ltr' });
    expect(textAttrs('ar', 'متصلون بالتقنية')).toEqual({});
    expect(textAttrs('zh', 'Security That Moves With You.')).toEqual({ lang: 'en', dir: 'ltr' });
    expect(textAttrs('zh', '以技术相连。')).toEqual({});
    expect(textAttrs('en', 'anything')).toEqual({});
  });
});
