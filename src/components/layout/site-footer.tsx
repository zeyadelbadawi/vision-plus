import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import type { Locale } from '@/i18n/locales';
import { localeMeta, locales } from '@/i18n/locales';
import { getCatalog, getCompany, getSamplesCopy, offices } from '@/content';
import { sampleOffices } from '@/content/data/samples';
import { solutions } from '@/content/data/registry';
import { isPreview } from '@/lib/env';

/**
 * Footer (§16.4). Verified office details render only when the client supplies them (D-01/D-02). Until then, preview
 * builds show the client-requested dummy details (data/samples.ts), labelled as sample data, as plain text (no
 * tel:/mailto: links, D-04). Production renders nothing for a missing value.
 */
export async function SiteFooter({ locale }: { locale: Locale }) {
  const [t, tn, ta] = await Promise.all([
    getTranslations({ locale, namespace: 'footer' }),
    getTranslations({ locale, namespace: 'nav' }),
    getTranslations({ locale, namespace: 'a11y' }),
  ]);
  const c = getCatalog(locale);
  const company = getCompany(locale);
  const samples = getSamplesCopy(locale);
  const year = new Date().getFullYear();

  const companyLinks = [
    { href: '/about', label: tn('aboutLinks.whoWeAre') },
    { href: '/projects', label: tn('projects') },
    { href: '/partners', label: tn('aboutLinks.partners') },
    { href: '/company-profile', label: tn('aboutLinks.companyProfile') },
    { href: '/services', label: tn('services') },
    { href: '/contact', label: tn('contact') },
  ];

  return (
    <footer className="theme-dark bg-bg text-fg">
      <div className="container-vp">
        <div className="grid-vp gap-y-12 border-t border-line pt-16 pb-12 lg:pt-20">
          <div className="col-span-4 md:col-span-8 lg:col-span-4">
            {/* Official stacked logo as delivered by the client (D-05, 2026-10-02: use the existing logo files, unaltered,
                until the missing variants arrive). Byte-identical copy of logo package v1; its artboard has ~60 px of
                built-in padding (330 × 320 around a 206 × 200 drawing), offset here so the drawing aligns with the column. */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/images/brand/vision-plus-logo-stacked-white.svg" alt="Vision Plus" width={200} height={194} className="footer-logo" decoding="async" />
            <p className="t-body-sm mt-6 max-w-[22rem] text-fg-muted">
              {company.tagline.join(' ')}
              <br />
              {company.descriptor}
            </p>
          </div>

          <nav aria-label={ta('footerNav')} className="col-span-4 grid gap-10 md:col-span-8 md:grid-cols-2 lg:col-span-8 lg:grid-cols-3">
            <div>
              <h2 className="t-caption mb-5 text-fg-muted">{t('solutions')}</h2>
              <ul className="grid gap-3">
                {solutions.map((s) => (
                  <li key={s.slug}>
                    <Link href={`/solutions/${s.slug}`} className="footer-link">
                      {c.solutions[s.slug].name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h2 className="t-caption mb-5 text-fg-muted">{t('company')}</h2>
              <ul className="grid gap-3">
                {companyLinks.map((l) => (
                  <li key={l.href}>
                    <Link href={l.href} className="footer-link">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h2 className="t-caption mb-5 text-fg-muted">{t('offices')}</h2>
              <div className="grid gap-8">
                {offices.map((o, i) => {
                  const showSample = isPreview && !(o.address && o.phone && o.email);
                  return (
                    <address key={o.key} className="not-italic" data-sample={showSample ? '' : undefined}>
                      <p className="t-body-sm mb-2 font-medium">{company.markets[i]}</p>
                      {o.address ? (
                        <p className="t-body-sm text-fg-muted">{o.address}</p>
                      ) : (
                        showSample && <p className="t-body-sm text-fg-muted">{samples.offices[o.key].address}</p>
                      )}
                      {o.phone ? (
                        <a href={`tel:${o.phone.replace(/\s/g, '')}`} dir="ltr" className="footer-link t-body-sm">
                          {o.phone}
                        </a>
                      ) : (
                        showSample && (
                          <p dir="ltr" className="t-body-sm text-fg-muted">
                            {sampleOffices[o.key].phone}
                          </p>
                        )
                      )}
                      {o.email ? (
                        <a href={`mailto:${o.email}`} dir="ltr" className="footer-link t-body-sm">
                          {o.email}
                        </a>
                      ) : (
                        showSample && (
                          <p dir="ltr" className="t-body-sm text-fg-muted">
                            {sampleOffices[o.key].email}
                          </p>
                        )
                      )}
                      {showSample && <p className="sample-tag mt-2">{samples.dataLabel}</p>}
                    </address>
                  );
                })}
              </div>
            </div>
          </nav>
        </div>

        <div className="flex flex-col gap-6 border-t border-line py-8 md:flex-row md:items-center md:justify-between">
          <p className="t-caption text-fg-muted">{t('rights', { year })}</p>
          <div className="flex flex-wrap items-center gap-x-8 gap-y-4">
            <ul className="flex gap-6" aria-label={t('language')}>
              {locales.map((code) => (
                <li key={code}>
                  <Link
                    href="/"
                    locale={code}
                    lang={localeMeta[code].htmlLang}
                    hrefLang={localeMeta[code].htmlLang}
                    className="footer-link t-caption"
                    aria-current={code === locale ? 'true' : undefined}
                  >
                    {localeMeta[code].nativeName}
                  </Link>
                </li>
              ))}
            </ul>
            <Link href="/privacy" className="footer-link t-caption">
              {t('privacy')}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
