import type { Locale } from '@/i18n/locales';
import type { ImageId } from '@/content/media';
import { ImageSlot, slotVisible } from '@/components/media/image-slot';

/**
 * Full-bleed hero image band under a page intro (§26.2 #1, §26.3). F2 slots carry separate mobile art.
 * In production a missing image yields no band (the designed text-only variant, §12.3).
 */
export function HeroBand({ locale, id }: { locale: Locale; id: ImageId }) {
  if (!slotVisible(id)) return null;
  return (
    <div className="page-band">
      <ImageSlot id={id} locale={locale} sizes="100vw" priority />
    </div>
  );
}
