'use client';

import { useEffect, useState, type CSSProperties, type ReactNode } from 'react';

/**
 * Canva presentation, click-to-load (MASTER_PROJECT_PLAN §33; P5A-11 notes §55.3.14). Nothing is requested from Canva
 * until the visitor chooses to load it: the poster and the approved "Load presentation" button show first. While the
 * iframe loads a skeleton is shown; if it has not loaded after 15 s, the approved fallback line and a contact link
 * appear (e.g. when the network blocks canva.com). Only rendered with a real, validated embed URL (D-06).
 */
export function CanvaEmbed({
  src,
  aspectRatio,
  title,
  poster,
  labels,
  fallbackAction,
}: {
  src: string;
  aspectRatio: string;
  title: string;
  poster: ReactNode;
  labels: { load: string; loadNotice: string; fallback: string };
  fallbackAction: ReactNode;
}) {
  const [state, setState] = useState<'poster' | 'loading' | 'loaded' | 'failed'>('poster');

  useEffect(() => {
    if (state !== 'loading') return;
    const timer = window.setTimeout(() => setState((s) => (s === 'loading' ? 'failed' : s)), 15000);
    return () => window.clearTimeout(timer);
  }, [state]);

  const frame = { aspectRatio } as CSSProperties;
  if (state === 'poster') {
    return (
      <div className="cp-frame" style={frame}>
        {poster}
        <div className="cp-frame__overlay">
          <button type="button" className="btn btn--primary" onClick={() => setState('loading')}>
            {labels.load}
          </button>
          <p className="t-caption">{labels.loadNotice}</p>
        </div>
      </div>
    );
  }
  return (
    <div className="cp-frame" style={frame} data-state={state}>
      {state === 'loading' && <span className="cp-frame__skeleton" aria-hidden="true" />}
      {state === 'failed' ? (
        <div className="cp-frame__fallback" role="status">
          <p>{labels.fallback}</p>
          {fallbackAction}
        </div>
      ) : (
        <iframe
          src={src}
          title={title}
          loading="lazy"
          allow="fullscreen"
          allowFullScreen
          referrerPolicy="strict-origin-when-cross-origin"
          className="cp-frame__iframe"
          onLoad={() => setState('loaded')}
        />
      )}
    </div>
  );
}
