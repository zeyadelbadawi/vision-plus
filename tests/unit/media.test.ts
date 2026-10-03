import { describe, expect, it } from 'vitest';
import manifest from '../../src/content/media/manifest.generated.json';
import { getSlot, ratioToCss, slotForInstance, variantBase, variantWidths } from '@/content/media';

describe('image registry', () => {
  it('mirrors the approved manifest dimensions for the homepage hero', () => {
    const hero = getSlot('HOME-HERO');
    expect(hero.desktop).toEqual({ width: 2880, height: 1800 });
    expect(hero.mobile).toEqual({ width: 1080, height: 1350 });
    expect(hero.separateMobile).toBe(true);
    expect(hero.priority).toBe('P1');
  });

  it('every fixed slot has a ratio that matches its delivered pixel size (±1%)', () => {
    for (const slot of Object.values(manifest)) {
      if (!slot.desktop || slot.templated) continue;
      const [w, h] = slot.desktopRatio.split(':').map(Number) as [number, number];
      const actual = slot.desktop.width / slot.desktop.height;
      expect(Math.abs(actual - w / h) / (w / h), slot.id).toBeLessThan(0.01);
    }
  });

  it('throws on unknown slot IDs so typos never ship silently', () => {
    expect(() => getSlot('HOME-HERO-TYPO')).toThrow(/Unknown image slot/);
  });

  it('builds deterministic variant widths and paths', () => {
    expect(variantWidths(1080)).toEqual([390, 640, 828, 1080]);
    expect(variantWidths(2880).at(-1)).toBe(2880);
    expect(variantBase('public/images/home/home-hero.jpg')).toBe('/_img/home/home-hero');
    expect(ratioToCss('16:10')).toBe('16 / 10');
    expect(ratioToCss('free (fit box)')).toBe('auto');
  });

  it('resolves concrete instances of templated slots and falls back to the template placeholder', () => {
    const cover = getSlot('PROJ-sample-fleet-surveillance-COVER');
    expect(cover.path).toBe('public/images/projects/sample-fleet-surveillance/cover.jpg');
    expect(cover.desktop).toEqual({ width: 1620, height: 1080 });
    expect(cover.templated).toBe(false);
    expect(slotForInstance('PROJ-{slug}-COVER', 'sample-fleet-surveillance')).toBe('PROJ-sample-fleet-surveillance-COVER');
    expect(slotForInstance('PROJ-{slug}-COVER', 'not-delivered')).toBe('PROJ-{slug}-COVER');
    expect(() => getSlot('PROJ-Sample-COVER')).toThrow();
    expect(() => getSlot('PROJ-x-GALLERY-01')).toThrow();
  });
});
