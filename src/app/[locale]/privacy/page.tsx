import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import type { Locale } from '@/i18n/locales';
import { getPrivacyCopy, getSeoCopy } from '@/content';
import { PageIntro } from '@/components/layout/page-intro';
import { Section } from '@/components/layout/section';
import { LegalDocument } from '@/components/sections/legal/legal-document';
import { pageMetadata } from '@/lib/metadata';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  return pageMetadata((await params).locale as Locale, 'privacy');
}

/**
 * Privacy (MASTER_PROJECT_PLAN §26.12, P5A-12; notes §55.3.15): long-form policy with a table of contents, filled from
 * copy/<locale>/privacy.json. The text comes from the client's legal adviser (D-16) and none has been supplied, so the
 * page shows the pending-client line: content:check blocks the route and site:check refuses the text in production.
 * To publish: add the approved sections to privacy.json and remove the pending branch below.
 */
export default async function PrivacyPage({ params }: { params: Promise<{ locale: string }> }) {
  const locale = (await params).locale as Locale;
  setRequestLocale(locale);
  const [tn, ta, tp] = await Promise.all([
    getTranslations({ locale, namespace: 'nav' }),
    getTranslations({ locale, namespace: 'a11y' }),
    getTranslations({ locale, namespace: 'pending' }),
  ]);
  const title = getSeoCopy(locale).privacy.title;
  const doc = getPrivacyCopy(locale);
  const pending = doc.sections.length === 0;

  return (
    <main id="main" tabIndex={-1} className="privacy">
      <PageIntro
        locale={locale}
        crumbs={[{ label: tn('home'), href: '/' }, { label: title }]}
        crumbsLabel={ta('breadcrumb')}
        title={title}
        lede={pending ? tp('privacy') : undefined}
      />
      {!pending && (
        <Section tone="canvas" spacing="default">
          <div className="container-vp">
            <LegalDocument locale={locale} doc={doc} />
          </div>
        </Section>
      )}
    </main>
  );
}
