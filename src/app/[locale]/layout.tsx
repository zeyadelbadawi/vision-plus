import type { Metadata, Viewport } from 'next';
import type { ReactNode } from 'react';
import { notFound } from 'next/navigation';
import { hasLocale } from 'next-intl';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { routing } from '@/i18n/routing';
import { localeMeta, locales, type Locale } from '@/i18n/locales';
import { plexArabic, plexSans } from '@/styles/fonts';
import { SiteHeader } from '@/components/layout/site-header';
import { SiteFooter } from '@/components/layout/site-footer';
import { SkipLink } from '@/components/layout/skip-link';
import { PreviewNotice } from '@/components/layout/preview-notice';
import { MotionController, motionBootScript } from '@/components/motion/motion-controller';
import { copyStatus, getCompany } from '@/content';
import { isPreview } from '@/lib/env';

export const dynamicParams = false;

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export const viewport: Viewport = {
  themeColor: '#1f1f1f',
  width: 'device-width',
  initialScale: 1,
};

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) return {};
  const company = getCompany(locale);
  return {
    title: { default: `VISION PLUS — ${company.descriptor}`, template: '%s — VISION PLUS' },
    description: company.tagline.join(' '),
    // Preview builds must never be indexed (§36).
    robots: isPreview ? { index: false, follow: false } : undefined,
  };
}

export default async function LocaleLayout({ children, params }: { children: ReactNode; params: Promise<{ locale: string }> }) {
  const { locale: requested } = await params;
  if (!hasLocale(routing.locales, requested)) notFound();
  const locale = requested as Locale;
  setRequestLocale(locale);
  const meta = localeMeta[locale];
  const [ta, tp] = await Promise.all([
    getTranslations({ locale, namespace: 'a11y' }),
    getTranslations({ locale, namespace: 'preview' }),
  ]);
  const status = copyStatus(locale);

  return (
    <html lang={meta.htmlLang} dir={meta.dir} className={`${plexSans.variable} ${plexArabic.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: motionBootScript }} />
        {/* Chinese font CSS is intentionally linked only on /zh so other locales never download it (§15.2) */}
        {/* eslint-disable-next-line @next/next/no-css-tags */}
        {locale === 'zh' && <link rel="stylesheet" href="/fonts/noto-sans-sc/noto-sans-sc.css" />}
      </head>
      <body>
          <SkipLink label={ta('skipToContent')} />
          <SiteHeader locale={locale} />
          {children}
          <SiteFooter locale={locale} />
          <MotionController />
          {isPreview && (
            <PreviewNotice
              label={tp('label')}
              title={tp('title')}
              closeLabel={tp('close')}
              lines={[
                tp('copyStatus', { status: status === 'draft-mt' ? tp('statusDraftMt') : tp('statusApproved') }),
                tp('logo'),
                tp('images'),
                tp('sections'),
              ]}
            />
          )}
      </body>
    </html>
  );
}
