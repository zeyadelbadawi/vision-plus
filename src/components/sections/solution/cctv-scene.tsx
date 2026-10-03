import { getTranslations } from 'next-intl/server';
import { localeMeta, type Locale } from '@/i18n/locales';
import type { Scene } from '@/content/data/scenes';
import { sceneText } from '@/content/scene-text';
import { ScrollScene, type SceneBeat, type SceneDriver } from '@/components/scenes/scroll-scene';
import { CCTV_FRAMES, CctvPlanArt } from '@/components/scenes/cctv-plan-art';
import '@/styles/scenes.css';

/**
 * CCTV & Security Systems scene "See · Know · Respond" (scene id cctv-see-know-respond; storyboard approved, D-20;
 * Ziad approved it as the next scene after ELV, 2026-10-03). Stepped on every breakpoint (§23.6.4): on desktop the
 * site plan stays sticky beside the three short beats and each beat plays once as its step is reached; below 1024 px
 * one cropped frame per beat; without JS or with reduced motion the final state. Every word comes from the scene
 * registry (approved copy): each beat title is followed by its labels as a short list (storyboard §5, DOM body).
 */
export async function CctvScene({ locale, scene, name, driver }: { locale: Locale; scene: Scene; name: string; driver?: SceneDriver }) {
  const t = await getTranslations({ locale, namespace: 'scene' });
  const text = (r: Parameters<typeof sceneText>[0]) => sceneText(r, locale);
  const beats: SceneBeat[] = scene.beats.map((b) => ({
    key: b.key,
    title: b.title ? text(b.title) : '',
    text: b.text ? text(b.text) : undefined,
    labels: b.labels.map(text),
  }));
  const rtl = localeMeta[locale].dir === 'rtl';
  return (
    <ScrollScene
      locale={locale}
      id={scene.id}
      className="scene--cctv"
      desktop="sticky"
      driver={driver}
      beats={beats}
      stepsLabel={t('stepsLabel', { name })}
      stage={<CctvPlanArt rtl={rtl} />}
      frames={CCTV_FRAMES.map((f, i) => (
        <CctvPlanArt key={i} rtl={rtl} viewBox={f} frame={i + 1} />
      ))}
    />
  );
}
