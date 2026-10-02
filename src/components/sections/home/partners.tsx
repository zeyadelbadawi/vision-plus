import { getTranslations } from 'next-intl/server';
import type { Locale } from '@/i18n/locales';
import { getHome } from '@/content';
import { partners, previewSlots } from '@/content/data/registry';
import { Section } from '@/components/layout/section';
import { LinkButton } from '@/components/ui/button';
import { ArrowEnd } from '@/components/ui/icons';
import { isPreview } from '@/lib/env';
import { PartnerMarquee } from './partner-marquee';

/**
 * Partners (§26.1 #9). No partner is confirmed yet (D-08); the PDF's market brand list is NOT a partner
 * list. Production: hidden until confirmed partners exist. Preview: logo cells as designed placeholders.
 */
export async function HomePartners({ locale }: { locale: Locale }) {
  if (partners.length === 0 && !isPreview) return null;
  const { partners: copy } = getHome(locale);
  const [tp, ta, tc] = await Promise.all([
    getTranslations({ locale, namespace: 'placeholder' }),
    getTranslations({ locale, namespace: 'a11y' }),
    getTranslations({ locale, namespace: 'cta' }),
  ]);

  const cells =
    partners.length > 0
      ? partners.map((p) => (
          <div key={p.slug} className="logo-cell">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={p.logo.mono} alt={p.name} loading="lazy" decoding="async" />
          </div>
        ))
      : Array.from({ length: previewSlots.partners }, (_, i) => (
          <div key={i} className="logo-cell logo-cell--placeholder vp-placeholder" aria-hidden="true">
            <span className="vp-crop vp-crop--ts" />
            <span className="vp-crop vp-crop--te" />
            <span className="vp-crop vp-crop--bs" />
            <span className="vp-crop vp-crop--be" />
            <span className="logo-cell__label">{tp('partnerPending')}</span>
          </div>
        ));

  return (
    <Section tone="canvas" labelledBy="partners-title">
      <div className="container-vp grid-vp gap-y-8">
        <div className="col-span-4 md:col-span-8 lg:col-span-6" data-reveal="">
          <span className="seam mb-6 w-12" aria-hidden="true" />
          <h2 id="partners-title" className="t-h2 max-w-[22ch]">
            {copy.title}
          </h2>
        </div>
        <p className="t-body col-span-4 text-fg-muted md:col-span-8 lg:col-span-5 lg:col-start-8 lg:pt-12">{copy.body}</p>
      </div>

      <div className="mt-14 lg:mt-20">
        <PartnerMarquee pauseLabel={ta('pauseLogos')} playLabel={ta('playLogos')}>
          {cells}
        </PartnerMarquee>
      </div>

      <div className="container-vp mt-12 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="t-h3">{copy.closing}</p>
          {partners.length === 0 && <p className="placeholder-note mt-4">{tp('partnerNote')}</p>}
        </div>
        <LinkButton href="/partners" variant="text">
          {tc('viewPartners')}
          <ArrowEnd size={16} />
        </LinkButton>
      </div>
    </Section>
  );
}
