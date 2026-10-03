import { readFileSync } from 'node:fs';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { ARCH_FRAMES, TALL, WIDE } from '@/components/scenes/mnvr-architecture-art';
import { PIN_SCALE, beatProgress } from '@/components/scenes/scene-progress';
import { MAX_BEATS, ScrollScene, type SceneBeat } from '@/components/scenes/scroll-scene';
import { beatAt } from '@/components/scenes/lab/lab-frame-driver';
import { MnvrOnboardScene } from '@/components/sections/solution/mnvr-onboard-scene';
import { ELV_FRAMES, ELV_SYSTEMS, ElvSectionArt, mirrorViewBox } from '@/components/scenes/elv-section-art';
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

describe('scene engine hardening (P5B-01)', () => {
  const beats = (n: number): SceneBeat[] => Array.from({ length: n }, (_, i) => ({ key: `b${i + 1}`, title: `Beat ${i + 1}`, labels: [] }));
  const scene = (n: number, frames = n, driver?: 'scroll' | 'manual') =>
    renderToStaticMarkup(
      <ScrollScene
        locale="en"
        id="test"
        beats={beats(n)}
        stage={<svg />}
        frames={Array.from({ length: frames }, (_, i) => (
          <svg key={i} />
        ))}
        stepsLabel="Steps"
        driver={driver}
      />,
    );

  it('accepts 1 to 8 beats (scenes.css registers --b1…--b8) and refuses more or none, at build time', () => {
    expect(MAX_BEATS).toBe(8);
    expect(readFileSync('src/styles/scenes.css', 'utf8')).toContain('@property --b8 ');
    expect(readFileSync('src/styles/scenes.css', 'utf8')).not.toContain('@property --b9 ');
    expect(() => scene(8)).not.toThrow();
    expect(() => scene(9)).toThrow(/9 beats; a scene has 1–8/);
    expect(() => scene(0)).toThrow(/0 beats/);
  });

  it('needs one stepped frame per beat', () => {
    expect(() => scene(6, 5)).toThrow(/5 stepped frames for 6 beats/);
  });

  it('the scroll driver (default) hands the scene to the MotionController; manual leaves it to the caller', () => {
    const page = scene(3);
    expect(page).toContain('data-progress="follow"');
    expect(page).toContain('data-steps=""');
    expect(page).not.toContain('data-driver');
    const lab = scene(3, 3, 'manual');
    expect(lab).not.toContain('data-progress');
    expect(lab).not.toContain('data-steps');
    expect(lab).toContain('data-driver="manual"');
  });

  it('the On board scene follows the same driver rule', () => {
    expect(renderToStaticMarkup(<MnvrOnboardScene locale="en" />)).toMatch(/^<div class="sys" data-steps="">/);
    expect(renderToStaticMarkup(<MnvrOnboardScene locale="en" driver="manual" />)).toMatch(/^<div class="sys" data-driver="manual">/);
  });

  it('the lab maps slider progress to the beat the pinned CSS is playing', () => {
    expect(beatAt(0, 6)).toBe(0);
    expect(beatAt(0.01, 6)).toBe(1);
    expect(beatAt(1, 6)).toBe(6);
    // beat n is under way exactly when its CSS progress has started (scene-progress.ts)
    for (let p = 0.02; p < 1; p += 0.05) {
      const n = beatAt(p, 6);
      expect(beatProgress(p, 6, n)).toBeGreaterThanOrEqual(0);
      if (n < 6) expect(p * 6 * PIN_SCALE).toBeLessThanOrEqual(n);
    }
  });
});

describe('ELV scene artwork (elv-one-infrastructure)', () => {
  const elv = scenes.find((s) => s.id === 'elv-one-infrastructure')!;

  it('has one stepped frame per approved beat and one strand per system in the legend', () => {
    expect(ELV_FRAMES).toHaveLength(elv.beats.length);
    expect(elv.beats[0]!.labels).toHaveLength(ELV_SYSTEMS);
    expect(elv.status).toBe('built-review');
  });

  it('tags every animated part with a beat and shows no text inside the drawing', () => {
    const svg = renderToStaticMarkup(<ElvSectionArt rtl={false} />);
    for (const n of [1, 2, 3, 4]) expect(svg).toContain(`data-beat="${n}"`);
    expect(svg).not.toMatch(/<text/);
    expect(svg.match(/class="elv-strand /g)).toHaveLength(ELV_SYSTEMS * 5); // 4 floors + the added one
  });

  it('mirrors the drawing and its crop windows in RTL', () => {
    expect(mirrorViewBox('742 335 180 225')).toBe('278 335 180 225');
    expect(mirrorViewBox(mirrorViewBox(ELV_FRAMES[0]!))).toBe(ELV_FRAMES[0]);
    const rtl = renderToStaticMarkup(<ElvSectionArt rtl viewBox={ELV_FRAMES[2]} />);
    expect(rtl).toContain(`viewBox="${mirrorViewBox(ELV_FRAMES[2]!)}"`);
    expect(rtl).toContain('transform="matrix(-1 0 0 1 1200 0)"');
  });
});
