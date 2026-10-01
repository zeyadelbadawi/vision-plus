import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import type { Locale } from '@/i18n/locales';
import { getContactCopy } from '@/content';
import { TemplatePage } from '@/components/layout/template-page';
import { pageMetadata } from '@/lib/metadata';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  return pageMetadata((await params).locale as Locale, 'contact');
}

/** Contact — P3 empty template with #inquiry and #locations. The form is P6; office data is D-01–D-03. */
export default async function ContactPage({ params }: { params: Promise<{ locale: string }> }) {
  const locale = (await params).locale as Locale;
  setRequestLocale(locale);
  const [tn, tf] = await Promise.all([getTranslations({ locale, namespace: 'nav' }), getTranslations({ locale, namespace: 'form' })]);
  const c = getContactCopy(locale);
  return (
    <TemplatePage
      locale={locale}
      crumbs={[{ label: tn('home'), href: '/' }, { label: tn('contact') }]}
      title={c.hero.title}
      sections={[
        { id: 'inquiry', title: tf('title') },
        { id: 'locations', title: c.locations },
      ]}
    />
  );
}
