import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import type { Locale } from '@/i18n/locales';
import { getCatalog, getHome, getSolutionsCopy } from '@/content';
import { solutions } from '@/content/data/registry';
import { PageIntro } from '@/components/layout/page-intro';
import { Section } from '@/components/layout/section';
import { CtaBand } from '@/components/sections/shared/cta-band';
import { HeroBand } from '@/components/sections/shared/hero-band';
import { IndexList } from '@/components/sections/shared/index-list';
import { ProcessTrack } from '@/components/sections/shared/process-track';
import { StatementBand } from '@/components/sections/shared/statement-band';
import { LinkButton } from '@/components/ui/button';
import { ArrowEnd } from '@/components/ui/icons';
import { pageMetadata } from '@/lib/metadata';
import { textAttrs } from '@/lib/text-attrs';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  return pageMetadata((await params).locale as Locale, 'solutionsHub');
}

/**
 * Solutions hub (MASTER_PROJECT_PLAN §26.3, P5A-02): hero → index of the 8 solutions (Mobile NVR first, featured)
 * → integration statement with the ELV teaser → approach teaser → CTA. Every word is approved copy (`01` §02, §06,
 * §12, §17, §24) or approved interface microcopy (D-18); images are labelled placeholders (D-11).
 */
export default async function SolutionsPage({ params }: { params: Promise<{ locale: string }> }) {
  const locale = (await params).locale as Locale;
  setRequestLocale(locale);
  const [tn, ta, tc] = await Promise.all([
    getTranslations({ locale, namespace: 'nav' }),
    getTranslations({ locale, namespace: 'a11y' }),
    getTranslations({ locale, namespace: 'cta' }),
  ]);
  const { hub, items } = getSolutionsCopy(locale);
  const catalog = getCatalog(locale);
  const { approach, closing } = getHome(locale);
  const elvName = catalog.solutions['elv-systems'].name;
  const elvHeadline = items['elv-systems'].headline;

  return (
    <main id="main" tabIndex={-1} className="solutions-hub">
      <PageIntro
        locale={locale}
        crumbs={[{ label: tn('home'), href: '/' }, { label: tn('solutions') }]}
        crumbsLabel={ta('breadcrumb')}
        eyebrow={hub.eyebrow}
        title={hub.title}
        lede={hub.lede}
      />
      <HeroBand locale={locale} id="SOL-HUB-HERO" />

      <Section tone="canvas" labelledBy="solutions-index-title">
        <div className="container-vp">
          <h2 id="solutions-index-title" className="sr-only">
            {tn('allSolutions')}
          </h2>
          <IndexList
            locale={locale}
            items={solutions.map((s) => ({
              href: `/solutions/${s.slug}`,
              name: catalog.solutions[s.slug].name,
              summary: catalog.solutions[s.slug].summary,
              image: s.image,
              marker: 'featured' in s && s.featured ? tn('featured') : undefined,
            }))}
          />
        </div>
      </Section>

      <StatementBand locale={locale} id="integration-title" statement={hub.integrationStatement}>
        <div className="statement-band__teaser">
          <p className="t-h3 text-fg-muted" {...textAttrs(locale, elvHeadline)}>
            {elvHeadline}
          </p>
          <LinkButton href="/solutions/elv-systems" variant="text">
            <span {...textAttrs(locale, elvName)}>{elvName}</span>
            <ArrowEnd size={16} />
          </LinkButton>
        </div>
      </StatementBand>

      <Section tone="canvas" labelledBy="approach-title">
        <div className="container-vp">
          <div data-reveal="">
            <span className="seam mb-6 w-12" aria-hidden="true" />
            <h2 id="approach-title" className="t-h2" {...textAttrs(locale, approach.title)}>
              {approach.title}
            </h2>
          </div>
          <div className="mt-12">
            <ProcessTrack locale={locale} steps={catalog.approach} label={ta('approachProgress')} />
          </div>
          <div className="mt-12">
            <LinkButton href="/services#approach" variant="text">
              {tc('approach')}
              <ArrowEnd size={16} />
            </LinkButton>
          </div>
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
