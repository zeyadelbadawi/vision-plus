'use client';

import { useEffect } from 'react';
import { PIN_SCALE } from '@/components/scenes/scene-progress';

export type LabMode = 'pinned' | 'stepped' | 'lite' | 'static';
export const LAB_MESSAGE = 'vp-scene-lab';

/** Beat reached at overall progress p, the way the pinned CSS plays it (scene-progress.ts): 0 before the first. */
export function beatAt(p: number, beats: number): number {
  return p <= 0 ? 0 : Math.min(beats, Math.ceil(p * beats * PIN_SCALE));
}

/**
 * Scene lab frame driver (MASTER_PROJECT_PLAN §23.6 authoring step 4, P5B-01), preview only. It drives the one scene
 * on its page, rendered with `driver="manual"`, so the MotionController leaves it alone:
 *  - mode (query `?mode=`): `static` drops `motion-ok` (the reduced-motion / no-JS composition), `lite` adds
 *    `scene-lite` (stepped frames on desktop, §23.5 rule 8); `pinned` and `stepped` follow the frame width.
 *  - progress (query `?p=`, then postMessage `{ type: 'vp-scene-lab', p }` from the same origin): `progress` scenes get
 *    --p plus the current beat and, in stepped modes, the frames up to that beat; `steps` scenes get the step.
 */
export function LabFrameDriver({ kind, beats }: { kind: 'progress' | 'steps'; beats: number }) {
  useEffect(() => {
    const html = document.documentElement;
    const query = new URLSearchParams(window.location.search);
    const mode = (query.get('mode') ?? 'pinned') as LabMode;
    html.classList.add('lab-frame');
    if (mode === 'static') html.classList.remove('motion-ok');
    if (mode === 'lite') html.classList.add('scene-lite');
    const root = document.querySelector<HTMLElement>('[data-driver="manual"]');
    if (!root) return;

    const apply = (p: number) => {
      if (mode === 'static') return; // the static composition has no live state
      const current = kind === 'progress' ? beatAt(p, beats) : Math.round(p * beats);
      root.dataset.live = '';
      root.dataset.current = String(current);
      root.dataset.reached = Array.from({ length: current }, (_, i) => i + 1).join(' ');
      if (kind === 'progress') {
        root.style.setProperty('--p', p.toFixed(4));
        root.querySelectorAll<HTMLElement>('[data-frame]').forEach((f) => {
          if (Number(f.dataset.frame) <= current) f.setAttribute('data-inview', '');
          else f.removeAttribute('data-inview');
        });
      }
    };
    apply(Math.min(1, Math.max(0, Number(query.get('p') ?? 0)) || 0));
    const onMessage = (e: MessageEvent) => {
      if (e.origin !== window.location.origin || e.data?.type !== LAB_MESSAGE) return;
      apply(Math.min(1, Math.max(0, Number(e.data.p) || 0)));
    };
    window.addEventListener('message', onMessage);
    return () => window.removeEventListener('message', onMessage);
  }, [kind, beats]);
  return null;
}
