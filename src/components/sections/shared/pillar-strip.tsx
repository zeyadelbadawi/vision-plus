import type { Locale } from '@/i18n/locales';
import { textAttrs } from '@/lib/text-attrs';

/**
 * Pillar strip (§20.8): 4–6 short concept words joined by the gold seam, e.g. the approved
 * "Comfort • Efficiency • Control • Security • Experience" (`01` §14). Not numbered: it is not a sequence.
 */
export function PillarStrip({ locale, items, label }: { locale: Locale; items: readonly string[]; label?: string }) {
  return (
    <ul className="pillar-strip" aria-label={label}>
      {items.map((item) => (
        <li key={item} className="pillar-strip__item t-h3" {...textAttrs(locale, item)}>
          {item}
        </li>
      ))}
    </ul>
  );
}
