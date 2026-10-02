import type { Locale } from '@/i18n/locales';
import { Link } from '@/i18n/navigation';
import { textAttrs } from '@/lib/text-attrs';

export interface RelatedGroup {
  title: string;
  links: { href: string; label: string }[];
}

/**
 * Related rail (§16.4, §26.2 #7): groups of links to related industries, product categories, projects and
 * neighbouring solutions. Empty groups are dropped, so unpublished relations simply do not appear (§12.3).
 */
export function RelatedRail({ locale, groups }: { locale: Locale; groups: RelatedGroup[] }) {
  const shown = groups.filter((g) => g.links.length > 0);
  return (
    <div className="related">
      {shown.map((g) => (
        <div key={g.title}>
          <h3 className="t-caption text-fg-muted" {...textAttrs(locale, g.title)}>
            {g.title}
          </h3>
          <ul className="related__list">
            {g.links.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="link-text" {...textAttrs(locale, l.label)}>
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
