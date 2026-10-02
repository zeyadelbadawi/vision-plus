/**
 * Scene engine progress maths (MASTER_PROJECT_PLAN §23.5), shared by every pinned scene. The CSS in scenes.css derives
 * --b1…--b8 from the MotionController "follow" progress --p with the same formula (tests/unit/scene-engine.test.ts).
 */

/** Scale so the last beat completes before the pinned stage releases (scenes.css). */
export const PIN_SCALE = 1.12;

/**
 * Per-beat progress used by the CSS (scenes.css): beat n runs while t = 1.12·p·beats passes n−1 → n,
 * reaching 1 slightly before its step text is centred. p is the MotionController "follow" progress.
 */
export function beatProgress(p: number, beats: number, n: number): number {
  const t = p * beats * PIN_SCALE;
  return Math.min(1, Math.max(0, (t - (n - 1)) * 1.4 - 0.1));
}
