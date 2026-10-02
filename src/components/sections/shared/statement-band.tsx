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
  tone = 'raised',
  children,
}: {
  locale: Locale;
  id: string;
  statement: string;
  tone?: 'raised' | 'canvas';
  children?: ReactNode;
}) {
  return (
    <section aria-labelledby={id} className={cn('statement-band section-y', tone === 'raised' ? 'bg-bg-raised' : 'bg-bg')}>
      <div className="container-vp flex flex-col items-center text-center" data-reveal="">
        <span className="seam w-12" aria-hidden="true" />
        <h2 id={id} className="t-display statement-band__text" {...textAttrs(locale, statement)}>
          {statement}
        </h2>
        {children}
      </div>
    </section>
  );
}
