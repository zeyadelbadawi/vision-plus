import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import type { Locale } from '@/i18n/locales';
import { getCompany, getSeoCopy } from '@/content';
import { companyProfile, embedFor } from '@/content/company-profile';
import { PageIntro } from '@/components/layout/page-intro';
import { ImageSlot } from '@/components/media/image-slot';
import { CanvaEmbed } from '@/components/sections/company-profile/canva-embed';
import { LinkButton } from '@/components/ui/button';
import { pageMetadata } from '@/lib/metadata';
import { textAttrs } from '@/lib/text-attrs';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  return pageMetadata((await params).locale as Locale, 'companyProfile');
}

/**
 * Company Profile (MASTER_PROJECT_PLAN §26.11, §33, P5A-11; notes §55.3.14): a charcoal intro (title and the markets
 * line), then the presentation frame. The Canva embed is configured in src/content/company-profile.ts and is empty
 * until the client supplies it (D-06): the frame then shows the poster slot and the pending-client line, which keeps
 * the production gate (content:check flags this route; site:check refuses the text in production output).
 */
export default async function CompanyProfilePage({ params }: { params: Promise<{ locale: string }> }) {
  const locale = (await params).locale as Locale;
  setRequestLocale(locale);
  const [tn, ta, tcp, tp] = await Promise.all([
    getTranslations({ locale, namespace: 'nav' }),
    getTranslations({ locale, namespace: 'a11y' }),
    getTranslations({ locale, namespace: 'companyProfile' }),
    getTranslations({ locale, namespace: 'pending' }),
  ]);
  const title = getSeoCopy(locale).companyProfile.title;
  const { markets } = getCompany(locale);
  const embed = embedFor(locale);
  const poster = <ImageSlot id={companyProfile.poster} locale={locale} sizes="(min-width: 1440px) 1312px, 100vw" fill />;

  return (
    <main id="main" tabIndex={-1} className="company-profile" data-hero="dark">
      <div className="theme-dark bg-bg text-fg">
        <PageIntro
          locale={locale}
          crumbs={[{ label: tn('home'), href: '/' }, { label: tn('about'), href: '/about' }, { label: tn('aboutLinks.companyProfile') }]}
          crumbsLabel={ta('breadcrumb')}
          title={title}
        >
          <p className="cp-markets t-caption" {...textAttrs(locale, markets.join(' • '))}>
            {markets.join(' • ')}
          </p>
        </PageIntro>

        <section aria-label={title} className="container-vp cp-section">
          <span className="seam mb-6 w-12" aria-hidden="true" />
          {embed ? (
            <CanvaEmbed
              src={embed.src}
              aspectRatio={embed.aspectRatio}
              title={title}
              poster={poster}
              labels={{ load: tcp('load'), loadNotice: tcp('loadNotice'), fallback: tcp('fallback') }}
              fallbackAction={
                <LinkButton href="/contact?type=general" variant="text">
                  {tn('contact')}
                </LinkButton>
              }
            />
          ) : (
            <div className="cp-frame" style={{ aspectRatio: '16 / 9' }}>
              {poster}
              <p className="cp-frame__pending">{tp('companyProfile')}</p>
            </div>
          )}
          {embed && companyProfile.pdf && (
            <div className="mt-6">
              <LinkButton href={companyProfile.pdf} variant="text">
                {tcp('download')}
              </LinkButton>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
