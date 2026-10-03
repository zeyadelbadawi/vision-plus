import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import type { Locale } from '@/i18n/locales';
import { getCatalog, getHome, getProjectsCopy, getSamplesCopy } from '@/content';
import { projects } from '@/content/data/registry';
import { sampleProjects } from '@/content/data/samples';
import { Link } from '@/i18n/navigation';
import { PageIntro } from '@/components/layout/page-intro';
import { Section } from '@/components/layout/section';
import { ImageSlot } from '@/components/media/image-slot';
import { CtaBand } from '@/components/sections/shared/cta-band';
import { HeroBand } from '@/components/sections/shared/hero-band';
import { ArrowEnd } from '@/components/ui/icons';
import { isPreview } from '@/lib/env';
import { pageMetadata } from '@/lib/metadata';
import { textAttrs } from '@/lib/text-attrs';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  return pageMetadata((await params).locale as Locale, 'projects');
}

/**
 * Projects hub (MASTER_PROJECT_PLAN §26.7, P5A-08; notes §55.3.11). No real project exists (D-10): production shows
 * the approved §22 hero only (placeholder text never ships, site:check); before launch the samples are replaced by
 * real projects or the page is hidden (Q-12). Preview shows the four ILLUSTRATIVE SAMPLES (Q-12,
 * data/samples.ts), each labelled and marked `data-sample` (site:check fails a production build containing one).
 * The filter bar appears only with ≥ 6 published projects (§26.7), so it is not built yet.
 */
export default async function ProjectsPage({ params }: { params: Promise<{ locale: string }> }) {
  const locale = (await params).locale as Locale;
  setRequestLocale(locale);
  const [tn, ta, tc, tph] = await Promise.all([
    getTranslations({ locale, namespace: 'nav' }),
    getTranslations({ locale, namespace: 'a11y' }),
    getTranslations({ locale, namespace: 'cta' }),
    getTranslations({ locale, namespace: 'placeholder' }),
  ]);
  const { hero, fields } = getProjectsCopy(locale);
  const catalog = getCatalog(locale);
  const samples = getSamplesCopy(locale);
  const { closing } = getHome(locale);
  const tx = (t: string | undefined) => textAttrs(locale, t);
  const listSep = locale === 'zh' ? '、' : locale === 'ar' ? '، ' : ', ';
  const showSamples = isPreview && projects.length === 0;

  return (
    <main id="main" tabIndex={-1} className="projects">
      <PageIntro
        locale={locale}
        crumbs={[{ label: tn('home'), href: '/' }, { label: tn('projects') }]}
        crumbsLabel={ta('breadcrumb')}
        eyebrow={hero.eyebrow}
        title={hero.title}
        lede={hero.body[0]}
      >
        <p className="t-body mt-4 max-w-[44rem] text-fg-muted" {...tx(hero.body[1])}>
          {hero.body[1]}
        </p>
      </PageIntro>
      <HeroBand locale={locale} id="PROJ-HUB-HERO" />

      <Section tone="canvas" labelledBy="projects-list-title">
        <div className="container-vp">
          <h2 id="projects-list-title" className="sr-only">
            {tn('projects')}
          </h2>
          {showSamples && (
            <>
              <ul className="project-cards">
                {sampleProjects.map((p) => {
                  const name = samples.projects[p.slug as keyof typeof samples.projects].name;
                  return (
                    <li key={p.slug} className="project-card" data-sample="">
                      <ImageSlot id="PROJ-{slug}-COVER" locale={locale} sizes="(min-width: 768px) 50vw, 100vw" />
                      <p className="sample-tag mt-6">{samples.label}</p>
                      <h3 className="t-h3 mt-3">
                        <Link href={`/projects/${p.slug}`} className="project-card__link" {...tx(name)}>
                          {name}
                        </Link>
                      </h3>
                      <dl className="project-card__facts">
                        <div>
                          <dt>{fields.clientSector}</dt>
                          <dd {...tx(catalog.industries[p.industry].name)}>{catalog.industries[p.industry].name}</dd>
                        </div>
                        <div>
                          <dt>{fields.solutions}</dt>
                          <dd>{p.solutions.map((s) => catalog.solutions[s].name).join(listSep)}</dd>
                        </div>
                      </dl>
                      <ArrowEnd size={20} className="project-card__arrow" />
                    </li>
                  );
                })}
              </ul>
              <p className="placeholder-note project-note">{tph('projectNote')}</p>
            </>
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
