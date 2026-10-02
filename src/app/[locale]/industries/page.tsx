import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import type { Locale } from '@/i18n/locales';
import { catalogPending, getCatalog, getHome, getIndustriesCopy } from '@/content';
import { industries } from '@/content/data/registry';
import { acrossEnvironments, industrySolutions } from '@/content/data/relations';
import { Link } from '@/i18n/navigation';
import { PageIntro } from '@/components/layout/page-intro';
import { Section } from '@/components/layout/section';
import { ImageSlot, slotVisible } from '@/components/media/image-slot';
import { IndustryExplorer } from '@/components/sections/industries/industry-explorer';
import { CtaBand } from '@/components/sections/shared/cta-band';
import { HeroBand } from '@/components/sections/shared/hero-band';
import { LinkButton } from '@/components/ui/button';
import { ArrowEnd } from '@/components/ui/icons';
import { isPreview } from '@/lib/env';
import { pageMetadata } from '@/lib/metadata';
import { textAttrs } from '@/lib/text-attrs';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  return pageMetadata((await params).locale as Locale, 'industries');
}

/**
 * Industries (MASTER_PROJECT_PLAN §26.4, P5A-06; notes §55.3.8): hero → explorer of the 12 industries (Q-08) →
 * solutions that apply across environments (§12.4) → CTA. Every word is approved copy (`01` §18) or approved
 * microcopy (D-18), except the Real Estate summary (R-1) and the industry order (R-4), which carry preview-only
 * notes while they await client review.
 */
export default async function IndustriesPage({ params }: { params: Promise<{ locale: string }> }) {
  const locale = (await params).locale as Locale;
  setRequestLocale(locale);
  const [tn, ta, tc, ti, ts, tp] = await Promise.all([
    getTranslations({ locale, namespace: 'nav' }),
    getTranslations({ locale, namespace: 'a11y' }),
    getTranslations({ locale, namespace: 'cta' }),
    getTranslations({ locale, namespace: 'industries' }),
    getTranslations({ locale, namespace: 'solution' }),
    getTranslations({ locale, namespace: 'preview' }),
  ]);
  const catalog = getCatalog(locale);
  const { hero } = getIndustriesCopy(locale);
  const { closing } = getHome(locale);
  const tx = (t: string | undefined) => textAttrs(locale, t);
  // Relations were approved as is (D-19).
  const showRelations = isPreview || industrySolutions.status === 'approved';

  const panels = industries.map(({ slug, image }) => {
    const { name, summary } = catalog.industries[slug];
    const related = showRelations ? industrySolutions.map[slug].map((l) => l.solution) : [];
    // R-1: a drafted summary awaiting client review (the client-supplied Residential name is not a wording item)
    const pending = isPreview && catalogPending(`industries.${slug}`);
    return (
      <section key={slug} id={slug} aria-labelledby={`${slug}-title`} className="ix__panel">
        {slotVisible(image) && (
          <div className="ix__media">
            <ImageSlot id={image} locale={locale} sizes="(min-width: 1024px) 28vw, (min-width: 768px) 40vw, 100vw" />
          </div>
        )}
        <div className="ix__body">
          <h3 id={`${slug}-title`} tabIndex={-1} className="t-h2 ix__title" {...tx(name)}>
            {name}
          </h3>
          <p className="t-lede mt-5 text-fg-muted" {...tx(summary)}>
            {summary}
          </p>
          {pending && <p className="pending-note t-caption">{tp('pendingWording')}</p>}
          {related.length > 0 && (
            <div className="mt-8">
              <h4 className="t-caption text-fg-muted">{ti('relatedSolutions')}</h4>
              <ul className="related__list">
                {related.map((s) => (
                  <li key={s}>
                    <Link href={`/solutions/${s}`} className="link-text" {...tx(catalog.solutions[s].name)}>
                      {catalog.solutions[s].name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
          <div className="mt-8">
            <LinkButton href={`/contact?type=consultation&industry=${slug}`} variant="text">
              {tc('consultation')}
              <ArrowEnd size={16} />
            </LinkButton>
          </div>
        </div>
      </section>
    );
  });

  return (
    <main id="main" tabIndex={-1} className="industries">
      <PageIntro
        locale={locale}
        crumbs={[{ label: tn('home'), href: '/' }, { label: tn('industries') }]}
        crumbsLabel={ta('breadcrumb')}
        eyebrow={hero.eyebrow}
        title={hero.title}
      />
      <HeroBand locale={locale} id="IND-HUB-HERO" />

      <Section tone="canvas" labelledBy="industries-index-title">
        <div className="container-vp">
          <h2 id="industries-index-title" className="sr-only">
            {ti('indexLabel')}
          </h2>
          {isPreview && <p className="pending-note t-caption mb-8">{tp('pendingOrder')}</p>}
          <IndustryExplorer
            label={ti('indexLabel')}
            items={industries.map(({ slug }) => ({ slug, name: catalog.industries[slug].name, attrs: tx(catalog.industries[slug].name) }))}
            panels={panels}
          />
          {showRelations && (
            <div className="ix__across">
              <h3 className="t-caption text-fg-muted">{ts('acrossEnvironments')}</h3>
              <ul className="related__list">
                {acrossEnvironments.map((s) => (
                  <li key={s}>
                    <Link href={`/solutions/${s}`} className="link-text" {...tx(catalog.solutions[s].name)}>
                      {catalog.solutions[s].name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </Section>

      <CtaBand
        locale={locale}
        id="cta-title"
        lead={closing.lead}
        title={closing.title}
        action={{ href: '/contact?type=consultation', label: tc('consultation') }}
      />
    </main>
  );
}
