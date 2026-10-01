import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import type { Locale } from '@/i18n/locales';
import { getCatalog, getSolutionsCopy } from '@/content';
import { solutions, type SolutionSlug } from '@/content/data/registry';
import { SolutionDetail } from '@/components/sections/solution/solution-detail';
import { TemplatePage } from '@/components/layout/template-page';
import { solutionMetadata } from '@/lib/metadata';

export const dynamicParams = false;

export function generateStaticParams() {
  return solutions.map((s) => ({ slug: s.slug }));
}

/**
 * The full solution template is enabled for Mobile NVR only — the P2 design-direction proof
 * (MASTER_PROJECT_PLAN §49.1 P2). The other seven solutions get the P3 empty template until P5.
 */
const FULL_TEMPLATE = new Set<SolutionSlug>(['mobile-nvr-mobile-surveillance']);
const isSlug = (s: string): s is SolutionSlug => solutions.some((x) => x.slug === s);

export async function generateMetadata({ params }: { params: Promise<{ locale: string; slug: string }> }): Promise<Metadata> {
  const { locale, slug } = await params;
  return isSlug(slug) ? solutionMetadata(locale as Locale, slug) : {};
}

export default async function SolutionPage({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale: raw, slug } = await params;
  const locale = raw as Locale;
  setRequestLocale(locale);
  if (!isSlug(slug)) notFound();
  if (slug === 'mobile-nvr-mobile-surveillance' && FULL_TEMPLATE.has(slug)) return <SolutionDetail locale={locale} slug={slug} />;

  const tn = await getTranslations({ locale, namespace: 'nav' });
  const name = getCatalog(locale).solutions[slug].name;
  return (
    <TemplatePage
      locale={locale}
      crumbs={[{ label: tn('home'), href: '/' }, { label: tn('solutions'), href: '/solutions' }, { label: name }]}
      title={name}
      lede={getSolutionsCopy(locale).items[slug].headline}
    />
  );
}
