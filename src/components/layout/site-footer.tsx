import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import type { Locale } from '@/i18n/locales';
import { localeMeta, locales } from '@/i18n/locales';
import { getCatalog, getCompany, offices } from '@/content';
import { solutions } from '@/content/data/registry';
import { Wordmark } from '@/components/ui/wordmark';
import { isPreview } from '@/lib/env';

/** Footer (§16.4). Office details are placeholders until D-01/D-02 — never invented. */
export async function SiteFooter({ locale }: { locale: Locale }) {
  const [t, tn, ta, tp] = await Promise.all([
    getTranslations({ locale, namespace: 'footer' }),
    getTranslations({ locale, namespace: 'nav' }),
    getTranslations({ locale, namespace: 'a11y' }),
    getTranslations({ locale, namespace: 'placeholder' }),
  ]);
  const c = getCatalog(locale);
  const company = getCompany(locale);
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
            <Wordmark className="text-[1.5rem]" />
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
                {offices.map((o, i) => (
                  <address key={o.key} className="not-italic">
                    <p className="t-body-sm mb-2 font-medium">{company.markets[i]}</p>
                    {/* Values render only when supplied by the client (D-01/D-02). */}
                    {o.address ? <p className="t-body-sm text-fg-muted">{o.address}</p> : isPreview && <p className="footer-placeholder">{tp('address')}</p>}
                    {o.phone ? (
                      <a href={`tel:${o.phone.replace(/\s/g, '')}`} dir="ltr" className="footer-link t-body-sm">
                        {o.phone}
                      </a>
                    ) : (
                      isPreview && <p className="footer-placeholder">{tp('phone')}</p>
                    )}
                    {o.email ? (
                      <a href={`mailto:${o.email}`} dir="ltr" className="footer-link t-body-sm">
                        {o.email}
                      </a>
                    ) : (
                      isPreview && <p className="footer-placeholder">{tp('email')}</p>
                    )}
                  </address>
                ))}
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
