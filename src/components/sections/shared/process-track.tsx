import type { CSSProperties } from 'react';
import type { Locale } from '@/i18n/locales';
import { cn } from '@/lib/cn';
import { textAttrs } from '@/lib/text-attrs';

export interface ProcessStep {
  title: string;
  /** Step text (full variant only). */
  text?: string;
  /** Anchor id for the step, so other sections can link to it (full variant only). */
  id?: string;
  /** Preview-only review note shown under the text (wording still awaiting client approval). */
  pending?: string;
}

/**
 * Process track (§20.8 "Timeline / process track"): numbered because the content is a real sequence
 * (the 8-step approach, `01` §17). The gold seam fills with scroll (`data-progress="track"`, scrubbed within the
 * section, no pin); without motion it shows the complete track. Shares the approach track's styles.
 * `compact` (default) shows titles only, in one row of 8 on desktop; `full` shows the step texts in rows of 4,
 * as the homepage approach does (§26.5 `#approach`).
 */
export function ProcessTrack({
  locale,
  steps,
  label,
  variant = 'compact',
}: {
  locale: Locale;
  steps: ProcessStep[];
  label: string;
  variant?: 'compact' | 'full';
}) {
  const full = variant === 'full';
  return (
    <ol className={cn('lifecycle', !full && 'lifecycle--compact')} aria-label={label} data-progress="track" style={{ '--n': steps.length } as CSSProperties}>
      {steps.map((s, i) => (
        <li key={s.title} id={full ? s.id : undefined} className="lifecycle__step" style={{ '--i': i } as CSSProperties}>
          <span className="lifecycle__line" aria-hidden="true">
            <span className="lifecycle__fill" />
          </span>
          <span className="lifecycle__node" aria-hidden="true" />
          <span className="lifecycle__n t-num" aria-hidden="true">
            {String(i + 1).padStart(2, '0')}
          </span>
          <h3 className={full ? 't-h3 lifecycle__title' : 't-h4'} {...textAttrs(locale, s.title)}>
            {s.title}
          </h3>
          {full && s.text && (
            <p className="t-body-sm text-fg-muted" {...textAttrs(locale, s.text)}>
              {s.text}
            </p>
          )}
          {full && s.pending && <p className="pending-note t-caption">{s.pending}</p>}
        </li>
      ))}
    </ol>
  );
}
