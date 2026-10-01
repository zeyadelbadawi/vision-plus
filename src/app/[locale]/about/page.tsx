import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import type { Locale } from '@/i18n/locales';
import { getAboutCopy, getCompany } from '@/content';
import { TemplatePage } from '@/components/layout/template-page';
import { pageMetadata } from '@/lib/metadata';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  return pageMetadata((await params).locale as Locale, 'about');
}

/** About — P3 empty template with the section anchors the menu links to (§26.8 layout is P5). */
export default async function AboutPage({ params }: { params: Promise<{ locale: string }> }) {
  const locale = (await params).locale as Locale;
  setRequestLocale(locale);
  const tn = await getTranslations({ locale, namespace: 'nav' });
  const a = getAboutCopy(locale);
  return (
    <TemplatePage
      locale={locale}
      crumbs={[{ label: tn('home'), href: '/' }, { label: tn('about') }]}
      eyebrow={a.whoWeAre.eyebrow}
      title={a.whoWeAre.title}
      lede={a.whoWeAre.body[0]}
      sections={[
        { id: 'who-we-are', title: a.whoWeAre.eyebrow },
        { id: 'journey', title: a.journey.title },
        { id: 'vision', title: a.vision.title },
        { id: 'mission', title: a.mission.title },
        { id: 'values', title: a.values.eyebrow },
        { id: 'philosophy', title: a.philosophy.title },
        { id: 'why-vision-plus', title: getCompany(locale).why.title },
      ]}
    />
  );
}
