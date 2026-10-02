import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';
import type { Locale } from '@/i18n/locales';
import { solutions, type SolutionSlug } from '@/content/data/registry';
import { MnvrPage } from '@/components/sections/solution/mnvr-page';
import { SolutionDetail } from '@/components/sections/solution/solution-detail';
import { solutionMetadata } from '@/lib/metadata';

export const dynamicParams = false;

export function generateStaticParams() {
  return solutions.map((s) => ({ slug: s.slug }));
}

/**
 * Mobile NVR has its own dedicated page (client decision 2026-10-02: the P2 page built on the generic §26.2 template
 * was not accepted; a distinctive page with a small scroll-triggered animation was requested). The other seven
 * solutions use the §26.2 template (solution-detail.tsx, P5A-04); their scenes follow in P5B.
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
  return <SolutionDetail locale={locale} slug={slug} />;
}
