import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { solutions } from '@/content/data/registry';
import { scenes, type CopyRef } from '@/content/data/scenes';

// Scenes may only show approved terms (§23.6): every reference must resolve in the English copy and match.
const copy = (file: string) => JSON.parse(readFileSync(`src/content/copy/en/${file}.json`, 'utf8'));
const resolve = (ref: string): unknown => {
  const [file = '', path = ''] = ref.split(':');
  return path.split('.').reduce<unknown>((o, k) => (o as Record<string, unknown> | undefined)?.[k], copy(file));
};
const sentences = (s: string) => s.match(/[^.!?]+[.!?]+/g)?.map((x) => x.trim()) ?? [s];

function matches(r: CopyRef): boolean {
  const value = resolve(r.ref);
  if (r.match === 'phrase') return typeof value === 'string' && value.toLowerCase().includes(r.text.toLowerCase());
  if (Array.isArray(value)) return value.includes(r.text);
  if (typeof value !== 'string') return false;
  return value === r.text || sentences(value).includes(r.text);
}

const refs = (scene: (typeof scenes)[number]) =>
  [...scene.beats.flatMap((b) => [b.title, b.text, ...b.labels]), ...(scene.coda ?? [])].filter((r): r is CopyRef => !!r);

describe('scene registry (§23.6, storyboards)', () => {
  it('has the homepage signature plus one scene per solution', () => {
    expect(scenes.find((s) => s.id === 'home-integration-system')?.status).toBe('built-approved');
    expect(
      scenes
        .filter((s) => s.solution)
        .map((s) => s.solution)
        .sort(),
    ).toEqual(solutions.map((s) => s.slug).sort());
    expect(new Set(scenes.map((s) => s.id)).size).toBe(scenes.length);
  });

  it('shows only approved copy: every title, text, label and coda resolves and matches', () => {
    for (const scene of scenes) for (const r of refs(scene)) expect(matches(r), `${scene.id}: "${r.text}" ← ${r.ref}`).toBe(true);
  });

  it('follows the plan classification and budgets', () => {
    const byId = (id: string) => {
      const scene = scenes.find((s) => s.id === id);
      if (!scene) throw new Error(`missing scene ${id}`);
      return scene;
    };
    for (const id of ['mnvr-route', 'smart-responsive-space', 'elv-one-infrastructure']) {
      expect(byId(id).classification).toBe('rich');
      expect(byId(id).modes).toEqual({ base: 'stepped', lg: 'pinned' });
      expect(byId(id).budgetKb).toBe(45);
    }
    expect(byId('mnvr-route').beats).toHaveLength(6);
    expect(byId('smart-responsive-space').beats).toHaveLength(5);
    expect(byId('elv-one-infrastructure').beats).toHaveLength(4);
    expect(byId('cctv-see-know-respond').beats).toHaveLength(3);
    expect(byId('access-who-where-when').beats).toHaveLength(3);
    expect(byId('fire-critical-sequence').beats).toHaveLength(4);
    for (const s of scenes.filter((x) => x.classification !== 'rich')) expect(s.budgetKb).toBeLessThanOrEqual(30);
  });

  it('keeps docs/SCENE_STORYBOARDS.md in step: every beat title and label appears there', () => {
    const doc = readFileSync('docs/SCENE_STORYBOARDS.md', 'utf8');
    for (const scene of scenes)
      for (const b of scene.beats) for (const r of [b.title, ...b.labels]) if (r) expect(doc, `${scene.id}: ${r.text}`).toContain(r.text);
  });

  it('flags every derived phrase so it is reviewed with the English copy (D-18)', () => {
    const phrases = scenes.flatMap((s) =>
      refs(s)
        .filter((r) => r.match === 'phrase')
        .map((r) => r.text),
    );
    expect(phrases).toEqual(['Who enters', 'Where they enter', 'When']);
  });
});
