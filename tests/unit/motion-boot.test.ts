import { existsSync, readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { motionBootScript } from '@/components/motion/motion-boot';

// React #418 root cause (2026-10-02): a value the server layout takes from a 'use client' module reaches the client as
// a reference to that module's JS chunk, so <head> waited on it during hydration (see tests/e2e/pages.spec.ts).
const LAYOUT = 'src/app/[locale]/layout.tsx';
const isClientModule = (file: string) => /^\s*['"]use client['"]/.test(readFileSync(file, 'utf8'));
const resolve = (spec: string) => ['.ts', '.tsx', '/index.ts', '/index.tsx'].map((ext) => spec.replace(/^@\//, 'src/') + ext).find((f) => existsSync(f));

describe('motion boot script', () => {
  it('comes from a server-safe module, not the client motion controller', () => {
    expect(isClientModule('src/components/motion/motion-boot.ts')).toBe(false);
    expect(readFileSync(LAYOUT, 'utf8')).toMatch(/import \{ motionBootScript \} from '@\/components\/motion\/motion-boot';/);
  });

  it('the root layout takes only components from client modules', () => {
    const imports = [...readFileSync(LAYOUT, 'utf8').matchAll(/^import (?!type )\{([^}]+)\} from '(@\/[^']+)';/gm)];
    expect(imports.length).toBeGreaterThan(0);
    for (const [, names, spec] of imports) {
      const file = resolve(spec!);
      expect(file, spec).toBeDefined();
      if (!isClientModule(file!)) continue;
      const components = names!.split(',').map((n) => n.trim());
      for (const name of components.filter(Boolean)) expect(name, `${name} from ${spec}`).toMatch(/^[A-Z]/);
    }
  });

  it('still enables js always and motion-ok only when motion is allowed', () => {
    for (const reduce of [false, true]) {
      const added: string[] = [];
      const document = { documentElement: { classList: { add: (c: string) => added.push(c) } } };
      const window = { matchMedia: () => ({ matches: reduce }) };
      new Function('document', 'window', motionBootScript)(document, window);
      expect(added).toEqual(reduce ? ['js'] : ['js', 'motion-ok']);
    }
  });
});
