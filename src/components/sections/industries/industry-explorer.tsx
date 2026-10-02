'use client';

import { useEffect, useReducer, useRef, useSyncExternalStore, type MouseEvent, type ReactNode } from 'react';

interface Entry {
  slug: string;
  name: string;
  /** `textAttrs` for untranslated placeholder names (lang/dir). */
  attrs?: { lang?: string; dir?: 'ltr' };
}

const DESKTOP = '(min-width: 1024px)';

// External browser state read without effects; the server snapshots match the server markup (no selection).
const subscribeDesktop = (cb: () => void) => {
  const mq = window.matchMedia(DESKTOP);
  mq.addEventListener('change', cb);
  return () => mq.removeEventListener('change', cb);
};
// Next's <Link> changes the hash with pushState, which fires no event: after any click, re-read the hash once the
// router has committed (re-reading is cheap; React ignores an unchanged snapshot).
const subscribeHash = (cb: () => void) => {
  const timers: number[] = [];
  const onClick = () => timers.push(window.setTimeout(cb, 0), window.setTimeout(cb, 120), window.setTimeout(cb, 400));
  window.addEventListener('hashchange', cb);
  window.addEventListener('popstate', cb);
  document.addEventListener('click', onClick);
  return () => {
    window.removeEventListener('hashchange', cb);
    window.removeEventListener('popstate', cb);
    document.removeEventListener('click', onClick);
    timers.forEach((t) => window.clearTimeout(t));
  };
};
const readDesktop = () => window.matchMedia(DESKTOP).matches;
const readHash = () => decodeURIComponent(window.location.hash.slice(1));
const serverFalse = () => false;
const serverEmpty = () => '';

/**
 * Industries explorer (MASTER_PROJECT_PLAN §26.4, §55.3.8). The server renders the index and all the anchored
 * industry sections (`panels`), which is the page without JavaScript and on mobile (chip index + stacked sections).
 * On desktop with JavaScript it becomes master–detail: CSS shows only the selected panel, a click selects without
 * scrolling and moves focus to the panel heading, and the hash follows the selection (replaceState: no history entries).
 * Hydration renders the server state; the selection appears in the following client render.
 */
export function IndustryExplorer({ items, panels, label }: { items: Entry[]; panels: ReactNode[]; label: string }) {
  const desktop = useSyncExternalStore(subscribeDesktop, readDesktop, serverFalse);
  const hash = useSyncExternalStore(subscribeHash, readHash, serverEmpty);
  const [, rerender] = useReducer((n: number) => n + 1, 0);
  const root = useRef<HTMLDivElement>(null);
  const focusNext = useRef(false);

  const fromHash = items.findIndex((i) => i.slug === hash);
  const selected = fromHash >= 0 ? fromHash : 0;
  const live = desktop;

  useEffect(() => {
    if (!live) return;
    if (focusNext.current) {
      // our own selection: the explorer is already in view; move focus to the panel heading
      focusNext.current = false;
      document.getElementById(`${items[selected]!.slug}-title`)?.focus({ preventScroll: true });
    } else if (fromHash >= 0) {
      // a hash from outside (load, header menu, typed): the browser or router aimed at the stacked or hidden section,
      // so bring the explorer into view once the panel shows
      root.current?.scrollIntoView({ block: 'start' });
    }
  }, [live, selected, fromHash, items]);

  const choose = (e: MouseEvent<HTMLAnchorElement>, i: number) => {
    if (!live) return; // mobile: a plain anchor jump to the stacked section
    e.preventDefault();
    focusNext.current = true;
    window.history.replaceState(window.history.state, '', `#${items[i]!.slug}`);
    rerender(); // replaceState fires no hashchange; the next render reads the new hash
  };

  return (
    <div ref={root} className="ix" data-live={live ? '' : undefined}>
      <nav className="ix__index" aria-label={label}>
        <ul className="ix__list">
          {items.map((it, i) => (
            <li key={it.slug}>
              <a
                href={`#${it.slug}`}
                className="ix__link"
                aria-current={live && selected === i ? 'true' : undefined}
                onClick={(e) => choose(e, i)}
                {...it.attrs}
              >
                {it.name}
              </a>
            </li>
          ))}
        </ul>
      </nav>
      <div className="ix__panels">
        {panels.map((p, i) => (
          <div key={items[i]!.slug} className="ix__slot" data-selected={live && selected === i ? '' : undefined}>
            {p}
          </div>
        ))}
      </div>
    </div>
  );
}
