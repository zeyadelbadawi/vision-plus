import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import type { Locale } from '@/i18n/locales';
import { getCatalog, getContactCopy } from '@/content';
import { industries, productCategories, solutions } from '@/content/data/registry';
import { Link } from '@/i18n/navigation';
import { PageIntro } from '@/components/layout/page-intro';
import { Section } from '@/components/layout/section';
import { ContactForm } from '@/components/sections/contact/contact-form';
import { OfficeBlocks } from '@/components/sections/contact/office-blocks';
import { isPreview } from '@/lib/env';
import { pageMetadata } from '@/lib/metadata';
import { textAttrs } from '@/lib/text-attrs';
import '@/styles/forms.css';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  return pageMetadata((await params).locale as Locale, 'contact');
}

/**
 * Contact (MASTER_PROJECT_PLAN §26.10, §30, P5A-10; notes §55.3.13): the approved hero line, the inquiry form UI
 * (#inquiry) and the offices (#locations). Sending is Phase 6 (D-04, D-14); office data is pending (D-01–D-03).
 */
export default async function ContactPage({ params }: { params: Promise<{ locale: string }> }) {
  const locale = (await params).locale as Locale;
  setRequestLocale(locale);
  const [tn, ta, tf, tp] = await Promise.all([
    getTranslations({ locale, namespace: 'nav' }),
    getTranslations({ locale, namespace: 'a11y' }),
    getTranslations({ locale, namespace: 'form' }),
    getTranslations({ locale, namespace: 'preview' }),
  ]);
  const c = getContactCopy(locale);
  const catalog = getCatalog(locale);
  const tx = (t: string | undefined) => textAttrs(locale, t);

  return (
    <main id="main" tabIndex={-1} className="contact">
      <PageIntro locale={locale} crumbs={[{ label: tn('home'), href: '/' }, { label: tn('contact') }]} crumbsLabel={ta('breadcrumb')} title={c.hero.title} />

      <Section tone="canvas" spacing="default">
        <div className="container-vp grid-vp gap-y-16">
          <section id="inquiry" aria-labelledby="inquiry-title" className="col-span-4 md:col-span-8 lg:col-span-7">
            <h2 id="inquiry-title" className="t-h2">
              {tf('title')}
            </h2>
            <noscript>
              <p className="form-noscript">
                {tf('noscript')} <a href="#locations">{c.locations}</a>
              </p>
            </noscript>
            <div className="mt-10">
              <ContactForm
                locale={locale}
                labels={{
                  title: tf('title'),
                  type: {
                    label: tf('type.label'),
                    consultation: tf('type.consultation'),
                    product: tf('type.product'),
                    general: tf('type.general'),
                    partnership: tf('type.partnership'),
                  },
                  name: tf('name.label'),
                  company: tf('company.label'),
                  email: tf('email.label'),
                  phone: tf('phone.label'),
                  phoneHint: tf('phone.hint'),
                  location: { label: tf('location.label'), qatar: tf('location.qatar'), egypt: tf('location.egypt'), other: tf('location.other') },
                  industry: tf('industry.label'),
                  solution: tf('solution.label'),
                  category: tf('category.label'),
                  message: tf('message.label'),
                  messageHint: tf('message.hint'),
                  consent: tf.rich('consent.label', {
                    privacy: (chunks) => (
                      <Link href="/privacy" className="link-text">
                        {chunks}
                      </Link>
                    ),
                  }),
                  optional: tf('optional'),
                  submit: tf('submit'),
                  summary: Array.from({ length: 11 }, (_, i) => tf('errors.summary', { count: i + 1 })),
                  errors: {
                    required: tf('errors.required'),
                    nameLength: tf('errors.nameLength'),
                    companyLength: tf('errors.companyLength'),
                    email: tf('errors.email'),
                    phone: tf('errors.phone'),
                    messageLength: tf('errors.messageLength'),
                    messageLinks: tf('errors.messageLinks'),
                    consent: tf('errors.consent'),
                  },
                  notConnected: isPreview ? tp('formNotConnected') : undefined,
                }}
                industries={[
                  ...industries.map((i) => ({ value: i.slug, label: catalog.industries[i.slug].name })),
                  { value: 'other', label: tf('industry.other') },
                ]}
                solutions={[
                  ...solutions.map((s) => ({ value: s.slug, label: catalog.solutions[s.slug].name })),
                  { value: 'services', label: tf('solution.services') },
                  { value: 'not-sure', label: tf('solution.notSure') },
                ]}
                categories={productCategories.map((p) => ({ value: p, label: catalog.productCategories[p].name }))}
              />
            </div>
          </section>

          <section id="locations" aria-labelledby="locations-title" className="contact__locations col-span-4 md:col-span-8 lg:col-span-5">
            <h2 id="locations-title" className="t-h2" {...tx(c.locations)}>
              {c.locations}
            </h2>
            <div className="mt-10">
              <OfficeBlocks locale={locale} />
            </div>
          </section>
        </div>
      </Section>
    </main>
  );
}
