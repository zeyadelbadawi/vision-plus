import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import type { Locale } from '@/i18n/locales';
import { getPartnersCopy } from '@/content';
import { TemplatePage } from '@/components/layout/template-page';
import { pageMetadata } from '@/lib/metadata';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  return pageMetadata((await params).locale as Locale, 'partners');
}

/** Technology Partners — P3 empty template. Partner names/logos come only from the client (D-08). */
export default async function PartnersPage({ params }: { params: Promise<{ locale: string }> }) {
  const locale = (await params).locale as Locale;
  setRequestLocale(locale);
  const tn = await getTranslations({ locale, namespace: 'nav' });
  const p = getPartnersCopy(locale);
  return (
    <TemplatePage
      locale={locale}
      crumbs={[{ label: tn('home'), href: '/' }, { label: tn('about'), href: '/about' }, { label: p.eyebrow }]}
      eyebrow={p.eyebrow}
      title={p.title}
      lede={p.body[0]}
    />
  );
}
