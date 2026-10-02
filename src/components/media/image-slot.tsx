import type { CSSProperties } from 'react';
import type { Locale } from '@/i18n/locales';
import { getFinal, getSlot, isFinal, ratioToCss, variantBase, variantWidths, type ImageId } from '@/content/media';
import { isPreview } from '@/lib/env';
import { cn } from '@/lib/cn';

/**
 * Whether a slot renders at all. In production, a missing P2/P3 image yields the
 * section's designed text-only variant; missing P0/P1 images fail `pnpm assets:check`.
 */
export function slotVisible(id: ImageId): boolean {
  return isFinal(id) || isPreview;
}

interface ImageSlotProps {
  id: ImageId;
  locale: Locale;
  /** `sizes` attribute derived from the grid span (e.g. "(min-width: 1024px) 50vw, 100vw"). */
  sizes: string;
  /** Fill a positioned parent instead of reserving the manifest aspect ratio. */
  fill?: boolean;
  priority?: boolean;
  /** One-time masked reveal on load (hero only, §23.3). */
  maskReveal?: boolean;
  className?: string;
  /** Where the spec label sits inside the placeholder. */
  labelAlign?: 'bottom-start' | 'top-end' | 'bottom-end';
  /** Small thumbnails: crop marks and the delivery size only (D-11: every placeholder shows its required size). */
  compact?: boolean;
}

export function ImageSlot({ id, locale, sizes, fill, priority, maskReveal, className, labelAlign = 'bottom-start', compact }: ImageSlotProps) {
  const slot = getSlot(id);
  const final = getFinal(id);

  // Aspect ratios switch at the md breakpoint when the manifest defines separate mobile art.
  const ratioStyle = fill
    ? undefined
    : ({
        '--ar-d': ratioToCss(slot.desktopRatio),
        '--ar-m': ratioToCss(slot.separateMobile || slot.mobileRatio === slot.desktopRatio ? slot.mobileRatio : slot.desktopRatio),
      } as CSSProperties);
  const frame = cn(
    'block overflow-hidden',
    fill ? 'absolute inset-0 h-full w-full' : 'relative [aspect-ratio:var(--ar-m)] md:[aspect-ratio:var(--ar-d)]',
    maskReveal && 'mask-reveal',
    className,
  );

  if (final && slot.desktop) {
    // Real delivered sizes win over the manifest spec, so srcsets never advertise pixels that don't exist.
    const d = final.size ?? slot.desktop;
    const m = final.mobileSize ?? slot.mobile ?? d;
    const base = variantBase(slot.path);
    const mBase = slot.mobilePath ? variantBase(slot.mobilePath) : null;
    const set = (b: string, w: number, fmt: string) =>
      variantWidths(w)
        .map((x) => `${b}-${x}.${fmt} ${x}w`)
        .join(', ');
    const focal = final.focal ? `${final.focal.x * 100}% ${final.focal.y * 100}%` : '50% 50%';
    return (
      <span className={frame} style={ratioStyle}>
        <picture>
          {mBase && <source media="(max-width: 767px)" type="image/avif" srcSet={set(mBase, m.width, 'avif')} sizes={sizes} />}
          {mBase && <source media="(max-width: 767px)" type="image/webp" srcSet={set(mBase, m.width, 'webp')} sizes={sizes} />}
          <source type="image/avif" srcSet={set(base, d.width, 'avif')} sizes={sizes} />
          <img
            src={`${base}-${variantWidths(d.width).at(-1)}.webp`}
            srcSet={set(base, d.width, 'webp')}
            sizes={sizes}
            width={d.width}
            height={d.height}
            alt={final.alt[locale]}
            loading={priority ? 'eager' : 'lazy'}
            fetchPriority={priority ? 'high' : 'auto'}
            decoding="async"
            className="absolute inset-0 h-full w-full object-cover"
            style={{ objectPosition: focal }}
          />
        </picture>
      </span>
    );
  }

  if (!isPreview) return null;

  // Designed placeholder (IMAGE_ASSET_MANIFEST §5): tonal surface, hairline grid,
  // print crop marks and a discreet spec label. Hidden from assistive technology.
  const dims = slot.desktop ? `${slot.desktop.width} × ${slot.desktop.height} · ${slot.desktopRatio}` : slot.desktopRatio;
  const mobileDims = slot.separateMobile && slot.mobile ? `Mobile ${slot.mobile.width} × ${slot.mobile.height} · ${slot.mobileRatio}` : null;
  return (
    <span className={cn(frame, 'vp-placeholder', compact && 'vp-placeholder--compact')} style={ratioStyle} aria-hidden="true" data-slot={id}>
      <span className="vp-placeholder__grid" />
      <span className="vp-crop vp-crop--ts" />
      <span className="vp-crop vp-crop--te" />
      <span className="vp-crop vp-crop--bs" />
      <span className="vp-crop vp-crop--be" />
      {compact && slot.desktop && (
        <span className="vp-placeholder__dims t-num" dir="ltr">
          {slot.desktop.width}×{slot.desktop.height}
        </span>
      )}
      {!compact && (
        <span className={cn('vp-placeholder__label t-num', `vp-placeholder__label--${labelAlign}`)} dir="ltr">
          <span className="vp-placeholder__id">{id}</span>
          <span>{dims}</span>
          {mobileDims && <span className="vp-placeholder__mobile">{mobileDims}</span>}
        </span>
      )}
    </span>
  );
}
