import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import type { Locale } from '@/i18n/locales';
import { getCatalog, getSolutionsCopy } from '@/content';
import { solutions, type SolutionSlug } from '@/content/data/registry';
import { MnvrPage } from '@/components/sections/solution/mnvr-page';
import { TemplatePage } from '@/components/layout/template-page';
import { solutionMetadata } from '@/lib/metadata';

export const dynamicParams = false;

export function generateStaticParams() {
  return solutions.map((s) => ({ slug: s.slug }));
}

/**
 * Mobile NVR has its own dedicated page (client decision 2026-10-02: the P2 page built on the generic §26.2 template
 * was not accepted; a distinctive page with a small scroll-triggered animation was requested). The other seven
 * solutions keep the P3 empty template until P5, which will use the §26.2 template (solution-detail.tsx).
 */
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
  if (slug === 'mobile-nvr-mobile-surveillance') return <MnvrPage locale={locale} />;

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
