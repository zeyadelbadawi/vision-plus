'use client';

import { useState, type ReactNode } from 'react';

/**
 * Click-to-load map (MASTER_PROJECT_PLAN §42.4): nothing is requested from Google, and no cookie is set, until the
 * visitor chooses to load the map. Before that the poster (the `CONTACT-MAP-*` image when final, otherwise a neutral
 * surface with the address) and a button are shown; after, an iframe with a title. Used only with a real embed URL.
 */
export function ClickToLoadMap({
  src,
  title,
  buttonLabel,
  notice,
  poster,
}: {
  src: string;
  title: string;
  buttonLabel: string;
  notice: string;
  poster: ReactNode;
}) {
  const [loaded, setLoaded] = useState(false);
  if (loaded) {
    return (
      <div className="office-map">
        <iframe src={src} title={title} loading="lazy" referrerPolicy="no-referrer-when-downgrade" className="office-map__frame" />
      </div>
    );
  }
  return (
    <div className="office-map office-map--poster">
      {poster}
      <div className="office-map__overlay">
        <button type="button" className="btn btn--secondary" onClick={() => setLoaded(true)}>
          {buttonLabel}
        </button>
        <p className="t-caption">{notice}</p>
      </div>
    </div>
  );
}
