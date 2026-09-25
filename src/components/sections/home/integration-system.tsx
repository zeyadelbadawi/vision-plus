'use client';

import { useState, type CSSProperties } from 'react';
import { Link } from '@/i18n/navigation';
import { ArrowEnd } from '@/components/ui/icons';

interface Node {
  slug: string;
  href: string;
  name: string;
  summary: string;
}

/**
 * "Integration System" — the homepage signature diagram (§23.6.9).
 * Concept: ONE origin (Vision Plus) on a single engineered bus; a gold signal travels the bus and
 * activates each capability in turn → "One technology partner. Multiple capabilities."
 *  - ≥1024: horizontal bus; hover/focus a node to read its approved summary in the readout.
 *  - <1024: vertical spine; the connection grows with scroll and activates nodes as you read.
 *  - Reduced motion / no JS: the fully connected final state; every summary remains in the DOM.
 */
export function IntegrationSystem({ origin, nodes, label }: { origin: string; nodes: Node[]; label: string }) {
  const [active, setActive] = useState(0);
  return (
    <div className="isys" data-reveal="" data-progress="follow" style={{ '--n': nodes.length } as CSSProperties}>
      <span className="isys__rail" aria-hidden="true">
        <span className="isys__rail-fill" />
      </span>
      <div className="isys__origin" aria-hidden="true">
        <span className="isys__origin-node" />
        <span className="isys__origin-label" dir="ltr">
          {origin}
        </span>
      </div>
      <ol className="isys__list" aria-label={label}>
        {nodes.map((n, i) => (
          <li key={n.slug} className="isys__node" data-active={active === i ? 'true' : undefined} style={{ '--i': i } as CSSProperties}>
            <span className="isys__marker" aria-hidden="true">
              <span className="isys__marker-on" />
            </span>
            <Link
              href={n.href}
              className="isys__link"
              aria-describedby={`isys-sum-${n.slug}`}
              onMouseEnter={() => setActive(i)}
              onFocus={() => setActive(i)}
            >
              <span className="isys__name">{n.name}</span>
              <ArrowEnd size={16} className="isys__arrow" />
            </Link>
            <p id={`isys-sum-${n.slug}`} className="isys__summary">
              <span className="isys__summary-name" aria-hidden="true">
                {n.name}
              </span>
              <span className="isys__summary-text">{n.summary}</span>
            </p>
          </li>
        ))}
      </ol>
    </div>
  );
}
