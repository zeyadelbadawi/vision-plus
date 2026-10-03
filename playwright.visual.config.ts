import { defineConfig, devices } from '@playwright/test';

// Visual regression baseline (MASTER_PROJECT_PLAN §40, §55.3.10; P5-T1). Pixels depend on the browser build and the
// system's font stack, so baselines are generated and compared only inside the official Playwright image
// (mcr.microsoft.com/playwright:v<installed version>-noble), locally (`pnpm test:visual`) and in CI (visual.yml).
// The image sets PLAYWRIGHT_BROWSERS_PATH=/ms-playwright; anywhere else this config refuses to run.
if (process.env.PLAYWRIGHT_BROWSERS_PATH !== '/ms-playwright') {
  throw new Error('Visual tests run only in the Playwright Docker image: use `pnpm test:visual` (see §55.3.10).');
}

export default defineConfig({
  testDir: 'tests/visual',
  snapshotPathTemplate: '{testDir}/__screenshots__/{arg}{ext}',
  fullyParallel: true,
  reporter: [['list']],
  expect: { toHaveScreenshot: { animations: 'disabled', caret: 'hide', scale: 'css' } },
  use: { baseURL: 'http://localhost:4173', trace: 'off' },
  webServer: { command: 'node scripts/serve-static.mjs', url: 'http://localhost:4173/en', reuseExistingServer: false },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
});
