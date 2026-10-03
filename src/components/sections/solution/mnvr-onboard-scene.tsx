import type { Locale } from '@/i18n/locales';
import { getSolutionsCopy } from '@/content';
import { MnvrOnboardArt } from '@/components/scenes/mnvr-onboard-art';
import type { SceneDriver } from '@/components/scenes/scroll-scene';
import { textAttrs } from '@/lib/text-attrs';

const SLUG = 'mobile-nvr-mobile-surveillance';

/**
 * The five "On board" steps (P2 revision). Every word is approved copy, referenced by position so all locales
 * resolve to the same item: `cap` indexes capabilities.items (step title + tags), `text` is a fleet pillar text
 * or a body paragraph. tests/unit/mnvr-page.test.ts pins the English so a reorder of the copy cannot go unnoticed.
 */
export const SYSTEM_STEPS = [
  { cap: [1], text: { pillar: 0 } },
  { cap: [0, 13], text: { body: 2 } },
  { cap: [2], text: { pillar: 1 } },
  { cap: [3, 4, 5], text: { pillar: 2 } },
  { cap: [6, 7, 14], text: { pillar: 3 } },
] as const;

/**
 * Mobile NVR "On board" cutaway (Concept A; mnvr-onboard-art.tsx): the stage with its step captions beside the five
 * steps. With the `scroll` driver the MotionController marks the reader's step (data-current / data-reached, both
 * scroll directions); with `manual` (the scene lab, §23.6) the caller sets them. Used by the Mobile NVR page and the
 * scene lab; the page's markup is unchanged by the extraction (P5B-01).
 */
export function MnvrOnboardScene({ locale, driver = 'scroll' }: { locale: Locale; driver?: SceneDriver }) {
  const copy = getSolutionsCopy(locale).items[SLUG];
  const caps = copy.capabilities.items;
  const tx = (t: string) => textAttrs(locale, t);
  const steps = SYSTEM_STEPS.map((s) => {
    const [title = '', ...tags] = s.cap.map((i) => caps[i]!);
    const text = 'pillar' in s.text ? copy.fleet.pillars[s.text.pillar]!.text : copy.body[s.text.body]!;
    return { title, tags, text };
  });

  return (
    <div className="sys" data-steps={driver === 'scroll' ? '' : undefined} data-driver={driver === 'manual' ? 'manual' : undefined}>
      <div className="sys__stage">
        <p className="sys__caption" aria-hidden="true">
          {steps.map((s, i) => (
            <span key={s.title} data-layer={i + 1}>
              <b className="t-num">{i + 1}</b> <span {...tx(s.title)}>{s.title}</span>
            </span>
          ))}
        </p>
        <MnvrOnboardArt rtl={locale === 'ar'} />
      </div>
      <ol className="sys__steps">
        {steps.map((s, i) => (
          <li key={s.title} className="sys__step" data-step={i + 1}>
            <span className="sys__n t-num" aria-hidden="true">
              {i + 1}
            </span>
            <div>
              <h3 className="t-h4" {...tx(s.title)}>
                {s.title}
              </h3>
              {s.tags.length > 0 && (
                <ul className="sys__tags">
                  {s.tags.map((t) => (
                    <li key={t} {...tx(t)}>
                      {t}
                    </li>
                  ))}
                </ul>
              )}
              <p className="t-body text-fg-muted mt-3" {...tx(s.text)}>
                {s.text}
              </p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
