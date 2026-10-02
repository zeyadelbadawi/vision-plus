import { describe, expect, it } from 'vitest';
import { getSolutionsCopy } from '../../src/content';
import { SYSTEM_STEPS } from '../../src/components/sections/solution/mnvr-page';
import { ONBOARD_ART, ONBOARD_VIEWS, WALL_LEFT_X, calloutPoint, viewWindow } from '../../src/components/scenes/mnvr-onboard-art';

// The "On board" steps reference approved copy by position. Pin the English so a reorder of solutions.json cannot
// silently change what a step says, and check every locale resolves every reference.
const EXPECTED = [
  ['Multi-Channel HD/IP Vehicle Cameras', 'Capture and record activity inside and around vehicles.'],
  ['Mobile Network Video Recorders', 'Unlike conventional CCTV environments'],
  ['GPS Tracking & Positioning', 'Understand where each connected vehicle or mobile asset is operating.'],
  ['4G/5G Connectivity', 'Maintain communication through mobile and wireless networks.'],
  ['Remote Live Viewing', 'Access live video, recorded footage, vehicle status, and events remotely.'],
] as const;

describe('Mobile NVR page — On board steps', () => {
  const resolve = (locale: 'en' | 'ar' | 'zh') => {
    const item = getSolutionsCopy(locale).items['mobile-nvr-mobile-surveillance'];
    return SYSTEM_STEPS.map((s) => ({
      title: item.capabilities.items[s.cap[0]],
      tags: s.cap.slice(1).map((i) => item.capabilities.items[i]),
      text: 'pillar' in s.text ? item.fleet.pillars[s.text.pillar]?.text : item.body[s.text.body],
    }));
  };

  it('uses exactly the approved English capability names and sentences', () => {
    resolve('en').forEach((s, i) => {
      expect(s.title).toBe(EXPECTED[i]![0]);
      expect(s.text?.startsWith(EXPECTED[i]![1])).toBe(true);
    });
    expect(resolve('en').flatMap((s) => s.tags)).toEqual([
      'Secure Local Video Storage',
      'Wi-Fi Communication',
      'Real-Time Video Transmission',
      'Remote Video Playback',
      'Centralized Management Platforms',
    ]);
  });

  it('resolves every step in every locale', () => {
    for (const l of ['ar', 'zh'] as const)
      for (const s of resolve(l)) expect([s.title, s.text, ...s.tags].every((t) => typeof t === 'string' && t.length > 0)).toBe(true);
  });

  it('keeps one callout per step inside the artboard', () => {
    for (const n of [1, 2, 3, 4, 5] as const) {
      const [x, y] = calloutPoint(n);
      expect(x).toBeGreaterThan(11);
      expect(x).toBeLessThan(ONBOARD_ART.w - 11);
      expect(y).toBeGreaterThan(10);
      expect(y).toBeLessThan(ONBOARD_ART.h - 11);
    }
  });
});

describe('Mobile NVR page — On board views (Concept A)', () => {
  it('has the overall view for the static state and step 5, and a gentle zoom for steps 1–4', () => {
    expect(ONBOARD_VIEWS[0]).toEqual([ONBOARD_ART.w / 2, ONBOARD_ART.h / 2, 1]);
    expect(ONBOARD_VIEWS[5]).toEqual(ONBOARD_VIEWS[0]);
    for (const n of [1, 2, 3, 4] as const) {
      const [, , s] = ONBOARD_VIEWS[n];
      expect(s).toBeGreaterThan(1);
      expect(s).toBeLessThanOrEqual(1.6);
    }
  });

  it('shows each step its own component: the callout is inside the view, and step 1 keeps the monitoring wall out', () => {
    for (const n of [1, 2, 3, 4, 5] as const) {
      const [x0, x1, y0, y1] = viewWindow(n);
      const [x, y] = calloutPoint(n);
      expect(x).toBeGreaterThan(x0);
      expect(x).toBeLessThan(x1);
      expect(y).toBeGreaterThan(y0);
      expect(y).toBeLessThan(y1);
    }
    expect(WALL_LEFT_X).toBeGreaterThan(viewWindow(1)[1]);
    expect(WALL_LEFT_X).toBeLessThan(viewWindow(5)[1]);
  });
});
