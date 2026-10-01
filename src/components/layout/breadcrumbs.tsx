import { Link } from '@/i18n/navigation';
import { cn } from '@/lib/cn';

export interface Crumb {
  label: string;
  /** Omit on the current page (last item). */
  href?: string;
}

/**
 * Breadcrumbs (§16.4). Used on every page except Home from P5 onward. The separator is a directional
 * chevron that mirrors in RTL; the current page is plain text with aria-current. BreadcrumbList JSON-LD
 * is added in P7 (SEO) from the same `items`.
 */
export function Breadcrumbs({ items, label, className }: { items: Crumb[]; label: string; className?: string }) {
  return (
    <nav aria-label={label} className={cn('breadcrumbs', className)}>
      <ol>
        {items.map((c, i) => {
          const current = i === items.length - 1;
          return (
            <li key={`${c.label}-${i}`}>
              {i > 0 && (
                <svg
                  className="breadcrumbs__sep icon-directional"
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  aria-hidden="true"
                  focusable="false"
                >
                  <path d="M9 5.5l6.5 6.5L9 18.5" />
                </svg>
              )}
              {c.href && !current ? <Link href={c.href}>{c.label}</Link> : <span aria-current={current ? 'page' : undefined}>{c.label}</span>}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
