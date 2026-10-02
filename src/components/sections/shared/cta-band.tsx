import type { Locale } from '@/i18n/locales';
import { LinkButton } from '@/components/ui/button';
import { textAttrs } from '@/lib/text-attrs';

/**
 * CTA band (§26.2 #8, §26.3): a charcoal closing chapter with one primary action (§20.6: one primary per view).
 * The lead and title are approved closing lines, passed in by the page.
 */
export function CtaBand({
  locale,
  id,
  lead,
  title,
  action,
}: {
  locale: Locale;
  id: string;
  lead?: string;
  title: string;
  action: { href: string; label: string };
}) {
  return (
    <section aria-labelledby={id} className="theme-dark bg-bg text-fg section-y-sm">
      <div className="container-vp flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between" data-reveal="">
        <div>
          <span className="seam mb-6 w-12" aria-hidden="true" />
          {lead && (
            <p className="t-h3 text-fg-muted" {...textAttrs(locale, lead)}>
              {lead}
            </p>
          )}
          <h2 id={id} className="t-h1 mt-3 max-w-[22ch]" {...textAttrs(locale, title)}>
            {title}
          </h2>
        </div>
        <LinkButton href={action.href} variant="primary" className="self-start lg:self-auto">
          {action.label}
        </LinkButton>
      </div>
    </section>
  );
}
