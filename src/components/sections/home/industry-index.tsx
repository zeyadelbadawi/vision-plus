'use client';

import { useState, type ReactNode } from 'react';
import { Link } from '@/i18n/navigation';
import { ArrowEnd } from '@/components/ui/icons';

interface Item {
  slug: string;
  href: string;
  name: string;
  summary: string;
}

/**
 * Industries index (§26.1 #6, pattern "Index reveal" §23.3): a typographic index; on desktop the
 * sticky 4:5 panel shows the hovered/focused industry's image + approved summary. On mobile each row
 * carries its own thumbnail and summary — no hover dependency.
 */
export function IndustryIndex({ items, media, thumbs }: { items: Item[]; media: ReactNode[]; thumbs: ReactNode[] }) {
  const [active, setActive] = useState(0);
  const current = items[active]!;
  return (
    <div className="ind">
      <ul className="ind__list">
        {items.map((it, i) => (
          <li key={it.slug} data-active={active === i ? 'true' : undefined}>
            <Link href={it.href} className="ind__row" onMouseEnter={() => setActive(i)} onFocus={() => setActive(i)}>
              <span className="ind__thumb">{thumbs[i]}</span>
              <span className="ind__text">
                <span className="ind__name">{it.name}</span>
                <span className="ind__summary">{it.summary}</span>
              </span>
              <ArrowEnd size={20} className="ind__arrow" />
            </Link>
          </li>
        ))}
      </ul>
      <div className="ind__panel" aria-hidden="true">
        <div className="ind__media">
          {media.map((m, i) => (
            <div key={items[i]!.slug} className="ind__media-item" data-active={active === i ? 'true' : undefined}>
              {m}
            </div>
          ))}
        </div>
        <p className="ind__panel-name">{current.name}</p>
        <p className="ind__panel-summary">{current.summary}</p>
      </div>
    </div>
  );
}
