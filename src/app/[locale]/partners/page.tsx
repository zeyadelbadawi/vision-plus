import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import type { Locale } from '@/i18n/locales';
import { getPartnersCopy } from '@/content';
import { partnersAlphabetical } from '@/content/data/registry';
import { PageIntro } from '@/components/layout/page-intro';
import { Section } from '@/components/layout/section';
import { StatementBand } from '@/components/sections/shared/statement-band';
import { isPreview } from '@/lib/env';
import { pageMetadata } from '@/lib/metadata';
import { textAttrs } from '@/lib/text-attrs';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  return pageMetadata((await params).locale as Locale, 'partners');
}

/**
 * Technology Partners (MASTER_PROJECT_PLAN §26.9, §34, P5A-09; notes §55.3.12): the approved §21 intro, the client-
 * confirmed partners (D-08 update, A-30) as a uniform alphabetical grid, and the approved closing line. Each cell is a
 * 240×96 logo box with the name as its caption. Until the designer's logo files arrive the box holds the name set in
 * type (preview builds also label the missing logo); a logo replaces it as a data change.
 */
export default async function PartnersPage({ params }: { params: Promise<{ locale: string }> }) {
  const locale = (await params).locale as Locale;
  setRequestLocale(locale);
  const [tn, ta, tph] = await Promise.all([
    getTranslations({ locale, namespace: 'nav' }),
    getTranslations({ locale, namespace: 'a11y' }),
    getTranslations({ locale, namespace: 'placeholder' }),
  ]);
  const p = getPartnersCopy(locale);
  const tx = (t: string | undefined) => textAttrs(locale, t);

  return (
    <main id="main" tabIndex={-1} className="partners">
      <PageIntro
        locale={locale}
        crumbs={[{ label: tn('home'), href: '/' }, { label: tn('about'), href: '/about' }, { label: p.eyebrow }]}
        crumbsLabel={ta('breadcrumb')}
        eyebrow={p.eyebrow}
        title={p.title}
        lede={p.body[0]}
      >
        <p className="t-body mt-4 max-w-[44rem] text-fg-muted" {...tx(p.body[1])}>
          {p.body[1]}
        </p>
      </PageIntro>

      <Section tone="canvas" labelledBy="partners-list-title">
        <div className="container-vp">
          <h2 id="partners-list-title" className="sr-only" {...tx(p.eyebrow)}>
            {p.eyebrow}
          </h2>
          <ul className="partner-grid">
            {partnersAlphabetical.map((partner) => (
              <li key={partner.slug} id={partner.slug} className="partner-cell">
                <div className="partner-cell__logo">
                  {partner.logo ? (
                    // the caption below names the partner, so the logo itself is decorative here
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={partner.logo.mono} alt="" loading="lazy" decoding="async" />
                  ) : (
                    <span className="partner-cell__wordmark" aria-hidden="true" {...tx(partner.name)}>
                      {partner.name}
                    </span>
                  )}
                  {!partner.logo && isPreview && <span className="partner-cell__pending">{tph('partnerPending')}</span>}
                </div>
                <h3 className="partner-cell__name" {...tx(partner.name)}>
                  {partner.name}
                </h3>
              </li>
            ))}
          </ul>
        </div>
      </Section>

      <StatementBand locale={locale} id="partners-closing" statement={p.closing} size="h2" />
    </main>
  );
}
