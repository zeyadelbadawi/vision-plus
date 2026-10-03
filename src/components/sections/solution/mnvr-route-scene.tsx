import { getTranslations } from 'next-intl/server';
import { localeMeta, type Locale } from '@/i18n/locales';
import { getSolutionsCopy } from '@/content';
import { scenes } from '@/content/data/scenes';
import { sceneText } from '@/content/scene-text';
import { ScrollScene, type SceneBeat, type SceneDriver } from '@/components/scenes/scroll-scene';
import { ARCH_FRAMES, MnvrArchitectureArt, type ArchTerms } from '@/components/scenes/mnvr-architecture-art';
import '@/styles/scenes.css';

/**
 * Mobile NVR fleet-level scene (scene id mnvr-route; Concept B, direction approved by Ziad 2026-10-02; storyboard
 * docs/SCENE_STORYBOARDS.md §2). The six approved beats run on the shared scene engine: pinned stage on desktop
 * (scroll-scrubbed through --b1…--b6), one stepped frame per beat below 1024 px (the stacked 'tall' layout, so every
 * frame is a full-width crop with complete labels), and the complete still diagram without JS or with reduced motion.
 * Every word comes from the scene registry or the approved capability list (tests/unit/scenes.test.ts).
 */
export async function MnvrRouteScene({ locale, name, driver }: { locale: Locale; name: string; driver?: SceneDriver }) {
  const scene = scenes.find((s) => s.id === 'mnvr-route');
  if (!scene) throw new Error('mnvr-route scene missing from the registry');
  const t = await getTranslations({ locale, namespace: 'scene' });
  const text = (r: Parameters<typeof sceneText>[0]) => sceneText(r, locale);
  const caps = getSolutionsCopy(locale).items['mobile-nvr-mobile-surveillance'].capabilities.items;

  const beats: SceneBeat[] = scene.beats.map((b) => ({
    key: b.key,
    title: b.title ? text(b.title) : '',
    text: b.text ? text(b.text) : undefined,
    labels: b.labels.map(text),
  }));
  const [video, location, connectivity, monitoring, intelligence, management] = scene.beats.map((b) => b.labels.map(text));
  const terms: ArchTerms = {
    cameras: video![0]!,
    nvr: caps[0]!, // Mobile Network Video Recorders
    storage: caps[13]!, // Secure Local Video Storage
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
      className="scene--arch"
      driver={driver}
      beats={beats}
      stepsLabel={t('stepsLabel', { name })}
      stage={<MnvrArchitectureArt rtl={rtl} terms={terms} />}
      frames={ARCH_FRAMES.map((f, i) => (
        <MnvrArchitectureArt key={i} rtl={rtl} terms={terms} layout="tall" viewBox={f} frame={i + 1} />
      ))}
    />
  );
}
