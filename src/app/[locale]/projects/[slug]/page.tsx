import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import type { Locale } from '@/i18n/locales';
import { getCatalog, getHome, getProjectsCopy, getSamplesCopy } from '@/content';
import { sampleProjects } from '@/content/data/samples';
import { UNPUBLISHED_SLUG } from '@/content/data/visibility';
import { Link } from '@/i18n/navigation';
import { PageIntro } from '@/components/layout/page-intro';
import { Section } from '@/components/layout/section';
import { ImageSlot } from '@/components/media/image-slot';
import { ProjectGallery } from '@/components/sections/projects/project-gallery';
import { CtaBand } from '@/components/sections/shared/cta-band';
import { HeroBand } from '@/components/sections/shared/hero-band';
import { RelatedRail } from '@/components/sections/shared/related-rail';
import { LinkButton } from '@/components/ui/button';
import { ArrowEnd } from '@/components/ui/icons';
import { isPreview } from '@/lib/env';
import { textAttrs } from '@/lib/text-attrs';

export const dynamicParams = false;

/**
 * Project detail (MASTER_PROJECT_PLAN §26.7, §35, P5A-08; notes §55.3.11). No real project exists (D-10), so only
 * the four ILLUSTRATIVE SAMPLES (Q-12) have pages, and only in preview builds. When real projects arrive they get the
 * §35 data model (including the confidential-client option) and replace the samples here.
 */
const slugs = isPreview ? sampleProjects.map((p) => p.slug) : [];

export function generateStaticParams() {
  // nothing to publish (production, D-10): one placeholder entry that 404s and postbuild removes (UNPUBLISHED_SLUG)
  return (slugs.length ? slugs : [UNPUBLISHED_SLUG]).map((slug) => ({ slug }));
}

/** Gallery placeholders per sample: the manifest's minimum of 4 (`PROJ-{slug}-GALLERY-{nn}`, F8, P2). */
const GALLERY_SLOTS = 4;

type SampleSlug = keyof ReturnType<typeof getSamplesCopy>['projects'];

export async function generateMetadata({ params }: { params: Promise<{ locale: string; slug: string }> }): Promise<Metadata> {
  const { locale, slug } = await params;
  const project = getSamplesCopy(locale as Locale).projects[slug as SampleSlug];
  return project ? { title: project.name, description: project.scope, robots: { index: false, follow: false } } : {};
}

export default async function ProjectPage({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale: raw, slug } = await params;
  const locale = raw as Locale;
  setRequestLocale(locale);
  const index = sampleProjects.findIndex((p) => p.slug === slug);
  if (!isPreview || index < 0) notFound();
  const project = sampleProjects[index]!;
  const next = sampleProjects[(index + 1) % sampleProjects.length]!;

  const [tn, ta, tc, tpr, ti] = await Promise.all([
    getTranslations({ locale, namespace: 'nav' }),
    getTranslations({ locale, namespace: 'a11y' }),
    getTranslations({ locale, namespace: 'cta' }),
    getTranslations({ locale, namespace: 'projects' }),
    getTranslations({ locale, namespace: 'industries' }),
  ]);
  const catalog = getCatalog(locale);
  const { fields } = getProjectsCopy(locale);
  const samples = getSamplesCopy(locale);
  const { closing } = getHome(locale);
  const tx = (t: string | undefined) => textAttrs(locale, t);
  const copy = samples.projects[slug as SampleSlug];
  const nextName = samples.projects[next.slug as SampleSlug].name;
  const industry = catalog.industries[project.industry].name;
  const gallery = Array.from({ length: GALLERY_SLOTS }, (_, i) => i);

  return (
    <main id="main" tabIndex={-1} className="project" data-sample="">
      <PageIntro
        locale={locale}
        crumbs={[{ label: tn('home'), href: '/' }, { label: tn('projects'), href: '/projects' }, { label: copy.name }]}
        crumbsLabel={ta('breadcrumb')}
        title={copy.name}
      >
        <p className="sample-tag mt-6">{samples.label}</p>
      </PageIntro>
      <HeroBand locale={locale} id="PROJ-{slug}-HERO" />

      {/* Facts (§35: a <dl>) and scope of work */}
      <Section tone="canvas" labelledBy="facts-title">
        <div className="container-vp grid-vp gap-y-12">
          <div className="col-span-4 md:col-span-8 lg:col-span-4">
            <h2 id="facts-title" className="t-caption text-fg-muted">
              {tpr('facts')}
            </h2>
            <dl className="project-facts">
              <div>
                <dt>{fields.location}</dt>
                <dd>{samples.projectFacts.location}</dd>
              </div>
              <div>
                <dt>{fields.clientSector}</dt>
                <dd>
                  {samples.projectFacts.client} · <span {...tx(industry)}>{industry}</span>
                </dd>
              </div>
              <div>
                <dt>{fields.solutions}</dt>
                <dd>
                  <ul className="project-facts__links">
                    {project.solutions.map((s) => (
                      <li key={s}>
                        <Link href={`/solutions/${s}`} className="link-text" {...tx(catalog.solutions[s].name)}>
                          {catalog.solutions[s].name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </dd>
              </div>
              <div>
                <dt>{fields.year}</dt>
                <dd className="t-num">{samples.projectFacts.year}</dd>
              </div>
            </dl>
          </div>
          <div className="col-span-4 md:col-span-8 lg:col-span-7 lg:col-start-6">
            <h2 id="scope-title" className="t-h2" {...tx(fields.scope)}>
              {fields.scope}
            </h2>
            <p className="t-lede mt-6 measure" {...tx(copy.scope)}>
              {copy.scope}
            </p>
          </div>
        </div>
      </Section>

      {/* Gallery: placeholders for review (F8; production hides a gallery without images) */}
      <Section tone="raised" labelledBy="gallery-title">
        <div className="container-vp">
          <h2 id="gallery-title" className="t-h2">
            {tpr('gallery.label')}
          </h2>
          <div className="mt-10">
            <ProjectGallery
              thumbs={gallery.map((i) => (
                <span key={i} className="gallery__frame">
                  <ImageSlot id="PROJ-{slug}-GALLERY-{nn}" locale={locale} sizes="(min-width: 1024px) 25vw, 50vw" fill compact />
                </span>
              ))}
              slides={gallery.map((i) => (
                <span key={i} className="gallery__frame gallery__frame--large">
                  <ImageSlot id="PROJ-{slug}-GALLERY-{nn}" locale={locale} sizes="100vw" fill />
                </span>
              ))}
              labels={{
                label: tpr('gallery.label'),
                open: gallery.map((i) => tpr('gallery.open', { n: i + 1, total: GALLERY_SLOTS })),
                previous: tpr('gallery.previous'),
                next: tpr('gallery.next'),
                close: tpr('gallery.close'),
              }}
            />
          </div>
        </div>
      </Section>

      {/* Related solutions and the next project */}
      <Section tone="canvas" labelledBy="related-title" spacing="sm">
        <div className="container-vp">
          <h2 id="related-title" className="sr-only">
            {ti('relatedSolutions')}
          </h2>
          <RelatedRail
            locale={locale}
            groups={[
              {
                title: ti('relatedSolutions'),
                links: project.solutions.map((s) => ({ href: `/solutions/${s}`, label: catalog.solutions[s].name })),
              },
            ]}
          />
          <div className="project-next">
            <p className="t-caption text-fg-muted">{tpr('nextProject')}</p>
            <LinkButton href={`/projects/${next.slug}`} variant="text">
              <span {...tx(nextName)}>{nextName}</span>
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
