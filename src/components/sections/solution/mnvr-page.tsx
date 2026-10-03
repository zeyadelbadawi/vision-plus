import type { CSSProperties } from 'react';
import { getTranslations } from 'next-intl/server';
import type { Locale } from '@/i18n/locales';
import { getCatalog, getSolutionsCopy } from '@/content';
import { solutions } from '@/content/data/registry';
import { industriesForSolution } from '@/content/data/relations';
import { Breadcrumbs } from '@/components/layout/breadcrumbs';
import { Section } from '@/components/layout/section';
import { ImageSlot } from '@/components/media/image-slot';
import { LinkButton } from '@/components/ui/button';
import { Equation } from '@/components/ui/equation';
import { Link } from '@/i18n/navigation';
import { textAttrs } from '@/lib/text-attrs';
import { MnvrOnboardScene } from './mnvr-onboard-scene';
import { MnvrRouteScene } from './mnvr-route-scene';
import '@/styles/pages.css';
import '@/styles/mnvr.css';

const SLUG = 'mobile-nvr-mobile-surveillance';

// Re-exported for tests/unit/mnvr-page.test.ts; the steps live with the On board scene.
export { SYSTEM_STEPS } from './mnvr-onboard-scene';

/**
 * Dedicated Mobile NVR & Mobile Surveillance page (client decision 2026-10-02, P2 revision): the generic solution
 * template is replaced by a page built around the product. It opens on a charcoal hero, explains the system with a
 * scroll-driven technical cutaway (Concept A: the current step builds its part of the system on the vehicle, forwards
 * and backwards; mnvr-onboard-art.tsx), then widens to fleet level with the architecture scene (Concept B, scene id
 * mnvr-route; mnvr-architecture-art.tsx), followed by capabilities,
 * applications and the consultation CTA.
 * No motion is needed to understand it: reduced motion, no JavaScript and old browsers get the complete diagram.
 */
export async function MnvrPage({ locale }: { locale: Locale }) {
  const catalog = getCatalog(locale);
  const copy = getSolutionsCopy(locale).items[SLUG];
  const name = catalog.solutions[SLUG].name;
  const caps = copy.capabilities.items;
  const [tn, ta, ts, tc] = await Promise.all([
    getTranslations({ locale, namespace: 'nav' }),
    getTranslations({ locale, namespace: 'a11y' }),
    getTranslations({ locale, namespace: 'solution' }),
    getTranslations({ locale, namespace: 'cta' }),
  ]);
  const tx = (t: string) => textAttrs(locale, t);
  const index = solutions.findIndex((s) => s.slug === SLUG);
  const neighbours = [solutions[(index + solutions.length - 1) % solutions.length]!, solutions[(index + 1) % solutions.length]!];
  const relatedIndustries = industriesForSolution(SLUG);

  return (
    <main id="main" tabIndex={-1} data-hero="dark" className="mnvr">
      {/* 1. Hero — charcoal, headline-led */}
      <header className="mnvr-hero theme-dark bg-bg text-fg">
        <div className="container-vp">
          <Breadcrumbs items={[{ label: tn('home'), href: '/' }, { label: tn('solutions'), href: '/solutions' }, { label: name }]} label={ta('breadcrumb')} />
          <div className="mnvr-hero__body" data-reveal="">
            <span className="seam mb-6 w-12" aria-hidden="true" />
            <h1 className="t-caption mnvr-hero__name" {...tx(name)}>
              {name}
            </h1>
            <p className="t-display mnvr-hero__headline" {...tx(copy.headline)}>
              {copy.headline}
            </p>
            <div className="mnvr-hero__lede">
              <p className="t-lede" {...tx(copy.body[0]!)}>
                {copy.body[0]}
              </p>
              <p className="t-body text-fg-muted mt-4" {...tx(copy.body[1]!)}>
                {copy.body[1]}
              </p>
              <div className="mt-10">
                <LinkButton href={`/contact?type=consultation&solution=${SLUG}`} variant="primary">
                  {tc('consultation')}
                </LinkButton>
              </div>
            </div>
          </div>
        </div>
        <div className="mnvr-hero__band">
          <ImageSlot id="SOL-MNVR-HERO" locale={locale} sizes="100vw" priority />
        </div>
      </header>

      {/* 2. On board — Concept A cutaway (data-steps: MotionController sets data-current / data-reached) */}
      <section aria-labelledby="system-title" className="mnvr-system section-y">
        <div className="container-vp">
          <div className="max-w-[46rem]" data-reveal="">
            <span className="seam mb-6 w-12" aria-hidden="true" />
            <h2 id="system-title" className="t-h3" {...tx(copy.body[3]!)}>
              {copy.body[3]}
            </h2>
          </div>
          <MnvrOnboardScene locale={locale} />
        </div>
      </section>

      {/* 3. Fleet level — Concept B architecture scene on the scene engine (scene id mnvr-route) */}
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
            <p className="t-body-sm text-fg-muted" {...tx(copy.fleet.body[0]!)}>
              {copy.fleet.body[0]}
            </p>
            <p className="t-h4 mt-3" {...tx(copy.fleet.body[1]!)}>
              {copy.fleet.body[1]}
            </p>
            <p className="t-body text-fg-muted mt-6 measure" {...tx(copy.fleet.body[2]!)}>
              {copy.fleet.body[2]}
            </p>
          </div>
          <div className="mt-16 lg:mt-24">
            <MnvrRouteScene locale={locale} name={copy.fleet.title} />
          </div>
          <div className="mt-16 lg:mt-24">
            <Equation terms={copy.fleet.equation} />
          </div>
        </div>
      </section>

      {/* 4. Core capabilities — the full approved list, numbered */}
      <Section tone="canvas" labelledBy="capabilities-title">
        <div className="container-vp">
          <div data-reveal="">
            <span className="seam mb-6 w-12" aria-hidden="true" />
            <h2 id="capabilities-title" className="t-h2" {...tx(copy.capabilities.intro)}>
              {copy.capabilities.intro}
            </h2>
          </div>
          <ol className="mnvr-caps mt-12">
            {caps.map((c, i) => (
              <li key={c} style={{ '--i': i } as CSSProperties}>
                <span className="t-num" aria-hidden="true">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span {...tx(c)}>{c}</span>
              </li>
            ))}
          </ol>
        </div>
      </Section>

      {/* 5. Applications */}
      <Section tone="raised" labelledBy="applications-title">
        <div className="container-vp grid-vp gap-y-10">
          <div className="col-span-4 md:col-span-8 lg:col-span-4">
            <h2 id="applications-title" className="t-h2" {...tx(copy.fleet.applicationsTitle)}>
              {copy.fleet.applicationsTitle}
            </h2>
          </div>
          <ul className="mnvr-apps col-span-4 md:col-span-8 lg:col-span-8">
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

      {/* 6. Related (relations approved, D-19) */}
      <Section tone="canvas" labelledBy="related-title" spacing="sm">
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

      {/* 7. CTA */}
      <section aria-labelledby="cta-title" className="theme-dark bg-bg text-fg section-y-sm">
        <div className="container-vp flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <h2 id="cta-title" className="t-h2 max-w-[24ch]">
            {ts('ctaTitle', { solution: name })}
          </h2>
          <LinkButton href={`/contact?type=consultation&solution=${SLUG}`} variant="primary">
            {tc('consultation')}
          </LinkButton>
        </div>
      </section>
    </main>
  );
}
