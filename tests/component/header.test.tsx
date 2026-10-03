// @vitest-environment jsdom
import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';
import { act, cleanup, fireEvent, render, screen, within } from '@testing-library/react';
import { HeaderClient, type LocaleOption } from '@/components/layout/header-client';
import type { NavItem } from '@/content/navigation';

// Component tests (MASTER_PROJECT_PLAN §40, P5-T2): the header island in isolation. The browser journeys (open with
// the keyboard, switch language, drawer focus trap) are in tests/e2e/home.spec.ts; these pin the timing and edge rules.
let path = '/en/solutions/access-control';
vi.mock('next/navigation', () => ({
  useParams: () => ({ locale: path.split('/')[1] }),
  usePathname: () => path,
  useRouter: () => ({ push: vi.fn(), replace: vi.fn(), prefetch: vi.fn() }),
}));

const items: NavItem[] = [
  {
    key: 'solutions',
    label: 'Solutions',
    href: '/solutions',
    panel: {
      kind: 'solutions',
      items: [{ href: '/solutions/access-control', label: 'Access Control' }],
      featured: { href: '/solutions/mobile-nvr-mobile-surveillance', eyebrow: 'Featured', title: 'Mobile', name: 'Mobile NVR' },
      footer: [{ href: '/solutions', label: 'All solutions' }],
    },
  },
  {
    key: 'industries',
    label: 'Industries',
    href: '/industries',
    panel: { kind: 'industries', items: [{ href: '/industries#retail', label: 'Retail' }], footer: [] },
  },
  { key: 'projects', label: 'Projects', href: '/projects' },
];
const locales: LocaleOption[] = [
  { code: 'en', nativeName: 'English', shortLabel: 'EN', htmlLang: 'en' },
  { code: 'ar', nativeName: 'العربية', shortLabel: 'ع', htmlLang: 'ar' },
  { code: 'zh', nativeName: '简体中文', shortLabel: '中', htmlLang: 'zh-Hans' },
];
const labels = { home: 'Home', mainNav: 'Main', mobileNav: 'Mobile', openMenu: 'Open menu', closeMenu: 'Close menu', language: 'Language' };
const header = () =>
  render(<HeaderClient items={items} cta={{ href: '/contact', label: 'Request' }} locale="en" locales={locales} labels={labels} featuredMedia={null} />);
const trigger = (name: string) => screen.getAllByRole('button', { name }).find((b) => b.classList.contains('nav-trigger'))!;
const panelOf = (button: HTMLElement) => document.getElementById(button.getAttribute('aria-controls')!)!;

beforeAll(() => {
  // jsdom has no layout, so offsetParent is always null; the drawer's focus trap uses it to skip hidden elements.
  Object.defineProperty(HTMLElement.prototype, 'offsetParent', {
    configurable: true,
    get(this: HTMLElement) {
      return this.closest('[hidden]') ? null : this.parentElement;
    },
  });
});
beforeEach(() => {
  path = '/en/solutions/access-control';
  document.documentElement.style.overflow = '';
});
afterEach(() => {
  cleanup();
  vi.useRealTimers();
});

describe('navigation disclosure (desktop)', () => {
  it('opens one panel at a time and reflects it in aria-expanded and data-open', () => {
    header();
    const solutions = trigger('Solutions');
    const industries = trigger('Industries');
    fireEvent.click(solutions);
    expect(solutions.getAttribute('aria-expanded')).toBe('true');
    expect(panelOf(solutions).dataset.open).toBe('true');
    fireEvent.click(industries);
    expect(solutions.getAttribute('aria-expanded')).toBe('false');
    expect(panelOf(solutions).dataset.open).toBeUndefined();
    expect(industries.getAttribute('aria-expanded')).toBe('true');
    fireEvent.click(industries);
    expect(industries.getAttribute('aria-expanded')).toBe('false');
  });

  it('Escape closes the open panel and returns focus to its trigger', () => {
    header();
    const solutions = trigger('Solutions');
    fireEvent.click(solutions);
    within(panelOf(solutions))
      .getByRole('link', { name: /Access Control/ })
      .focus();
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(solutions.getAttribute('aria-expanded')).toBe('false');
    expect(document.activeElement).toBe(solutions);
  });

  it('a pointer press outside the header closes it; inside it does not', () => {
    header();
    const solutions = trigger('Solutions');
    fireEvent.click(solutions);
    fireEvent.pointerDown(panelOf(solutions));
    expect(solutions.getAttribute('aria-expanded')).toBe('true');
    fireEvent.pointerDown(document.body);
    expect(solutions.getAttribute('aria-expanded')).toBe('false');
  });

  it('hover opens after 150 ms, moves instantly between triggers, and closes 200 ms after leaving', () => {
    vi.useFakeTimers();
    header();
    const solutions = trigger('Solutions');
    fireEvent.mouseEnter(solutions);
    act(() => vi.advanceTimersByTime(149));
    expect(solutions.getAttribute('aria-expanded')).toBe('false');
    act(() => vi.advanceTimersByTime(1));
    expect(solutions.getAttribute('aria-expanded')).toBe('true');
    fireEvent.mouseEnter(trigger('Industries'));
    expect(trigger('Industries').getAttribute('aria-expanded')).toBe('true');
    fireEvent.mouseLeave(solutions.closest('nav')!);
    act(() => vi.advanceTimersByTime(199));
    expect(trigger('Industries').getAttribute('aria-expanded')).toBe('true');
    act(() => vi.advanceTimersByTime(1));
    expect(trigger('Industries').getAttribute('aria-expanded')).toBe('false');
  });
});

describe('language switcher', () => {
  it('links every locale to the same page and marks the current one', () => {
    header();
    const menu = screen.getByRole('button', { name: 'Language: English' });
    fireEvent.click(menu);
    expect(menu.getAttribute('aria-expanded')).toBe('true');
    const list = document.getElementById(menu.getAttribute('aria-controls')!)!;
    const links = within(list).getAllByRole('link');
    expect(links.map((a) => a.getAttribute('href'))).toEqual(['/en/solutions/access-control', '/ar/solutions/access-control', '/zh/solutions/access-control']);
    expect(links.map((a) => a.getAttribute('hreflang'))).toEqual(['en', 'ar', 'zh-Hans']);
    expect(links.map((a) => a.getAttribute('aria-current'))).toEqual(['true', null, null]);
  });

  it('maps the home page to each locale root and remembers the choice in a cookie', () => {
    path = '/en';
    header();
    const compact = screen.getAllByRole('link', { name: 'العربية' })[0]!;
    expect(compact.getAttribute('href')).toBe('/ar');
    fireEvent.click(compact);
    expect(document.cookie).toContain('NEXT_LOCALE=ar');
  });

  it('Escape closes the language menu and returns focus to its button', () => {
    header();
    const menu = screen.getByRole('button', { name: 'Language: English' });
    fireEvent.click(menu);
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(menu.getAttribute('aria-expanded')).toBe('false');
    expect(document.activeElement).toBe(menu);
  });
});

describe('mobile drawer', () => {
  const open = () => {
    header();
    const menuButton = screen.getAllByRole('button').find((b) => b.getAttribute('aria-controls')?.endsWith('-drawer'))!;
    fireEvent.click(menuButton);
    const drawer = screen.getByRole('dialog', { name: 'Mobile' });
    return { menuButton, drawer };
  };

  it('opens as a modal dialog, focuses its close button and locks page scroll', () => {
    const { menuButton, drawer } = open();
    expect(menuButton.getAttribute('aria-expanded')).toBe('true');
    expect(drawer.getAttribute('aria-modal')).toBe('true');
    expect(drawer.hasAttribute('inert')).toBe(false);
    expect(drawer.contains(document.activeElement)).toBe(true);
    expect(document.documentElement.style.overflow).toBe('hidden');
  });

  it('traps Tab inside the drawer in both directions, skipping collapsed sections', () => {
    const { drawer } = open();
    const focusables = [...drawer.querySelectorAll<HTMLElement>('a[href], button:not([disabled])')].filter((el) => !el.closest('[hidden]'));
    const first = focusables[0]!;
    const last = focusables[focusables.length - 1]!;
    last.focus();
    fireEvent.keyDown(document, { key: 'Tab' });
    expect(document.activeElement).toBe(first);
    fireEvent.keyDown(document, { key: 'Tab', shiftKey: true });
    expect(document.activeElement).toBe(last);
  });

  it('accordion sections toggle aria-expanded and their list', () => {
    const { drawer } = open();
    const section = within(drawer).getByRole('button', { name: /Solutions/ });
    const list = document.getElementById(section.getAttribute('aria-controls')!)!;
    expect(section.getAttribute('aria-expanded')).toBe('false');
    expect(list.hidden).toBe(true);
    fireEvent.click(section);
    expect(section.getAttribute('aria-expanded')).toBe('true');
    expect(list.hidden).toBe(false);
  });

  it('Escape closes it, makes it inert, restores page scroll and returns focus to the menu button', () => {
    const { menuButton, drawer } = open();
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(menuButton.getAttribute('aria-expanded')).toBe('false');
    expect(drawer.hasAttribute('inert')).toBe(true);
    expect(document.documentElement.style.overflow).toBe('');
    expect(document.activeElement).toBe(menuButton);
  });
});
