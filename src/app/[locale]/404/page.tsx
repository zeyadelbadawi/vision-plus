import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import type { Locale } from '@/i18n/locales';
import { LinkButton } from '@/components/ui/button';
import { Link } from '@/i18n/navigation';
import '@/styles/pages.css';

/**
 * Localized 404 (MASTER_PROJECT_PLAN §26.13, §36; P5A-03): typographic, no images, links to the key sections.
 * Exported as /{locale}/404.html. The Worker's static assets use `not_found_handling: "404-page"`, which serves the
 * NEAREST 404.html with a 404 status, so unknown paths under /en, /ar and /zh get this page in their own language;
 * paths outside a locale keep the trilingual root 404 (app/not-found.tsx). Never indexed.
 */
export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const t = await getTranslations({ locale: (await params).locale as Locale, namespace: 'notFound' });
  return { title: t('title'), robots: { index: false, follow: false } };
}

export default async function LocalizedNotFound({ params }: { params: Promise<{ locale: string }> }) {
  const locale = (await params).locale as Locale;
  setRequestLocale(locale);
  const [t, tn] = await Promise.all([getTranslations({ locale, namespace: 'notFound' }), getTranslations({ locale, namespace: 'nav' })]);
  const links = [
    { href: '/solutions', label: tn('solutions') },
    { href: '/industries', label: tn('industries') },
    { href: '/services', label: tn('services') },
    { href: '/about', label: tn('about') },
    { href: '/contact', label: tn('contact') },
  ];
  return (
    <main id="main" tabIndex={-1} data-hero="dark" className="not-found theme-dark bg-bg text-fg">
      <div className="container-vp not-found__body">
        <span className="seam w-12" aria-hidden="true" />
        <h1 className="t-display max-w-[16ch]">{t('title')}</h1>
        <p className="t-lede max-w-[40rem] text-fg-muted">{t('body')}</p>
        <div>
          <LinkButton href="/" variant="primary">
            {t('home')}
          </LinkButton>
        </div>
        <nav aria-labelledby="not-found-links">
          <h2 id="not-found-links" className="t-caption text-fg-muted">
            {t('links')}
          </h2>
          <ul className="not-found__links">
            {links.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="link-text">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </main>
  );
}
