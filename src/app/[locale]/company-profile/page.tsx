import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import type { Locale } from '@/i18n/locales';
import { getSeoCopy } from '@/content';
import { TemplatePage } from '@/components/layout/template-page';
import { pageMetadata } from '@/lib/metadata';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  return pageMetadata((await params).locale as Locale, 'companyProfile');
}

/** Company Profile — P3 empty template. The Canva embed needs the client's embed code (D-06). */
export default async function CompanyProfilePage({ params }: { params: Promise<{ locale: string }> }) {
  const locale = (await params).locale as Locale;
  setRequestLocale(locale);
  const [tn, tp] = await Promise.all([getTranslations({ locale, namespace: 'nav' }), getTranslations({ locale, namespace: 'pending' })]);
  return (
    <TemplatePage
      locale={locale}
      crumbs={[{ label: tn('home'), href: '/' }, { label: tn('about'), href: '/about' }, { label: tn('aboutLinks.companyProfile') }]}
      title={getSeoCopy(locale).companyProfile.title}
      lede={tp('companyProfile')}
    />
  );
}
