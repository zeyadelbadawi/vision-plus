import { createTranslator } from 'next-intl';
import { describe, expect, it } from 'vitest';
import ar from '../../messages/ar.json';
import en from '../../messages/en.json';
import zh from '../../messages/zh.json';

// Every UI string must compile and format as ICU MessageFormat in its own locale (plural rules differ:
// Arabic has six forms, Chinese one), with all placeholders and rich-text tags resolving.
const all = { en, ar, zh } as const;
const values = { count: 3, n: 1, total: 6, current: 2, name: 'X', solution: 'X', ref: 'VP-0000', year: 2026, status: 'X' };
const tags = { privacy: (chunks: unknown) => chunks };

function leaves(obj: object, prefix = ''): string[] {
  return Object.entries(obj).flatMap(([k, v]) => (k === '_meta' ? [] : typeof v === 'object' && v ? leaves(v, `${prefix}${k}.`) : [`${prefix}${k}`]));
}

describe('messages (ICU)', () => {
  for (const [locale, messages] of Object.entries(all)) {
    it(`formats every ${locale} message`, () => {
      const errors: string[] = [];
      const t = createTranslator({ locale, messages, onError: (e) => errors.push(e.message) });
      for (const key of leaves(messages)) {
        const raw = key.split('.').reduce<unknown>((o, k) => (o as Record<string, unknown>)[k], messages) as string;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any -- keys are discovered at runtime
        const out = raw.includes('<') ? (t as any).rich(key, { ...values, ...tags }) : (t as any)(key, values);
        expect(out, `${locale}:${key}`).toBeTruthy();
      }
      expect(errors).toEqual([]);
    });
  }

  it('uses Arabic plural categories where counts appear', () => {
    const t = createTranslator({ locale: 'ar', messages: ar });
    expect(t('projects.count', { count: 2 })).toBe('مشروعان');
    expect(t('projects.count', { count: 11 })).toBe('11 مشروعًا');
  });
});
