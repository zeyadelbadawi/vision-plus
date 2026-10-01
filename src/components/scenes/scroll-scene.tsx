import type { CSSProperties, ReactNode } from 'react';
import type { Locale } from '@/i18n/locales';
import { textAttrs } from '@/lib/text-attrs';

/**
 * Shared scene engine (MASTER_PROJECT_PLAN §23.5), server-rendered:
 *  - pinned (desktop ≥ lg, motion allowed): the stage is sticky while the step texts scroll past. The
 *    existing MotionController writes --p on this root (data-progress="follow"); scenes.css derives
 *    each beat's progress --b1…--bN from it. No scene-specific JavaScript.
 *  - stepped (mobile/tablet, and desktop on save-data / low-memory devices): each step shows its own
 *    cropped frame of the same artwork, which plays its beat once when it enters view.
 *  - static (reduced motion / no JS): every --bN keeps its registered initial value 1 → final state.
 * The step list is the real HTML text (approved copy) for screen readers and search engines; all
 * artwork is aria-hidden.
 */
export interface SceneBeat {
  key: string;
  title: string;
  text?: string;
  labels: string[];
}

/** Low-power heuristic (§23.5 rule 8): fall back to stepped mode even on desktop. */
const lowPowerScript = `(function(){try{var n=navigator,c=n.connection;if((c&&c.saveData)||(n.deviceMemory&&n.deviceMemory<=2))document.documentElement.classList.add('scene-lite');}catch(e){}})();`;

export function ScrollScene({
  id,
  beats,
  stage,
  frames,
  stepsLabel,
  className,
  locale,
}: {
  locale: Locale;
  id: string;
  beats: SceneBeat[];
  stage: ReactNode;
  frames: ReactNode[];
  stepsLabel: string;
  className?: string;
}) {
  const n = beats.length;
  return (
    <div className={['scene', className].filter(Boolean).join(' ')} data-scene={id} data-progress="follow" style={{ '--beats': n } as CSSProperties}>
      <script dangerouslySetInnerHTML={{ __html: lowPowerScript }} />
      <ol className="scene__ticks" aria-hidden="true">
        {beats.map((b, i) => (
          <li key={b.key} data-tick={i + 1} />
        ))}
      </ol>
      <div className="scene__stage" aria-hidden="true">
        {stage}
      </div>
      <ol className="scene__steps" aria-label={stepsLabel}>
        {beats.map((b, i) => (
          <li
            key={b.key}
            className="scene__step"
            data-step={i + 1}
            style={{ '--self': `var(--b${i + 1})`, '--next': i + 1 < n ? `var(--b${i + 2})` : '0' } as CSSProperties}
          >
            <div className="scene__frame" data-frame={i + 1} data-reveal="" aria-hidden="true">
              {frames[i]}
            </div>
            <div className="scene__text">
              <span className="scene__n t-num" aria-hidden="true">
                {String(i + 1).padStart(2, '0')}
              </span>
              <h3 className="t-h3" {...textAttrs(locale, b.title)}>
                {b.title}
              </h3>
              {b.text && (
                <p className="t-body text-fg-muted mt-3 max-w-[38ch]" {...textAttrs(locale, b.text)}>
                  {b.text}
                </p>
              )}
              {b.labels.length > 0 && (
                <ul className="scene__labels">
                  {b.labels.map((l) => (
                    <li key={l} {...textAttrs(locale, l)}>
                      {l}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
