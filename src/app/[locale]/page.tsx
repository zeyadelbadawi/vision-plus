import { setRequestLocale } from 'next-intl/server';
import type { Locale } from '@/i18n/locales';
import { HomeHero } from '@/components/sections/home/hero';
import { HomePositioning } from '@/components/sections/home/positioning';
import { HomeIntegration } from '@/components/sections/home/integration';
import { HomeMobileNvr } from '@/components/sections/home/mobile-nvr';
import { HomeApproach } from '@/components/sections/home/approach';
import { HomeIndustries } from '@/components/sections/home/industries';
import { HomeWhy } from '@/components/sections/home/why';
import { HomeProjects } from '@/components/sections/home/projects-preview';
import { HomePartners } from '@/components/sections/home/partners';
import { HomeJourney } from '@/components/sections/home/journey';
import { HomeClosing } from '@/components/sections/home/closing';

/**
 * Homepage (MASTER_PROJECT_PLAN §26.1). Narrative order:
 * Hero → Positioning → Integration system → Mobile NVR → Approach → Industries → Why →
 * Projects → Partners → Journey → Closing. `data-hero="dark"` lets the header float over the hero.
 */
export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: raw } = await params;
  const locale = raw as Locale;
  setRequestLocale(locale);
  return (
    <main id="main" data-hero="dark" tabIndex={-1}>
      <HomeHero locale={locale} />
      <HomePositioning locale={locale} />
      <HomeIntegration locale={locale} />
      <HomeMobileNvr locale={locale} />
      <HomeApproach locale={locale} />
      <HomeIndustries locale={locale} />
      <HomeWhy locale={locale} />
      <HomeProjects locale={locale} />
      <HomePartners locale={locale} />
      <HomeJourney locale={locale} />
      <HomeClosing locale={locale} />
    </main>
  );
}
