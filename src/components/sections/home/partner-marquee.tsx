'use client';

import { useState, type ReactNode } from 'react';
import { PauseIcon, PlayIcon } from '@/components/ui/icons';

/**
 * Partner logo marquee (§34, motion "Marquee" §23.3): slow continuous scroll, pauses on hover/focus,
 * visible pause control (WCAG 2.2.2), static wrapped grid under reduced motion. The duplicate row is
 * aria-hidden so logos are announced once.
 */
export function PartnerMarquee({ children, pauseLabel, playLabel }: { children: ReactNode; pauseLabel: string; playLabel: string }) {
  const [paused, setPaused] = useState(false);
  return (
    <div className="marquee" data-paused={paused ? 'true' : undefined}>
      <div className="marquee__viewport">
        <div className="marquee__track">
          <div className="marquee__group">{children}</div>
          <div className="marquee__group" aria-hidden="true" inert>
            {children}
          </div>
        </div>
      </div>
      <button type="button" className="marquee__toggle" onClick={() => setPaused((p) => !p)} aria-pressed={paused}>
        {paused ? <PlayIcon size={16} /> : <PauseIcon size={16} />}
        <span>{paused ? playLabel : pauseLabel}</span>
      </button>
    </div>
  );
}
