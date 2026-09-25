import type { Locale } from '@/i18n/locales';
import { getHome } from '@/content';
import { Section } from '@/components/layout/section';
import { ImageSlot, slotVisible } from '@/components/media/image-slot';
import { cn } from '@/lib/cn';

/** Positioning statement (§26.1 #2) — editorial 7/5 composition; text-only variant if HOME-STATEMENT is absent. */
export function HomePositioning({ locale }: { locale: Locale }) {
  const { positioning: p } = getHome(locale);
  const withImage = slotVisible('HOME-STATEMENT');
  return (
    <Section tone="canvas" labelledBy="positioning-title" spacing="lg">
      <div className="container-vp">
        <div data-reveal="">
          <span className="seam mb-6 w-12" aria-hidden="true" />
          <h2 id="positioning-title" className="t-h4 text-fg-muted">
            {p.title}
          </h2>
        </div>
        <p className="t-display mt-8 max-w-[22ch] lg:mt-10">{p.statement}</p>

        <div className="grid-vp mt-16 gap-y-12 lg:mt-24">
          <div className={cn('col-span-4 md:col-span-6 lg:col-span-4 lg:pt-4', !withImage && 'lg:col-span-7')}>
            {p.body.map((para, i) => (
              <p key={i} className={cn('measure', i === 0 ? 't-lede' : 't-body mt-6 text-fg-muted')}>
                {para}
              </p>
            ))}
          </div>
          {withImage && (
            <div className="col-span-4 md:col-span-8 lg:col-span-7 lg:col-start-6 lg:translate-y-12">
              <ImageSlot id="HOME-STATEMENT" locale={locale} sizes="(min-width: 1440px) 752px, (min-width: 1024px) 55vw, 100vw" />
            </div>
          )}
        </div>

        <div className="statement-line mt-24 lg:mt-40" data-reveal="">
          <span className="seam statement-line__seam" aria-hidden="true" />
          <p className="t-h2 max-w-[26ch]">{p.closing}</p>
        </div>
      </div>
    </Section>
  );
}
