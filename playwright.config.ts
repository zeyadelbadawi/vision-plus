import { defineConfig, devices } from '@playwright/test';

// E2E against the static export (`pnpm build` first). §40: Chromium on every push/PR; the full
// Chromium + Firefox + WebKit matrix runs nightly (.github/workflows/e2e-matrix.yml, PW_ALL_BROWSERS=1).
const allBrowsers = process.env.PW_ALL_BROWSERS === '1';
export default defineConfig({
  testDir: 'tests/e2e',
  fullyParallel: true,
  reporter: [['list']],
  use: { baseURL: 'http://localhost:4173', trace: 'retain-on-failure' },
  webServer: { command: 'node scripts/serve-static.mjs', url: 'http://localhost:4173/en', reuseExistingServer: true },
  projects: [
    { name: 'desktop', use: { ...devices['Desktop Chrome'], viewport: { width: 1440, height: 900 } } },
    { name: 'mobile', use: { ...devices['Desktop Chrome'], viewport: { width: 390, height: 844 }, hasTouch: true } },
    ...(allBrowsers
      ? [
          { name: 'firefox-desktop', use: { ...devices['Desktop Firefox'], viewport: { width: 1440, height: 900 } } },
          { name: 'webkit-desktop', use: { ...devices['Desktop Safari'], viewport: { width: 1440, height: 900 } } },
          { name: 'webkit-mobile', use: { ...devices['iPhone 13'], viewport: { width: 390, height: 844 } } },
        ]
      : []),
  ],
});
