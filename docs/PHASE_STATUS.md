# VISION PLUS — Phase Status & Acceptance Evidence (P1–P4)

**As of:** 2026-10-01 · **Branch:** `claude/confident-cori-lahb3k` (the remote has no `main` branch) · **Authority:** MASTER_PROJECT_PLAN §49.1 (scope, outputs, acceptance), §50 (deliverables), §51 (Definition of Done). Deviations: plan §55.

Evidence is code and command output, not reports. **Verified** = run and passed in this repository; **local** = verified locally / in CI but not on a deployed environment; **blocked** = needs an external input.

---

## Visible product today (preview build)

| Area | What exists | Since |
|---|---|---|
| Homepage `/en` `/ar` `/zh` | The approved homepage (11 sections), header + mega menus, mobile drawer, language switcher, footer | `9f90b5d`, `c7e5c0e` |
| Mobile NVR solution page | Full §26.2 template with the Route scene first cut (pinned desktop, stepped mobile, static reduced-motion), 3 locales | `6932552` |
| Style guide `/{locale}/_lab` | Tokens, type scale × 3 scripts, buttons, form controls, image slots, motion samples (preview only) | `6932552` |
| Every other sitemap route | P3 empty templates: breadcrumb, h1, approved lede, section anchors — **bodies are P5** | `6932552` |
| Links and redirects | 0 broken internal links or anchors across 63 pages; 96 sitemap-alias 301s active | `6932552` |
| Content | Approved English everywhere it renders; Arabic/Chinese are draft machine translations (homepage UI) or English placeholders (new page copy) — preview only | P4 |
| Not yet | Page bodies for hubs/about/services/industries/products/projects/partners/contact (P5); 7 more solution scenes (P5B); contact form (P6); SEO metadata beyond titles/descriptions (P7); real translations (P8); client assets (P9); any deployment (D-22) | — |

---

## P1 — Client Decisions & Input Kickoff · **Blocked on client (not complete)**

| Requirement (§49.1) | Status | Evidence |
|---|---|---|
| Answer Q-01…Q-23 (minimum before P2: Q-01–Q-08, Q-14, Q-16, Q-22) | **Blocked** | §53.3 has no answers |
| Decision log in §53.3 (answer, date, who) | Not done | No decisions exist to log |
| Send checklist; collect D-05, D-07, D-14, D-22, D-25 | Partially | Checklist `dd6b24d`; banner received (`c7e5c0e`); logo v1 received and rejected (`54008fd`); D-07, D-14, D-22, D-25 outstanding |
| Acceptance: "before P2" questions answered or default accepted | **Not met** | Defaults applied are recorded as pending (`docs/P4_CLIENT_REVIEW.md` §4) |

## P2 — Design Direction Proof · **Implemented — awaiting client approval (not accepted)**

| Requirement (§49.1) | Status | Evidence |
|---|---|---|
| Live style guide: tokens, type scale en/ar/zh, buttons, forms, placeholders, seams | **Verified (local)** | `src/app/[locale]/%5Flab/page.tsx`, `src/styles/forms.css` (`6932552`); e2e + axe × 3 locales × 2 viewports |
| Homepage hero + Integration System | **Verified** | `src/components/sections/home/hero.tsx`, `integration-system.tsx` (`9f90b5d`, `c7e5c0e`); `tests/e2e/home.spec.ts` |
| Full Mobile NVR solution page | **Verified (local)** | `src/app/[locale]/solutions/[slug]/page.tsx`, `src/components/sections/solution/solution-detail.tsx` (`6932552`) |
| Route scene first cut — pinned, stepped, reduced-motion | **Verified (local)** | `src/components/scenes/*`, `src/styles/scenes.css` (`6932552`); e2e: `--p` test hook, stepped frames, reduced motion, RTL mirroring; unit: progress maths |
| Header + mega menu, desktop and mobile | **Verified** | `src/components/layout/site-header.tsx`, `header-client.tsx` (`9f90b5d`); e2e keyboard/Escape/focus trap |
| Output: preview URL | **Blocked (D-22)** | — |
| Output: screenshots 390/768/1440/1920 × 3 locales | **Verified** | `docs/review/p2/` (36 images; `scripts/dev/review-shots.mjs`) |
| Validation: contrast checks | Verified | axe 0 serious/critical (logotype excluded, §55 A-10) |
| Validation: scene performance trace on throttled mobile | **Verified (local, Lighthouse)** | Mobile NVR page: performance 0.98, LCP 2.2 s, TBT 68 ms, CLS 0; no added JS (budget: 141.8 KB) |
| Acceptance: written client approval of direction, type and motion | **Pending** | Homepage approval relayed by the owner in session (not a written client record); Mobile NVR page, Route scene and style guide not yet reviewed by the client |

## P3 — Engineering Foundation · **Implemented and verified locally; not closed**

| Requirement (§49.1) | Status | Evidence |
|---|---|---|
| Next 16 static export; next-intl static setup; locales, `dir`, fonts; tokens | Verified | `next.config.ts`, `src/i18n/*`, `src/styles/*` (`9f90b5d`); deviation A-03 (`setRequestLocale`), A-04 (local fonts) |
| ESLint rules (logical properties, Option A ban); Prettier | Verified | `eslint.config.mjs`, `scripts/brand-check.mjs` (`9f90b5d`); Prettier `9d04cf8` |
| Content schemas + loaders (Zod) | **Verified** | `src/content/schema/index.ts` + `scripts/content-check.mjs` (`9d04cf8`); negative-tested |
| Image pipeline + ImageSlot | Verified | `scripts/images.mjs`, `scripts/assets-check.mjs`, `image-slot.tsx` |
| Layout shell incl. breadcrumbs and skip link | Verified | `src/components/layout/*`; breadcrumbs now rendered on every inner page |
| Worker: root negotiation, `/api/contact/health` | **Local** | `worker/*` (`eb4facc`); unit tests + `pnpm worker:smoke` (25/25, local Cloudflare runtime) |
| CI (lint, types, unit, content, assets, Lighthouse, axe) | Verified | `.github/workflows/ci.yml`; GitHub runs green (see below) |
| Preview deploys on Cloudflare | **Blocked (D-22)** | Workflow skips with a notice until secrets exist |
| `.env.example` | Verified | `.env.example` |
| Verify `_headers` / `_redirects` / `run_worker_first` | **Local** | `pnpm worker:smoke` (headers, CSP, 301 redirects keeping `#anchor`) |
| Verify next-intl static export on Next 16.3 | Verified | Build |
| Verify hreflang `zh-Hans` | Partially | `lang="zh-Hans"` set; hreflang tags are P7 |
| Output: deployable preview with **empty templates in 3 locales** | **Templates verified (`6932552`)**; deployment blocked (D-22) | `site:check`: 63 pages, 0 errors |
| Validation: Lighthouse baseline ≥ 95 | **Not met for `/ar` `/zh`** | `/en` 0.95–0.98, `/ar` 0.88, `/zh` 0.75 (§55 A-09, P10) |
| Acceptance: §51 checklist; preview URL shared | Partially / blocked | No preview link (D-22) |
| Done when merged to `main` | **Not possible yet** | No `main` branch (§55 A-14) |

## P4 — Content Encoding & Scene Storyboards · **Ready for Acceptance — not accepted**

| Requirement (§49.1) | Status | Evidence |
|---|---|---|
| Encode `01` fully with source references | Verified | `pnpm content:fidelity`: 372/372, 0 undeclared (`c4bd119`) |
| Relations (§12.4) and aliases | Verified | `src/content/data/relations.ts`, `aliases.json`; unit tests; 96 redirects active |
| Draft microcopy and SEO strings | Verified | `messages/*.json` (ICU test), `copy/*/seo.json` (Zod budgets) |
| Translation workbook export | Verified — **prepared, not released** until D-18 | `docs/i18n/translations.xlsx` |
| Storyboards (8 solutions + home) | Verified as documents; the Route scene is now also built (first cut) | `docs/SCENE_STORYBOARDS.md` |
| Acceptance: D-18, D-19, D-20 | **Pending client** | `docs/P4_CLIENT_REVIEW.md` §6 |
| Done when English locked and workbook sent | Not met | Needs D-18 |

---

## Verification log (this remediation)

| Check | Result |
|---|---|
| `pnpm lint` · `typecheck` · `format:check` | Pass |
| Unit (`pnpm test`) | 45 / 45 |
| `content:check` (Zod) · `content:fidelity` · `assets:check` | Pass (preview); production correctly blocked (42 items) |
| `pnpm site:check` | 63 pages, 7,686 internal links, 96 redirects, 0 errors |
| E2E Chromium (`pnpm test:e2e`) | 113 passed, 7 skipped by viewport design |
| E2E matrix on GitHub (Chromium, Firefox, WebKit desktop + iPhone) | Pass — run 36896670176 on `9d04cf8` |
| GitHub CI | Green on `6932552` (run 5) and `9d04cf8` (run 6) |
| Worker smoke (local Cloudflare runtime) | 25 / 25 |
| Budget | Home JS 142.8 / CSS 11.3 / HTML ≤ 25.1 KB; Mobile NVR page JS 141.8 / CSS 14.0 / HTML ≤ 22.5 KB (gzip) |
| Lighthouse (mobile, median of 3) | `/en` 0.98 · `/ar` 0.88 · `/zh` 0.75 · Mobile NVR 0.98 — a11y 1.00, best practices 0.96, CLS ≤ 0.002 |
| Homepage vs approved build `c7e5c0e` | **0 differing pixels** (re-checked after the CSS scan fix), en/ar/zh × 390/768/1440/1920, reduced motion (Chromium) |
| Formatting change | All 63 built pages identical before/after (build hashes aside) |

**Not verified:** anything on a deployed Cloudflare environment (D-22); Safari/Firefox on real devices (covered by Playwright WebKit/Firefox engines in the GitHub matrix only); motion states pixel-for-pixel (animation timing varies by run); real Arabic/Chinese copy (none supplied).
