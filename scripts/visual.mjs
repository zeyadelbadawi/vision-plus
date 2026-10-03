// Visual regression runner (MASTER_PROJECT_PLAN §55.3.10, P5-T1). Screenshots are only comparable when they come from
// the same browser build and font stack, so this always runs Playwright inside the official image whose version
// matches the installed @playwright/test. In that image (CI's `visual.yml` container) it runs directly; elsewhere it
// starts the image with Docker. Build first (`pnpm build`); extra arguments pass through (e.g. --update-snapshots).
import { spawnSync } from 'node:child_process';
import { readFileSync } from 'node:fs';

const { version } = JSON.parse(readFileSync('node_modules/@playwright/test/package.json', 'utf8'));
const image = `mcr.microsoft.com/playwright:v${version}-noble`;
const args = ['playwright', 'test', '-c', 'playwright.visual.config.ts', ...process.argv.slice(2)];

const inImage = process.env.PLAYWRIGHT_BROWSERS_PATH === '/ms-playwright';
const run = inImage
  ? spawnSync('npx', args, { stdio: 'inherit' })
  : spawnSync('docker', ['run', '--rm', '--ipc=host', '-v', `${process.cwd()}:/work`, '-w', '/work', '-e', 'CI', image, 'npx', ...args], { stdio: 'inherit' });
if (run.error) {
  console.error(`visual: could not start ${inImage ? 'Playwright' : `Docker (${image})`}: ${run.error.message}`);
  process.exit(1);
}
process.exit(run.status ?? 1);
