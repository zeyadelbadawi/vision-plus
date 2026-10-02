import type { Metadata } from 'next';
import { Fragment } from 'react';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import type { Locale } from '@/i18n/locales';
import { catalogPending, getCatalog, getHome, getServicesCopy } from '@/content';
import { serviceMedia, services } from '@/content/data/registry';
import { approachSteps, serviceStages } from '@/content/data/relations';
import { Link } from '@/i18n/navigation';
import { PageIntro } from '@/components/layout/page-intro';
import { Section } from '@/components/layout/section';
import { CtaBand } from '@/components/sections/shared/cta-band';
import { HeroBand } from '@/components/sections/shared/hero-band';
import { ProcessTrack } from '@/components/sections/shared/process-track';
import { SplitEditorial } from '@/components/sections/shared/split-editorial';
import { StatementBand } from '@/components/sections/shared/statement-band';
import { isPreview } from '@/lib/env';
import { pageMetadata } from '@/lib/metadata';
import { textAttrs } from '@/lib/text-attrs';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  return pageMetadata((await params).locale as Locale, 'services');
}

/**
 * Services (MASTER_PROJECT_PLAN §26.5, P5A-05; notes §55.3.7): hero → #approach (the 8 steps, `01` §17) → the
 * 6 services (`01` §16) with their "Stages" (D-19) under a sticky stage rail on desktop → closing line → CTA.
 * Every word is approved copy or approved microcopy (D-18), except the Understand step text, a draft awaiting
 * client review (R-2), which carries a preview-only note. Supply & Procurement is not built (R-3).
 */
export default async function ServicesPage({ params }: { params: Promise<{ locale: string }> }) {
  const locale = (await params).locale as Locale;
  setRequestLocale(locale);
  const [tn, ta, tc, tsv, tp] = await Promise.all([
    getTranslations({ locale, namespace: 'nav' }),
    getTranslations({ locale, namespace: 'a11y' }),
    getTranslations({ locale, namespace: 'cta' }),
    getTranslations({ locale, namespace: 'services' }),
    getTranslations({ locale, namespace: 'preview' }),
  ]);
  const catalog = getCatalog(locale);
  const copy = getServicesCopy(locale);
  const { closing } = getHome(locale);
  const tx = (t: string | undefined) => textAttrs(locale, t);

  const steps = approachSteps.map((key, i) => ({
    key,
    id: `step-${key}`,
    title: catalog.approach[i]!.title,
    text: catalog.approach[i]!.text,
    pending: isPreview && catalogPending(`approach.${i}.text`) ? tp('pendingWording') : undefined,
  }));
  const stepByKey = Object.fromEntries(steps.map((s) => [s.key, s]));
  // Which services (1-based, in page order) each stage belongs to — the rail highlights them via data-current.
  const servicesFor = (key: string) =>
    services
      .map((s, i) => ((serviceStages.map[s] as readonly string[]).includes(key) ? i + 1 : 0))
      .filter(Boolean)
      .join(' ');

  return (
    <main id="main" tabIndex={-1} className="services">
      <PageIntro
        locale={locale}
        crumbs={[{ label: tn('home'), href: '/' }, { label: tn('services') }]}
        crumbsLabel={ta('breadcrumb')}
        eyebrow={copy.hero.eyebrow}
        title={copy.hero.title}
        lede={copy.hero.lede}
      />
      <HeroBand locale={locale} id="SRV-HUB-HERO" />

      <Section id="approach" tone="canvas" labelledBy="approach-title">
        <div className="container-vp">
          <div data-reveal="">
            <span className="seam mb-6 w-12" aria-hidden="true" />
            <p className="t-caption text-fg-muted mb-4" {...tx(copy.approach.eyebrow)}>
              {copy.approach.eyebrow}
            </p>
            <h2 id="approach-title" className="t-h2" {...tx(copy.approach.title)}>
              {copy.approach.title}
            </h2>
          </div>
          <div className="mt-14 lg:mt-20">
            <ProcessTrack locale={locale} steps={steps} label={ta('approachProgress')} variant="full" />
          </div>
        </div>
      </Section>

      <div className="services-flow" data-steps="">
        <div className="stage-rail" aria-hidden="true">
          <ol className="stage-rail__list container-vp">
            {steps.map((s, i) => (
              <li key={s.key} className="stage-rail__item" data-for={servicesFor(s.key)}>
                <span className="stage-rail__n t-num">{String(i + 1).padStart(2, '0')}</span>
                <span {...tx(s.title)}>{s.title}</span>
              </li>
            ))}
          </ol>
        </div>
        {services.map((slug, i) => {
          const stages = serviceStages.map[slug].map((k) => stepByKey[k]!);
          return (
            <SplitEditorial key={slug} locale={locale} id={slug} title={catalog.services[slug].name} image={serviceMedia[slug].image} flip={i % 2 === 1} step>
              <p className="service-stages t-caption">
                <span className="text-fg-muted">{tsv('stages')}</span>{' '}
                {stages.map((s, j) => (
                  <Fragment key={s.key}>
                    {j > 0 && <span aria-hidden="true"> · </span>}
                    <Link href={`/services#${s.id}`} className="service-stages__link" {...tx(s.title)}>
                      {s.title}
                    </Link>
                  </Fragment>
                ))}
              </p>
              {copy.items[slug].body.map((p) => (
                <p key={p} className="t-body measure" {...tx(p)}>
                  {p}
                </p>
              ))}
            </SplitEditorial>
          );
        })}
      </div>

      <StatementBand locale={locale} id="closing-title" statement={copy.approach.closing} />

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
