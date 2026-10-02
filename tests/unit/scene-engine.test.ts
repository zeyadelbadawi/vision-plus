import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { ARCH_FRAMES, TALL, WIDE } from '@/components/scenes/mnvr-architecture-art';
import { PIN_SCALE, beatProgress } from '@/components/scenes/scene-progress';
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

describe('architecture scene geometry (Concept B)', () => {
  it('crops one full-width band of the stacked layout per beat, so RTL frames need no separate crop', () => {
    expect(ARCH_FRAMES).toHaveLength(6);
    for (const [x, y, w, h] of ARCH_FRAMES) {
      expect([x, w]).toEqual([0, TALL.w]);
      expect(y).toBeGreaterThanOrEqual(0);
      expect(y + h).toBeLessThanOrEqual(TALL.h);
    }
  });

  it('keeps every label anchor and node inside its artboard in both layouts', () => {
    for (const G of [WIDE, TALL]) {
      for (const l of Object.values(G.labels)) {
        expect(l.x).toBeGreaterThan(0);
        expect(l.x).toBeLessThan(G.w);
        expect(l.y).toBeGreaterThan(0);
        expect(l.y).toBeLessThan(G.h);
      }
      for (const b of [G.nvr, G.gps, G.play, G.alert, G.fleet, ...G.cams, ...G.panes]) {
        expect(b.x).toBeGreaterThanOrEqual(0);
        expect(b.x + b.w).toBeLessThanOrEqual(G.w);
        expect(b.y + b.h).toBeLessThanOrEqual(G.h);
      }
    }
  });

  it('frames each mobile beat around its own parts (beat 4: viewing panes; beat 5: alerts; beat 6: fleet monitoring)', () => {
    const inside = (b: { y: number; h: number }, [, y, , h]: [number, number, number, number]) => b.y >= y && b.y + b.h <= y + h;
    expect(TALL.cams.every((c) => inside(c, ARCH_FRAMES[0]!))).toBe(true);
    expect(inside(TALL.gps, ARCH_FRAMES[1]!)).toBe(true);
    expect(TALL.panes.every((p) => inside(p, ARCH_FRAMES[3]!))).toBe(true);
    expect(inside(TALL.alert, ARCH_FRAMES[4]!)).toBe(true);
    expect(inside(TALL.fleet, ARCH_FRAMES[5]!)).toBe(true);
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
