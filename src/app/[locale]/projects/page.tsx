import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import type { Locale } from '@/i18n/locales';
import { getProjectsCopy } from '@/content';
import { TemplatePage } from '@/components/layout/template-page';
import { pageMetadata } from '@/lib/metadata';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  return pageMetadata((await params).locale as Locale, 'projects');
}

/** Projects — P3 empty template. No project data exists (D-10); nothing is invented. */
export default async function ProjectsPage({ params }: { params: Promise<{ locale: string }> }) {
  const locale = (await params).locale as Locale;
  setRequestLocale(locale);
  const tn = await getTranslations({ locale, namespace: 'nav' });
  const { hero } = getProjectsCopy(locale);
  return (
    <TemplatePage
      locale={locale}
      crumbs={[{ label: tn('home'), href: '/' }, { label: tn('projects') }]}
      eyebrow={hero.eyebrow}
      title={hero.title}
      lede={hero.body[0]}
    />
  );
}
