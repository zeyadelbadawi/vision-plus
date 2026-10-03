'use client';

import { useRef, useState, type KeyboardEvent, type PointerEvent, type ReactNode } from 'react';
import { ArrowEnd, CloseIcon } from '@/components/ui/icons';

interface Labels {
  /** Gallery region label ("Project gallery"). */
  label: string;
  /** "Open image {n} of {total}", already formatted per thumbnail. */
  open: string[];
  previous: string;
  next: string;
  close: string;
}

/**
 * Project gallery with an accessible lightbox (MASTER_PROJECT_PLAN §26.7, §35; notes §55.3.11). Thumbnails are
 * buttons; the lightbox is a native modal <dialog>, so the rest of the page is inert, focus stays inside and Esc
 * closes it (focus then returns to the thumbnail that opened it). Arrow keys move between images, mirrored in RTL
 * (the visual "next" is always toward the inline end); a horizontal swipe does the same on touch. `thumbs` and
 * `slides` are server-rendered image slots in the same order; `captions` are optional.
 */
export function ProjectGallery({
  thumbs,
  slides,
  captions,
  labels,
}: {
  thumbs: ReactNode[];
  slides: ReactNode[];
  captions?: (string | undefined)[];
  labels: Labels;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const opener = useRef<HTMLButtonElement | null>(null);
  const swipe = useRef<number | null>(null);
  const [index, setIndex] = useState(0);
  const total = slides.length;
  const go = (step: number) => setIndex((i) => (i + step + total) % total);

  const open = (i: number, button: HTMLButtonElement) => {
    opener.current = button;
    setIndex(i);
    dialog.current?.showModal();
  };
  const onKey = (e: KeyboardEvent<HTMLDialogElement>) => {
    if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
    const rtl = getComputedStyle(e.currentTarget).direction === 'rtl';
    const forward = (e.key === 'ArrowRight') !== rtl;
    e.preventDefault();
    go(forward ? 1 : -1);
  };
  const onPointerDown = (e: PointerEvent<HTMLDivElement>) => {
    swipe.current = e.pointerType === 'mouse' ? null : e.clientX;
  };
  const onPointerUp = (e: PointerEvent<HTMLDivElement>) => {
    if (swipe.current === null) return;
    const dx = e.clientX - swipe.current;
    swipe.current = null;
    if (Math.abs(dx) < 40) return;
    const rtl = getComputedStyle(e.currentTarget).direction === 'rtl';
    go(dx < 0 !== rtl ? 1 : -1); // swipe toward the inline start shows the next image
  };

  return (
    <div className="gallery">
      <ul className="gallery__grid" aria-label={labels.label}>
        {thumbs.map((t, i) => (
          <li key={i}>
            <button type="button" className="gallery__thumb" aria-label={labels.open[i]} onClick={(e) => open(i, e.currentTarget)}>
              {t}
            </button>
          </li>
        ))}
      </ul>
      <dialog ref={dialog} className="lightbox" aria-label={labels.label} onKeyDown={onKey} onClose={() => opener.current?.focus()}>
        <div className="lightbox__bar">
          <p className="lightbox__count t-num" aria-live="polite" dir="ltr">
            {index + 1} / {total}
          </p>
          <button type="button" className="lightbox__btn" onClick={() => dialog.current?.close()} aria-label={labels.close}>
            <CloseIcon size={20} />
          </button>
        </div>
        <div className="lightbox__stage" onPointerDown={onPointerDown} onPointerUp={onPointerUp}>
          {slides.map((s, i) => (
            <figure key={i} className="lightbox__slide" hidden={i !== index}>
              {s}
              {captions?.[i] && <figcaption className="t-body-sm">{captions[i]}</figcaption>}
            </figure>
          ))}
        </div>
        <div className="lightbox__nav">
          <button type="button" className="lightbox__btn" onClick={() => go(-1)} aria-label={labels.previous}>
            <span className="lightbox__prev">
              <ArrowEnd size={20} />
            </span>
          </button>
          <button type="button" className="lightbox__btn" onClick={() => go(1)} aria-label={labels.next}>
            <ArrowEnd size={20} />
          </button>
        </div>
      </dialog>
    </div>
  );
}
