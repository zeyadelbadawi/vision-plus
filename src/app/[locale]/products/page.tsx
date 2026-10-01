import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import type { Locale } from '@/i18n/locales';
import { getCatalog, getProductsCopy } from '@/content';
import { productCategories } from '@/content/data/registry';
import { TemplatePage } from '@/components/layout/template-page';
import { pageMetadata } from '@/lib/metadata';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  return pageMetadata((await params).locale as Locale, 'products');
}

/** Products — P3 empty template with the category anchors the menu links to (§26.6 layout is P5). */
export default async function ProductsPage({ params }: { params: Promise<{ locale: string }> }) {
  const locale = (await params).locale as Locale;
  setRequestLocale(locale);
  const tn = await getTranslations({ locale, namespace: 'nav' });
  const c = getCatalog(locale);
  return (
    <TemplatePage
      locale={locale}
      crumbs={[{ label: tn('home'), href: '/' }, { label: tn('products') }]}
      title={getProductsCopy(locale).hero.title}
      sections={productCategories.map((slug) => ({ id: slug, title: c.productCategories[slug].name }))}
    />
  );
}
