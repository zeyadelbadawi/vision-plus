import { getTranslations } from 'next-intl/server';
import type { Locale } from '@/i18n/locales';
import type { Crumb } from '@/components/layout/breadcrumbs';
import { PageIntro } from '@/components/layout/page-intro';
import { Link } from '@/i18n/navigation';
import { isPreview } from '@/lib/env';
import { textAttrs } from '@/lib/text-attrs';

/**
 * Empty page template (MASTER_PROJECT_PLAN §49.1 P3 output: "a deployable preview with empty templates
 * in 3 locales"). It gives every sitemap route its real URL, title, breadcrumb, h1 and the section
 * anchors the navigation links to, so nothing 404s. The page bodies are P5 work and are NOT built here.
 */
export interface TemplateSection {
  id: string;
  title: string;
}

export async function TemplatePage({
  locale,
  crumbs,
  eyebrow,
  title,
  lede,
  sections = [],
  links = [],
}: {
  locale: Locale;
  crumbs: Crumb[];
  eyebrow?: string;
  title: string;
  lede?: string;
  sections?: TemplateSection[];
  links?: { href: string; label: string }[];
}) {
  const [ta, tp] = await Promise.all([getTranslations({ locale, namespace: 'a11y' }), getTranslations({ locale, namespace: 'preview' })]);
  return (
    <main id="main" tabIndex={-1} className="template-page">
      <PageIntro locale={locale} crumbs={crumbs} crumbsLabel={ta('breadcrumb')} eyebrow={eyebrow} title={title} lede={lede} />
      <div className="container-vp template-page__body">
        {isPreview && <p className="template-page__notice">{tp('templatePending')}</p>}
        {links.length > 0 && (
          <ul className="template-page__links">
            {links.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="link-text" {...textAttrs(locale, l.label)}>
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        )}
        {sections.map((s) => (
          <section key={s.id} id={s.id} aria-labelledby={`${s.id}-title`} className="template-page__section">
            <h2 id={`${s.id}-title`} className="t-h3" {...textAttrs(locale, s.title)}>
              {s.title}
            </h2>
            {isPreview && <p className="t-caption text-fg-muted mt-2">{tp('sectionPending')}</p>}
          </section>
        ))}
      </div>
    </main>
  );
}
