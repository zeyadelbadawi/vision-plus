# VISION PLUS — Phase Status & Acceptance Evidence (P1–P4)

**As of:** 2026-10-02 · **Branches:** `main` (created 2026-10-02, merge `b4b386c` = reviewed `a48f2df`) and the working branch `claude/confident-cori-lahb3k` at `6859835`. The branches have **diverged**: 3 commits ahead (`3496899`, `7acdfff`, `6859835`) and 1 behind (the merge commit `b4b386c`, whose tree equals the merge base `a48f2df`). A dry-run merge is conflict-free; not merged. GitHub default branch: still the working branch. Audit: `docs/PRE_P5_HANDOFF.md` · **Client decisions:** `docs/CLIENT_DECISIONS.md` · **Authority:** MASTER_PROJECT_PLAN §49.1 (scope, outputs, acceptance), §50 (deliverables), §51 (Definition of Done). Deviations: plan §55.

**Update (2026-10-02, P5 baseline):** the working branch is at `eb98ad5` plus the P5 commits recorded below; `main` is unchanged at `e137ea6`; PR #1 (`claude/mnvr-main-integration` → `main`) is open and not merged. The current verified state is MASTER_PROJECT_PLAN **§55.2**. The branch facts in the line above are as of `6859835`, kept for history.

Evidence is code and command output, not reports. **Verified** = run and passed in this repository; **local** = verified locally / in CI but not on a deployed environment; **blocked** = needs an external input.

---

## Visible product today (preview build)

| Area | What exists | Since |
|---|---|---|
| Homepage `/en` `/ar` `/zh` | The approved homepage (11 sections), header + mega menus, mobile drawer, language switcher, footer | `9f90b5d`, `c7e5c0e` |
| Mobile NVR solution page | **Dedicated page (P2 revision).** Ziad replaced both scenes with new concepts and approved the direction; the implementation is **IMPLEMENTED 2026-10-02 (`626c894`) — AWAITING ZIAD'S REVIEW OF THE IMPLEMENTED PAGE**, then client approval as applicable: charcoal hero, the On board scene (Concept A, isometric cutaway), the fleet-level scene (Concept B, architecture schematic), capabilities, applications, related, CTA, in 3 locales. The earlier generic version (`6932552`) was not accepted. | `7acdfff`, `626c894` |
| Style guide `/{locale}/_lab` | Tokens, type scale × 3 scripts, buttons, form controls, image slots, motion samples (preview only) | `6932552` |
| Every other sitemap route | P3 empty templates: breadcrumb, h1, approved lede, section anchors — **bodies are P5**. Products is **hidden** (Q-02): not built, not linked. | `6932552`, `3496899` |
| Client decisions in the build | 12 industries (Q-08), Site Survey in Understand (Q-09), V/M/V withheld (Q-04), illustrative sample projects and dummy offices labelled and preview-only (Q-12, D-01/D-02), client stacked logo in the footer (D-05), sizes on every placeholder (D-11) | `3496899` |
| Links and redirects | 0 broken internal links or anchors across 60 pages; 99 sitemap-alias 301s active | `3496899` |
| Content | Approved English everywhere it renders; Arabic/Chinese are draft machine translations (homepage UI) or English placeholders (new page copy) — preview only | P4 |
| Not yet | Page bodies for hubs/about/services/industries/products/projects/partners/contact (P5); 7 more solution scenes (P5B); contact form (P6); SEO metadata beyond titles/descriptions (P7); real translations (P8); client assets (P9); any deployment (D-22) | — |

---

## P1 — Client Decisions & Input Kickoff · **Partially answered (2026-10-02)**

Q-01, Q-02, Q-08, Q-09 and Q-12 are decided; Q-03 and Q-04 were rejected without a replacement (unresolved); Q-05/Q-07 are answered via D-13/D-24; the rest are pending. Data items D-01–D-27 have instructions (`CLIENT_DECISIONS.md` §2). The table below is the 2026-10-01 assessment, kept for history.

| Requirement (§49.1) | Status | Evidence |
|---|---|---|
| Answer Q-01…Q-23 (minimum before P2: Q-01–Q-08, Q-14, Q-16, Q-22) | **Blocked** | §53.3 has no answers |
| Decision log in §53.3 (answer, date, who) | Not done | No decisions exist to log |
| Send checklist; collect D-05, D-07, D-14, D-22, D-25 | Partially | Checklist `dd6b24d`; banner received (`c7e5c0e`); logo v1 received and rejected (`54008fd`); D-07, D-14, D-22, D-25 outstanding |
| Acceptance: "before P2" questions answered or default accepted | **Not met** | Defaults applied are recorded as pending (`docs/P4_CLIENT_REVIEW.md` §4) |

## P2 — Design Direction Proof · **Approved except the Mobile NVR page — open (2026-10-02)**

Client decision: the homepage baseline, style guide, design direction, typography and motion are approved. The Mobile NVR page was **not accepted**; a dedicated page with a small purposeful scroll-triggered animation was requested. Revision: `7acdfff`, screenshots `docs/review/p2-mnvr-revision/`. Ziad's personal review (2026-10-02) did **not** approve the two animation scenes. Their animation revision (`fdb3468`) was superseded the same day: Ziad replaced both visuals with new concepts and approved the direction (Concept A On board, Concept B fleet level). The implementation is **IMPLEMENTED 2026-10-02 (`626c894`) — AWAITING ZIAD'S REVIEW OF THE IMPLEMENTED PAGE**, then client approval as applicable. Evidence: `docs/review/p2-mnvr-final/`; notes: `docs/PRE_P5_HANDOFF.md` §11. **P2 is not closed**: it still needs Ziad's review of the implemented page and the client's written approval of direction, type and motion (§49.1). Tests cannot replace either. Review notes: `docs/PRE_P5_HANDOFF.md` §3. The table below is the 2026-10-01 evidence, kept for history (rows about the Mobile NVR page describe the rejected version).

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

## P3 — Engineering Foundation · **Accepted with open items (2026-10-02)**

Client decision: accepted as the current engineering implementation. Open items stay tracked:
- the preview environment and Cloudflare access (D-22);
- `/ar` and `/zh` Lighthouse below 95 (P10).

Git integration is resolved (`main`, `b4b386c`). No production deployment or launch is approved.

Acceptance covers the implementation only. The §49.1 P3 **output “deployable preview” is not met** (no preview URL; D-22), and the §51 “preview link attached” item cannot be met until D-22 is resolved.

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
| Done when merged to `main` | **Done** | `main` created, reviewed work merged as `b4b386c`; CI run 8 on `main` green |

## P4 — Content Encoding & Scene Storyboards · **Approved (2026-10-02)**

D-18, D-19 and D-20 are approved (`P4_CLIENT_REVIEW.md` §6). Text added after the sign-off is listed as pending in `CONTENT_FIDELITY_REPORT.md`.

| Requirement (§49.1) | Status | Evidence |
|---|---|---|
| Encode `01` fully with source references | Verified | `pnpm content:fidelity`: 372/372, 0 undeclared (`c4bd119`) |
| Relations (§12.4) and aliases | Verified | `src/content/data/relations.ts`, `aliases.json`; unit tests; 96 redirects active |
| Draft microcopy and SEO strings | Verified | `messages/*.json` (ICU test), `copy/*/seo.json` (Zod budgets) |
| Translation workbook export | Verified — **prepared, not released** until D-18 | `docs/i18n/translations.xlsx` |
| Storyboards (8 solutions + home) | Verified as documents; the Route scene is now also built (first cut) | `docs/SCENE_STORYBOARDS.md` |
| Acceptance: D-18, D-19, D-20 | **Approved 2026-10-02** | `docs/P4_CLIENT_REVIEW.md` §6 |
| Done when English locked and workbook sent | English locked (D-18). Translation is drafted by Claude in P8 with human review (D-12/D-13) | `docs/i18n/translations.xlsx` |

## P5 — Page Templates, Scene Engine & Solution Scenes · **Started 2026-10-02 under exception A-24 (P2 still open)**

Ziad authorised P5 to start while P2 is open (plan §55 A-24). P2 is **not** closed, and the Mobile NVR page is **not** client-approved. Base branch: `claude/confident-cori-lahb3k` (A-28). Task breakdown, eligibility and blocked tasks: plan **§55.3**.

| Task | Status | Commit | Validation |
|---|---|---|---|
| P5-00 Baseline (plan §55.2–55.3, documentation fixes) | Done | `011a873` | Docs only |
| P5A-01 Shared section library | Started: `IndexList`, `ProcessTrack`, `StatementBand`, `CtaBand`, `HeroBand`, `SpecList`, `RelatedRail`, `PillarStrip`, `SceneSteps`, `SplitEditorial`, `Timeline` | `0573e0a` | Unit 7 tests; used by P5A-02 |
| P5A-02 Solutions hub (§26.3) | Implemented, awaiting review | `0573e0a` | Plan §55.3.5: local suite green; E2E 147/7; 0 px on 84 renders; markup unchanged elsewhere; CI 37054589973 green; matrix 37054595279: 368 passed / 17 skipped / 0 failed |
| P5A-04 Solution detail template (7 solutions, no scenes) | Implemented, awaiting review | `c1d7370` | Plan §55.3.5–55.3.6 |
| P5A-03 Localized 404 | Implemented, awaiting review | `fce167f` | Plan §55.3.5; `worker:smoke` 29/29 |
| P5A-05 Services lifecycle (§26.5) | Implemented, awaiting review; R-2 wording still pending client review | `667ac58` | Plan §55.3.5, §55.3.7 |
| P5A-06 Industries explorer (§26.4) | Implemented, awaiting review; R-1 summary and R-4 order still pending client review | `52e9338` | Plan §55.3.5, §55.3.8 |
| Milestone P5A-03 to P5A-06 | Validated | `46ca5f5` | Local suite green; E2E Chromium 232/10 skipped; CI 37077803419 green; matrix 37077807521: 581 passed / 24 skipped / 0 failed / 0 flaky |
| P5A-07 About (§26.8) | Implemented, awaiting review; Vision, Mission and Core Values withheld (Q-04) | *this commit* | Plan §55.3.5, §55.3.9 |
| Blocked | P5B-02 Mobile NVR finish (B-1, B-2); P5A-13 Products (Q-02); P5A-16 navigation order (Q-03); P5B-03… order and Smart Building view (E-6, E-7) | — | — |

## P5 — Page Templates, Scene Engine & Solution Scenes · **Not started — entry conditions not met** — *superseded by the section above (kept for history)*

| Entry condition (client, 2026-10-02) | State |
|---|---|
| Revised Mobile NVR page verified by Ziad personally | ☐ Direction approved (Concepts A and B); implementation **IMPLEMENTED 2026-10-02 (`626c894`) — AWAITING ZIAD'S REVIEW OF THE IMPLEMENTED PAGE** |
| P2 closed (revised page approved, client as applicable) | ☐ Open |
| P3 acceptance recorded with open items | ☑ |
| P4 approvals recorded (D-18, D-19, D-20) | ☑ |
| Ziad explicitly authorises P5 | ☐ Not given — P5 not started, not authorised |

---

## Verification log (2026-10-02, after the client decisions)

| Check | Result |
|---|---|
| `pnpm lint` · `typecheck` · `format:check` | Pass |
| Unit (`pnpm test`) | 48 / 48 |
| `content:check` · `content:fidelity` · `assets:check` | Pass (preview). Fidelity: 371/371 approved `01` units, 1 client amendment (Q-09), 0 undeclared strings |
| `pnpm site:check` | 60 pages, 6,516 internal links, 99 redirects, 0 errors |
| E2E Chromium (`pnpm test:e2e`) | 117 passed, 7 skipped by viewport design |
| Homepage vs approved build | Changed by decision: desktop header (Products removed), Approach (Q-09), Industries (Q-08), Projects (Q-12), footer (D-01/D-02/D-05). **All 8 other sections: 0 differing pixels**, en/ar/zh × 390/768/1440/1920 (`scripts/dev/home-unchanged-diff.mjs`); their markup is byte-identical |
| Budget | Home JS 142.8 KB; Mobile NVR page JS 141.8 / CSS 15.6 / HTML ≤ 24.4 KB gz |
| Lighthouse (mobile, median of 3, local) | `/en` 0.97 · `/ar` 0.89 · `/zh` 0.75 · Mobile NVR page 0.96 (LCP 2.56 s, just above the 2.5 s warning; TBT 109 ms; CLS 0) — accessibility 1.00 on all four; best practices 0.96 |
| GitHub CI | `main` `b4b386c` run 8 green; `3496899` run 9, `7acdfff` run 10, `6859835` run 11 green |
| **Audit re-run on `6859835`** | lint, format, typecheck, unit 48/48, content/fidelity/assets, `site:check` (60 pages, 0 errors), e2e 117 passed / 7 skipped, worker smoke 25/25, budgets, homepage protection (8 sections: byte-identical markup and 0 px, en/ar/zh × 4 widths): all pass. Production gates fail as intended (content 38, assets 16). Firefox/WebKit matrix **not run** since `a48f2df`. Lighthouse not re-run (the row above is from 09:14 UTC on `7acdfff` code); `/ar` 0.89 and `/zh` 0.75 are below the §37 target of ≥ 90. |
| **Authorised remediation `123c73e`** | Production deploy now runs `site:check` (`deploy-production.yml` lines 50–53). Production gates block the Privacy and Company Profile pending text (`content:check`: 40 production blockers; `site:check`: placeholder-text rule). New tests: `tests/unit/production-gates.test.ts` 10/10. Re-run: unit 58/58, e2e Chromium 117 passed / 7 skipped (viewport design), worker smoke 25/25, content, assets and site checks pass. Firefox/WebKit matrix (run 36998058056 on `123c73e`): **288 passed, 22 skipped, 0 failed**. The skips are by design, except that the 3 Route-scene tests do not run in Firefox/WebKit (project-name condition), a coverage gap recorded in `PRE_P5_HANDOFF.md` §8.3. CI run 14 (`1f4dba5`) passed. Details: `PRE_P5_HANDOFF.md` §8. Mobile NVR is still **PENDING — ZIAD'S PERSONAL VERIFICATION**; P2 open; P5 not started and not authorised. |
| **Route test coverage `8fe760c` / `main` `e137ea6`** | Route scene tests now run in every applicable browser project. Matrix run 37002693260 on `8fe760c`: **295 passed, 15 skipped, 0 failed** (59 / 3 per project; the skips are layout-only, see `docs/E2E_COVERAGE.md`). Local `8fe760c`: e2e 118 passed / 6 skipped, unit 58/58, all checks pass. `main` received only this work (cherry-picks `ab86f47`, `e137ea6`; fast-forward); the `main` candidate passed locally (unit 45/45, e2e 114 / 6, all checks). Mobile NVR is still **PENDING — ZIAD'S PERSONAL VERIFICATION**; P2 open; P5 not started and not authorised. |
| **Mobile NVR animation revision (2026-10-02, superseded by the concept replacement below)** | On board scene step-synchronised (`[data-steps]` in the MotionController; forwards and backwards); Route scene data flow on existing connections (current beat only, finite). Local: lint, format, typecheck, unit 58/58, `content:check` (preview pass; production blocked by 40 items as intended), `content:fidelity` 371/371, `assets:check` (preview pass; production blocked by 16 items), `site:check` 60 pages / 0 errors, budgets (Mobile NVR JS 142.0 / CSS 16.6 / HTML 23.2 KB gz), worker smoke 25/25, e2e Chromium **126 passed / 6 skipped** (layout-only). Homepage vs the pre-revision build: **0 differing px**, en/ar/zh × 390/768/1440/1920. Lighthouse (mobile, median of 3): Mobile NVR **0.98** (LCP 1.95 s, TBT 105 ms, **CLS 0**), `/en` 0.97, `/ar` 0.89, `/zh` 0.73 (homepage unchanged); accessibility 1.00, best practices 0.96. `main` matrix run 37004469407 on `e137ea6`: **285 passed, 15 skipped, 0 failed**. Working branch `db7a3ea`: CI run 37008403699 green; matrix run 37008405786 **315 passed, 15 skipped, 0 failed** (`docs/PRE_P5_HANDOFF.md` §9.6). Status: **IMPLEMENTED (ANIMATION REVISION 2026-10-02) — AWAITING ZIAD'S VISUAL ACCEPTANCE**; P2 open; P5 not started and not authorised; nothing deployed. |

## Verification log (2026-10-01 remediation, superseded)

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
