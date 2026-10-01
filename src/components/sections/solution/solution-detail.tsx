import type { CSSProperties } from 'react';
import { getTranslations } from 'next-intl/server';
import type { Locale } from '@/i18n/locales';
import { getCatalog, getSolutionsCopy } from '@/content';
import { solutions, type SolutionSlug } from '@/content/data/registry';
import { categoriesForSolution, industriesForSolution, industrySolutions } from '@/content/data/relations';
import { PageIntro } from '@/components/layout/page-intro';
import { Section } from '@/components/layout/section';
import { ImageSlot } from '@/components/media/image-slot';
import { LinkButton } from '@/components/ui/button';
import { ArrowEnd } from '@/components/ui/icons';
import { Equation } from '@/components/ui/equation';
import { Link } from '@/i18n/navigation';
import { isPreview } from '@/lib/env';
import { textAttrs } from '@/lib/text-attrs';
import { MnvrRouteScene } from './mnvr-route-scene';
import '@/styles/pages.css';

const IMAGE: Record<SolutionSlug, string> = {
  'mobile-nvr-mobile-surveillance': 'MNVR',
  'cctv-security-systems': 'CCTV',
  'access-control': 'ACCESS',
  'networking-ict': 'ICT',
  'elv-systems': 'ELV',
  'audio-visual': 'AV',
  'smart-building-home-automation': 'SMART',
  'fire-alarm-systems': 'FIRE',
};

/**
 * Solution detail (MASTER_PROJECT_PLAN §26.2): hero → context → scene → capabilities → solution module →
 * lifecycle → related → CTA. Built in P2 for Mobile NVR only (the design-direction proof, §49.1 P2); the
 * same template serves the other seven solutions once P5 is approved. All copy is the approved text.
 */
export async function SolutionDetail({ locale, slug }: { locale: Locale; slug: 'mobile-nvr-mobile-surveillance' }) {
  const catalog = getCatalog(locale);
  const copy = getSolutionsCopy(locale).items[slug];
  const name = catalog.solutions[slug].name;
  const code = IMAGE[slug];
  const [tn, ta, ts, tc, tp] = await Promise.all([
    getTranslations({ locale, namespace: 'nav' }),
    getTranslations({ locale, namespace: 'a11y' }),
    getTranslations({ locale, namespace: 'solution' }),
    getTranslations({ locale, namespace: 'cta' }),
    getTranslations({ locale, namespace: 'preview' }),
  ]);

  // Relations are derived and await client confirmation (D-19): shown in preview, held back in production.
  const showRelations = isPreview || industrySolutions.status === 'approved';
  const relatedIndustries = showRelations ? industriesForSolution(slug) : [];
  const relatedCategories = showRelations ? categoriesForSolution(slug) : [];
  const index = solutions.findIndex((s) => s.slug === slug);
  const neighbours = [solutions[(index + solutions.length - 1) % solutions.length]!, solutions[(index + 1) % solutions.length]!];
  const [opening, ...context] = copy.body;
  const tx = (t: string | undefined) => textAttrs(locale, t);

  return (
    <main id="main" tabIndex={-1} className="solution">
      {/* 1. Hero */}
      <PageIntro
        locale={locale}
        crumbs={[{ label: tn('home'), href: '/' }, { label: tn('solutions'), href: '/solutions' }, { label: name }]}
        crumbsLabel={ta('breadcrumb')}
        title={name}
      >
        <p className="t-display solution__headline" {...tx(copy.headline)}>
          {copy.headline}
        </p>
        <p className="t-lede mt-8 max-w-[40rem]" {...tx(opening)}>
          {opening}
        </p>
      </PageIntro>
      <div className="solution__band">
        <ImageSlot id={`SOL-${code}-HERO`} locale={locale} sizes="100vw" priority />
      </div>

      {/* 2. Context */}
      <Section tone="canvas" labelledBy="context-title" spacing="default">
        <div className="container-vp grid-vp gap-y-12">
          <div className="col-span-4 md:col-span-8 lg:col-span-6">
            <h2 id="context-title" className="sr-only">
              {name}
            </h2>
            <div className="grid gap-6">
              {context.map((p) => (
                <p key={p} className="t-body measure" {...tx(p)}>
                  {p}
                </p>
              ))}
            </div>
          </div>
          <div className="col-span-4 md:col-span-8 lg:col-span-5 lg:col-start-8">
            <ImageSlot id={`SOL-${code}-DETAIL`} locale={locale} sizes="(min-width: 1024px) 40vw, 100vw" />
          </div>
        </div>
      </Section>

      {/* 3. Scene (Mobile Security & Fleet Intelligence, 01 §08) */}
      <section aria-labelledby="fleet-title" className="theme-dark bg-bg text-fg section-y">
        <div className="container-vp">
          <div className="max-w-[52rem]" data-reveal="">
            <span className="seam mb-6 w-12" aria-hidden="true" />
            <p className="t-caption text-fg-muted mb-4" {...tx(copy.fleet.eyebrow)}>
              {copy.fleet.eyebrow}
            </p>
            <h2 id="fleet-title" className="t-h1" {...tx(copy.fleet.title)}>
              {copy.fleet.title}
            </h2>
          </div>
          <div className="solution__insight">
            <p className="t-body-sm text-fg-muted" {...tx(copy.fleet.body[0])}>
              {copy.fleet.body[0]}
            </p>
            <p className="t-h4 mt-3" {...tx(copy.fleet.body[1])}>
              {copy.fleet.body[1]}
            </p>
            <p className="t-body text-fg-muted mt-6 measure" {...tx(copy.fleet.body[2])}>
              {copy.fleet.body[2]}
            </p>
          </div>
          {isPreview && <p className="solution__preview-note">{tp('sceneFirstCut')}</p>}
          <div className="mt-16 lg:mt-24">
            <MnvrRouteScene locale={locale} name={copy.fleet.title} />
          </div>
          <div className="mt-16 lg:mt-24">
            <Equation terms={copy.fleet.equation} />
          </div>
        </div>
      </section>

      {/* 4. Capabilities */}
      <Section tone="canvas" labelledBy="capabilities-title">
        <div className="container-vp">
          <div data-reveal="">
            <span className="seam mb-6 w-12" aria-hidden="true" />
            <h2 id="capabilities-title" className="t-h2" {...tx(copy.capabilities.intro)}>
              {copy.capabilities.intro}
            </h2>
          </div>
          <ul className="spec-list mt-12">
            {copy.capabilities.items.map((c) => (
              <li key={c} {...tx(c)}>
                {c}
              </li>
            ))}
          </ul>
        </div>
      </Section>

      {/* 5. Solution module: applications + fleet band */}
      <Section tone="raised" labelledBy="applications-title">
        <div className="container-vp">
          <h2 id="applications-title" className="t-h2" {...tx(copy.fleet.applicationsTitle)}>
            {copy.fleet.applicationsTitle}
          </h2>
          <ul className="spec-list spec-list--plain mt-10">
            {copy.fleet.applications.map((a) => (
              <li key={a} {...tx(a)}>
                {a}
              </li>
            ))}
          </ul>
        </div>
        <div className="solution__band mt-16 lg:mt-24">
          <ImageSlot id="SOL-MNVR-FLEET" locale={locale} sizes="100vw" />
        </div>
      </Section>

      {/* 6. Delivered through our lifecycle */}
      <Section tone="canvas" labelledBy="lifecycle-title">
        <div className="container-vp">
          <h2 id="lifecycle-title" className="t-h2">
            {ts('lifecycleTitle')}
          </h2>
          <ol
            className="lifecycle lifecycle--compact mt-12"
            aria-label={ta('approachProgress')}
            data-progress="track"
            style={{ '--n': catalog.approach.length } as CSSProperties}
          >
            {catalog.approach.map((s, i) => (
              <li key={s.title} className="lifecycle__step" style={{ '--i': i } as CSSProperties}>
                <span className="lifecycle__line" aria-hidden="true">
                  <span className="lifecycle__fill" />
                </span>
                <span className="lifecycle__node" aria-hidden="true" />
                <span className="lifecycle__n t-num" aria-hidden="true">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <h3 className="t-h4">{s.title}</h3>
              </li>
            ))}
          </ol>
          <div className="mt-12">
            <LinkButton href="/services#approach" variant="text">
              {tc('approach')}
              <ArrowEnd size={16} />
            </LinkButton>
          </div>
        </div>
      </Section>

      {/* 7. Related */}
      <Section tone="raised" labelledBy="related-title" spacing="sm">
        <div className="container-vp">
          <h2 id="related-title" className="t-h2">
            {ts('related')}
          </h2>
          <div className="related mt-10">
            {relatedIndustries.length > 0 && (
              <div>
                <h3 className="t-caption text-fg-muted">{ts('relatedIndustries')}</h3>
                <ul className="related__list">
                  {relatedIndustries.map((i) => (
                    <li key={i}>
                      <Link href={`/industries#${i}`} className="link-text">
                        {catalog.industries[i].name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {relatedCategories.length > 0 && (
              <div>
                <h3 className="t-caption text-fg-muted">{ts('relatedCategories')}</h3>
                <ul className="related__list">
                  {relatedCategories.map((c) => (
                    <li key={c}>
                      <Link href={`/products#${c}`} className="link-text">
                        {catalog.productCategories[c].name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            <div>
              <h3 className="t-caption text-fg-muted">{ts('otherSolutions')}</h3>
              <ul className="related__list">
                {neighbours.map((s) => (
                  <li key={s.slug}>
                    <Link href={`/solutions/${s.slug}`} className="link-text">
                      {catalog.solutions[s.slug].name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </Section>

      {/* 8. CTA band */}
      <section aria-labelledby="cta-title" className="theme-dark bg-bg text-fg section-y-sm">
        <div className="container-vp flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <h2 id="cta-title" className="t-h2 max-w-[24ch]">
            {ts('ctaTitle', { solution: name })}
          </h2>
          <LinkButton href={`/contact?type=consultation&solution=${slug}`} variant="primary">
            {tc('consultation')}
          </LinkButton>
        </div>
      </section>
    </main>
  );
}
