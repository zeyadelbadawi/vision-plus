import { describe, expect, it } from 'vitest';
import { getSolutionsCopy } from '../../src/content';
import { SYSTEM_STEPS } from '../../src/components/sections/solution/mnvr-page';
import { CALLOUTS, SYSTEM_ART } from '../../src/components/scenes/mnvr-system-art';

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
    expect(Object.keys(CALLOUTS)).toHaveLength(SYSTEM_STEPS.length);
    for (const [x, y] of Object.values(CALLOUTS)) {
      expect(x).toBeGreaterThan(11);
      expect(x).toBeLessThan(SYSTEM_ART.w - 11);
      expect(y).toBeGreaterThan(10);
      expect(y).toBeLessThan(SYSTEM_ART.h - 11);
    }
  });
});
