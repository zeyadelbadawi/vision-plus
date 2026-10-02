import type { Locale } from '@/i18n/locales';
import type { CopyRef } from './data/scenes';
import { getCatalog, getHome, getSolutionsCopy } from './index';

/**
 * Resolves a scene CopyRef (src/content/data/scenes.ts) to the words shown in a given locale.
 * The reference is matched in ENGLISH (where it was verified against the approved copy) and the same
 * position is read from the locale's copy: the whole value, the same list item, or the same sentence.
 * Phrase references (derived, D-18) have no positional equivalent and fall back to the locale's full value.
 */
const files: Record<string, (l: Locale) => unknown> = {
  solutions: getSolutionsCopy,
  catalog: getCatalog,
  home: getHome,
};

const get = (obj: unknown, path: string): unknown => path.split('.').reduce<unknown>((o, k) => (o as Record<string, unknown> | undefined)?.[k], obj);

/** Sentence split that also understands Chinese full-width terminators. */
export const sentences = (s: string): string[] => s.match(/[^.!?。！？]+[.!?。！？]+/g)?.map((x) => x.trim()) ?? [s];

export function sceneText(ref: CopyRef, locale: Locale): string {
  const [file = '', path = ''] = ref.ref.split(':');
  const load = files[file];
  if (!load) throw new Error(`scene ref: unknown copy file "${file}"`);
  const en = get(load('en'), path);
  const loc = get(load(locale), path);
  if (Array.isArray(en) && Array.isArray(loc)) {
    const i = en.indexOf(ref.text);
    if (i < 0) throw new Error(`scene ref: "${ref.text}" not found in ${ref.ref}`);
    return String(loc[i]);
  }
  if (typeof en !== 'string' || typeof loc !== 'string') throw new Error(`scene ref: ${ref.ref} is not text`);
  if (en === ref.text || ref.match === 'phrase') return ref.match === 'phrase' && locale === 'en' ? ref.text : loc;
  const i = sentences(en).indexOf(ref.text);
  if (i < 0) throw new Error(`scene ref: "${ref.text}" is not a sentence of ${ref.ref}`);
  return sentences(loc)[i] ?? loc;
}
