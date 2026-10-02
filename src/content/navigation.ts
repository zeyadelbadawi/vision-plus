import { getTranslations } from 'next-intl/server';
import type { Locale } from '@/i18n/locales';
import { getCatalog, getHome } from '@/content';
import { industries, productCategories, services, solutions } from '@/content/data/registry';

/** Serializable navigation model built on the server from the registries + localized copy (§16). */
export interface NavLink {
  href: string;
  label: string;
  summary?: string;
}
export type NavPanel =
  | { kind: 'solutions'; items: NavLink[]; featured: { href: string; eyebrow: string; title: string; name: string }; footer: NavLink[] }
  | { kind: 'products'; intro: string; items: NavLink[]; footer: NavLink[] }
  | { kind: 'industries'; items: NavLink[]; footer: NavLink[] }
  | { kind: 'services'; items: NavLink[]; steps: string[]; footer: NavLink[] }
  | { kind: 'about'; items: NavLink[] };
export interface NavItem {
  key: string;
  label: string;
  href: string;
  panel?: NavPanel;
}

export async function getNavigation(locale: Locale): Promise<NavItem[]> {
  const t = await getTranslations({ locale, namespace: 'nav' });
  const c = getCatalog(locale);
  const home = getHome(locale);
  const featured = solutions.find((s) => 'featured' in s && s.featured)!;

  return [
    {
      key: 'solutions',
      label: t('solutions'),
      href: '/solutions',
      panel: {
        kind: 'solutions',
        items: solutions.map((s) => ({ href: `/solutions/${s.slug}`, label: c.solutions[s.slug].name, summary: c.solutions[s.slug].summary })),
        featured: {
          href: `/solutions/${featured.slug}`,
          eyebrow: t('featured'),
          title: home.mobileNvr.title,
          name: c.solutions[featured.slug].name,
        },
        footer: [
          { href: '/solutions', label: t('allSolutions') },
          { href: '/services#approach', label: t('howWeWork') },
        ],
      },
    },
    {
      key: 'products',
      label: t('products'),
      href: '/products',
      panel: {
        kind: 'products',
        intro: t('productsIntro'),
        items: productCategories.map((slug) => ({ href: `/products#${slug}`, label: c.productCategories[slug].name })),
        footer: [{ href: '/contact?type=product', label: t('askProducts') }],
      },
    },
    {
      key: 'industries',
      label: t('industries'),
      href: '/industries',
      panel: {
        kind: 'industries',
        items: industries.map((i) => ({ href: `/industries#${i.slug}`, label: c.industries[i.slug].name })),
        footer: [{ href: '/industries', label: t('allIndustries') }],
      },
    },
    {
      key: 'services',
      label: t('services'),
      href: '/services',
      panel: {
        kind: 'services',
        items: services.map((slug) => ({ href: `/services#${slug}`, label: c.services[slug].name })),
        steps: c.approach.map((s) => s.title),
        footer: [
          { href: '/services', label: t('allServices') },
          { href: '/services#approach', label: t('ourApproach') },
        ],
      },
    },
    { key: 'projects', label: t('projects'), href: '/projects' },
    {
      key: 'about',
      label: t('about'),
      href: '/about',
      panel: {
        kind: 'about',
        items: [
          { href: '/about#who-we-are', label: t('aboutLinks.whoWeAre') },
          { href: '/about#journey', label: t('aboutLinks.journey') },
          { href: '/about#vision', label: t('aboutLinks.visionMission') },
          { href: '/about#values', label: t('aboutLinks.values') },
          { href: '/about#why-vision-plus', label: t('aboutLinks.why') },
          { href: '/partners', label: t('aboutLinks.partners') },
          { href: '/company-profile', label: t('aboutLinks.companyProfile') },
        ],
      },
    },
  ];
}
