'use client';

import { useEffect, useState } from 'react';
import { CloseIcon } from '@/components/ui/icons';

/**
 * Discreet preview-build indicator (CONTENT_MODE=preview only). Tells reviewers what is
 * interim so nothing placeholder-driven is mistaken for final content. Never rendered in production.
 */
export function PreviewNotice({ label, title, lines, closeLabel }: { label: string; title: string; lines: string[]; closeLabel: string }) {
  const [open, setOpen] = useState(false);
  const [shown, setShown] = useState(false);
  // Appears once the reader leaves the hero, so it never covers first-view content.
  useEffect(() => {
    const onScroll = () => setShown(window.scrollY > 480);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  if (!shown && !open) return null;
  return (
    <div className="preview-notice" data-open={open ? 'true' : undefined}>
      {open ? (
        <div className="preview-notice__panel" role="dialog" aria-label={title}>
          <div className="flex items-start justify-between gap-4">
            <p className="font-medium">{title}</p>
            <button type="button" onClick={() => setOpen(false)} aria-label={closeLabel} className="-m-2 p-2">
              <CloseIcon size={18} />
            </button>
          </div>
          <ul className="mt-3 grid gap-2">
            {lines.map((l) => (
              <li key={l}>{l}</li>
            ))}
          </ul>
        </div>
      ) : (
        <button type="button" className="preview-notice__pill" onClick={() => setOpen(true)} aria-expanded={false}>
          <span className="preview-notice__dot" aria-hidden="true" />
          {label}
        </button>
      )}
    </div>
  );
}
