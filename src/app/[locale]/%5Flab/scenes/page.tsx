import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';
import type { Locale } from '@/i18n/locales';
import { SceneLab } from '@/components/scenes/lab/scene-lab';
import { LAB_SCENES } from '@/components/scenes/lab/lab-scenes';
import { isPreview } from '@/lib/env';
import '@/styles/lab.css';

export const metadata: Metadata = { title: 'Scene lab', robots: { index: false, follow: false } };

/**
 * Scene lab (MASTER_PROJECT_PLAN §23.6 authoring step 4, P5B-01): every scene in a frame, scrubbed with a slider, in
 * each mode (pinned, stepped, lite, static = reduced motion) and locale (ar = RTL). Preview builds only; postbuild
 * removes /_lab from production output. Internal tooling text, not website copy.
 */
export default async function SceneLabPage({ params }: { params: Promise<{ locale: string }> }) {
  if (!isPreview) notFound();
  const locale = (await params).locale as Locale;
  setRequestLocale(locale);
  return (
    <main id="main" tabIndex={-1} className="lab container-vp">
      <h1 className="t-h2">Scene lab</h1>
      <p className="t-body text-fg-muted mt-4 max-w-[60ch]">
        Each scene runs with the manual driver: the slider sets its progress, so every beat can be inspected forwards and backwards. Static is the
        reduced-motion and no-JavaScript composition; Arabic shows the mirrored artwork.
      </p>
      {LAB_SCENES.map((s) => (
        <SceneLab key={s.id} scene={s.id} title={s.title} kind={s.kind} beats={s.beats} locale={locale} />
      ))}
    </main>
  );
}
