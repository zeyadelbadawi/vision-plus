import type { CSSProperties } from 'react';
import type { Locale } from '@/i18n/locales';
import { textAttrs } from '@/lib/text-attrs';

/**
 * Compact process track (§20.8 "Timeline / process track"): numbered because the content is a real sequence
 * (the 8-step approach, `01` §17). The gold seam fills with scroll (`data-progress="track"`, scrubbed within the
 * section, no pin); without motion it shows the complete track. Shares the approach track's styles.
 */
export function ProcessTrack({ locale, steps, label }: { locale: Locale; steps: { title: string }[]; label: string }) {
  return (
    <ol className="lifecycle lifecycle--compact" aria-label={label} data-progress="track" style={{ '--n': steps.length } as CSSProperties}>
      {steps.map((s, i) => (
        <li key={s.title} className="lifecycle__step" style={{ '--i': i } as CSSProperties}>
          <span className="lifecycle__line" aria-hidden="true">
            <span className="lifecycle__fill" />
          </span>
          <span className="lifecycle__node" aria-hidden="true" />
          <span className="lifecycle__n t-num" aria-hidden="true">
            {String(i + 1).padStart(2, '0')}
          </span>
          <h3 className="t-h4" {...textAttrs(locale, s.title)}>
            {s.title}
          </h3>
        </li>
      ))}
    </ol>
  );
}
