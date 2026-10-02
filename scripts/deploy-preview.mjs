// Uploads a new version of the PREVIEW worker with a per-branch alias:
//   https://<alias>-vision-plus-web-preview.<account-subdomain>.workers.dev
// Requires CLOUDFLARE_API_TOKEN and CLOUDFLARE_ACCOUNT_ID (client-owned account — D-22). Never stored in the repo.
import { execFileSync, execSync } from 'node:child_process';
import { createHash } from 'node:crypto';

const WORKER = 'vision-plus-web-preview';
const missing = ['CLOUDFLARE_API_TOKEN', 'CLOUDFLARE_ACCOUNT_ID'].filter((k) => !process.env[k]);
if (missing.length) {
  console.error(`deploy:preview — blocked: missing ${missing.join(', ')} (client Cloudflare account, D-22). See docs/DEPLOYMENT.md.`);
  process.exit(2);
}

const branch = process.env.GITHUB_HEAD_REF || process.env.GITHUB_REF_NAME || execSync('git rev-parse --abbrev-ref HEAD', { encoding: 'utf8' }).trim();
// Alias rules: lowercase letters, digits, dashes; starts with a letter; alias + worker name ≤ 63 chars.
let alias = branch
  .toLowerCase()
  .replace(/[^a-z0-9-]+/g, '-')
  .replace(/-+/g, '-')
  .replace(/^-|-$/g, '');
if (!/^[a-z]/.test(alias)) alias = `b-${alias}`.replace(/-$/, ''); // e.g. "123-fix" → "b-123-fix"
const room = 63 - WORKER.length - 1; // the alias + "-" + worker name form one DNS label
if (alias.length > room) {
  // Same approach as wrangler: truncate and append a short branch hash so long branches never collide.
  const hash = createHash('sha256').update(branch).digest('hex').slice(0, 4);
  alias = `${alias.slice(0, room - 5).replace(/-+$/, '')}-${hash}`;
}

const sha = (process.env.GITHUB_SHA || execSync('git rev-parse HEAD', { encoding: 'utf8' })).trim().slice(0, 12);
console.log(`deploy:preview — branch "${branch}" → alias "${alias}" (version tag ${sha})`);
// Arguments are passed as an array (no shell), because branch names come from PR head refs.
execFileSync('npx', ['wrangler', 'versions', 'upload', '--preview-alias', alias, '--tag', sha, '--message', `preview ${alias}@${sha}`], {
  stdio: 'inherit',
});
