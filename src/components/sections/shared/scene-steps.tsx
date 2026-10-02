import type { Locale } from '@/i18n/locales';
import type { Scene } from '@/content/data/scenes';
import { sceneText } from '@/content/scene-text';
import { textAttrs } from '@/lib/text-attrs';

/**
 * The DOM beat texts of a solution scene (§23.5: "server-rendered HTML text for each beat — SEO + a11y source of
 * truth"). Until the scene's artwork is built in P5B this is the scene section on its own, i.e. the scene's
 * static state (MASTER_PROJECT_PLAN §55.3, P5A-04); P5B adds the artwork beside the same text.
 * Every word is resolved from the approved copy through the scene registry (tests/unit/scenes.test.ts).
 */
export function SceneSteps({ locale, scene }: { locale: Locale; scene: Scene }) {
  const beats = scene.beats.filter((b) => b.title);
  return (
    <ol className="scene-steps" data-scene={scene.id}>
      {beats.map((b, i) => {
        const title = sceneText(b.title!, locale);
        const text = b.text ? sceneText(b.text, locale) : undefined;
        const labels = b.labels.map((l) => sceneText(l, locale));
        return (
          <li key={b.key} className="scene-steps__beat">
            <span className="scene-steps__n t-num" aria-hidden="true">
              {String(i + 1).padStart(2, '0')}
            </span>
            <h3 className="t-h3" {...textAttrs(locale, title)}>
              {title}
            </h3>
            {text && (
              <p className="t-body text-fg-muted mt-3 measure" {...textAttrs(locale, text)}>
                {text}
              </p>
            )}
            {labels.length > 0 && (
              <ul className="scene-steps__labels">
                {labels.map((l) => (
                  <li key={l} {...textAttrs(locale, l)}>
                    {l}
                  </li>
                ))}
              </ul>
            )}
          </li>
        );
      })}
    </ol>
  );
}
