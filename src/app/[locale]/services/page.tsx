import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import type { Locale } from '@/i18n/locales';
import { getCatalog, getServicesCopy } from '@/content';
import { services } from '@/content/data/registry';
import { TemplatePage } from '@/components/layout/template-page';
import { pageMetadata } from '@/lib/metadata';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  return pageMetadata((await params).locale as Locale, 'services');
}

/** Services — P3 empty template with the 6 service anchors and #approach (§26.5 layout is P5). */
export default async function ServicesPage({ params }: { params: Promise<{ locale: string }> }) {
  const locale = (await params).locale as Locale;
  setRequestLocale(locale);
  const tn = await getTranslations({ locale, namespace: 'nav' });
  const c = getCatalog(locale);
  const copy = getServicesCopy(locale);
  return (
    <TemplatePage
      locale={locale}
      crumbs={[{ label: tn('home'), href: '/' }, { label: tn('services') }]}
      eyebrow={copy.hero.eyebrow}
      title={copy.hero.title}
      lede={copy.hero.lede}
      sections={[...services.map((s) => ({ id: s, title: c.services[s].name })), { id: 'approach', title: copy.approach.title }]}
    />
  );
}
