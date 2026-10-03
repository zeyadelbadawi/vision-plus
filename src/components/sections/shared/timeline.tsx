import type { CSSProperties } from 'react';
import type { Locale } from '@/i18n/locales';
import type { ImageId } from '@/content/media';
import { ImageSlot, slotVisible } from '@/components/media/image-slot';
import { textAttrs } from '@/lib/text-attrs';

export interface Milestone {
  when: string;
  where?: string;
  title: string;
  body: string[];
  image?: ImageId;
}

/**
 * Timeline (§20.8; About journey §26.8 #2): a real sequence, so an ordered list joined by the gold seam. It reuses
 * the homepage journey's global styles unchanged: vertical on mobile, three columns from 768 px, the seam drawn once
 * when the list enters view. Each milestone may carry an F7 photo; without one (production, no final image) the
 * milestone is text-only (manifest fallback).
 */
export function Timeline({ locale, items, label }: { locale: Locale; items: Milestone[]; label?: string }) {
  return (
    <ol className="journey timeline" aria-label={label} data-reveal="">
      {items.map((m, i) => (
        <li key={m.title} className="journey__step" style={{ '--i': i } as CSSProperties}>
          <span className="journey__line" aria-hidden="true">
            <span className="journey__fill" />
          </span>
          <span className="journey__node" aria-hidden="true" />
          <p className="journey__when t-num">
            <span className="t-display" {...textAttrs(locale, m.when)}>
              {m.when}
            </span>
            {m.where && (
              <span className="journey__where" {...textAttrs(locale, m.where)}>
                {m.where}
              </span>
            )}
          </p>
          {m.image && slotVisible(m.image) && (
            <div className="timeline__media">
              <ImageSlot id={m.image} locale={locale} sizes="(min-width: 768px) 30vw, 100vw" />
            </div>
          )}
          <h3 className="t-h3 mt-6" {...textAttrs(locale, m.title)}>
            {m.title}
          </h3>
          {m.body.map((p) => (
            <p key={p} className="t-body-sm mt-3 max-w-[40ch] text-fg-muted" {...textAttrs(locale, p)}>
              {p}
            </p>
          ))}
        </li>
      ))}
    </ol>
  );
}
