import { getTranslations } from 'next-intl/server';
import { localeMeta, type Locale } from '@/i18n/locales';
import type { Scene } from '@/content/data/scenes';
import { sceneText } from '@/content/scene-text';
import { ScrollScene, type SceneBeat, type SceneDriver } from '@/components/scenes/scroll-scene';
import { ELV_FRAMES, ElvSectionArt } from '@/components/scenes/elv-section-art';
import '@/styles/scenes.css';

/**
 * ELV Systems scene "One Infrastructure" (scene id elv-one-infrastructure; storyboard approved, D-20; Ziad chose it as
 * the next scene, E-7, 2026-10-03). The four approved principles run on the shared scene engine: a pinned building
 * section on desktop, one stepped frame per beat below 1024 px, and the complete section without JS or with reduced
 * motion. Every word comes from the scene registry (approved copy); the beat 1 labels are the strand legend.
 */
export async function ElvScene({ locale, scene, name, driver }: { locale: Locale; scene: Scene; name: string; driver?: SceneDriver }) {
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
      className="scene--elv"
      driver={driver}
      beats={beats}
      stepsLabel={t('stepsLabel', { name })}
      stage={<ElvSectionArt rtl={rtl} />}
      frames={ELV_FRAMES.map((f, i) => (
        <ElvSectionArt key={i} rtl={rtl} viewBox={f} frame={i + 1} />
      ))}
    />
  );
}
