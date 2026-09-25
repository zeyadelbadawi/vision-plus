'use client';

import { useEffect } from 'react';

/**
 * The single shared motion controller (§23.5). ~1 KB. It never animates anything itself:
 *  - [data-reveal]   → sets data-inview once the element enters the viewport (CSS does the rest)
 *  - [data-progress] → writes --p (0→1) while the element is on screen (CSS maps it to visuals)
 *      data-progress="track"  : 0 when the top is at 85% of the viewport, 1 when it reaches 40%
 *      data-progress="follow" : follows the element's full height as it passes 70% of the viewport
 * Nothing runs when the user prefers reduced motion; CSS then shows final states.
 */
export function MotionController() {
  useEffect(() => {
    const root = document.documentElement;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (reduce.matches || !root.classList.contains('motion-ok')) return;

    const reveal = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            e.target.setAttribute('data-inview', '');
            reveal.unobserve(e.target);
          }
        }
      },
      { rootMargin: '0px 0px -12% 0px', threshold: 0.15 },
    );
    document.querySelectorAll('[data-reveal]').forEach((el) => reveal.observe(el));

    const active = new Set<HTMLElement>();
    let frame = 0;
    const clamp = (n: number) => Math.min(1, Math.max(0, n));
    const tick = () => {
      frame = 0;
      const vh = window.innerHeight;
      for (const el of active) {
        const r = el.getBoundingClientRect();
        const mode = el.dataset.progress;
        const p = mode === 'follow' ? (vh * 0.7 - r.top) / Math.max(r.height, 1) : (vh * 0.85 - r.top) / (vh * 0.45);
        el.style.setProperty('--p', clamp(p).toFixed(4));
      }
    };
    const schedule = () => {
      if (!frame && active.size) frame = requestAnimationFrame(tick);
    };
    const progress = new IntersectionObserver((entries) => {
      for (const e of entries) {
        const el = e.target as HTMLElement;
        if (e.isIntersecting) active.add(el);
        else {
          active.delete(el);
          // settle to the nearest end so off-screen elements don't freeze mid-way
          el.style.setProperty('--p', e.boundingClientRect.top < 0 ? '1' : '0');
        }
      }
      schedule();
    });
    document.querySelectorAll<HTMLElement>('[data-progress]').forEach((el) => {
      el.style.setProperty('--p', '0');
      progress.observe(el);
    });
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule, { passive: true });

    const onChange = () => {
      if (reduce.matches) root.classList.remove('motion-ok');
    };
    reduce.addEventListener('change', onChange);

    return () => {
      reveal.disconnect();
      progress.disconnect();
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
      reduce.removeEventListener('change', onChange);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);
  return null;
}

/** Runs before first paint: enables motion styles only when motion is allowed (and JS runs). */
export const motionBootScript = `(function(){try{var d=document.documentElement;d.classList.add('js');if(!window.matchMedia('(prefers-reduced-motion: reduce)').matches)d.classList.add('motion-ok');}catch(e){}})();`;
