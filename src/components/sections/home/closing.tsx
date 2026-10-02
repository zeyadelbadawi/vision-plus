import { getTranslations } from 'next-intl/server';
import type { Locale } from '@/i18n/locales';
import { getHome } from '@/content';
import { ImageSlot, slotVisible } from '@/components/media/image-slot';
import { LinkButton } from '@/components/ui/button';

/** Closing statement + consultation CTA (§26.1 #11). HOME-CLOSING is optional (P2): solid charcoal is a valid final state. */
export async function HomeClosing({ locale }: { locale: Locale }) {
  const { closing } = getHome(locale);
  const tc = await getTranslations({ locale, namespace: 'cta' });
  return (
    <section aria-labelledby="closing-title" className="closing theme-dark bg-bg text-fg">
      {slotVisible('HOME-CLOSING') && (
        <div className="closing__media" aria-hidden="true">
          <ImageSlot id="HOME-CLOSING" locale={locale} fill sizes="100vw" labelAlign="top-end" />
          <span className="closing__scrim" />
        </div>
      )}
      <div className="container-vp relative flex flex-col items-center text-center" data-reveal="">
        <span className="seam w-12" aria-hidden="true" />
        <p className="t-h3 mt-10 text-fg-muted">{closing.lead}</p>
        <h2 id="closing-title" className="t-display mt-4 max-w-[18ch]">
          {closing.title}
        </h2>
        <p className="t-lede mt-8 max-w-[44rem] text-fg-muted">{closing.body}</p>
        <div className="mt-12 flex w-full flex-col items-stretch justify-center gap-3 sm:w-auto sm:flex-row">
          <LinkButton href="/contact?type=consultation" variant="primary">
            {tc('consultation')}
          </LinkButton>
          <LinkButton href="/company-profile" variant="secondary">
            {tc('companyProfile')}
          </LinkButton>
        </div>
      </div>
    </section>
  );
}
