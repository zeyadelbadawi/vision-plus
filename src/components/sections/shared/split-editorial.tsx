import type { ReactNode } from 'react';
import type { Locale } from '@/i18n/locales';
import type { ImageId } from '@/content/media';
import { ImageSlot, slotVisible } from '@/components/media/image-slot';
import { cn } from '@/lib/cn';
import { textAttrs } from '@/lib/text-attrs';

/**
 * Split editorial (§20.8): an approved heading and text beside one F4 image, the image side alternating with
 * `flip` (§26.5 services). In production a missing image leaves the text column alone (the manifest's text-only
 * fallback); the alternating column offset keeps the rhythm. `step` marks it for a `[data-steps]` container.
 */
export function SplitEditorial({
  locale,
  id,
  title,
  image,
  flip = false,
  step = false,
  children,
}: {
  locale: Locale;
  id: string;
  title: string;
  image?: ImageId;
  flip?: boolean;
  step?: boolean;
  children: ReactNode;
}) {
  const media = image && slotVisible(image) ? image : undefined;
  return (
    <section id={id} aria-labelledby={`${id}-title`} className="split section-y" data-step={step ? '' : undefined}>
      <div className="container-vp grid-vp items-center gap-y-10">
        <div
          className={cn(
            'split__text col-span-4 md:col-span-8 lg:col-span-5 lg:row-start-1',
            flip ? 'lg:col-start-8' : 'lg:col-start-1',
            !media && flip && 'lg:col-span-6 lg:col-start-7',
          )}
          data-reveal=""
        >
          <span className="seam mb-6 w-12" aria-hidden="true" />
          <h2 id={`${id}-title`} className="t-h2" {...textAttrs(locale, title)}>
            {title}
          </h2>
          <div className="mt-8 grid gap-5">{children}</div>
        </div>
        {media && (
          <div className={cn('split__media col-span-4 md:col-span-8 lg:col-span-6 lg:row-start-1', flip ? 'lg:col-start-1' : 'lg:col-start-7')}>
            <ImageSlot id={media} locale={locale} sizes="(min-width: 1024px) 50vw, 100vw" />
          </div>
        )}
      </div>
    </section>
  );
}
