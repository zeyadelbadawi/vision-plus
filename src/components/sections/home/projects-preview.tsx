import { getTranslations } from 'next-intl/server';
import type { Locale } from '@/i18n/locales';
import { getHome } from '@/content';
import { previewSlots, projects } from '@/content/data/registry';
import { Section, SectionHeading } from '@/components/layout/section';
import { ImageSlot } from '@/components/media/image-slot';
import { LinkButton } from '@/components/ui/button';
import { ArrowEnd } from '@/components/ui/icons';
import { isPreview } from '@/lib/env';
import { cn } from '@/lib/cn';

/**
 * Projects preview (§26.1 #8). NO project data exists yet (D-10) and none may be invented.
 * Production: hidden until real projects are published. Preview: the approved section copy plus
 * structural slots showing the approved project data model (01 §22) — clearly marked as pending.
 */
export async function HomeProjects({ locale }: { locale: Locale }) {
  if (projects.length === 0 && !isPreview) return null;
  const { projects: copy } = getHome(locale);
  const [tp, tc] = await Promise.all([getTranslations({ locale, namespace: 'placeholder' }), getTranslations({ locale, namespace: 'cta' })]);
  const [, location, clientSector, solutionsDelivered, , year] = copy.fields;
  const facts = [location, clientSector, solutionsDelivered, year];

  return (
    <Section tone="raised" labelledBy="projects-title">
      <div className="container-vp">
        <div className="grid-vp gap-y-8">
          <SectionHeading id="projects-title" title={copy.title} className="col-span-4 md:col-span-8 lg:col-span-6" />
          <div className="col-span-4 md:col-span-8 lg:col-span-5 lg:col-start-8 lg:self-end">
            <p className="t-lede">{copy.body[0]}</p>
            <p className="t-body mt-4 text-fg-muted">{copy.body[1]}</p>
          </div>
        </div>

        {/* Scrollable on mobile → focusable so keyboard users can scroll it (WCAG 2.1.1) */}
        <ul className="projects-grid mt-14 lg:mt-20" tabIndex={0} aria-label={copy.title}>
          {Array.from({ length: previewSlots.projects }, (_, i) => (
            <li key={i} className={cn('project-slot', i === 0 && 'project-slot--lead')}>
              <ImageSlot
                id="PROJ-{slug}-COVER"
                locale={locale}
                sizes={i === 0 ? '(min-width: 1024px) 752px, 100vw' : '(min-width: 1024px) 528px, 100vw'}
                labelAlign="bottom-start"
              />
              <div className="project-slot__body">
                <p className="project-slot__title">{tp('projectPending')}</p>
                <dl className="project-slot__facts">
                  {facts.map((f) => (
                    <div key={f}>
                      <dt>{f}</dt>
                      <dd>
                        <span aria-hidden="true">—</span>
                        <span className="sr-only">{tp('projectPending')}</span>
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>
            </li>
          ))}
        </ul>

        <div className="mt-10 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <p className="placeholder-note">{tp('projectNote')}</p>
          <LinkButton href="/projects" variant="text">
            {tc('viewProjects')}
            <ArrowEnd size={16} />
          </LinkButton>
        </div>
      </div>
    </Section>
  );
}
