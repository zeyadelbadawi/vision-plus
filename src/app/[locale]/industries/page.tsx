import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import type { Locale } from '@/i18n/locales';
import { getCatalog, getIndustriesCopy } from '@/content';
import { industries } from '@/content/data/registry';
import { TemplatePage } from '@/components/layout/template-page';
import { pageMetadata } from '@/lib/metadata';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  return pageMetadata((await params).locale as Locale, 'industries');
}

/** Industries — P3 empty template with the 11 anchors (§26.4 explorer is P5). */
export default async function IndustriesPage({ params }: { params: Promise<{ locale: string }> }) {
  const locale = (await params).locale as Locale;
  setRequestLocale(locale);
  const tn = await getTranslations({ locale, namespace: 'nav' });
  const c = getCatalog(locale);
  const { hero } = getIndustriesCopy(locale);
  return (
    <TemplatePage
      locale={locale}
      crumbs={[{ label: tn('home'), href: '/' }, { label: tn('industries') }]}
      eyebrow={hero.eyebrow}
      title={hero.title}
      sections={industries.map((i) => ({ id: i.slug, title: c.industries[i.slug].name }))}
    />
  );
}
