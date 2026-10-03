# Implementation Notes — Phase: Homepage (quality gate)

**Scope delivered:** the complete homepage in `/en`, `/ar` and `/zh`, plus the shared foundation it needs. It includes:
- tokens, type and grid
- header with mega menus, language switcher and mobile drawer
- footer
- the image-slot system
- the motion system
- content/asset gates
- tests

**Not started (by instruction):** every other page. Links to `/solutions`, `/about` and the rest resolve to the global 404 until their phases are built.

The MASTER_PROJECT_PLAN is unchanged. The table below records every place where implementation made a concrete choice the plan left open, or where a measurement corrected a plan assumption. **None of them changes the architecture.**

## 1. Decisions and deviations

| # | Topic | Plan said | Implemented | Why |
|---|---|---|---|---|
| I-01 | next-intl static setup | "`next/root-params` in Next ≥ 16.3" | `setRequestLocale` (documented and supported) | Root params require `[locale]` to be the *root* layout. That prevents the static root redirect (`app/page.tsx`) and the global 404 in a static export unless experimental flags are used. Revisit when `globalNotFound` becomes stable. |
| I-02 | Client i18n runtime | next-intl on the client | **No `NextIntlClientProvider`.** All strings are resolved on the server and passed to islands as props. `src/i18n/navigation.ts` is a ~0.5 KB locale-prefixing wrapper around `next/link`. | Removes ~13 KB gz of client JS (use-intl plus a message formatter) and the serialized message payload. The API (`Link`, `usePathname`) is unchanged for call sites. |
| I-03 | Font delivery | `next/font/google` | `next/font/local` with the same OFL fonts from Fontsource (IBM Plex Sans variable, IBM Plex Sans Arabic). Noto Sans SC CSS and slices are copied to `public/fonts/` and linked **only on `/zh`**. | Builds stay deterministic and offline (Google Fonts is unreachable from some CI sandboxes and from mainland China), with an identical result. Arabic is never preloaded. The Chinese CSS (31 KB gz) is never requested outside `/zh`. |
| I-04 | JS budget | ≤ 130 KB gz first load | **Measured: 142.8 KB gz** module JS on `/en` = **134 KB** Next 16.3 + React 19.3 framework baseline + **8.5 KB** of homepage code. The 38.7 KB legacy polyfill (`noModule`) is not downloaded by modern browsers. | 130 KB cannot be met by any Next 16 page. Proposed budget: **framework baseline + ≤ 25 KB of app JS per route**, with CI failing on a > 10 % regression. |
| I-05 | Hero CTAs | *Explore solutions* + *Request a consultation* | Hero: **Explore solutions** (primary) + **See how we work** (secondary). The consultation CTA is always in the header, rendered as an outline while over the dark hero. | Avoids two identical CTAs in the first viewport. The two hero actions are the two ways into the story (what and how). |
| I-06 | Hero while HOME-HERO is missing | Placeholder only | Placeholder plus **preview-only architectural linework** (`HeroPlaceholderArt`): a building corner in Option B greys with gold light seams that draw on load. | The requirement was that the missing photograph must not make the hero look unfinished. This is a drawing, clearly not a photograph, that never represents a Vision Plus site. It is removed automatically once `HOME-HERO` is registered as final, and it never renders in production. |
| I-07 | Closing section | Statement, CTA and two office mini-blocks | Statement, CTA (consultation + company profile). Offices appear in the footer directly below. | Avoids showing the same placeholder office blocks twice in one scroll. |
| I-08 | Journey strip | Optional F7 images | Text-first strip. The images stay optional on the About page. | Keeps the strip light and symmetrical, since "Today" has no P2 image. |
| I-09 | Mobile projects preview | Horizontal snap list | Implemented as specified. The list is keyboard-focusable (it scrolls). | — |
| I-10 | Magnific (generative imagery) | Allowed where it improves supporting visuals | **Not used on the homepage.** | Every homepage visual is either (a) a real-photography slot, which must stay a placeholder per the manifest, or (b) a technical diagram. Diagrams are better as code-drawn SVG: crisp at any DPR, animatable along real paths, mirrored for RTL, themed by tokens, and a few KB. A raster from a generator would be heavier, would not respond to scroll or RTL, and would risk the "AI visual" look the brief rules out. Magnific will be reconsidered for solution-scene reference art in Phase 4 storyboards. |
| I-12 | **HOME-HERO: client banner (2026-09-29; replaced 2026-10-03)** | Real photography to the manifest (2880×1800 + 1080×1350 mobile) | **2026-10-03: Ziad approved a new client banner as the home hero** (dark scene, charcoal-and-gold 3D VP monogram on the right carrying CCTV cameras, a PTZ dome, a monitor, a smart lock and a door intercom, with buildings and a night skyline; the left side is empty for text). It replaces the 2026-09-29 banner (grey/charcoal grain + VisionPlus logo lock-up, "From vision to execution"). **Desktop** is the file as supplied (1500×938 WebP, flattened to sRGB JPG q90, 16:10 ✓). **Mobile** is a 4:5 crop of the same file framed on the VP lock-up (x 720–1470, 750×938), with no new imagery. Alt text rewritten in en/ar/zh (ar/zh are draft translations). `textZone: 'left'` and the focal point are unchanged. AVIF quality is 48 pipeline-wide. | Requested by the client. The asset gate now reports resolution shortfalls as **warnings** (ratio mismatch is still an error): both files are about half the manifest master size, so they will be slightly soft on high-DPI screens. **Request full-size masters.** |
| I-13 | Artwork-specific text zone | Manifest safe zones: text in the outer band on the inline-start side (mirrored in RTL) | New `textZone: 'left'` option in `images.json`. The banner has the logo baked in on the right, so hero text is pinned to the dark left side in **every locale**. On desktop (≥1024) the column is 54vw in LTR and 46vw in RTL, because the RTL right edge must stay in the dark zone. The seam stops at the column instead of crossing the logo. The scrim darkens only the text side and the bottom strip, and the header top-scrim is stronger for white nav over light artwork. Tablet (768–1023) now stacks the 16:10 art above the text; mobile stacks the 4:5 crop. | The logo must not be covered or mirrored, and Arabic right-aligned text would otherwise collide with it. `HeroPlaceholderArt` is removed automatically because the slot is final. |
| I-14 | **HOME-STATEMENT: client image (2026-10-03)** | Close architectural/technical detail, real Vision Plus work, no text in the image (manifest) | Ziad approved a client-supplied image for the positioning section: a dusk desk scene (hard hat, floor plans, a tablet showing camera feeds) facing a lit building with a dome camera and an access-control panel. Registered as final at the manifest master size (1620×1080, 3:2, so no crop), saved as sRGB JPG q90. The section switches from the text-only layout to the 4/7 text-and-image layout automatically. The image carries the English line "One vision for all Connected solutions." baked in; the alt text quotes it in every locale. | Requested by the client. The baked-in line is not part of the approved site copy and stays English on `/ar` and `/zh` (it cannot be translated or mirrored); a text-free or per-locale version would fix that if the client wants it. |
| I-15 | **Industry images (IND-\*), client set (2026-10-03)** | One real environment image per industry, 1080×1350 (4:5) | Ziad approved the client's industry set for the home industries section (the same IND-\* slots also serve the Industries page). Registered as final at the manifest master size, sRGB JPG q88, with en/ar/zh alt text (ar/zh drafts): Transportation & Fleet, Government & Public Sector, Banking & Finance, Hospitality, Retail, Residential, Logistics & Warehousing, Industrial & Manufacturing, and Real Estate & Property Development where that industry exists (Q-08). **Not delivered:** Commercial & Corporate (the supplied `Commercial` file is byte-identical to `Retail`; Ziad chose to keep the placeholder), Education, Healthcare. The extra `political` file is a tighter crop of the Government scene and is unused (Ziad chose `Government.png`). | Missing industries keep the labelled placeholder in preview and render without an image in production; each is a P1 asset, so `assets:check` keeps listing them for launch. |
| I-16 | **HOME-MNVR: client image (2026-10-03)** | Real vehicle / fleet / bus with a Vision Plus mobile surveillance installation (manifest) | Ziad approved a client-supplied image for the homepage Mobile NVR chapter: a gated residential compound at dusk (car at a barrier, guardhouse with cameras) under a grid of ten smart-building system icons with English labels baked in. **Desktop** is the file as supplied (1440×1620 = manifest master, 8:9). **Mobile** is a 4:3 crop framed on the icon grid (y 40–1120 of the source, resized to 1080×810). Focal point x 0.5 / y 0.08: the half-bleed panel stretches to the text column, so at 1024–1440 it is narrower than 8:9 (side crop, every label still visible) and at ≥1920 it is wider (top kept so the first icon row is never cut); checked at 390, 1024, 1440, 1920 and 2560 and in RTL. Alt text names the ten systems in en/ar/zh (ar/zh drafts). **Feature branch only so far; not yet on `main`.** | Requested by the client. The artwork shows a residential compound and building-automation icons rather than the vehicle/mobile subject the manifest specifies for this chapter, and its labels stay English on `/ar` and `/zh`. |
| I-11 | Section tones | Plan order | Hero dark → canvas → white → **Mobile NVR dark** → canvas → white → canvas → white → canvas → white → **closing dark** → footer dark | Light-dominant rhythm with charcoal chapters at the three narrative peaks (§18). |

## 2. Content status (what reviewers are looking at)

| Content | Status | Notes |
|---|---|---|
| English homepage copy | `approved` | Taken verbatim from `01_Vision_Plus_Approved_Content.txt` (source section per file in `_meta.source`), with typographic apostrophes only. |
| English UI microcopy (buttons, labels, notes) | `draft` | Team-written. **Needs client approval (D-18).** |
| Arabic and Chinese (all) | `draft-mt` | Working translations for **layout, RTL and CJK review only.** The production build refuses them. The final copy comes from the client (D-12, D-13). |
| Projects, partners | none | Preview shows designed structural slots with no invented names, logos or data. **Hidden in production** until real data exists (D-08, D-10). |
| Offices | `placeholder` | Qatar and Egypt blocks show "pending client" in preview. The production build refuses them (D-01 to D-03). |
| Logo | interim | A typographic wordmark shown in preview only. P0 blocks release (D-05). |

A small **Preview** indicator (bottom-end, shown after the hero) lists these facts for reviewers. It is never rendered in production.

## 3. Motion system (as built)

- **One shared controller** (`components/motion/motion-controller.tsx`, ~1 KB).
  - `[data-reveal]` sets `data-inview` once the element is in view.
  - `[data-progress]` writes `--p` (0→1) while the element is on screen.
  - All visuals are CSS.
- **Text is never hidden by motion.** Only seams, signals and node states animate. There is no fade-up anywhere.
- **Homepage motion inventory:**
  - hero mask reveal plus the seam and light-seam draw (on load, once)
  - **Integration System:** a signal pass along the bus that activates each capability (desktop, once). On mobile the connection grows with scroll.
  - the Mobile NVR equation signal
  - the lifecycle line scrubbed by scroll
  - the journey seam
  - industries index reveal
  - header compression
  - the partner marquee, with a pause control
- **`prefers-reduced-motion`:** the boot script never sets `motion-ok`. Every diagram renders its final connected state, the marquee becomes a static grid, and panel transitions are instant. This is verified by E2E.
- **Flashing:** none.

## 4. Validation results (this commit)

| Check | Result |
|---|---|
| `pnpm typecheck` | ✅ |
| `pnpm lint` (includes the **RTL rule** that bans physical-direction classes, and the **Option A colour ban**) | ✅ (the rule was verified to fire on a probe file) |
| `pnpm test` (Vitest: registry ↔ manifest, ratios, content parity, no invented data) | ✅ 8/8 |
| `pnpm test:e2e` (Playwright, 1440 and 390: lang/dir, 11 sections, no horizontal overflow, **axe WCAG 2.2 AA: 0 serious/critical**, mega menu keyboard + Esc focus return, drawer focus trap, language switch, reduced motion) | ✅ 26 passed (4 skipped by viewport design) |
| `pnpm content:check` / `assets:check` (preview) | ✅. In production mode they correctly **block**: 19 content items and 15 asset items listed. |
| Image pipeline | Verified with temporary synthetic files (since removed): 26 AVIF/WebP variants, `<picture>` with separate mobile art, the gate rejects a wrong-ratio delivery. |
| `pnpm build` (static export) | ✅ `/en`, `/ar`, `/zh` |
| Lab performance (`/en`, throttled ~1.6 Mbps + 4× CPU) | LCP ≈ 1.3 s at 390 and 1440, **CLS 0.000** |
| Visual review | 390 / 768 / 1440 / 1920 × en / ar / zh; mega menus (en/ar/zh); drawers (en/ar); reduced motion |

## 5. Known limitations and next-phase notes

- **The hero banner shows the official logo and a tagline** ("VisionPlus" with a VP monogram; "From vision to execution"). Neither appears in the approved content, and the header still uses the interim "VISION PLUS" wordmark. **Next step:** the client sends the logo as vectors (D-05) so the header and footer can use it, and confirms whether "From vision to execution" becomes approved copy. Until then it appears only inside the client's own artwork.

- Links to pages outside this phase 404, and link prefetch logs 404s in the console, until those routes exist.
- The homepage `<title>`/description use the approved tagline and descriptor. Full per-page SEO (canonical, hreflang, sitemap, JSON-LD, OG cards) is Phase 7.
- The contact endpoint (Cloudflare Worker + Apps Script) is Phase 6. CTAs point to `/contact?type=…` already.
- The mega-menu "Featured" and footer structures are final. Their destinations are built in later phases.

## 6. How to run

```bash
pnpm install
pnpm build                 # gates + image pipeline + static export → out/
pnpm serve                 # http://localhost:4173/en  (/ar, /zh)
pnpm lint && pnpm typecheck && pnpm test && pnpm test:e2e
CONTENT_MODE=production pnpm build   # demonstrates the publication gates (fails until client inputs arrive)
node scripts/dev/shoot.mjs en,ar,zh 390,1440   # review screenshots → tests/screenshots/ (git-ignored)
```

---

# Implementation Notes — Phase P3: Engineering Foundation

**Scope delivered:**
- Cloudflare Worker foundation (`worker/`, `wrangler.jsonc`): root locale negotiation, health route, security headers.
- Generated `_headers` (CSP, security headers, cache rules).
- CI and deploy workflows (`.github/workflows/`).
- Platform checks: Worker dry-run and smoke test, performance budget, Lighthouse CI.
- Font subsetting for `/zh`.
- The shared `Breadcrumbs` component, used from P5.

Setup steps and the client access needed are in `docs/DEPLOYMENT.md`.

**Not done (by instruction):** no deployment (blocked on D-22), no P4+ work. The approved homepage is unchanged: a reduced-motion render is pixel-identical to the approved build (see §P3-4).

## P3-1. Decisions

| # | Topic | Decision | Why |
|---|---|---|---|
| P3-01 | Worker scope | `run_worker_first: ["/", "/api/*"]`. Every other request is a static-asset hit and never invokes the Worker. | Free-plan request limits are only spent on `/` and the API. The pages stay a static export. |
| P3-02 | Root `/` | 302 to `/{locale}`, chosen by `NEXT_LOCALE` cookie → `Accept-Language` (q-values; any `zh-*` → `zh`) → `en`. The response carries `Vary: Accept-Language, Cookie` and `private, no-store`. | Plan §15.4. A 302, not a 301, so the choice is never cached as permanent. A malformed cookie falls through to the header, and is unit-tested. |
| P3-03 | Health route | `/api/contact/health`: `GET`/`HEAD` return 200 JSON, other methods return 405 with `Allow`. | The path the P6 contact endpoint lives under. It lets uptime checks and CI probe the Worker without touching the form. |
| P3-04 | Two Workers | Top level = `vision-plus-web-preview` (noindex, branch preview aliases); `env.production` = `vision-plus-web`. | A preview build (placeholders, draft translations) can never be served from the production Worker. Previews don't touch production versions. |
| P3-05 | Headers | `scripts/postbuild.mjs` writes `out/_headers` per `CONTENT_MODE`. The Worker sets the same baseline on its own responses, because `_headers` only applies to asset responses. HSTS is set **without** `includeSubDomains` until the client's subdomains are audited (P11). | Plan §39. The CSP keeps `'unsafe-inline'` for scripts (Next static-export bootstrap); hash-based CSP is evaluated in P10. |
| P3-06 | Production deploys | `workflow_dispatch` only, with typed confirmation and the GitHub `production` environment. | The production gates fail by design until the launch blockers arrive. Nothing ships by accident before P11. |
| P3-07 | Preview without credentials | The deploy workflow **skips with a notice** when the secrets are missing, and `pnpm deploy:preview` exits 2 with an explanation. | No invented credentials. CI stays green until D-22 is supplied. |
| P3-08 | Chinese font | **Build-time subset** of Noto Sans SC to the CJK characters in `src/content/copy/zh/**` and `messages/zh.json`: 477 glyphs, **152 KB in 15 files (was 922 KB)**, with a 6 KB stylesheet (was ~100 KB). Same typeface, variable `wght` axis kept. | The full slice set made `/zh` the heaviest page by far. Characters added later are picked up on the next build; anything outside the subset falls back to the system CJK stack, exactly as before. **Verified pixel-identical** (P3-4). |
| P3-09 | Lighthouse CI | **Errors:** a11y = 100, best practices ≥ 0.95, CLS ≤ 0.05, the individual SEO audits, and a performance floor ≥ 0.60. **Warnings:** the plan targets, performance ≥ 0.95 and LCP ≤ 2.5 s. | Preview is noindex, so the SEO *category* is capped at 0.63 by `is-crawlable` alone. Lantern scores for an identical build varied by up to ±0.1 between runs. The ≥ 95 target is closed in P10 (see P3-5). |
| P3-10 | `experimental.inlineCss` | **Tried and rejected.** | Next also embeds the CSS in the RSC payload, so HTML grew by about 36 KB gz per page, with no measurable score gain (within run-to-run noise). |
| P3-11 | Content validation | TypeScript `satisfies` + `content:check` parity and status gates; **Zod is not added**. | The content is static JSON checked at build time. Zod would add a dependency for no extra guarantee. Revisit if a runtime input (the P6 form) needs schema validation; that is the Worker side. |
| P3-12 | Breadcrumbs | Shared component (`components/layout/breadcrumbs.tsx`): `nav[aria-label]` > `ol`, `aria-current="page"`, and a directional chevron mirrored in RTL. | Plan §16. It is **not** rendered on the homepage. Its first use is the P5 templates. |

## P3-2. Budget (gzip, `pnpm budget`)

| Page | JS (module) | CSS | HTML | Budget |
|---|---|---|---|---|
| `/en` | 142.8 KB | 12.3 KB | 22.9 KB | JS 160 · CSS 30 · HTML 40 |
| `/ar` | 142.8 KB | 12.3 KB | 25.1 KB | |
| `/zh` | 142.8 KB | 12.3 KB | 24.5 KB | (+ 152 KB of subset CJK font, only on `/zh`) |

## P3-3. Lighthouse (mobile emulation, Lantern, median-score run of 3, local static server with brotli, final P3 build)

| Page | Perf | A11y | Best practices | SEO* | FCP | LCP | TBT | CLS |
|---|---|---|---|---|---|---|---|---|
| `/en` | 0.96 | 1.00 | 0.96 | 0.63 | 1.05 s | 2.85 s | 51 ms | 0 |
| `/ar` | 0.93 | 1.00 | 0.96 | 0.63 | 1.35 s | 3.15 s | 108 ms | 0.002 |
| `/zh` | 0.75 | 1.00 | 0.96 | 0.63 | 2.41 s | 4.25 s | 300 ms | 0 |

\* SEO is capped by the intentional preview `noindex`. Every other SEO audit asserted passes.

The LCP element is the hero banner on every locale. Its time is almost entirely **render delay** from main-thread style and layout work under 4× CPU throttling (about 1.9 s on `/zh`), not network time. The observed, unthrottled LCP is about 0.26 s. Closing the gap to ≥ 0.95 on `/ar` and `/zh` is P10 work. It touches the approved homepage's DOM, motion and type rendering, so it needs its own approval.

## P3-4. Visual regression check (homepage unchanged)

The approved commit (`54008fd`) was built in a separate worktree, then both builds were screenshotted under identical settings (Chromium, full page, 390 and 1440, en/ar/zh).

| Mode | Result |
|---|---|
| Reduced motion (deterministic) | **0 differing pixels** in all 6 locale × width pairs |
| Motion | 1.4k–53k px. The same build differs by up to 30k px from run to run (continuous marquee and signal animations), so this is animation timing, not a change. |
| Font subset vs the full upstream font on `/zh` | **0 differing pixels** at 390 and 1440. Chrome reports the same platform fonts per node. |

## P3-5. Known issues

- **`/zh` and `/ar` Lighthouse performance is below the 0.95 target** (P3-3). Reported as a CI warning. Proposed for P10.
- **Some CJK glyphs render with the system fallback (pre-existing, also in the approved baseline).** In the zh positioning statement, 5 of 35 glyphs (visibly 的) are drawn by the system CJK font instead of Noto Sans SC, so they look slightly lighter. It is identical before and after P3, and was not changed here because the homepage is approved. Proposed for the P8 CJK typography review.
- Preview deployment is **not exercised end-to-end** (no Cloudflare account yet). The Worker, configuration and bundle are validated locally with `wrangler deploy --dry-run` (both environments) and `wrangler dev --local` (smoke test).

## P3-6. How to run

```bash
pnpm build && pnpm budget
pnpm worker:check && pnpm worker:smoke
pnpm lhci                      # CHROME_PATH=… if Chrome isn't on PATH
```

---

# Implementation Notes — Phase P4: Content Encoding & Scene Storyboards

**Phase status:** Ready for Acceptance — **not accepted or closed**. Acceptance waits on D-18, D-19 and D-20, each a separate pending client sign-off recorded in `docs/P4_CLIENT_REVIEW.md` §6. No client decision is recorded; the defaults in P4-12 are pending confirmation. The translation workbook is prepared but not released until D-18 is approved. P5 has not started.

**Scope delivered:** P4 as defined in MASTER_PROJECT_PLAN §49.1 and §50:
- All approved English copy (`01`) encoded in typed copy files, with source references.
- Relations (§12.4, §26.5, §9.2) and sitemap aliases.
- Draft UI microcopy and per-page SEO strings.
- The translation workbook export.
- `docs/SCENE_STORYBOARDS.md` for the 8 solution scenes plus the homepage scene.
- The fidelity report.
- A one-stop client review sheet: `docs/P4_CLIENT_REVIEW.md`.

**Not done (by instruction):** no page templates, routes or scene artwork/code (P5/P5B). The homepage is unchanged: its HTML is token-identical to the approved build apart from build hashes, the CSS is byte-identical, and the reduced-motion render is pixel-identical in en/ar/zh at 390 and 1440.

## P4-1. Decisions

| # | Topic | Decision | Why |
|---|---|---|---|
| P4-01 | Copy layout | New page files in `copy/<locale>/`: `solutions`, `services`, `industries`, `products`, `projects`, `partners`, `about`, `contact`, `seo`. Names, one-line summaries and approach steps stay in the existing `catalog.json`; Why Vision Plus stays in `company.json`. | §12.1 split, reusing the files the approved homepage already reads. Nothing is moved, so the homepage code is untouched. |
| P4-02 | Repeated sentences | A page file is complete for its page, even when the homepage selection repeats a sentence (for example the Mobile NVR intro and the journey). | The workbook gives each distinct English string one row, so it is translated once. `content:check` requires identical translations once a locale is approved. This keeps the homepage untouched without coupling pages to `home.json`. |
| P4-03 | Block-level status | `_meta.review` lists every non-verbatim entry (`derived` / `draft` / `placeholder`) with its source. A file with entries cannot claim `approved` (`content:check`). | §12.3 asks for status per block; this records it without wrapping every string. It is also the D-18 sign-off list. |
| P4-04 | Honest labelling of the product-category names | `catalog.json` is now `derived`: the 7 category names are the client's sitemap labels (02 p6), not `01` text. | Found by the fidelity check. It is metadata only, with no rendering change. The production gate now also waits on D-18 for these names. |
| P4-05 | ar / zh for the new page copy | `placeholder` status containing the **English** source, not machine translation. | Long-form approved copy is translated by people (D-12, D-13); placeholders keep key parity and are refused by the production gate. For RTL/CJK layout QA in P5, draft translations can be added as `draft-mt` **if you approve it** (as was done for the homepage). |
| P4-06 | ar / zh for the new UI microcopy | `draft-mt`, matching the existing status of `messages/ar.json` and `messages/zh.json`. | Short interface strings; preview-only, refused in production. Every message compiles as ICU in its locale, including the six Arabic plural forms (unit test). |
| P4-07 | Relations with evidence | `data/relations.ts`. Every industry→solution link carries the words from the approved sentence that justify it, and a test checks those words exist. ELV and Fire Alarm are not force-linked. All relations are `derived` until D-19. | §12.4 says links are derived *only* where the wording names the technology. The test makes that rule enforceable. |
| P4-08 | Aliases | `data/aliases.json` (+ typed `aliases.ts`): 32 sitemap paths → canonical routes, anchors or filters. `postbuild` writes `out/_redirects`, emitting each 301 only once its target page exists, and fails if an alias collides with a real page. Real Estate & Compounds (Q-08) and Supply & Procurement (Q-09) are listed as pending, not redirected. | Verified locally through `wrangler dev`: 301 with anchor and query targets preserved; the canonical page still serves 200. Aliases switch on automatically as the P5 routes land. |
| P4-09 | Scene registry | `data/scenes.ts` mirrors the storyboards. Every title, label and caption is a reference into the copy, never a literal. A test resolves each reference against the approved text and checks the storyboard document lists every label. | §23.6: “Scene labels use only approved terms.” Localised scenes resolve the same references in ar/zh. |
| P4-10 | Workbook | `pnpm i18n:export` writes `docs/i18n/translations.xlsx`. It uses `write-excel-file` (MIT, one dependency) instead of `exceljs`, whose archive dependencies are older. | The workbook is prepared but not released to translators until D-18 is approved; approved rows already hold the client-approved English, and derived/draft rows may still change through D-18. Machine drafts are never pre-filled. The import (`i18n:import`) is built in P8, where the plan places it. |
| P4-11 | Fidelity | `pnpm content:fidelity` (in CI) checks both directions: every approved 01 unit appears verbatim, and every English string comes from 01 or is declared. `--write` regenerates `docs/CONTENT_FIDELITY_REPORT.md`. | The P4 validation item in §49. A negative test confirmed it catches a removed sentence and an altered word. |
| P4-12 | Open client questions | Every question the plan ties to P4 is unanswered in the decision log (§53.3): Q-01, Q-02, Q-04, Q-05, Q-07, Q-08, Q-09, Q-10, Q-14, Q-19. That is the roadmap's P4 dependencies plus every “needed before P4” row. The plan's documented defaults are applied and recorded as pending in `docs/P4_CLIENT_REVIEW.md` §4. Nothing is encoded without approved text. Q-17 (needed before P8) is noted there separately. | “Do not assume that unresolved client decisions are approved.” Each default is cheap to change (registry/data edits). |

## P4-2. Validation (this commit)

| Check | Result |
|---|---|
| Content fidelity | 372 / 372 approved 01 units found; 475 English strings, 0 undeclared; 22 derived/draft strings + 170 UI strings listed for D-18 |
| `content:check` | Structure OK. New gates verified with deliberate breakage: review paths, status claims, SEO lengths. |
| Unit tests | 37 / 37, including relations evidence, aliases, scenes ↔ approved copy ↔ storyboard document, ICU in en/ar/zh |
| Homepage | HTML token-identical to the approved build (hashes aside); CSS byte-identical; reduced-motion render 0 px different in en/ar/zh at 390 and 1440 |

---

# Remediation — P1–P4 alignment with the Master Plan (2026-10-01)

**Trigger:** the P1–P4 implementation audit. **Scope:** finish what the plan requires of P2 and P3, close verification gaps, and record every deviation (plan §55). Status per phase with evidence: `docs/PHASE_STATUS.md`.

## R-1. Timeline (from git history)

| Date | Commit | What happened | Against the plan |
|---|---|---|---|
| 2026-09-25 | `dd6b24d` | Plan, checklist, manifest, client materials | P0 |
| 2026-09-25 | `9f90b5d` | Full homepage + shared foundation ("quality gate"), on the owner's instruction | Replaced the P2 slice; P2's style guide, Mobile NVR page and Route scene not built |
| 2026-09-29 | `c7e5c0e` | Client banner as hero | Approved homepage baseline |
| 2026-10-01 | `54008fd` | Logo package v1 recorded, rejected, not integrated | — |
| 2026-10-01 | `eb4facc` | P3: Worker, CI, deploy workflows, checks | "Empty templates" listed as deferred to P5; Mobile NVR scene listed as deferred to P5B; no plan change |
| 2026-10-01 | `c4bd119`–`77137b3` | P4 content, storyboards, review docs | Nothing new rendered (by design) |
| 2026-10-01 | `6932552` | **Remediation:** P2 completed; P3 empty templates; site check; e2e for new pages | Brings P2/P3 outputs in line with §49.1 |
| 2026-10-01 | `9d04cf8` | **Remediation:** Zod, Prettier, nightly browser matrix, scene-page budget/Lighthouse/smoke | Closes §40/§51 gaps |
| 2026-10-01 | `1c80910`, `a48f2df` | Tailwind scan limited to app code; phase status and plan amendments | — |
| 2026-10-02 | `b4b386c` (main) | `main` created and the reviewed work merged | Client decision (Part 5) |
| 2026-10-02 | `3496899` | Client decisions applied to content and code | Client decisions |
| 2026-10-02 | `7acdfff` | Dedicated Mobile NVR page (P2 revision) | Client decision (P2 exception) |

## R-2. Root causes (confirmed by evidence)

1. **Phase scope changed by instruction without amending the plan.** The homepage was built in place of P2's defined slice, and the plan's remaining P2 deliverables were never reconciled. *Evidence:* `9f90b5d`; plan §49.1 unchanged until §55. *Impact:* P2 could not be accepted, and P5B "Mobile NVR (finish)" assumed a first cut that did not exist.
2. **Deferral by report instead of by decision.** The P3 report moved its own output ("empty templates") and a P2 deliverable (the Route scene) to later phases as "Deferred Items". Later phases took the report as the baseline. *Evidence:* the P3 section of these notes. *Impact:* 18 of 21 homepage links led to 404; all 96 alias redirects stayed inactive.
3. **Verification checked what was built, not what was required.** There was no link/route check, axe ran only on the homepage at its dark top state, Lighthouse covered only the homepage, CI ran only Chromium (with a config comment claiming more), and no Prettier or Zod existed although §40/§51 require them. *Impact:* broken navigation and a contrast finding went unnoticed; CI was green on an incomplete product.
4. **Acceptance tracked in conversation, not in the repository.** Owner approvals were not recorded against the plan's criteria (preview URL, merge to `main`, client approval), so phases read as complete while their criteria were open. *Impact:* status was ambiguous until the audit.
5. **External dependency.** No Cloudflare account (D-22), so nothing could be deployed or verified on the real platform.

## R-3. Decisions

| Decision | Why |
|---|---|
| Complete P2 as the plan defines it (style guide, full Mobile NVR page, Route scene first cut in three modes) instead of amending P2 away | The plan is achievable; P5 depends on P2 approval |
| Build P3 *empty* templates only (breadcrumb, h1, approved lede, section anchors) — not P5 page bodies | Fixes navigation and meets the P3 output without starting P5 ahead of its gate |
| The full solution template is enabled for Mobile NVR only | P2 asks for one solution page; the other seven are P5 |
| Scene engine reuses the existing MotionController (`data-progress="follow"`); beats derive from `--p` in CSS; `@property` registration makes the static state the default | §23.5 "one shared controller, JS never touches SVG nodes"; zero added JavaScript |
| Adopt Zod (reversing P3-11) and Prettier | Required by §12.1, §40, §51; no technical reason against |
| Interim wordmark excluded from contrast checks as a logotype; Lighthouse contrast audit skipped in favour of axe | WCAG 1.4.3 logotype exemption; avoids changing the approved header |
| `/ar` `/zh` Lighthouse ≥ 95 stays a P10 item | Fixing it changes font loading on the approved homepage; already accepted in P3 |
| Untranslated English on `/ar` `/zh` marked `lang="en" dir="ltr"` | Fixes bidi punctuation defects without inventing translations |
| Commit a P2 screenshot set (`docs/review/p2/`) | P2 output; the only reviewable form until D-22 |
| No deployment, no credentials, no external changes | Not authorised; D-22 is the client's |

## R-4. Defects found and fixed during remediation

| Defect | Fix |
|---|---|
| Last pinned beat never completed before the stage released (beat 6 ≈ 70 %) | Progress scale 1.12, mirrored in `beatProgress` and unit-tested |
| Stepped frames showed earlier beats' labels cut off by the crop | Each frame shows only its own beat's labels; final frame cropped to the node area |
| Bidi punctuation flipped in English placeholder copy on `/ar` | `src/lib/text-attrs.ts` |
| Words in scripts and docs (e.g. "shadow") generated unused CSS utilities — Tailwind scanned the whole repo | Structural: `@source not` for docs, client-materials, scripts, tests and worker in `globals.css`. 21 unused utilities removed (verified absent from `src`); home CSS 12.4 → 11.3 KB gz; homepage 0 px difference at all 12 locale × width combinations |

## R-5. Homepage protection

Reduced-motion renders compared with the approved build `c7e5c0e`: **0 differing pixels** in en/ar/zh at 390, 768, 1440 and 1920 (Chromium), after the P2/P3 work and again after formatting. All 63 built pages are byte-identical before and after the Prettier change (build hashes aside). Limitations: Chromium only; animated states and open menus are verified functionally (e2e), not pixel-for-pixel.

---

# Client decisions of 2026-10-02 — implementation

Source and per-decision status: `docs/CLIENT_DECISIONS.md`. Amendments: plan §55 A-14 to A-23.

| # | Decision | What was done | Why this way |
|---|---|---|---|
| C-1 | Git: create `main` after review, then merge | Branch reviewed at `a48f2df` (CI, E2E matrix, secret scan, `pnpm audit --prod`, `git fsck`). `main` created at `dd6b24d`; `--no-ff` merge `b4b386c` (tree = `a48f2df`). CI green on `main`. | A merge commit records the review point. `main` starts from the client-materials baseline, not from a work-in-progress commit. |
| C-2 | Q-02: hide Products | `pageVisibility.products = false`. The page calls `notFound()`; postbuild removes the exported files of hidden routes (and of `/_lab` in production). | **Defect found:** a static export still writes a `notFound()` page as `products.html` with the 404 markup, so Cloudflare would answer **200** (soft 404). Removing the files makes the host return a real 404 and keeps alias redirects to the page switched off. |
| C-3 | Q-08: 12 industries | New slug `real-estate-property-development`; `residential` slug kept, name changed. No relation for the new industry. | Keeping the slug avoids churn in anchors and aliases. D-19 approved only the relations that existed, so a new link needs a new review. |
| C-4 | Q-09: Site Survey in Understand | The 01 sentence is extended. `content:fidelity` has an `AMENDED` list for 01 text the client has changed by decision. | The fidelity rule ("every approved sentence verbatim") stays strict; the one deliberate change is declared, not silenced. |
| C-5 | D-18 approved | Review entries get `"approved": "D-18"`; files whose entries are all approved return to status `approved`; new status `withheld` (Q-04). `content:check` rejects an `approved` file with pending entries. | Keeps one mechanism for "approved at sign-off" vs "added later, pending" vs "never publish", enforced by CI. |
| C-6 | Q-12 / D-01 / D-02: samples | `data/samples.ts` + `copy/*/samples.json`. Preview only, visibly labelled, `data-sample` marker, and `site:check` fails a production build that contains it. Dummy phones are all-zero subscriber numbers; emails use `example.com`; plain text only. | Temporary content stays centralised and replaceable. It can never be dialled, mailed or published by mistake. |
| C-7 | D-05: existing logos, unaltered | Footer uses the stacked white SVG (byte-identical copy, sha256 checked). Header keeps the interim wordmark. | A stacked logo in the 32 px header would make the wordmark ~9 px and the tagline ~1 px. The horizontal variant is one of the "missing variants" the decision waits for. |
| C-8 | D-11: sizes on placeholders | Compact 64 px thumbnails now show the delivery size. | Full placeholders already showed ID, size and ratio. |
| C-9 | P2 exception: Mobile NVR | Dedicated page + “On board” diagram (`7acdfff`); Route scene kept unchanged. | Scroll-triggered (one-shot reveals + `:has()`), not scrubbed: small-scale, no new JavaScript, and the complete diagram is the fallback everywhere. |

### Homepage protection (2026-10-02)

The decisions change five homepage regions: the desktop header (Products removed), Approach, Industries, Projects and the footer.

The other **8 sections were checked against the approved build at identical document offsets**: 0 differing pixels in en/ar/zh at 390/768/1440/1920, and byte-identical markup. A first attempt using element screenshots reported false differences. Element screenshots are not deterministic here: the baseline compared with itself also differed, because of sticky and scroll effects and tile seams. The method was replaced (`scripts/dev/home-unchanged-diff.mjs`).

