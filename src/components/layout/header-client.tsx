'use client';

import { useCallback, useEffect, useId, useRef, useState, type ReactNode } from 'react';
import { Link, usePathname } from '@/i18n/navigation';
import type { NavItem, NavLink, NavPanel } from '@/content/navigation';
import type { Locale } from '@/i18n/locales';
import { ArrowEnd, ChevronDown, CloseIcon, MenuIcon } from '@/components/ui/icons';
import { Wordmark } from '@/components/ui/wordmark';
import { cn } from '@/lib/cn';

export interface LocaleOption {
  code: Locale;
  nativeName: string;
  shortLabel: string;
  htmlLang: string;
}

interface Labels {
  home: string;
  mainNav: string;
  mobileNav: string;
  openMenu: string;
  closeMenu: string;
  language: string;
}

interface HeaderClientProps {
  items: NavItem[];
  cta: { href: string; label: string };
  locale: Locale;
  locales: LocaleOption[];
  labels: Labels;
  /** Server-rendered featured media (ImageSlot) for the Solutions panel. */
  featuredMedia: ReactNode;
}

const OPEN_DELAY = 150;
const CLOSE_DELAY = 200;

function setLocaleCookie(code: Locale) {
  document.cookie = `NEXT_LOCALE=${code}; path=/; max-age=31536000; samesite=lax`;
}

export function HeaderClient({ items, cta, locale, locales, labels, featuredMedia }: HeaderClientProps) {
  const [openKey, setOpenKey] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  const timer = useRef<number | undefined>(undefined);
  const triggerRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const langButtonRef = useRef<HTMLButtonElement>(null);
  const uid = useId();
  const pathname = usePathname();

  // Header compression + surface change after 80 px (§16.1)
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close menus on navigation (state reset during render, not in an effect)
  const [prevPath, setPrevPath] = useState(pathname);
  if (prevPath !== pathname) {
    setPrevPath(pathname);
    setOpenKey(null);
    setDrawerOpen(false);
    setLangOpen(false);
  }

  const closePanels = useCallback((focusTrigger?: boolean) => {
    window.clearTimeout(timer.current);
    setOpenKey((current) => {
      if (focusTrigger && current) triggerRefs.current[current]?.focus();
      return null;
    });
    setLangOpen(false);
  }, []);

  // Escape closes any open desktop panel and returns focus to its trigger
  useEffect(() => {
    if (!openKey && !langOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      if (langOpen) {
        setLangOpen(false);
        langButtonRef.current?.focus();
      } else closePanels(true);
    };
    const onPointer = (e: PointerEvent) => {
      if (headerRef.current && !headerRef.current.contains(e.target as Node)) closePanels();
    };
    document.addEventListener('keydown', onKey);
    document.addEventListener('pointerdown', onPointer);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('pointerdown', onPointer);
    };
  }, [openKey, langOpen, closePanels]);

  const scheduleOpen = (key: string) => {
    window.clearTimeout(timer.current);
    if (openKey) setOpenKey(key);
    else timer.current = window.setTimeout(() => setOpenKey(key), OPEN_DELAY);
  };
  const scheduleClose = () => {
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setOpenKey(null), CLOSE_DELAY);
  };

  const onHeaderBlur = (e: React.FocusEvent) => {
    if (!headerRef.current?.contains(e.relatedTarget as Node)) {
      setOpenKey(null);
      setLangOpen(false);
    }
  };

  // At the very top of a page that opens with a dark hero (main[data-hero="dark"]), CSS renders the
  // header transparent on charcoal tokens; any scroll or open panel switches to the solid surface.
  const atTop = !scrolled && !openKey && !langOpen;
  const current = locales.find((l) => l.code === locale)!;

  return (
    <>
      <header
        ref={headerRef}
        onBlur={onHeaderBlur}
        className={cn('site-header', atTop ? 'site-header--top' : 'site-header--solid', scrolled && 'site-header--compact')}
        data-open={openKey ? 'true' : undefined}
      >
        <div className="container-vp site-header__bar">
          <Link href="/" className="site-header__logo" aria-label={labels.home}>
            <Wordmark className="text-[1.25rem] nav:text-[1.375rem]" />
          </Link>

          {/* Desktop navigation (≥ nav breakpoint) — WAI-ARIA disclosure pattern (T-14) */}
          <nav aria-label={labels.mainNav} className="hidden h-full nav:flex" onMouseLeave={scheduleClose} onMouseEnter={() => window.clearTimeout(timer.current)}>
            <ul className="flex h-full items-stretch">
              {items.map((item) => {
                const panelId = `${uid}-panel-${item.key}`;
                const isOpen = openKey === item.key;
                return (
                  <li key={item.key} className="flex">
                    {item.panel ? (
                      <button
                        ref={(el) => {
                          triggerRefs.current[item.key] = el;
                        }}
                        type="button"
                        className="nav-trigger"
                        aria-expanded={isOpen}
                        aria-controls={panelId}
                        onClick={() => {
                          window.clearTimeout(timer.current);
                          setLangOpen(false);
                          setOpenKey(isOpen ? null : item.key);
                        }}
                        onMouseEnter={() => scheduleOpen(item.key)}
                      >
                        <span>{item.label}</span>
                        <ChevronDown size={16} className="nav-trigger__chevron" />
                      </button>
                    ) : (
                      <Link href={item.href} className="nav-trigger" onMouseEnter={() => scheduleClose()}>
                        <span>{item.label}</span>
                      </Link>
                    )}
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="flex items-center gap-2 nav:gap-5">
            {/* Language switcher — desktop */}
            <div className="relative hidden nav:block">
              <button
                ref={langButtonRef}
                type="button"
                className="lang-trigger"
                aria-expanded={langOpen}
                aria-controls={`${uid}-lang`}
                aria-label={`${labels.language}: ${current.nativeName}`}
                onClick={() => {
                  setOpenKey(null);
                  setLangOpen((v) => !v);
                }}
              >
                <span aria-hidden="true">{current.shortLabel}</span>
                <ChevronDown size={14} className="nav-trigger__chevron" />
              </button>
              <ul id={`${uid}-lang`} className="lang-menu" data-open={langOpen ? 'true' : undefined} hidden={!langOpen}>
                {locales.map((l) => (
                  <li key={l.code}>
                    <Link
                      href={pathname}
                      locale={l.code}
                      lang={l.htmlLang}
                      hrefLang={l.htmlLang}
                      aria-current={l.code === locale ? 'true' : undefined}
                      className="lang-menu__item"
                      onClick={() => setLocaleCookie(l.code)}
                    >
                      {l.nativeName}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <Link href={cta.href} className="btn btn--primary hidden nav:inline-flex">
              {cta.label}
            </Link>

            {/* Compact language + menu (< nav breakpoint) */}
            <div className="flex items-center nav:hidden">
              <ul className="lang-compact" aria-label={labels.language}>
                {locales.map((l) => (
                  <li key={l.code}>
                    <Link
                      href={pathname}
                      locale={l.code}
                      lang={l.htmlLang}
                      hrefLang={l.htmlLang}
                      aria-label={l.nativeName}
                      aria-current={l.code === locale ? 'true' : undefined}
                      className="lang-compact__item"
                      onClick={() => setLocaleCookie(l.code)}
                    >
                      {l.shortLabel}
                    </Link>
                  </li>
                ))}
              </ul>
              <button
                ref={menuButtonRef}
                type="button"
                className="menu-button"
                aria-expanded={drawerOpen}
                aria-controls={`${uid}-drawer`}
                onClick={() => setDrawerOpen(true)}
              >
                <span>{labels.openMenu}</span>
                <MenuIcon size={22} />
              </button>
            </div>
          </div>
        </div>

        {/* Mega panels */}
        {items.map((item) =>
          item.panel ? (
            <div
              key={item.key}
              id={`${uid}-panel-${item.key}`}
              className="mega"
              data-open={openKey === item.key ? 'true' : undefined}
              onMouseEnter={() => window.clearTimeout(timer.current)}
              onMouseLeave={scheduleClose}
            >
              <div className="container-vp">
                <MegaPanel panel={item.panel} featuredMedia={featuredMedia} />
              </div>
            </div>
          ) : null,
        )}
      </header>
      <div className="mega-scrim" data-open={openKey ? 'true' : undefined} aria-hidden="true" onClick={() => closePanels()} />

      <MobileDrawer
        id={`${uid}-drawer`}
        open={drawerOpen}
        onClose={() => {
          setDrawerOpen(false);
          menuButtonRef.current?.focus();
        }}
        items={items}
        cta={cta}
        locale={locale}
        locales={locales}
        labels={labels}
        pathname={pathname}
      />
    </>
  );
}

function PanelLinks({ links, className }: { links: NavLink[]; className?: string }) {
  return (
    <ul className={className}>
      {links.map((l) => (
        <li key={l.href}>
          <Link href={l.href} className="mega-link">
            <span className="mega-link__label">{l.label}</span>
            {l.summary && <span className="mega-link__summary">{l.summary}</span>}
          </Link>
        </li>
      ))}
    </ul>
  );
}

function PanelFooter({ links }: { links: NavLink[] }) {
  return (
    <div className="mega__footer">
      {links.map((l) => (
        <Link key={l.href} href={l.href} className="link-text">
          {l.label}
          <ArrowEnd size={16} />
        </Link>
      ))}
    </div>
  );
}

function MegaPanel({ panel, featuredMedia }: { panel: NavPanel; featuredMedia: ReactNode }) {
  switch (panel.kind) {
    case 'solutions':
      return (
        <div className="grid-vp gap-y-8">
          <div className="col-span-12 xl:col-span-8">
            <PanelLinks links={panel.items} className="mega-grid mega-grid--2" />
            <PanelFooter links={panel.footer} />
          </div>
          <Link href={panel.featured.href} className="mega-feature col-span-12 xl:col-span-4">
            <span className="mega-feature__media">{featuredMedia}</span>
            <span className="mega-feature__eyebrow">{panel.featured.eyebrow}</span>
            <span className="mega-feature__title">{panel.featured.title}</span>
            <span className="mega-feature__name">
              {panel.featured.name}
              <ArrowEnd size={16} />
            </span>
          </Link>
        </div>
      );
    case 'products':
      return (
        <div className="grid-vp gap-y-6">
          <p className="mega-intro col-span-12 lg:col-span-4">{panel.intro}</p>
          <div className="col-span-12 lg:col-span-8">
            <PanelLinks links={panel.items} className="mega-grid mega-grid--2" />
            <PanelFooter links={panel.footer} />
          </div>
        </div>
      );
    case 'industries':
      return (
        <div>
          <PanelLinks links={panel.items} className="mega-grid mega-grid--3" />
          <PanelFooter links={panel.footer} />
        </div>
      );
    case 'services':
      return (
        <div className="grid-vp gap-y-8">
          <div className="col-span-12 lg:col-span-7">
            <PanelLinks links={panel.items} className="mega-grid mega-grid--2" />
            <PanelFooter links={panel.footer} />
          </div>
          {/* The approach is a real sequence, so it is numbered (§19.4) */}
          <ol className="mega-steps col-span-12 lg:col-span-5">
            {panel.steps.map((s, i) => (
              <li key={s}>
                <span className="t-num mega-steps__n">{String(i + 1).padStart(2, '0')}</span>
                <span>{s}</span>
              </li>
            ))}
          </ol>
        </div>
      );
    case 'about':
      return <PanelLinks links={panel.items} className="mega-grid mega-grid--3" />;
  }
}

function MobileDrawer({
  id,
  open,
  onClose,
  items,
  cta,
  locale,
  locales,
  labels,
  pathname,
}: {
  id: string;
  open: boolean;
  onClose: () => void;
  items: NavItem[];
  cta: { href: string; label: string };
  locale: Locale;
  locales: LocaleOption[];
  labels: Labels;
  pathname: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const [section, setSection] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    const root = document.documentElement;
    const prev = root.style.overflow;
    root.style.overflow = 'hidden';
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
        return;
      }
      if (e.key !== 'Tab' || !ref.current) return;
      // Focus trap
      const focusables = ref.current.querySelectorAll<HTMLElement>('a[href], button:not([disabled])');
      const visible = Array.from(focusables).filter((el) => el.offsetParent !== null);
      const first = visible[0];
      const last = visible[visible.length - 1];
      if (!first || !last) return;
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener('keydown', onKey);
    return () => {
      root.style.overflow = prev;
      document.removeEventListener('keydown', onKey);
    };
  }, [open, onClose]);

  return (
    <div
      ref={ref}
      id={id}
      role="dialog"
      aria-modal="true"
      aria-label={labels.mobileNav}
      className="drawer theme-dark"
      data-open={open ? 'true' : undefined}
      inert={!open}
    >
      <div className="container-vp drawer__bar">
        <Link href="/" aria-label={labels.home} onClick={onClose}>
          <Wordmark className="text-[1.25rem]" />
        </Link>
        <button ref={closeRef} type="button" className="menu-button" onClick={onClose}>
          <span>{labels.closeMenu}</span>
          <CloseIcon size={22} />
        </button>
      </div>

      <nav aria-label={labels.mainNav} className="drawer__body container-vp">
        <ul>
          {items.map((item) => {
            const sectionId = `${id}-${item.key}`;
            const expanded = section === item.key;
            const links = item.panel ? panelLinks(item.panel) : null;
            return (
              <li key={item.key} className="drawer__item">
                {links ? (
                  <>
                    <button
                      type="button"
                      className="drawer__trigger"
                      aria-expanded={expanded}
                      aria-controls={sectionId}
                      onClick={() => setSection(expanded ? null : item.key)}
                    >
                      <span>{item.label}</span>
                      <ChevronDown size={20} className="nav-trigger__chevron" />
                    </button>
                    <ul id={sectionId} className="drawer__links" hidden={!expanded}>
                      {links.map((l) => (
                        <li key={l.href}>
                          <Link href={l.href} onClick={onClose} className="drawer__link">
                            {l.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </>
                ) : (
                  <Link href={item.href} className="drawer__trigger" onClick={onClose}>
                    <span>{item.label}</span>
                  </Link>
                )}
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="drawer__footer container-vp">
        <ul className="drawer__langs" aria-label={labels.language}>
          {locales.map((l) => (
            <li key={l.code}>
              <Link
                href={pathname}
                locale={l.code}
                lang={l.htmlLang}
                hrefLang={l.htmlLang}
                aria-current={l.code === locale ? 'true' : undefined}
                onClick={() => setLocaleCookie(l.code)}
              >
                {l.nativeName}
              </Link>
            </li>
          ))}
        </ul>
        <Link href={cta.href} className="btn btn--primary w-full" onClick={onClose}>
          {cta.label}
        </Link>
      </div>
    </div>
  );
}

function panelLinks(panel: NavPanel): NavLink[] {
  switch (panel.kind) {
    case 'solutions':
    case 'products':
    case 'industries':
    case 'services':
      return [...panel.items, ...panel.footer];
    case 'about':
      return panel.items;
  }
}
