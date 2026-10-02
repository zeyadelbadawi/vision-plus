import manifestJson from './manifest.generated.json';
import finalsJson from './images.json';
import type { Locale } from '@/i18n/locales';

/**
 * Image registry = IMAGE_ASSET_MANIFEST (generated from the CSV) + final-asset overrides.
 * Components reference slots by manifest ID only; replacing a placeholder is a data change.
 */
export type ImageFamily = 'F1' | 'F2' | 'F3' | 'F4' | 'F5' | 'F6' | 'F7' | 'F8' | 'F9' | 'F10' | 'F11';
export interface ManifestSlot {
  id: string;
  page: string;
  section: string;
  purpose: string;
  family: ImageFamily;
  desktop: { width: number; height: number } | null;
  desktopRatio: string;
  mobile: { width: number; height: number } | null;
  mobileRatio: string;
  separateMobile: boolean;
  priority: 'P0' | 'P1' | 'P2' | 'P3';
  fallback: string;
  path: string;
  mobilePath: string | null;
  templated: boolean;
}
export interface FinalAsset {
  status: 'final';
  focal?: { x: number; y: number };
  alt: Record<Locale, string>;
  /** Actual delivered master size, when it differs from the manifest (e.g. an undersized interim file). */
  size?: { width: number; height: number };
  mobileSize?: { width: number; height: number };
  /**
   * Where overlaid text may sit for this specific artwork. Default = manifest safe zones
   * (text at the inline-start, mirrored in RTL). 'left' pins text to the physical left in every
   * locale — used when the art has a baked-in element (e.g. a logo) on the right.
   */
  textZone?: 'inline-start' | 'left';
  /** Provenance note (who supplied it, any derivation such as a crop). */
  source?: string;
  /** Optional mirrored-composition variant for RTL (never auto-flipped). */
  rtlPath?: string;
}

const manifest = manifestJson as unknown as Record<string, ManifestSlot>;
const finals = (finalsJson as { assets: Record<string, FinalAsset> }).assets;

export type ImageId = string;

export function getSlot(id: ImageId): ManifestSlot {
  const slot = manifest[id];
  if (!slot) throw new Error(`Unknown image slot "${id}" — not in docs/image-asset-manifest.csv`);
  return slot;
}

export function getFinal(id: ImageId): FinalAsset | undefined {
  return finals[id];
}

export function isFinal(id: ImageId): boolean {
  return finals[id]?.status === 'final';
}

/** Widths generated at build time by scripts/images.mjs (must stay in sync). */
export const IMAGE_WIDTHS = [390, 640, 828, 1080, 1280, 1620, 1920, 2400, 2880] as const;

export function variantWidths(masterWidth: number): number[] {
  const ws: number[] = IMAGE_WIDTHS.filter((w) => w < masterWidth);
  ws.push(masterWidth);
  return ws;
}

/** public/images/home/home-hero.jpg → /_img/home/home-hero */
export function variantBase(publicPath: string): string {
  return publicPath.replace(/^public\/images\//, '/_img/').replace(/\.(jpe?g|png|webp)$/i, '');
}

export function ratioToCss(ratio: string): string {
  const m = /^(\d+(?:\.\d+)?):(\d+(?:\.\d+)?)$/.exec(ratio.trim());
  return m ? `${m[1]} / ${m[2]}` : 'auto';
}
