import type { ReactNode } from 'react';
import { Breadcrumbs, type Crumb } from '@/components/layout/breadcrumbs';
import '@/styles/pages.css';
import type { Locale } from '@/i18n/locales';
import { textAttrs } from '@/lib/text-attrs';

/**
 * Inner-page opening (§26): breadcrumb, optional eyebrow, the page h1 and an optional approved lede.
 * Sits below the fixed header (inner pages open on a light surface).
 */
export function PageIntro({
  crumbs,
  crumbsLabel,
  eyebrow,
  title,
  lede,
  children,
  locale,
}: {
  locale: Locale;
  crumbs: Crumb[];
  crumbsLabel: string;
  eyebrow?: string;
  title: string;
  lede?: string;
  children?: ReactNode;
}) {
  return (
    <header className="page-intro container-vp">
      <Breadcrumbs items={crumbs} label={crumbsLabel} />
      <div className="page-intro__body" data-reveal="">
        <span className="seam mb-6 w-12" aria-hidden="true" />
        {eyebrow && (
          <p className="t-caption text-fg-muted mb-4" {...textAttrs(locale, eyebrow)}>
            {eyebrow}
          </p>
        )}
        <h1 className="t-h1 max-w-[22ch]" {...textAttrs(locale, title)}>
          {title}
        </h1>
        {lede && (
          <p className="t-lede mt-6 max-w-[44rem] text-fg-muted" {...textAttrs(locale, lede)}>
            {lede}
          </p>
        )}
        {children}
      </div>
    </header>
  );
}
