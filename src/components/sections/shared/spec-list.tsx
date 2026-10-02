import type { Locale } from '@/i18n/locales';
import { cn } from '@/lib/cn';
import { textAttrs } from '@/lib/text-attrs';

/**
 * Spec list (§20.8): capability lists as two or three columns with hairline separators; no bullets or icons.
 * `plain` sets the items in the smaller UI size (application lists, labels).
 */
export function SpecList({ locale, items, plain, className }: { locale: Locale; items: readonly string[]; plain?: boolean; className?: string }) {
  return (
    <ul className={cn('spec-list', plain && 'spec-list--plain', className)}>
      {items.map((item) => (
        <li key={item} {...textAttrs(locale, item)}>
          {item}
        </li>
      ))}
    </ul>
  );
}
