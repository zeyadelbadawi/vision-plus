import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import type { Locale } from '@/i18n/locales';
import { getCatalog, getSolutionsCopy } from '@/content';
import { solutions } from '@/content/data/registry';
import { TemplatePage } from '@/components/layout/template-page';
import { pageMetadata } from '@/lib/metadata';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  return pageMetadata((await params).locale as Locale, 'solutionsHub');
}

/** Solutions hub — P3 empty template (§49.1 P3); the hub layout (§26.3) is P5. */
export default async function SolutionsPage({ params }: { params: Promise<{ locale: string }> }) {
  const locale = (await params).locale as Locale;
  setRequestLocale(locale);
  const tn = await getTranslations({ locale, namespace: 'nav' });
  const { hub } = getSolutionsCopy(locale);
  const c = getCatalog(locale);
  return (
    <TemplatePage
      locale={locale}
      crumbs={[{ label: tn('home'), href: '/' }, { label: tn('solutions') }]}
      eyebrow={hub.eyebrow}
      title={hub.title}
      lede={hub.lede}
      links={solutions.map((s) => ({ href: `/solutions/${s.slug}`, label: c.solutions[s.slug].name }))}
    />
  );
}
