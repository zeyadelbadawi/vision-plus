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
