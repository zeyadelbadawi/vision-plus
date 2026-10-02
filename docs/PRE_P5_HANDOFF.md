# VISION PLUS — Repository Audit & Pre-P5 Handoff (2026-10-02)

> **Mobile NVR revision (`7acdfff`): PENDING — ZIAD'S PERSONAL VERIFICATION.**
> **P2 is open. P5 has not started and is not authorised.** Nothing is merged, deployed or approved by this audit.

The audit was run on `claude/confident-cori-lahb3k` at `6859835`. This document is documentation-only.

**Evidence labels:**
- **Verified (run):** run by Claude in this audit, with the result shown.
- **Verified (GitHub):** GitHub Actions or API evidence.
- **Reported:** taken from earlier project documentation and not re-run here.
- **Unverified:** cannot be checked from this environment.
- **Blocked:** needs credentials, a preview environment or client input.

---

## 1. Repository and branch state

### 1.1 Branch heads

**Verified (run):** `git fetch` + `rev-parse`. **Verified (GitHub):** branches API.

| Ref | SHA |
|---|---|
| `main` | `b4b386cb4d630b029ba2f65149566a40fab50a87` |
| `claude/confident-cori-lahb3k` | `6859835557b627c8b92b529c3d2ed6f76a00398b` |
| Merge base | `a48f2df98168b953e2f24699ce23337413900c81` |

### 1.2 Why the branches have diverged

- `main` contains one commit that the working branch does not: **`b4b386c`**. It is the `--no-ff` merge commit that created `main` (parents `dd6b24d` and `a48f2df`).
- Its tree (`31fe856…`) is **identical** to the tree of the merge base `a48f2df`. The only thing on `main` that the working branch lacks is the merge commit object itself, not any file content.
- The working branch is **3 ahead / 1 behind**: `3496899`, `7acdfff` and `6859835` are on the branch only. A fast-forward is impossible, so the next merge needs a merge commit or a PR.

### 1.3 Repository facts that need Ziad's attention

**Verified (GitHub):**
- The repository **default branch is still `claude/confident-cori-lahb3k`**, not `main`.
- The repository is **public**. Client materials (`client-materials/`, including the strategy PDF and the logo package) are publicly readable.
- No pull requests exist.
- The repository's *homepage* field is `https://vision-plus-gamma.vercel.app`. The project documents record **no deployment** (D-22).
- That URL could not be checked from this environment (the outbound proxy refused it, HTTP 403). **Unverified:** whether it serves this code, and since when.

### 1.4 Merge simulation

**Verified (run):** `git merge-tree --write-tree origin/main origin/claude/confident-cori-lahb3k` exits 0 (no conflicts). The result tree `73e83a4…` is **identical to the working-branch tree**.

What this means for a future merge:
- It cannot revert anything on `main`.
- It cannot duplicate any change.
- No refs were touched.

### 1.5 Differences main → working branch

119 files: **51 added, 68 modified, 0 deleted, 0 renamed** (`git diff --name-status -M`).

| Group | Files | Commit | Purpose / effect |
|---|---|---|---|
| Products hidden (Q-02) | `src/content/data/visibility.ts` (A), `src/app/[locale]/products/page.tsx`, `src/content/navigation.ts`, `scripts/postbuild.mjs`, `src/components/sections/solution/solution-detail.tsx` | `3496899` | Products is not built and not in the navigation. Postbuild deletes hidden-route output, which avoids a 200 "soft 404". |
| 12 industries (Q-08) | `src/content/data/registry.ts`, `relations.ts`, `aliases.json`, `copy/{en,ar,zh}/catalog.json`, `docs/image-asset-manifest.csv`, `src/content/media/manifest.generated.json` | `3496899` | New industry (summary drafted, pending review) and Residential renamed. New alias and image slot. |
| Site Survey in Understand (Q-09) | `copy/{en,ar,zh}/catalog.json` `approach.0.text`, `scripts/content-fidelity.mjs` (`AMENDED`) | `3496899` | Wording pending review. The 01 change is declared, not hidden. |
| V/M/V withheld (Q-04) | `copy/en/about.json`, `src/app/[locale]/about/page.tsx`, `src/content/schema/index.ts`, `scripts/content-check.mjs` | `3496899` | New `withheld` status; the about page shows labels only. |
| D-18 / D-19 recorded | `copy/en/{contact,products,projects,seo}.json`, `messages/en.json`, `relations.ts`, `tests/unit/relations.test.ts` | `3496899` | Per-entry `approved` markers; relations `approved`. |
| Samples (Q-12, D-01/D-02) | `src/content/data/samples.ts` (A), `copy/*/samples.json` (A), `projects-preview.tsx`, `site-footer.tsx`, `globals.css`, `home.css`, `scripts/site-check.mjs` | `3496899` | Preview-only, labelled sample projects and offices; production guard in `site:check`. |
| Logo (D-05) | `public/images/brand/vision-plus-logo-stacked-white.svg` (A), `site-footer.tsx`, `globals.css` | `3496899` | Client stacked logo in the footer (byte-identical copy). |
| Placeholder sizes (D-11) | `src/components/media/image-slot.tsx`, `globals.css` | `3496899` | Compact thumbnails now show their delivery size. |
| ar/zh notes, workbook (D-12/13/24) | 26 files under `copy/{ar,zh}/`, `messages/{ar,zh}.json`, `scripts/i18n-export.mjs`, `docs/i18n/translations.xlsx` | `3496899` | Status notes say "drafted by Claude, human review required". |
| Mobile NVR revision (P2) | `mnvr-page.tsx` (A), `mnvr-system-art.tsx` (A), `mnvr.css` (A), `solutions/[slug]/page.tsx`, `tests/unit/mnvr-page.test.ts` (A), `tests/e2e/pages.spec.ts`, `scripts/dev/review-shots.mjs`, 39 × `docs/review/p2-mnvr-revision/*.webp` (A) | `7acdfff` | Dedicated page plus the "On board" diagram, **pending Ziad**. |
| Evidence tooling | `scripts/dev/home-unchanged-diff.mjs` (A) | `3496899` | Homepage protection check. |
| Decision records | `docs/CLIENT_DECISIONS.md` (A), plan, checklist, manifest, P4 review, storyboards, phase status, notes, README, fidelity report | `6859835` (+ `3496899`/`7acdfff` for the generated report) | Documentation. |

### 1.6 Recommended path (the decision is Ziad's)

1. Open a PR `claude/confident-cori-lahb3k` → `main`. Do not push directly to `main`. The PR shows the full diff above and runs CI against `main` as base.
2. Merge the PR only after Ziad has verified the Mobile NVR page. Alternatively, merge the non-Mobile-NVR work first, if Ziad prefers to keep `main` free of pending design work.
3. Set `main` as the default branch in GitHub settings.
4. Decide whether the repository should be private, given the client materials it contains.
5. Confirm what `vision-plus-gamma.vercel.app` is.

---

## 2. Homepage audit (approved baseline)

### 2.1 Protection evidence

**Verified (run)** on `6859835`, against a build of `a48f2df` (= `main`'s tree):

- **Markup:** the 8 sections Hero, Positioning, Integration, Mobile NVR, Why, Partners, Journey and Closing have **byte-identical markup** in en/ar/zh. Asset hashes are normalised.
- **Pixels:** `scripts/dev/home-unchanged-diff.mjs` hides the 3 changed sections, the header and the footer in both builds and compares full pages: **0 differing pixels** in en/ar/zh × 390/768/1440/1920.

**Limitations:**
- Chromium only, reduced motion only.
- Hover, open mega menus, the mobile drawer and animated states are not pixel-compared.
- `a48f2df` was shown to be 0 px against the approved `c7e5c0e` on 2026-10-01 (**reported**; not re-run today).

### 2.2 Changed regions

All five changes come from `3496899`.

| Region | Source files | Decision | Kind of change | Needs Ziad's review |
|---|---|---|---|---|
| Desktop header | `src/content/navigation.ts`, `src/content/data/visibility.ts` | Q-02 (Products hidden). The Industries mega panel lists 12 industries (Q-08). | **Content and visibility.** One nav item and its mega panel are removed, and the remaining items reflow. The mobile header bar is unchanged at 390 px. The drawer uses the same model. | Desktop nav spacing with 5 items. Q-03 (order) is still unresolved. |
| Approach | `copy/*/catalog.json` | Q-09 | **Content.** The Understand sentence is longer (section +23 px on desktop). | Wording is pending review (CLIENT_DECISIONS §5 R-2). |
| Industries | `registry.ts`, `copy/*/catalog.json`, `image-slot.tsx`, `globals.css` | Q-08, D-11 | **Content, plus a placeholder label.** One more row and one renamed row (+75 px desktop / +179 px mobile). The 64 px mobile thumbnails now print `1080×1350`. | Drafted summary; order (R-4); thumbnail label legibility on phones. |
| Projects | `projects-preview.tsx`, `data/samples.ts`, `copy/*/samples.json`, `home.css`, `globals.css` | Q-12 | **Content plus a new visual element** (preview only). Three sample cards replace the "Awaiting client project data" slots; a dashed "Illustrative sample" tag is added; the card title colour changes from muted to full text colour. Production behaviour is unchanged (section hidden). | The sample tag is a new UI element on the approved homepage. Sample names and scopes (R-6). |
| Footer | `site-footer.tsx`, `globals.css`, `public/images/brand/…svg`, `data/samples.ts` | D-05, D-01/D-02 | **Visual and content.** The text wordmark is replaced by the client's stacked logo (200 px wide, with negative margins to offset the artboard padding). Dummy office details and a "Sample data — not verified" tag are shown (preview only). | **The logo uses bronze `#c08f42` and a `#d3942c`→`#7f5421` gradient**, outside Option B. D-05 says "do not recolour", so this is a brand decision, not a fix. `scripts/brand-check.mjs` only bans the Option A colours and does not scan `public/`. |

### 2.3 Palette

**Verified (run):** no literal colours were added to `src/styles/mnvr.css`, `globals.css` or `home.css` in these commits. Only tokens and `color-mix()` of `--color-gold` are used. The only off-palette colours are inside the client's logo file.

---

## 3. Mobile NVR — review notes for Ziad (PENDING — ZIAD'S PERSONAL VERIFICATION)

**Scope reviewed:**
- `src/components/sections/solution/mnvr-page.tsx`
- `src/components/scenes/mnvr-system-art.tsx`
- `src/styles/mnvr.css`
- `tests/unit/mnvr-page.test.ts`, `tests/e2e/pages.spec.ts`
- `docs/SCENE_STORYBOARDS.md` §2 / §2a
- All 39 images in `docs/review/p2-mnvr-revision/`: full page en/ar/zh × 390/768/1440/1920 in reduced motion; "On board" steps for en 1440, ar 1440 and en 390; Route beats for en and ar

### 3.1 Confirmed strengths (evidence)

- **Approved words only.** Step titles and texts are approved capability names and pillar sentences, pinned by `tests/unit/mnvr-page.test.ts` (verified, run).
- **No new JavaScript.** Page JS is 141.8 KB gz, the same as before. CSS is 15.6 KB and HTML 22.4 KB (en) / 24.4 KB (ar) gz (verified, run: `pnpm budget`). The diagram is inline SVG of about 3 KB.
- **Accessibility.** axe finds 0 serious/critical issues on the page in 3 locales × 2 viewports. The diagram is `aria-hidden` and the ordered step list carries the content (verified, run: e2e).
- **Fallbacks.** In reduced motion the complete diagram shows (verified, e2e). Without JavaScript, and in browsers without `:has()`, the "not yet" state is never applied, because it requires `.motion-ok` plus `@supports selector(:has(*))`. That is by code review only; **no automated no-JS test** exists.
- **RTL.** The art is mirrored and the step numbers are not (verified, e2e). The ar screenshots show the vehicle reversed with upright digits.
- **LCP.** The LCP element is the hero paragraph, not a scene (Lighthouse report, 09:14 UTC run on `7acdfff` code), consistent with storyboard rule 0.2-7.
- **No fabricated material.** No footage, plates, places, times, counts or alarms. The screen is an empty outlined frame (D-26).

### 3.2 Potential issues

None of these have been changed.

| # | Observation | Trace | Intentional? | Suggestion |
|---|---|---|---|---|
| 1 | **Large dark band below the hero** (≈ 640 px at 1440) | `ImageSlot id="SOL-MNVR-HERO"`, F2 9:4 (2880×1280; mobile 1080×810, 4:3). Small ID and size label at bottom-start | **Yes.** §26.2 #1 full-bleed band; D-11/D-26 placeholder | Confirm a label this small is clear enough for reviewers. The image is outstanding (D-26). |
| 2 | **Large light band in Applications** | `SOL-MNVR-FLEET` placeholder | **Yes** (§26.2 #5) | Same as #1. |
| 3 | **Tall empty gaps between the "On board" steps** in static screenshots | `.sys__step { min-height: 34svh }` (mobile) / `44svh` (desktop) applies in **all** modes, including reduced motion and no JS, where nothing is triggered | Intentional for the scroll trigger; **not needed in static mode** | Scope the min-heights to `.motion-ok`. |
| 4 | Step numbers in the diagram become ≈ 7 px on phones | SVG callouts are 12 user units, scaled ×0.56 at 358 px | Unintended legibility issue | Larger callouts on small screens, or hide them below `md`. |
| 5 | §26.2 sections not on the dedicated page: **Context with `SOL-MNVR-DETAIL`** (#2) and **"Delivered through our lifecycle"** (#6) | `mnvr-page.tsx` | Partly intentional: the page is dedicated (plan A-22) | A-22 does not record the omission of #2/#6, and the manifest slot `SOL-MNVR-DETAIL` is now unused. Decide: keep the omission and update the manifest, or reinstate. |
| 6 | Mobile order: §26.2 #1 says "on mobile the image comes first, then the text"; the page shows the text first | `mnvr-page.tsx` hero | Deviation | Confirm. |
| 7 | **Two animations on one page:** "On board" plus the pinned Route (~520 svh) | Page structure | A design choice (R-5) | The client asked for "small-scale". Ziad decides whether the Route stays here. |
| 8 | One-shot reveal: arriving from below (Back, anchor) lights later steps before earlier ones | MotionController `[data-reveal]` is one-shot | Side effect | Verify in a running preview. |
| 9 | ar hero: English placeholder lede is left-aligned while the CTA sits at the inline start (right) | `textAttrs` → `dir="ltr"` on the paragraphs | Side effect of placeholder copy | Resolves when Arabic copy lands (P8). |
| 10 | ar/zh page copy is English (placeholder, P8) | `copy/{ar,zh}/solutions.json` status `placeholder` | Yes (A-11) | Ziad should expect English on `/ar` and `/zh`. |
| 11 | h1 is the solution name in caption size; the approved headline is a display `<p>` | Matches §26.2 #1 ("solution name (h1), approved headline (display)") | Yes | Confirm visually. |
| 12 | Lighthouse: performance 0.96, **LCP 2.56 s** (lab), above the 2.5 s warning and the §37 field target of 2.0 s | 09:14 UTC run | Gap | Track in P10, or tune the hero text font loading. |
| 13 | Scene frame budget (≥ 55 fps) and CLS during a scroll-through **not measured** (§40 Motion, §51) | — | Gap | Needs a performance trace. |

### 3.3 Needs a running preview

These can't be judged from screenshots; there's no preview URL until D-22.

- Scroll feel and the timing of each trigger on a real phone.
- iOS Safari: sticky stage, `svh`, `:has()`.
- Firefox and WebKit. The nightly matrix last ran on `a48f2df`, **not** on `7acdfff`.
- Back/anchor navigation (issue #8).
- Save-data / low-memory Route fallback.
- Keyboard-only and screen-reader pass.
- Dark-band perception at real size.

### 3.4 Open content / storyboard questions

- **"On board" (§2a)** is new and is **not covered by D-20**. It needs Ziad's verification, then client approval as applicable.
- **Route storyboard (§2) "Questions for the client"** were not answered one by one in the 2026-10-02 decision:
  - generic bus/van silhouette or an abstract glyph;
  - keep the capability labels on beats 1 and 2.
- The first cut uses a generic vehicle glyph and both labels; treat both questions as **open**.

### 3.5 Ziad's verification checklist

- [ ] Hero, "On board", Route, capabilities, applications, related and CTA read as one dedicated Mobile NVR page (not the generic template).
- [ ] The "On board" animation is small-scale, purposeful and explains the product (cameras → recorder/storage → GPS → 4G/5G → remote viewing).
- [ ] Nothing implies a real deployment, real footage or a capability Vision Plus has not approved.
- [ ] Desktop (1440/1920) and mobile (390/768) compositions are acceptable. Decide on issues #3, #4 and #6.
- [ ] Arabic RTL mirroring is acceptable (with placeholder English text).
- [ ] Decide whether the Route scene stays on this page (#7).
- [ ] Decide on the §26.2 Context/DETAIL image and lifecycle omission (#5).
- [ ] Placeholder bands (#1, #2) are understood as image slots awaiting D-26/D-11 assets.
- [ ] Outcome: ☐ verified, forward to the client · ☐ changes requested (list)

---

## 4. Leak paths and production gates

**Verified (run):**
- `CONTENT_MODE=production` `content:check` exits 1 with **38 blockers**: 24 ar/zh copy, 2 ar/zh messages, 10 office fields, and en `about.json` + `catalog.json`.
- `assets:check` exits 1 with **16 blockers** (15 P1 slots + BRAND-LOGO).
- A **production-mode render with those gates deliberately bypassed** (`CONTENT_MODE=production next build` locally, then postbuild and `site:check`; not deployed) was scanned for leaks.

| Pending / sample item | Shown in preview | In the production render (gates bypassed) | What stops it shipping |
|---|---|---|---|
| Sample projects (Q-12) | Homepage, labelled | **Absent** (0 matches) | `isPreview` guard in `projects-preview.tsx`; `site:check` `[data-sample]` rule |
| Dummy offices (D-01/D-02) | Footer, labelled | **Absent**; offices show the country name only | `isPreview` guard in `site-footer.tsx`; 10 location blockers |
| Q-08 Real Estate summary, Q-09 Understand wording | Homepage | **Present** in markup | Content gate: `catalog.json` is `draft`. A file with pending entries cannot be set to `approved` (rule in `content-check.mjs`) |
| Q-04 V/M/V | Not rendered | Absent | Never rendered; `about.json` is `draft` (blocker) |
| Supply & Procurement draft | Not rendered | Absent (only in `docs/CLIENT_DECISIONS.md`) | Not in `src/` or `messages/` |
| Products page | Hidden | Not built (postbuild removed `/products`, `/_lab`) | `visibility.ts` + postbuild; e2e 404 test |
| ar/zh drafts | `/ar`, `/zh` | Present | Content gate (26 blockers) |
| Image placeholders | Labelled boxes | Absent (`ImageSlot` returns null) | `assets:check` P0/P1 gate |
| Interim header wordmark | Header | Present | BRAND-LOGO P0 gate |
| Privacy / Company Profile "… — pending client (D-16/D-06)" lede | P3 templates | **Present, and no gate covers it** | **Gap:** a production build with every other input supplied would publish these lines. P5A templates must gate them. | *Remediated in `123c73e` (§8).*
| `site:check` sample guard | — | — | **Gap:** not in `.github/workflows/deploy-production.yml`, which runs lint, typecheck, test, build and budget only. It does run in `ci.yml`. | *Remediated in `123c73e` (§8).*

---

## 5. Quality evidence

The working branch was at `6859835` during this audit; `6859835` is docs-only on top of `7acdfff`.

| Check | Result | Evidence |
|---|---|---|
| Lint (ESLint + RTL rule + Option A ban) · Prettier · typecheck | Pass | Verified (run); also CI runs 9–11 |
| Unit (Vitest) | 48/48 | Verified (run) |
| `content:check` (Zod, parity, gates) | Pass in preview; production blocked by 38 | Verified (run) |
| `content:fidelity` | 371/371 approved units, 1 declared amendment, 0 undeclared | Verified (run) |
| `assets:check` | Pass in preview; production blocked by 16; 2 resolution warnings for HOME-HERO | Verified (run) |
| `site:check` | 60 pages, 6,516 links, 99 redirects, 0 errors | Verified (run) |
| E2E Chromium + axe | 117 passed, 7 skipped by viewport design | Verified (run); also CI |
| E2E Firefox/WebKit matrix | Last success on `a48f2df` (scheduled, 2026-10-02 08:30) | Verified (GitHub). **Not run on `3496899`/`7acdfff`/`6859835`** |
| Worker smoke (local workerd) | 25/25 | Verified (run) |
| Budgets | Home JS 142.8 / CSS 11.4 / HTML ≤ 25.6 KB; Mobile NVR JS 141.8 / CSS 15.6 / HTML ≤ 24.4 KB (gz) | Verified (run). **The §37 target is 130 KB JS**; the 160 KB cap is the documented amendment A-05. JS is above the plan target. |
| Lighthouse (mobile, median of 3) | `/en` 0.97 · `/ar` **0.89** · `/zh` **0.75** · Mobile NVR 0.96 · a11y 1.00 · best practices 0.96 | Run at 09:14 UTC on `7acdfff` code (not re-run since). **Below the §37 target (≥ 90):** `/ar` and `/zh`. **LCP above 2.5 s:** `/ar` 3.45 s, `/zh` 4.46 s, Mobile NVR 2.56 s. CI asserts performance only as a 0.6 error floor and a 0.95 warning, so a green CI does **not** mean the target is met. |
| Lighthouse SEO 100 | Not asserted as a category in preview (noindex caps it) | P7/P10 |
| GitHub CI | Runs 8 (`main`), 9, 10, 11: success | Verified (GitHub) |
| Visual-regression snapshots, component tests (Testing Library), scroll-through CLS, ≥ 55 fps traces | **Not implemented** | §40 and §50 assign them to P5/P10 |
| Preview deployment | **Blocked (D-22)** | — |

### 5.1 Security

**Verified (run), code review:**
- **Secrets:** none found by pattern scan. `.env*` is ignored (`.env.example` allowed). No account ID, zone or route in `wrangler.jsonc`.
- **Workflows:** all four use `permissions: contents: read`. Production deploy is manual, uses `environment: production`, and stops if the Cloudflare secrets are absent.
- **Dependencies:** `pnpm audit --prod` showed no known vulnerabilities (reported, run during the `main` review at `a48f2df`).
- **CSP:** documented `'unsafe-inline'` for scripts (hash-based CSP is planned for P10).
- **New SVG:** `public/images/brand/vision-plus-logo-stacked-white.svg` is loaded through `<img>` (scripts cannot execute) and contains no `<script>` or external references.
- **Repository visibility:** **public** (§1.3).

---

## 6. P5 boundary

The source of truth is MASTER_PROJECT_PLAN §49.1 P5, §26, §23.5–23.6, §37–41, §50 and §51. Nothing below adds scope.

### 6.1 Entry conditions

| Condition | State |
|---|---|
| Revised Mobile NVR page verified by **Ziad personally** | ☐ **Pending** |
| Revised Mobile NVR page approved by the client, as applicable, so that **P2 is closed** | ☐ Open |
| P3 acceptance recorded with open items visible | ☑ (`CLIENT_DECISIONS.md` §3) |
| P4 approvals (D-18, D-19, D-20) recorded | ☑ (`P4_CLIENT_REVIEW.md` §6) |
| **Ziad explicitly authorises P5** | ☐ Not given |

### 6.2 P5A — Templates

The plan's list (§49.1). Inputs: §26, the content and the storyboards.

| Item | Plan § | Can proceed with labelled placeholders | Blocked / deferred until | Specific acceptance |
|---|---|---|---|---|
| Home | §26.1 | Already approved; only decision-driven changes | — | Unchanged baseline sections (0 px) |
| Solutions hub + 7 solution details | §26.3, §26.2 | Yes (image slots) | Scenes for the 7 details come in P5B | §26.2 sections 1–8 |
| Industries explorer | §26.4 | Yes; **12** industries (A-16, not 11) | Real Estate summary (R-1) and order (R-4) need review | Master–detail on desktop; anchored sections without JS |
| Services lifecycle | §26.5 | Yes | Supply & Procurement stays out until R-3 is approved | Sticky track; "Stages" markers (D-19) |
| About | §26.8 | Yes for Who we are, Journey, Philosophy and Why | **Vision, Mission, Values withheld (Q-04)** | Withheld text never rendered |
| Products | §26.6 | Template only, **hidden (Q-02)** | D-09 data plus client approval to publish | Not built in output while hidden |
| Projects list/detail | §26.7 | **4 illustrative samples (Q-12)**, preview only, labelled | Real projects (D-10) before launch | Filter bar only at ≥ 6 projects (so none with 4 samples) |
| Partners | §26.9 | Neutral placeholder cells | D-08; Q-13 | Hidden from production navigation until real data exists |
| Company Profile (config placeholder) | §26.11, §33 | Yes | D-06, Q-06/D-27 | No embed without a real URL; the pending lede is gated in production (§4 gap) |
| Contact UI | §26.10, §30 | Form UI and locations with sample data (D-01/D-02), map placeholder (D-03) | P6 (integration), D-04, D-14 | Production build fails on placeholder location values |
| Privacy | §26.12 | Marked draft placeholder (D-16) | Legally reviewed policy | Pending text never published (§4 gap) |
| 404 | §26.13 | Yes | — | Localised; links to key sections |
| OG card generation | §50 | Yes (typographic, OG-DEFAULT) | Official logo variants (D-05) for any logo use | 1200 × 630 |

### 6.3 P5B — Scenes

Order fixed by §49.1:

1. Harden the engine (plus the scene lab `/_lab/scenes`, §10 of the storyboards).
2. Mobile NVR (finish), but only after Ziad's verification.
3. Smart Building.
4. ELV.
5. CCTV.
6. Access Control.
7. Fire Alarm.
8. Networking.
9. AV.
10. Home Integration.

Each scene must meet the §51 scene checklist:
- it matches the approved storyboard and every label is approved copy;
- pinned, stepped, reduced-motion and no-JS modes are all complete;
- SVG ≤ 30 KB gz (≤ 45 KB for rich scenes); CLS 0; ≥ 55 fps;
- RTL is verified; no flashing.

Open storyboard questions: Route vehicle glyph and labels (§3.4 above); Smart Building photography upgrade and section-vs-plan view.

### 6.4 Required test coverage

From §40, §41 and §51:
- axe 0 per template × locale × 2 viewports.
- Visual snapshots in 3 locales × 4 widths × default/reduced motion (**not yet implemented**).
- Lighthouse budgets.
- Scene performance and reduced-motion tests.
- Component tests (**not yet implemented**).
- The QA pass is logged.
- §51 also requires a preview link for review, which is **blocked by D-22**.

### 6.5 PR grouping

The plan's rules (§49.3):
- "one PR per coherent unit";
- for P5A, "the shared section library first, then pages assembled from it";
- one engine, then scenes in the fixed order.

The plan sets no finer order for the P5A pages.

---

## 7. Handoff checklist

### A. Claude: remaining audit and documentation work

| Item | Status | Why | Next action | Where |
|---|---|---|---|---|
| Add `site:check` to the production deploy workflow | **Done** in `123c73e` (authorised remediation, §8) | Second line of defence against sample content | Needs Ziad's go-ahead; a one-line workflow change | `.github/workflows/deploy-production.yml` |
| Gate the privacy and company-profile "pending client" ledes in production | **Gated** in `123c73e` (§8). The templates themselves are unchanged; replacing the lede remains P5A plus client content (D-06, D-16) | They would publish today if all other gates passed | Handle in the P5A Privacy/Company Profile PRs | `src/app/[locale]/{privacy,company-profile}/page.tsx` |
| Run the browser matrix on the current head | Not run since `a48f2df` | Firefox/WebKit coverage of the new page | Trigger `e2e-matrix.yml` (manual dispatch) once Ziad agrees | `.github/workflows/e2e-matrix.yml` |
| Mobile NVR technical fixes (#3, #4) | Proposed only | Static-mode gaps; legibility | Apply only if Ziad requests them | `src/styles/mnvr.css`, `mnvr-system-art.tsx` |

### B. Ziad: personal verification and decisions

| Item | Status | Why | Next action | Where |
|---|---|---|---|---|
| Verify the revised Mobile NVR page | **PENDING** | Closes P2; gates P5 | Use the §3.5 checklist and the screenshots | `docs/review/p2-mnvr-revision/` |
| Merge path | Undecided | `main` lacks 3 commits | Open a PR, review, merge when ready (§1.6) | — |
| Default branch → `main` | Not done (verified) | Scheduled workflows run on the default branch | GitHub → Settings → Branches | — |
| Repository visibility | Public (verified) | Client materials are exposed | Decide public or private | GitHub settings |
| `vision-plus-gamma.vercel.app` | Unverified | Possible undocumented deployment (D-22 says none) | Confirm or remove | Repo homepage field |
| Footer logo colours vs Option B | Open | Brand consistency | Accept as delivered, or ask the client for a `#D4AF37` version | CLIENT_DECISIONS D-05 |
| Sample tag on the homepage | Open | New UI element on the approved homepage | Accept or request changes | §2.2 |
| Authorise P5 | Not given | Required entry condition | Explicit instruction after P2 closes | §6.1 |

### C. Client: approvals and assets

| Item | Status | Next action | Where |
|---|---|---|---|
| Mobile NVR revision (after Ziad) | Pending | Client review, as applicable | `CLIENT_DECISIONS.md` §5 R-5 |
| Q-03 navigation order; Q-04 V/M/V wording | Unresolved | Supply them | §1 |
| R-1 to R-4 and R-6 (drafts, order, samples) | Pending review | Approve or edit | §5 |
| Storyboard sub-questions (Route glyph and labels; Smart Building photography and view) | Open | Answer | `SCENE_STORYBOARDS.md` §2, §3 |
| D-01 to D-04, D-05 variants, D-06, D-08 to D-11, D-14 to D-16, D-21, D-26 | Outstanding | Supply them | `CLIENT_INPUT_CHECKLIST.md` |
| D-12/D-13 human reviewers | Not named | Name them | — |
| D-07/D-14/D-22 access | Outstanding | Provide access; **D-22 blocks the preview URL** | `DEPLOYMENT.md` |

### D. Deferred to later phases

| Item | Phase |
|---|---|
| Contact integration (Worker, Turnstile, Sheets, email) | P6 |
| SEO (hreflang, canonical, JSON-LD, sitemap, SEO = 100) | P7 |
| Arabic/Chinese drafting by Claude and human review | P8 |
| Client assets integration | P9 |
| `/ar` `/zh` Lighthouse ≥ 90, LCP, JS 130 KB target, hash-based CSP, browser/device matrix, `QA_MATRIX.md` | P10 |
| DNS, production secrets, launch | P11 |

### E. P5 entry conditions still open

1. Ziad's personal verification of the Mobile NVR revision.
2. P2 closed (client approval as applicable).
3. Ziad's explicit authorisation to start P5.

---

## 8. Authorised audit remediation (2026-10-02)

Scope authorised by Ziad: security gates, documentation and verification only.
- Branch: `claude/confident-cori-lahb3k`, start `979d263`.
- Gate commit: **`123c73e`**.
- Not touched: no P5 work, no deployment, no merge, no PR, nothing pushed to `main`, no default-branch change. The Mobile NVR page, the homepage and the footer logo are unchanged.

### 8.1 Production deployment gate

- **`.github/workflows/deploy-production.yml` lines 50–53:** new step `Site check (production output gate)` → `run: pnpm site:check`. It runs after `pnpm build` (line 49) and before `pnpm budget` and `pnpm deploy:production`.
  - Steps run sequentially without `continue-on-error`, so a failure stops the job.
  - The manual dispatch, the `confirm == 'deploy'` condition, `environment: production`, `CONTENT_MODE: production` and `permissions: contents: read` are unchanged.
- **Test:** `tests/unit/production-gates.test.ts` (*production deploy workflow*) asserts:
  - the step order build → site:check → deploy;
  - no `continue-on-error`, step `if:` or masked exit code;
  - the manual-only trigger and production restrictions are intact.
- **Mutation check (verified, run):** changing the step to `pnpm site:check || true` makes 2 of these tests fail. The file was restored afterwards.

### 8.2 Pending-client content protection

**Finding:** `src/app/[locale]/privacy/page.tsx` and `src/app/[locale]/company-profile/page.tsx` pass `pending.privacy` / `pending.companyProfile` ("… — pending client (D-16/D-06)") as their lede, with no preview guard. Those strings live in `messages/*.json`, which is approved (D-18), so no status gate caught them.

**Fix (gates only):** the templates were not changed. Replacing the lede needs the client's content and the P5A templates.
1. **`scripts/content-check.mjs`:** in production, every route that renders the `pending` messages namespace is a publication blocker. That is exactly these two routes; production blockers go from 38 to 40.
2. **`scripts/site-check.mjs`:** in production, any deployable HTML page **or RSC payload (`.txt`)** containing a distinctive `pending`, `placeholder` or `preview` message string, in any locale, fails the check.
   - Only distinctive strings are used (≥ 20 characters, no ICU arguments), so generic labels can't cause false positives.
   - `SITE_OUT` allows fixture tests.

**Evidence (verified, run):**
- **Unit tests** (*site:check production output gate*, *content:check production gate*, real scripts): pending text in HTML (en, ar) fails; pending text only in an RSC payload fails; sample content fails; a clean page passes; preview builds are unaffected; the content gate lists both routes.
- **Local production-mode render** (gates bypassed, not deployed): `site:check` exits 1 with **24 errors**, which is exactly the 2 ledes × 3 locales × 4 deployable files (`.html`, `.txt`, `__PAGE__.txt`, `_full.txt`). No other errors. The preview build still passes with 0 errors.

**Remaining dependency:** the pages stay unpublishable until D-16 (a legally reviewed policy) and D-06 (the Canva profile) are supplied and their P5A templates are built. This is intended.

### 8.3 Verification

Runs on `123c73e`, local container (Node v22.22.2, Playwright 1.56.1, Chromium):

| Command | Result |
|---|---|
| `pnpm lint` · `format:check` · `typecheck` | Pass |
| `pnpm test` | **58/58** (48 existing + 10 new) |
| `pnpm content:check` | Pass (preview); 40 production blockers |
| `content:fidelity` | 371/371, 0 undeclared |
| `assets:check` | Pass (preview); 16 production blockers |
| `site:check` | 60 pages, 6,516 links, 99 redirects, 0 errors |
| `budget` | All within caps |
| `pnpm test:e2e` (Chromium, desktop + mobile projects, axe) | **117 passed, 7 skipped**. The skips are by viewport design: drawer focus trap and drawer accordion on desktop; mega menu keyboard and language switcher on mobile; Route stepped mode on desktop; Route pinned mode and Route RTL on mobile |
| `pnpm worker:smoke` (local workerd) | 25/25 |
| **Firefox / WebKit matrix** (GitHub `e2e-matrix.yml`, workflow_dispatch on `claude/confident-cori-lahb3k`) | **In progress at the time of this commit** (run 36998058056 on `123c73e`); no result recorded yet. It will be added once the run completes. |

### 8.4 Security and public repository

- **Secret scan (verified, run):** the full git history (`git log -p --all`) was scanned for:
  - AWS keys, GitHub tokens, Google API keys, Slack tokens;
  - private-key blocks and JWTs;
  - assigned `api_key` / `secret` / `token` / `password` literals;
  - Cloudflare token assignments.

  Result: **0 matches** for every pattern. The only tracked env file is `.env.example`, with two non-secret settings (`CONTENT_MODE`, `NEXT_PUBLIC_SITE_URL`). No values were printed.
- **Publicly readable client-facing paths** (the repository is public; contents not reproduced here):

  | Path | What it is |
  |---|---|
  | `client-materials/00_README_AND_SOURCE_MANIFEST.md`, `client-materials/PACKAGE_README.md` | Client package manifests |
  | `client-materials/01_Vision_Plus_Approved_Content.txt` | Approved website copy |
  | `client-materials/02_Vision_Plus_Strategy_and_Brand.pdf` | Strategy and brand document (includes market research) |
  | `client-materials/04_Vision_Plus_Color_Palette_Option_B.jpg` | Palette |
  | `client-materials/_extracted/` (README + 3 PNG extracts of PDF pages 5–7) | Extracts from the PDF |
  | `client-materials/brand/logo-package-v1-2026-10-01/` (REVIEW.md, 2 contact sheets, 13 as-received logo/icon files) | Unreleased logo package |
  | `public/images/home/home-hero.jpg`, `home-hero-mobile.jpg` | Client banner (intended for the public site) |
  | `public/images/brand/vision-plus-logo-stacked-white.svg` | Client logo (intended for the public site) |
  | `docs/review/p2/` (36), `docs/review/p2-mnvr-revision/` (39) | Review screenshots, including sample data |
  | `docs/i18n/translations.xlsx` | Translation workbook |
  | `docs/*.md` (plan, decisions, checklist, review sheets, manifests, notes) | Internal decisions, open questions and client status |

  Visibility is unchanged and nothing was moved or deleted. The decision is Ziad's.
- **`vision-plus-gamma.vercel.app`** (repository homepage field): **unverified**. It was not visited in this task.

