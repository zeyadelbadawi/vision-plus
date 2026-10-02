import type { ReactNode } from 'react';
import type { Locale } from '@/i18n/locales';
import { cn } from '@/lib/cn';
import { textAttrs } from '@/lib/text-attrs';

/**
 * Statement band (§20.8): one full-width typographic statement taken from approved closing lines. Centred, as
 * §20.10 allows for statement bands. `children` holds an optional follow-on (e.g. a teaser link).
 */
export function StatementBand({
  locale,
  id,
  statement,
  lead,
  size = 'display',
  tone = 'raised',
  children,
}: {
  locale: Locale;
  id: string;
  statement: string;
  /** Optional approved lead-in line shown above the statement (e.g. "…our objective is simple:"). */
  lead?: string;
  /** `h2` for long approved sentences that would be too large in display size. */
  size?: 'display' | 'h2';
  tone?: 'raised' | 'canvas';
  children?: ReactNode;
}) {
  return (
    <section aria-labelledby={id} className={cn('statement-band section-y', tone === 'raised' ? 'bg-bg-raised' : 'bg-bg')}>
      <div className="container-vp flex flex-col items-center text-center" data-reveal="">
        <span className="seam w-12" aria-hidden="true" />
        {lead && (
          <p className="t-lede text-fg-muted statement-band__lead" {...textAttrs(locale, lead)}>
            {lead}
          </p>
        )}
        <h2
          id={id}
          className={cn(size === 'display' ? 't-display' : 't-h2 statement-band__text--long', 'statement-band__text')}
          {...textAttrs(locale, statement)}
        >
          {statement}
        </h2>
        {children}
      </div>
    </section>
  );
}
