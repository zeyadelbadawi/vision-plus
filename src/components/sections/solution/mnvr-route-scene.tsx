import { getTranslations } from 'next-intl/server';
import { localeMeta, type Locale } from '@/i18n/locales';
import { scenes } from '@/content/data/scenes';
import { sceneText } from '@/content/scene-text';
import { ScrollScene, type SceneBeat } from '@/components/scenes/scroll-scene';
import { MnvrRouteArt, type RouteLabels } from '@/components/scenes/mnvr-route-art';
import { FRAMES, mirrorFrame } from '@/components/scenes/route-geometry';
import '@/styles/scenes.css';

/**
 * Mobile NVR "Route" scene — P2 first cut (MASTER_PROJECT_PLAN §49.1 P2, §23.6.1; storyboard
 * docs/SCENE_STORYBOARDS.md §2, awaiting D-20). Every word comes from the scene registry, which is
 * verified against the approved copy (tests/unit/scenes.test.ts).
 */
export async function MnvrRouteScene({ locale, name }: { locale: Locale; name: string }) {
  const scene = scenes.find((s) => s.id === 'mnvr-route');
  if (!scene) throw new Error('mnvr-route scene missing from the registry');
  const t = await getTranslations({ locale, namespace: 'scene' });
  const text = (r: Parameters<typeof sceneText>[0]) => sceneText(r, locale);

  const beats: SceneBeat[] = scene.beats.map((b) => ({
    key: b.key,
    title: b.title ? text(b.title) : '',
    text: b.text ? text(b.text) : undefined,
    labels: b.labels.map(text),
  }));
  const [video, location, connectivity, monitoring, intelligence, management] = scene.beats.map((b) => b.labels.map(text));
  const labels: RouteLabels = {
    cameras: video![0]!,
    gps: location![0]!,
    cellular: connectivity![0]!,
    wifi: connectivity![1]!,
    live: monitoring![0]!,
    playback: monitoring![1]!,
    alerts: intelligence![0]!,
    fleet: management![0]!,
  };
  const rtl = localeMeta[locale].dir === 'rtl';

  return (
    <ScrollScene
      locale={locale}
      id={scene.id}
      beats={beats}
      stepsLabel={t('stepsLabel', { name })}
      stage={<MnvrRouteArt labels={labels} rtl={rtl} />}
      frames={FRAMES.map((f, i) => (
        <MnvrRouteArt key={i} labels={labels} rtl={rtl} viewBox={rtl ? mirrorFrame(f) : f} />
      ))}
    />
  );
}
