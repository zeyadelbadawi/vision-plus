import { getTranslations } from 'next-intl/server';
import type { Locale } from '@/i18n/locales';
import { getCatalog, getHome } from '@/content';
import { solutions } from '@/content/data/registry';
import { Section, SectionHeading } from '@/components/layout/section';
import { IntegrationSystem } from './integration-system';

export async function HomeIntegration({ locale }: { locale: Locale }) {
  const { integration } = getHome(locale);
  const c = getCatalog(locale);
  const ta = await getTranslations({ locale, namespace: 'a11y' });
  return (
    <Section tone="raised" labelledBy="integration-title">
      <div className="container-vp">
        <SectionHeading id="integration-title" title={integration.title} lede={integration.lede} />
        <div className="mt-16 lg:mt-24">
          <IntegrationSystem
            origin="VISION PLUS"
            label={ta('solutionsDiagram')}
            nodes={solutions.map((s) => ({
              slug: s.slug,
              href: `/solutions/${s.slug}`,
              name: c.solutions[s.slug].name,
              summary: c.solutions[s.slug].summary,
            }))}
          />
        </div>
      </div>
    </Section>
  );
}
