import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

// P5-T1 (MASTER_PROJECT_PLAN §55.3.10): baselines only compare when CI renders in the same Playwright image as the
// local runner (scripts/visual.mjs derives its tag from the installed version), so the workflow's tag must match.
describe('visual regression image', () => {
  it('the CI workflow uses the image of the installed Playwright version', () => {
    const { version } = JSON.parse(readFileSync('node_modules/@playwright/test/package.json', 'utf8')) as { version: string };
    const workflow = readFileSync('.github/workflows/visual.yml', 'utf8');
    expect(workflow).toContain(`image: mcr.microsoft.com/playwright:v${version}-noble`);
  });
});
