import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';
import type { Locale } from '@/i18n/locales';
import { getSolutionsCopy } from '@/content';
import { scenes } from '@/content/data/scenes';
import { sceneText } from '@/content/scene-text';
import { OnboardCutaway } from '@/components/scenes/concepts/onboard-cutaway';
import { ARCH_FRAMES, SystemArchitecture } from '@/components/scenes/concepts/system-architecture';
import { SYSTEM_STEPS } from '@/components/sections/solution/mnvr-page';
import { isPreview } from '@/lib/env';
import { textAttrs } from '@/lib/text-attrs';
import '@/styles/mnvr-concepts.css';

/**
 * Mobile NVR visual concepts — PROTOTYPE FOR ZIAD'S REVIEW (2026-10-02). Preview builds only (removed from production
 * builds with the rest of /_lab). It does not change the Mobile NVR page: both concepts reuse the approved step copy
 * and are rendered here so the direction can be reviewed before anything replaces the current scenes.
 * The headings on this page are internal review labels, not website copy.
 */
export const metadata: Metadata = {
  title: 'Mobile NVR visual concepts (review)',
  description: 'Internal prototype of two proposed Mobile NVR scenes, for review.',
  robots: { index: false, follow: false },
};

const SLUG = 'mobile-nvr-mobile-surveillance';

export default async function MnvrConceptsPage({ params }: { params: Promise<{ locale: string }> }) {
  if (!isPreview) notFound();
  const locale = (await params).locale as Locale;
  setRequestLocale(locale);
  const rtl = locale === 'ar';
  const tx = (t: string) => textAttrs(locale, t);
  const copy = getSolutionsCopy(locale).items[SLUG];
  const caps = copy.capabilities.items;
  const steps = SYSTEM_STEPS.map((s) => {
    const [title = '', ...tags] = s.cap.map((i) => caps[i]!);
    const text = 'pillar' in s.text ? copy.fleet.pillars[s.text.pillar]!.text : copy.body[s.text.body]!;
    return { title, tags, text };
  });
  const terms = {
    cameras: caps[1]!,
    nvr: caps[0]!,
    storage: caps[13]!,
    gps: caps[2]!,
    cellular: caps[3]!,
    wifi: caps[4]!,
    live: caps[6]!,
    playback: caps[7]!,
    alerts: caps[9]!,
    fleet: caps[8]!,
  };
  const route = scenes.find((s) => s.id === 'mnvr-route')!;
  const beats = route.beats.map((b) => ({
    title: b.title ? sceneText(b.title, locale) : '',
    text: b.text ? sceneText(b.text, locale) : '',
    labels: b.labels.map((l) => sceneText(l, locale)),
  }));

  return (
    <main id="main" tabIndex={-1} className="concepts">
      <header className="container-vp concepts__intro">
        <p className="t-caption text-fg-muted">Internal review · not website copy</p>
        <h1 className="t-h2 mt-3">Mobile NVR — proposed visual concepts</h1>
        <p className="t-body text-fg-muted mt-3 max-w-[60ch]">
          Concept A replaces the On board vehicle illustration. Concept B is the proposed replacement for the second diagram. The live Mobile NVR page is
          unchanged.
        </p>
      </header>

      {/* Concept A — On board: isometric technical cutaway (light) */}
      <section aria-labelledby="concept-a" className="concept-a section-y">
        <div className="container-vp">
          <p className="t-caption text-fg-muted">Concept A · On board</p>
          <h2 id="concept-a" className="t-h3 mt-3 max-w-[46rem]" {...tx(copy.body[3]!)}>
            {copy.body[3]}
          </h2>
          <div className="cx" data-steps="">
            <div className="cx__stage">
              <p className="cx__caption" aria-hidden="true">
                {steps.map((s, i) => (
                  <span key={s.title} data-layer={i + 1}>
                    <b className="t-num">{i + 1}</b> <span {...tx(s.title)}>{s.title}</span>
                  </span>
                ))}
              </p>
              <OnboardCutaway rtl={rtl} />
            </div>
            <ol className="cx__steps">
              {steps.map((s, i) => (
                <li key={s.title} className="cx__step" data-step={i + 1}>
                  <span className="cx__n t-num" aria-hidden="true">
                    {i + 1}
                  </span>
                  <div>
                    <h3 className="t-h4" {...tx(s.title)}>
                      {s.title}
                    </h3>
                    {s.tags.length > 0 && (
                      <ul className="cx__tags">
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
        </div>
      </section>

      {/* Concept B — System architecture (dark) */}
      <section aria-labelledby="concept-b" className="concept-b theme-dark bg-bg text-fg section-y">
        <div className="container-vp">
          <p className="t-caption text-fg-muted">Concept B · System architecture</p>
          <h2 id="concept-b" className="t-h3 mt-3 max-w-[46rem]" {...tx(copy.fleet.title)}>
            {copy.fleet.title}
          </h2>
          <div className="axw" data-steps="">
            <div className="ax__stage">
              <SystemArchitecture rtl={rtl} terms={terms} />
            </div>
            <ol className="ax__steps">
              {beats.map((b, i) => (
                <li key={b.title} className="ax__step" data-step={i + 1}>
                  <div className="ax__frame" aria-hidden="true">
                    <SystemArchitecture rtl={rtl} terms={terms} viewBox={ARCH_FRAMES[i]} frame={i + 1} />
                  </div>
                  <span className="ax__n t-num" aria-hidden="true">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <h3 className="t-h4 mt-2" {...tx(b.title)}>
                    {b.title}
                  </h3>
                  <p className="t-body text-fg-muted mt-3" {...tx(b.text)}>
                    {b.text}
                  </p>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>
    </main>
  );
}
