import type { Locale } from '@/i18n/locales';
import type { ImageId } from '@/content/media';
import { ImageSlot, slotVisible } from '@/components/media/image-slot';
import { ArrowEnd } from '@/components/ui/icons';
import { Link } from '@/i18n/navigation';
import { textAttrs } from '@/lib/text-attrs';

export interface IndexItem {
  href: string;
  name: string;
  summary: string;
  image?: ImageId;
  /** Short marker shown above the name (e.g. the featured solution). */
  marker?: string;
}

/**
 * Index list (§20.8): full-width rows with a large name, the approved one-line summary and an image that is
 * revealed on hover or focus at ≥ 1024 px (§23.3 "index reveal"); below that a small thumbnail is always visible.
 * Server-rendered and CSS-only. The whole row is one link; the name is the row's heading.
 */
export function IndexList({ locale, items, headingLevel = 'h3' }: { locale: Locale; items: IndexItem[]; headingLevel?: 'h2' | 'h3' }) {
  const Heading = headingLevel;
  return (
    <ul className="index-list">
      {items.map((item) => (
        <li key={item.href} className="index-list__item">
          <div className="index-list__text">
            {item.marker && (
              <p className="index-list__marker t-caption" {...textAttrs(locale, item.marker)}>
                {item.marker}
              </p>
            )}
            <Heading className="index-list__name">
              <Link href={item.href} className="index-list__link" {...textAttrs(locale, item.name)}>
                {item.name}
              </Link>
            </Heading>
            <p className="index-list__summary" {...textAttrs(locale, item.summary)}>
              {item.summary}
            </p>
          </div>
          {item.image && slotVisible(item.image) && (
            <div className="index-list__media" aria-hidden="true">
              <ImageSlot id={item.image} locale={locale} sizes="(min-width: 1024px) 22vw, 96px" compact />
            </div>
          )}
          <ArrowEnd className="index-list__arrow" size={20} aria-hidden="true" />
        </li>
      ))}
    </ul>
  );
}
