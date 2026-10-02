# Deployment — Cloudflare Workers + Static Assets (Free plan)

**Status (P3):** the Worker, the configuration, CI and the deploy workflows are built and validated locally.
**Nothing has been deployed.** Deployment is blocked until the client's Cloudflare account exists (**D-22**).
The custom domain is attached in P11 (**D-07**).

No account IDs, tokens or domains are stored in this repository, and none have been invented.

---

## 1. Architecture

| Piece | What it is |
|---|---|
| `out/` | The static export (`pnpm build`) — every page, image, font and `_headers`. |
| `worker/index.ts` | A small Worker that runs **only** for `/` and `/api/*` (`run_worker_first`). Everything else is served directly from static assets, which is free and unmetered. |
| `/` | Locale negotiation, in this order: `NEXT_LOCALE` cookie → `Accept-Language` (any `zh-*` → `zh`) → `en`. Returns a 302 with `Vary: Accept-Language, Cookie` and `Cache-Control: private, no-store`. |
| `/api/contact/health` | Health check. `GET`/`HEAD` return 200 JSON `{ status, service, environment, build }`, and other methods return 405. The contact endpoint itself is built in P6. |
| `/api/*` (other) | JSON 404. |
| `out/_headers` | Security headers and CSP for asset responses, plus cache rules. It is generated per mode by `scripts/postbuild.mjs`. The Worker sets the same baseline on its own responses (`worker/headers.ts`). |

There are two Workers, one per environment, both defined in `wrangler.jsonc`:

| Environment | Worker name | Build | Indexing |
|---|---|---|---|
| Preview (top level) | `vision-plus-web-preview` | `CONTENT_MODE=preview`: placeholders and draft translations are visible | `X-Robots-Tag: noindex, nofollow` |
| Production (`--env production`) | `vision-plus-web` | `CONTENT_MODE=production`: strict gates, which **fail until every launch blocker is supplied** | indexable, with HSTS (no `includeSubDomains` until the DNS audit) |

> A preview build must never be deployed to production. The production workflow always builds with `CONTENT_MODE=production` itself.

**Branch previews:** every push uploads a new *version* of the preview Worker with a per-branch alias:
`https://<branch-alias>-vision-plus-web-preview.<account-subdomain>.workers.dev`.
The `<account-subdomain>` is chosen in the client's account and is not known yet.

---

## 2. What we need from the client (D-22)

1. **A Cloudflare account on the Free plan.** Create it with a company email the client controls; no card is needed. Then invite the developer as a member (Manage Account → Members).
2. **A workers.dev subdomain.** Choose one in Workers & Pages (one-time). The preview URLs use it.
3. **An API token for CI.** Go to My Profile → API Tokens → Create Token and pick the **"Edit Cloudflare Workers"** template. Scope it to this account only, and restrict zone resources to the site's zone once the domain is on Cloudflare (P11). A member can create the token after being invited.
4. **The Account ID**, shown on the account's Workers & Pages overview.
5. **GitHub repository secrets.** Under Settings → Secrets and variables → Actions, add:
   - `CLOUDFLARE_API_TOKEN`
   - `CLOUDFLARE_ACCOUNT_ID`

Nothing else is required for previews. KV for form rate-limiting (P6) and the custom domain (P11) are added in their own phases.

---

## 3. First deployment (one time, after D-22)

```bash
pnpm install
pnpm build                                     # preview build
export CLOUDFLARE_API_TOKEN=…  CLOUDFLARE_ACCOUNT_ID=…
pnpm exec wrangler deploy                      # creates the preview worker (vision-plus-web-preview)
```

After that, CI takes over (§4). Each branch push runs `pnpm deploy:preview`, which calls
`wrangler versions upload --preview-alias <branch>` and does not change the preview worker's main URL.

**Check after the first deploy:**

```bash
curl -sI https://vision-plus-web-preview.<account-subdomain>.workers.dev/ | grep -iE '^(HTTP|location|vary)'
curl -s  https://vision-plus-web-preview.<account-subdomain>.workers.dev/api/contact/health
```

Expected: a 302 to `/en` (or `/ar`, `/zh`), and `{"status":"ok","service":"vision-plus-web","environment":"preview",…}`.

---

## 4. CI / CD (GitHub Actions)

| Workflow | Trigger | What it does | Needs secrets |
|---|---|---|---|
| `ci.yml` | push to `main` / `claude/**`, every PR, manual | **verify:** lint (including the RTL and brand-colour rules), typecheck, unit tests, build with gates, budget, `wrangler` dry-run for both environments, Worker smoke test. **e2e:** Playwright + axe at 1440 and 390. **lighthouse:** Lighthouse CI on `/en`, `/ar` and `/zh`. | no |
| `deploy-preview.yml` | push to any branch except `main`, same-repo PRs, manual | Preview build → `pnpm deploy:preview`. **Skips with a notice** while the secrets are missing. | yes |
| `deploy-production.yml` | **manual only**, and you must type `deploy` to confirm | Lint, typecheck and tests → **production build (gates)** → budget → `wrangler deploy --env production`. It uses the GitHub `production` environment, so required reviewers can be added there. | yes |

Production stays manual until launch (P11). The production gates refuse placeholder, draft and machine-translated content, so the workflow fails by design until the client inputs arrive.

**Workers Builds is an equivalent alternative.** Cloudflare's own Git integration is also free and can connect this repository directly in the dashboard. If the client prefers it:
- Build command: `pnpm build`.
- Deploy command for production: `pnpm deploy:production`.
- Non-production branches: `pnpm deploy:preview`.
- Set `CONTENT_MODE` per branch, and disable `deploy-*.yml` so the site is not deployed twice.

---

## 5. Local commands

```bash
pnpm build             # gates + image pipeline + fonts + static export + out/_headers
pnpm worker:dev        # Worker + assets locally on http://localhost:8787 (wrangler dev --local)
pnpm worker:check      # wrangler deploy --dry-run for preview and production (validates config and bundle)
pnpm worker:smoke      # starts wrangler dev --local and runs the routing/header/health assertions
pnpm budget            # JS / CSS / HTML gzip budget for /en, /ar, /zh
pnpm lhci              # Lighthouse CI (set CHROME_PATH if Chrome isn't on PATH)
pnpm deploy:preview    # needs CLOUDFLARE_API_TOKEN + CLOUDFLARE_ACCOUNT_ID; exits 2 with a message otherwise
```

---

## 6. Later phases

- **P6 (contact form):**
  - A KV namespace for rate limiting, created in the client account and bound as `RATE_LIMIT`.
  - Turnstile keys.
  - The Apps Script URL and shared secret, stored as Worker secrets (`wrangler secret put`), never in the repo.
- **P7 (SEO):**
  - `robots.txt`, sitemap, and the canonical host.
  - Alias redirects in `_redirects` (Static Assets supports them; a 301 was verified locally).
- **P11 (launch):**
  - Move the domain's nameservers to Cloudflare, after copying every DNS record, **MX included**, and checking with the client's IT.
  - Add the custom domain route to `env.production`.
  - Decide on `www` vs the apex (Q-15) and redirect the other.
  - Consider `includeSubDomains` for HSTS once the subdomains are audited.
