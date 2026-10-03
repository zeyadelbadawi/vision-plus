import type { Locale } from '@/i18n/locales';
import type { PrivacyCopy } from '@/content';
import { textAttrs } from '@/lib/text-attrs';

// Intl locale per site locale; Latin digits everywhere (Q-17).
const DATE_LOCALE: Record<Locale, string> = { en: 'en-GB', ar: 'ar-u-nu-latn', zh: 'zh-Hans' };

/** "2026-10-03" → "3 October 2026" / "3 أكتوبر 2026" / "2026年10月3日" (UTC, so the day never shifts). */
export function formatPolicyDate(locale: Locale, iso: string): string {
  return new Intl.DateTimeFormat(DATE_LOCALE[locale], { dateStyle: 'long', timeZone: 'UTC' }).format(new Date(`${iso}T00:00:00Z`));
}

/**
 * Long-form legal text (§26.12): a table of contents beside the prose (sticky on desktop), one h2 per section with
 * an anchor id, and the effective date. Renders nothing for an empty document; the page shows the pending line then.
 * The text itself is supplied by the client's legal adviser (D-16) and never written by the team.
 */
export function LegalDocument({ locale, doc }: { locale: Locale; doc: PrivacyCopy }) {
  if (doc.sections.length === 0) return null;
  const tx = (t: string | undefined) => textAttrs(locale, t);
  return (
    <div className="legal">
      <nav className="legal__toc" aria-labelledby="legal-toc-title">
        <h2 id="legal-toc-title" className="legal__toc-title" {...tx(doc.labels.contents)}>
          {doc.labels.contents}
        </h2>
        <ol>
          {doc.sections.map((s) => (
            <li key={s.id}>
              <a href={`#${s.id}`} className="legal__toc-link" {...tx(s.title)}>
                {s.title}
              </a>
            </li>
          ))}
        </ol>
      </nav>
      <article className="legal__body">
        {doc.updated && (
          <p className="legal__updated">
            <span {...tx(doc.labels.updated)}>{doc.labels.updated}</span> <time dateTime={doc.updated}>{formatPolicyDate(locale, doc.updated)}</time>
          </p>
        )}
        {doc.sections.map((s) => (
          <section key={s.id} id={s.id} aria-labelledby={`${s.id}-title`} className="legal__section">
            <h2 id={`${s.id}-title`} className="t-h3" {...tx(s.title)}>
              {s.title}
            </h2>
            {s.paragraphs.map((p, i) => (
              <p key={i} className="t-body measure" {...tx(p)}>
                {p}
              </p>
            ))}
            {s.list && (
              <ul className="legal__list measure">
                {s.list.map((item, i) => (
                  <li key={i} {...tx(item)}>
                    {item}
                  </li>
                ))}
              </ul>
            )}
          </section>
        ))}
      </article>
    </div>
  );
}
