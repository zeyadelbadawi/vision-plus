'use client';

import { useRef, useState } from 'react';
import { LAB_MESSAGE, beatAt, type LabMode } from './lab-frame-driver';

const MODES: { mode: LabMode; width: number; label: string }[] = [
  { mode: 'pinned', width: 1280, label: 'Pinned (desktop)' },
  { mode: 'stepped', width: 390, label: 'Stepped (390 px)' },
  { mode: 'lite', width: 1280, label: 'Lite (desktop, save-data)' },
  { mode: 'static', width: 1280, label: 'Static (reduced motion)' },
];
const LOCALES = ['en', 'ar', 'zh'] as const;

/**
 * One scene in the scene lab (§23.6 authoring step 4, P5B-01), preview only: mode, locale (ar = RTL) and a progress
 * slider that scrubs the scene in its frame. Internal tooling: the labels are not website copy.
 */
export function SceneLab({ scene, title, kind, beats, locale }: { scene: string; title: string; kind: 'progress' | 'steps'; beats: number; locale: string }) {
  const frame = useRef<HTMLIFrameElement>(null);
  const [mode, setMode] = useState<LabMode>('pinned');
  const [lang, setLang] = useState(locale);
  const [p, setP] = useState(0);
  const width = MODES.find((m) => m.mode === mode)!.width;
  // the frame URL carries the start state; slider moves after load go by message (no reload)
  const [src, setSrc] = useState(`/${locale}/_lab/scenes/${scene}?mode=pinned&p=0`);
  const reload = (next: { mode?: LabMode; lang?: string }) => {
    const m = next.mode ?? mode;
    const l = next.lang ?? lang;
    setSrc(`/${l}/_lab/scenes/${scene}?mode=${m}&p=${p}`);
  };
  const send = (value: number) => frame.current?.contentWindow?.postMessage({ type: LAB_MESSAGE, p: value }, window.location.origin);
  const position = kind === 'progress' ? beatAt(p, beats) : Math.round(p * beats);

  return (
    <section className="lab-scene" aria-labelledby={`lab-${scene}`} data-lab-scene={scene}>
      <h2 id={`lab-${scene}`} className="t-h3">
        {title}
      </h2>
      <div className="lab-scene__controls">
        <label>
          Mode{' '}
          <select
            value={mode}
            onChange={(e) => {
              const m = e.target.value as LabMode;
              setMode(m);
              reload({ mode: m });
            }}
          >
            {MODES.map((m) => (
              <option key={m.mode} value={m.mode}>
                {m.label}
              </option>
            ))}
          </select>
        </label>
        <label>
          Locale{' '}
          <select
            value={lang}
            onChange={(e) => {
              setLang(e.target.value);
              reload({ lang: e.target.value });
            }}
          >
            {LOCALES.map((l) => (
              <option key={l} value={l}>
                {l === 'ar' ? 'ar (RTL)' : l}
              </option>
            ))}
          </select>
        </label>
        <label className="lab-scene__slider">
          Progress{' '}
          <input
            type="range"
            min={0}
            max={1}
            step={0.005}
            value={p}
            disabled={mode === 'static'}
            onChange={(e) => {
              const value = Number(e.target.value);
              setP(value);
              send(value);
            }}
          />
          <output className="t-num">
            {p.toFixed(3)} · {kind === 'progress' ? 'beat' : 'step'} {position}/{beats}
          </output>
        </label>
      </div>
      <div className="lab-scene__viewport">
        <iframe ref={frame} title={`${title} (${mode}, ${lang})`} src={src} width={width} height={820} onLoad={() => send(p)} />
      </div>
    </section>
  );
}
