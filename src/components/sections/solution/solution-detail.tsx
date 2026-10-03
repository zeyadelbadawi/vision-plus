import { getTranslations } from 'next-intl/server';
import type { Locale } from '@/i18n/locales';
import { getCatalog, getSolutionsCopy } from '@/content';
import { solutions, type SolutionSlug } from '@/content/data/registry';
import { pageVisibility } from '@/content/data/visibility';
import { categoriesForSolution, industriesForSolution, industrySolutions } from '@/content/data/relations';
import { scenes } from '@/content/data/scenes';
import { PageIntro } from '@/components/layout/page-intro';
import { Section } from '@/components/layout/section';
import { ImageSlot, slotVisible } from '@/components/media/image-slot';
import { CtaBand } from '@/components/sections/shared/cta-band';
import { HeroBand } from '@/components/sections/shared/hero-band';
import { PillarStrip } from '@/components/sections/shared/pillar-strip';
import { ProcessTrack } from '@/components/sections/shared/process-track';
import { RelatedRail } from '@/components/sections/shared/related-rail';
import { SceneSteps } from '@/components/sections/shared/scene-steps';
import { SpecList } from '@/components/sections/shared/spec-list';
import { StatementBand } from '@/components/sections/shared/statement-band';
import { LinkButton } from '@/components/ui/button';
import { ArrowEnd } from '@/components/ui/icons';
import { isPreview } from '@/lib/env';
import { textAttrs } from '@/lib/text-attrs';
import { CctvScene } from './cctv-scene';
import { ElvScene } from './elv-scene';
import '@/styles/pages.css';

/** The seven solutions on the shared §26.2 template. Mobile NVR has its own dedicated page (A-22, A-29). */
export type TemplateSolutionSlug = Exclude<SolutionSlug, 'mobile-nvr-mobile-surveillance'>;

/**
 * Solution detail (MASTER_PROJECT_PLAN §26.2; P5A-04): hero → context → scene → capabilities → solution module →
 * lifecycle → related → CTA. Every word is approved copy (`01` §09–§15) or approved microcopy (D-18).
 * Sections without approved content collapse instead of being filled (§19.6 "real or nothing"):
 * - Context (#2) only when the solution has body paragraphs beyond the opening one;
 * - Scene (#3) shows the scene's approved beat texts until its artwork is built in P5B (§55.3); subtle scenes
 *   without step texts (Networking, Audio Visual) have no section until then;
 * - Capabilities (#4) only where an approved list exists (ELV's approved module is its four principles, shown as
 *   its scene beats, so #5 is not repeated: §26.2 #5 "if not already covered in the scene").
 */
export async function SolutionDetail({ locale, slug }: { locale: Locale; slug: TemplateSolutionSlug }) {
  const catalog = getCatalog(locale);
  const copy = getSolutionsCopy(locale).items[slug];
  const name = catalog.solutions[slug].name;
  const entry = solutions.find((s) => s.slug === slug)!;
  const scene = scenes.find((s) => s.solution === slug);
  const [tn, ta, ts, tc] = await Promise.all([
    getTranslations({ locale, namespace: 'nav' }),
    getTranslations({ locale, namespace: 'a11y' }),
    getTranslations({ locale, namespace: 'solution' }),
    getTranslations({ locale, namespace: 'cta' }),
  ]);

  // Relations were approved as is (D-19); product categories only while the Products page is visible (Q-02).
  const showRelations = isPreview || industrySolutions.status === 'approved';
  const relatedIndustries = showRelations ? industriesForSolution(slug) : [];
  const relatedCategories = showRelations && pageVisibility.products ? categoriesForSolution(slug) : [];
  const index = solutions.findIndex((s) => s.slug === slug);
  const neighbours = [solutions[(index + solutions.length - 1) % solutions.length]!, solutions[(index + 1) % solutions.length]!];
  const [opening, ...context] = copy.body;
  const tx = (t: string | undefined) => textAttrs(locale, t);
  const detailId = entry.detail;
  const hasSteps = scene?.beats.some((b) => b.title) ?? false;

  return (
    <main id="main" tabIndex={-1} className="solution">
      {/* 1. Hero (on mobile the image comes first, §26.2 #1) */}
      <div className="solution-hero">
        <PageIntro
          locale={locale}
          crumbs={[{ label: tn('home'), href: '/' }, { label: tn('solutions'), href: '/solutions' }, { label: name }]}
          crumbsLabel={ta('breadcrumb')}
          title={name}
        >
          <p className="t-display solution__headline" {...tx(copy.headline)}>
            {copy.headline}
          </p>
          {opening && (
            <p className="t-lede mt-8 max-w-[40rem]" {...tx(opening)}>
              {opening}
            </p>
          )}
        </PageIntro>
        <HeroBand locale={locale} id={entry.hero} />
      </div>

      {/* 2. Context */}
      {context.length > 0 && (
        <Section tone="canvas" labelledBy="context-title">
          <div className="container-vp grid-vp gap-y-12">
            <div className="col-span-4 md:col-span-8 lg:col-span-6">
              <h2 id="context-title" className="sr-only" {...tx(name)}>
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
            {slotVisible(detailId) && (
              <div className="col-span-4 md:col-span-8 lg:col-span-5 lg:col-start-8">
                <ImageSlot id={detailId} locale={locale} sizes="(min-width: 1024px) 40vw, 100vw" />
              </div>
            )}
          </div>
        </Section>
      )}

      {/* 3. Scene: the live scene once its artwork is built (P5B), else the approved beat texts on their own */}
      {scene && hasSteps && (
        <Section tone="raised" labelledBy="scene-title">
          <div className="container-vp">
            {'principles' in copy ? (
              <div data-reveal="">
                <span className="seam mb-6 w-12" aria-hidden="true" />
                <h2 id="scene-title" className="t-h2" {...tx(copy.principles.intro)}>
                  {copy.principles.intro}
                </h2>
              </div>
            ) : (
              <h2 id="scene-title" className="sr-only" {...tx(copy.headline)}>
                {copy.headline}
              </h2>
            )}
            <div className="mt-12">
              {scene.id === 'elv-one-infrastructure' ? (
                <ElvScene locale={locale} scene={scene} name={name} />
              ) : scene.id === 'cctv-see-know-respond' ? (
                <CctvScene locale={locale} scene={scene} name={name} />
              ) : (
                <SceneSteps locale={locale} scene={scene} />
              )}
            </div>
          </div>
        </Section>
      )}

      {/* 4. Capabilities */}
      {'capabilities' in copy && (
        <Section tone="canvas" labelledBy="capabilities-title">
          <div className="container-vp">
            <div data-reveal="">
              <span className="seam mb-6 w-12" aria-hidden="true" />
              <h2 id="capabilities-title" className="t-h2" {...tx(copy.capabilities.intro)}>
                {copy.capabilities.intro}
              </h2>
            </div>
            <SpecList locale={locale} items={copy.capabilities.items} className="mt-12" />
          </div>
        </Section>
      )}

      {/* 5. Solution-specific module (§26.2 #5) */}
      {'values' in copy && (
        <StatementBand locale={locale} id="module-title" statement={copy.closingLead} size="h2">
          <PillarStrip locale={locale} items={copy.values} />
        </StatementBand>
      )}
      {'closing' in copy && (
        <StatementBand
          locale={locale}
          id="module-title"
          statement={copy.closing}
          size={'closingLead' in copy ? 'display' : 'h2'}
          lead={'closingLead' in copy ? copy.closingLead : undefined}
        />
      )}

      {/* 6. Delivered through our lifecycle */}
      <Section tone="canvas" labelledBy="lifecycle-title">
        <div className="container-vp">
          <div data-reveal="">
            <span className="seam mb-6 w-12" aria-hidden="true" />
            <h2 id="lifecycle-title" className="t-h2">
              {ts('lifecycleTitle')}
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

      {/* 7. Related (projects appear once real projects are published, D-10) */}
      <Section tone="raised" labelledBy="related-title" spacing="sm">
        <div className="container-vp">
          <h2 id="related-title" className="t-h2">
            {ts('related')}
          </h2>
          <div className="mt-10">
            <RelatedRail
              locale={locale}
              groups={[
                {
                  title: ts('relatedIndustries'),
                  links: relatedIndustries.map((i) => ({ href: `/industries#${i}`, label: catalog.industries[i].name })),
                },
                {
                  title: ts('relatedCategories'),
                  links: relatedCategories.map((c) => ({ href: `/products#${c}`, label: catalog.productCategories[c].name })),
                },
                {
                  title: ts('otherSolutions'),
                  links: neighbours.map((s) => ({ href: `/solutions/${s.slug}`, label: catalog.solutions[s.slug].name })),
                },
              ]}
            />
          </div>
        </div>
      </Section>

      {/* 8. CTA band, pre-filled with this solution */}
      <CtaBand
        locale={locale}
        id="cta-title"
        title={ts('ctaTitle', { solution: name })}
        action={{ href: `/contact?type=consultation&solution=${slug}`, label: tc('consultation') }}
      />
    </main>
  );
}
