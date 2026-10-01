import { getTranslations } from 'next-intl/server';
import type { Locale } from '@/i18n/locales';
import { getCatalog, getHome } from '@/content';
import { industries } from '@/content/data/registry';
import { Section, SectionHeading } from '@/components/layout/section';
import { ImageSlot } from '@/components/media/image-slot';
import { LinkButton } from '@/components/ui/button';
import { ArrowEnd } from '@/components/ui/icons';
import { IndustryIndex } from './industry-index';

export async function HomeIndustries({ locale }: { locale: Locale }) {
  const { industries: copy } = getHome(locale);
  const c = getCatalog(locale);
  const tc = await getTranslations({ locale, namespace: 'cta' });
  return (
    <Section tone="raised" labelledBy="industries-title">
      <div className="container-vp">
        <SectionHeading id="industries-title" title={copy.title} className="max-w-[48rem]" />
        <div className="mt-14 lg:mt-20">
          <IndustryIndex
            items={industries.map((i) => ({
              slug: i.slug,
              href: `/industries#${i.slug}`,
              name: c.industries[i.slug].name,
              summary: c.industries[i.slug].summary,
            }))}
            media={industries.map((i) => (
              <ImageSlot key={i.slug} id={i.image} locale={locale} sizes="(min-width: 1440px) 528px, 36vw" />
            ))}
            thumbs={industries.map((i) => (
              <ImageSlot key={i.slug} id={i.image} locale={locale} sizes="72px" compact />
            ))}
          />
        </div>
        <div className="mt-12">
          <LinkButton href="/industries" variant="text">
            {tc('allIndustries')}
            <ArrowEnd size={16} />
          </LinkButton>
        </div>
      </div>
    </Section>
  );
}
