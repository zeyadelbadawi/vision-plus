// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { act, cleanup, fireEvent, render, screen } from '@testing-library/react';
import { IndustryExplorer } from '@/components/sections/industries/industry-explorer';

// Component tests (MASTER_PROJECT_PLAN §40, P5-T2): the Industries explorer's client behaviour. The server markup is
// pinned in tests/unit/industry-explorer.test.tsx and the browser journey in tests/e2e/pages.spec.ts.
const items = ['retail', 'hospitality', 'education'].map((slug) => ({ slug, name: slug.toUpperCase() }));
const panels = items.map((i) => (
  <section key={i.slug} id={i.slug}>
    <h3 id={`${i.slug}-title`} tabIndex={-1}>
      {i.name}
    </h3>
  </section>
));
let desktop = true;

beforeEach(() => {
  desktop = true;
  window.history.replaceState(null, '', '/en/industries');
  window.matchMedia = vi.fn().mockImplementation((q: string) => ({
    matches: desktop,
    media: q,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  }));
  Element.prototype.scrollIntoView = vi.fn();
});
afterEach(cleanup);

const explorer = () => render(<IndustryExplorer items={items} panels={panels} label="Industries" />);
const selected = () => [...document.querySelectorAll('.ix__slot')].findIndex((s) => s.hasAttribute('data-selected'));
const current = () => screen.getAllByRole('link').map((a) => a.getAttribute('aria-current'));

describe('IndustryExplorer (desktop)', () => {
  it('selects the first industry when there is no hash', () => {
    explorer();
    expect(document.querySelector('.ix')!.hasAttribute('data-live')).toBe(true);
    expect(selected()).toBe(0);
    expect(current()).toEqual(['true', null, null]);
  });

  it('a click selects without navigating: hash replaced (no history entry), focus on the panel heading', () => {
    explorer();
    const before = window.history.length;
    const link = screen.getByRole('link', { name: 'HOSPITALITY' });
    const notPrevented = fireEvent.click(link);
    expect(notPrevented).toBe(false); // default prevented: no jump to the stacked section
    expect(window.location.hash).toBe('#hospitality');
    expect(window.history.length).toBe(before);
    expect(selected()).toBe(1);
    expect(current()).toEqual([null, 'true', null]);
    expect(document.activeElement?.id).toBe('hospitality-title');
  });

  it('follows a hash set from outside (header menu, typed URL) and brings the explorer into view', () => {
    explorer();
    act(() => {
      window.history.replaceState(null, '', '#education');
      window.dispatchEvent(new HashChangeEvent('hashchange'));
    });
    expect(selected()).toBe(2);
    expect(Element.prototype.scrollIntoView).toHaveBeenCalled();
  });

  it('ignores an unknown hash and keeps the first industry', () => {
    window.history.replaceState(null, '', '/en/industries#nowhere');
    explorer();
    expect(selected()).toBe(0);
  });
});

describe('IndustryExplorer (mobile)', () => {
  it('stays a plain index of anchors: no selection, and a click is a normal anchor jump', () => {
    desktop = false;
    explorer();
    expect(document.querySelector('.ix')!.hasAttribute('data-live')).toBe(false);
    expect(selected()).toBe(-1);
    expect(fireEvent.click(screen.getByRole('link', { name: 'EDUCATION' }))).toBe(true); // not prevented
  });
});
