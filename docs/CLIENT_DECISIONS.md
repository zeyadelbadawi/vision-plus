# VISION PLUS — Client Decision Record

**Source:** "Consolidated Client Decisions, Phase Approvals & Implementation Instructions", relayed by the project owner on **2026-10-02**. That document is the source of truth for the decisions it records. Earlier recommendations and defaults stay in their original documents as history (`MASTER_PROJECT_PLAN.md` §53.3, `CLIENT_INPUT_CHECKLIST.md`, `P4_CLIENT_REVIEW.md` §4). This file records what changed.

**Rules applied:**
- An explicit decision is implemented as given.
- A rejection without a replacement stays **unresolved**.
- Questions not answered in the document stay **pending**. They are not inferred from adjacent answers.

The one exception is two questions that ask exactly what a data item (D-xx) answers. They are cross-referenced below so the client can correct the mapping:
- Q-05, answered by D-13.
- Q-07, answered by D-24.

**Status key:**
- **Resolved:** fully decided and implemented.
- **Resolved — detail outstanding:** decided, but a specific item is still needed.
- **Unresolved:** decision not made.
- **Pending:** not answered yet.

---

## 1. Website structure and content

| ID | Question | Client answer | Implementation action | Status | Evidence / follow-up |
|---|---|---|---|---|---|
| Q-01 | Approved content or strategic sitemap as the structural reference? | Use the proposed approach: approved content is primary, sitemap elements are mapped to it, no unsupported pages. | Already the architecture (plan §9.2): 8 solutions, 6 services, industries per Q-08, and sitemap items as 301 aliases. No change needed. | **Resolved** | `src/content/data/aliases.json`; 99 active redirects (`site:check`). |
| Q-02 | How should Products work? | **Option B — temporarily hide** until verified product data exists. Keep the architecture ready. | `src/content/data/visibility.ts` → `products: false`. The page is not built (postbuild removes the soft-404 output) and is not in the navigation. Related-category links are off. Data, copy and template are kept. | **Resolved** (re-enable after D-09 + client approval) | `3496899`; e2e "Products is hidden" (404 in 3 locales, no link); `site:check` 0 broken links. |
| Q-03 | Navigation order Solutions · Products · Industries? | The proposed order is **not accepted**. No replacement was given. | No change. The current order stays as built (Products is currently hidden under Q-02). It is not treated as approved. | **Unresolved** — need the exact order | Ask the client for the order before P5 navigation work is finalised. |
| Q-04 | Which Vision, Mission and Core Values? | The proposed content is **not accepted** as presented. | `about.json` vision/mission/values are marked **withheld** (new review status: never to be published). The about template shows only the labels "Our Vision", "Our Mission" and "Our Core Values". Other approved content is unchanged. | **Unresolved** — need the client's exact wording | `3496899`; `docs/CONTENT_FIDELITY_REPORT.md` "Withheld". |
| Q-08 | Add "Real Estate & Compounds"? | Use the supplied list of **12 industries** (incl. "Real Estate & Property Development" and "Residential & Communities" as separate entries). | Added `real-estate-property-development`. Its summary is drafted as neutral description and is **pending review**, with no derived relation. Renamed "Residential" → "Residential & Communities" (slug kept). The sitemap alias `/industries/real-estate-compounds` now redirects to it. New image slot `IND-REALESTATE`. ar/zh drafted (D-12/D-13). | **Resolved — detail outstanding** | Needs review: (1) the drafted Real Estate summary, §5; (2) the display order. The approved `01` order is kept, with the two client-named entries adjacent. The client's list was numbered differently, but the order was not stated as a decision. |
| Q-09 | Add Site Survey and Supply & Procurement as services? | The proposed arrangement is not accepted. Instead: Supply & Procurement becomes a service **once its description is approved**; Site Survey goes **inside the Understand stage**, not as a separate service. | The Understand text now includes the site survey. The wording is **pending review**, and the change to 01 is recorded as a client amendment in `content:fidelity`. A Supply & Procurement description is drafted for review (§5) and is **not published**. Its sitemap alias stays pending. | **Resolved — detail outstanding** | Needs approval of the two wordings in §5. |
| Q-12 | Show Projects and Partners before verified data? | Show both, using **four complete illustrative sample projects**, clearly labelled. Neutral placeholders for partners. Replace or hide before launch. | Samples are centralised in `src/content/data/samples.ts` and `copy/*/samples.json`. The homepage shows 3 of the 4 (the approved card layout holds 3). Every sample is labelled "Illustrative sample" and marked `data-sample`, and is shown in preview builds only. `site:check` fails any production build that contains sample content. Partner cells stay neutral placeholders. | **Resolved** (replace before launch) | `3496899`; e2e "illustrative samples are labelled". The full Projects page grid is P5. |
| Q-05 | Who produces the Arabic copy? | Answered by **D-13** (Claude drafts; human review before launch). | Recorded via D-13. | **Resolved — detail outstanding** | Who the human Arabic reviewer is. |
| Q-07 | Brand name in Arabic and Chinese? | Answered by **D-24**: "Vision Plus" in all three languages, never translated or transliterated. | Verified: no ar/zh string translates or transliterates the name. | **Resolved** | `3496899` (workbook rules updated). |
| Q-06, Q-10, Q-11, Q-13–Q-23 | — | Not included in the document. | Unchanged. Q-10 (relations) is effectively covered by the D-19 sign-off. | **Pending** | See `MASTER_PROJECT_PLAN.md` §53.3. |

## 2. Client data and assets

| ID | Item | Client instruction | Implementation action | Status |
|---|---|---|---|---|
| D-01 | Qatar office | Realistic, clearly labelled dummy data until verified. | `samples.json` / `samples.ts`: sample address, a `+974 0000 0000` phone and a `qatar.office@example.com` email (RFC 2606). Footer only, preview only, labelled "Sample data — not verified". Plain text, never a `tel:`/`mailto:` link. | Placeholder in place; **verified data outstanding** |
| D-02 | Egypt office | Same as D-01. | Same (`+20 00 0000 0000`, `egypt.office@example.com`). No city is invented. | Placeholder in place; **verified data outstanding** |
| D-03 | Map locations | Labelled map placeholders; never point to unrelated real locations. | No map is rendered yet (contact page body is P5/P6). `locations.json` keeps `mapUrl`/`mapEmbedSrc` null; the contact template will show a labelled placeholder. | **Outstanding** |
| D-04 | Inquiry email | The client provides it later. It must stay configurable, and real inquiries must not go to a dummy address. | Already configured through the Apps Script / environment (plan §31–32). Dummy office emails are never links and never routing targets. | **Outstanding** |
| D-05 | Official logo | Use the existing uploaded logos, unaltered, until the missing variants are supplied. | Footer: the client's **stacked white logo**, a byte-identical copy of logo package v1 (sha256 checked), at `public/images/brand/`. Header: the missing **horizontal** variant is required (a stacked logo at header size would make the wordmark ~9 px), so the interim text wordmark stays there. Icons and favicon are not used, because the delivered files are the full stacked logo and are mis-sized. Nothing was recoloured, cropped or re-exported. | **Partially resolved** — horizontal lock-up, monogram, favicon and icons outstanding. *Audit note:* the delivered logo uses bronze `#c08f42` and a `#d3942c`→`#7f5421` gradient, outside the Option B palette. Because it must not be recoloured, this needs a brand decision (Ziad / client; `PRE_P5_HANDOFF.md` §2.2). |
| D-06 | Canva profile | Later. | Section stays ready (plan §33). *2026-10-02 gate (`123c73e`):* the Company Profile route renders pending-client text, so it is a production blocker in `content:check`, and `site:check` fails any production output containing it. | Outstanding |
| D-07 | Domain / DNS | Later; keep using development. | No change. | Outstanding |
| D-08 | Partners | Labelled dummy entries; no implied partnership. | Neutral "Partner logo" placeholder cells (preview only); no names or logos. | Placeholder in place; outstanding |
| D-09 | Products | Dummy data allowed for development; the page itself is hidden (Q-02). | Category data kept; no dummy products published. | Outstanding |
| D-10 | Projects | Four illustrative demo projects (Q-12). | See Q-12. | Placeholder in place; outstanding |
| D-11 | Website images | Every image placeholder shows the exact designer dimensions from the manifest. | Already true for every full placeholder (ID + delivery size + ratio + separate mobile size). Compact thumbnails now also show the size. | **Resolved** (images outstanding) |
| D-12 | Chinese content | **Claude drafts** Simplified Chinese from approved English; human review before launch. | Policy change recorded (it replaces "no machine translation"). All ar/zh files now carry "Draft by Claude (D-12/D-13) — human review required before launch". The production gate still refuses unreviewed drafts. Full drafting is scheduled in **P8** (plan order); new strings added now are drafted immediately. | Resolved — human reviewer outstanding |
| D-13 | Arabic content | Same for Arabic, with RTL terminology. | Same. | Resolved — human reviewer outstanding |
| D-14 | Google account | Later; keep configurable; no credentials stored. | No change (P6). | Outstanding |
| D-15 | Legal entity names | Labelled placeholders until supplied. | No legal name is rendered yet; the footer "©" line uses the approved brand name only. A placeholder will be used in P5/P7 where a legal name is required (structured data, privacy page). | Outstanding |
| D-16 | Privacy policy | Clearly marked draft placeholder; no invented legal policy. | The privacy page is a P3 template with no policy text. The P5 body will carry a marked draft placeholder. *2026-10-02 gate (`123c73e`):* the route renders pending-client text, so it is a production blocker in `content:check`, and `site:check` fails any production output containing it. | Outstanding |
| D-17 | Social links | Non-functional, marked placeholders **if required**. | Not required by any current template, so none are added. | Outstanding |
| D-21 | Smart Building images | Placeholders with exact dimensions. | Covered by D-11 for the Smart Building slots. | Outstanding |
| D-22 | Cloudflare | Later; no production deploy without access and explicit authorisation. | Preview deploy workflow keeps skipping without secrets; production is manual only. | **Outstanding — blocks preview URL** |
| D-23 | Analytics | Disabled until approved. | Disabled (no script; CSP allows it only if enabled later). | Pending |
| D-24 | Company name | "Vision Plus" in en/ar/zh; never translated or transliterated. | Verified across all ar/zh copy; workbook rule updated. Display styling ("VISION PLUS" in capitals in some approved headings) is unchanged. | **Resolved** |
| D-25 | Missing source files | Use what is available; record exactly what is present and missing. | See §4. | Recorded |
| D-26 | Mobile NVR footage | Labelled dummy media or placeholders; never shown as real footage. | Image slots `SOL-MNVR-HERO` / `SOL-MNVR-FLEET` stay labelled placeholders; the new diagram shows an empty outlined screen, never imagery. | Outstanding |
| D-27 | China Canva alternative | canva.cn or PDF per Q-06. | No change; depends on Q-06 and D-06. | **Unresolved** (Q-06) |

## 3. Phase approvals

| Phase | Client decision | Recorded status | Evidence / follow-up |
|---|---|---|---|
| **P2** | Approved, **except the Mobile NVR page**. Homepage stays the baseline; style guide, design direction, typography and motion accepted. A dedicated Mobile NVR page with a small purposeful scroll-triggered animation was requested. | **Approved with one exception — open.** Revision built (`7acdfff`). Ziad's personal review (2026-10-02) did not approve the two animation scenes; they were revised and are **IMPLEMENTED (ANIMATION REVISION 2026-10-02) — AWAITING ZIAD'S VISUAL ACCEPTANCE**, then client approval as applicable. P2 closes only after that (`docs/PRE_P5_HANDOFF.md` §9). Review notes: `docs/PRE_P5_HANDOFF.md` §3. | Revision: `docs/review/p2-mnvr-revision-2/` (both scenes per step, en/ar/zh, desktop and mobile, with before/after sheets). First set: `docs/review/p2-mnvr-revision/` (full page en/ar/zh × 390/768/1440/1920; the five "On board" steps; the Route beats). |
| **P3** | Accepted as the current engineering implementation; open items tracked. | **Accepted (2026-10-02) with open items:** preview environment (D-22), `/ar` `/zh` Lighthouse below 95 (P10), Cloudflare access (D-22). Git integration is now done (§3.1). No production deployment or launch is approved. | `docs/PHASE_STATUS.md`. |
| **P4** | D-18 English copy **approved**; D-19 relations **approved as is**; D-20 storyboards **all approved**. | **Approved (2026-10-02).** English and storyboard baselines locked: later material changes are documented and submitted for review (the Q-08/Q-09 drafts are the first such items, §5). | `docs/P4_CLIENT_REVIEW.md` §6; `SCENE_STORYBOARDS.md` §11; per-entry `"approved": "D-18"` markers in the copy files. |
| **P5** | Start only after the P2, P3 and P4 conditions are explicitly closed. | **Not started. Entry conditions not met.** P2 is open until the revised Mobile NVR page is approved. | §3.2. |

### 3.1 Git branch and merge

- **Client decision:** create `main` after reviewing the current changes, then merge the reviewed changes into it.
- **Review of `claude/confident-cori-lahb3k` at `a48f2df`:**
  - CI run 7 green.
  - E2E browser matrix green on `9d04cf8`.
  - Working tree clean.
  - No secrets found by pattern scan.
  - `pnpm audit --prod`: no known vulnerabilities.
  - `git fsck` clean.
- **Done:**
  - `main` created at the first commit `dd6b24d` (client materials and plan).
  - The reviewed branch merged with `--no-ff`, giving merge commit **`b4b386c`**, whose tree is identical to `a48f2df`.
  - Pushed. CI run 8 on `main`: **success**.
  - Nothing was deployed. Pushes to `main` run CI only, and production deployment stays a manual workflow with a typed confirmation.
- **Note:** `main` was first pushed at `dd6b24d` because an initial merge command failed. The merge was then pushed as a normal fast-forward. No force push, no history rewrite.
- **Since then:** later work (`3496899`, `7acdfff` and this record) is on `claude/confident-cori-lahb3k` and is not yet on `main`. It reaches `main` by the same review-then-merge step.
- **Owner action:** set `main` as the repository's default branch in GitHub settings. This was not changed here.
- **Audit 2026-10-02 (verified):**
  - `main` = `b4b386c`; working branch = `6859835`; merge base = `a48f2df`.
  - The branches have **diverged**: 3 ahead / 1 behind. The 1 commit on `main` is the merge commit `b4b386c`, whose tree is identical to `a48f2df`.
  - A dry-run merge (`git merge-tree`) is conflict-free and yields exactly the working-branch tree.
  - The GitHub default branch is still `claude/confident-cori-lahb3k`.
  - No PR exists.
  - The merge decision is Ziad's (`docs/PRE_P5_HANDOFF.md` §1).
- **Integration 2026-10-02 (authorised: Route test coverage only):**
  - `main` advanced by fast-forward from `b4b386c` to **`e137ea6`**: cherry-picks of `8fe760c` and `8e2d066` (`ab86f47`, `e137ea6`); test file and `docs/E2E_COVERAGE.md` only.
  - The other working-branch commits (decision changes, the pending Mobile NVR revision, the production gate) are **not** on `main`; merging them is Ziad's decision.
  - The default branch was not changed.

### 3.2 P5 entry conditions

| Condition | State |
|---|---|
| Revised Mobile NVR page verified by Ziad personally | ☐ First scenes not approved; revision **IMPLEMENTED (ANIMATION REVISION 2026-10-02) — AWAITING ZIAD'S VISUAL ACCEPTANCE** |
| P2 closed — revised Mobile NVR page approved (client, as applicable) | ☐ **Open** |
| P3 acceptance recorded, open items visible | ☑ Recorded (this file, `PHASE_STATUS.md`) |
| P4 approvals D-18, D-19, D-20 recorded | ☑ Recorded |
| Ziad explicitly authorises P5 | ☐ Not given — **P5 not started, not authorised** |

## 4. Source files (D-25)

| File | State |
|---|---|
| `00_README_AND_SOURCE_MANIFEST.md` | Available (`client-materials/`) |
| `01_Vision_Plus_Approved_Content.txt` | Available — approved content |
| `02_Vision_Plus_Strategy_and_Brand.pdf` | Available |
| `03_Vision_Plus_Website_Sitemap.png` | **Missing**. The same sitemap is used from PDF page 6 (`client-materials/_extracted/pdf-p6_sitemap.png`). |
| `04_Vision_Plus_Color_Palette_Option_B.jpg` | Available — approved palette |
| `05_Vision_Plus_Reference_Image.jpg` | **Missing. Contents unknown, not inferred.** |
| Hero banner (2026-09-29) | Available (`public/images/home/`; full-size masters still requested) |
| Logo package v1 (2026-10-01) | Available (`client-materials/brand/logo-package-v1-2026-10-01/`); used per D-05 |

## 5. Submitted for client review (not approved)

These items exist because of the 2026-10-02 decisions. None is treated as approved.

| # | Item | Proposed English | Where |
|---|---|---|---|
| R-1 | Real Estate & Property Development — summary (Q-08) | “Security, access, networking, and building technologies coordinated across new and existing property developments.” | `catalog.json` `industries.real-estate-property-development` |
| R-2 | Understand stage with Site Survey (Q-09) | “We begin with the objective, environment, users, and operational requirements, including a site survey.” (01: “…operational requirements.”) | `catalog.json` `approach.0.text` |
| R-3 | Supply & Procurement service description (Q-09) — **not published** | “We source and supply the technologies each project requires, selected for suitability, compatibility, reliability, and lifecycle value, and coordinated with the design, installation, and support of the complete system.” | This file only, until approved |
| R-4 | Industry display order (Q-08) | Approved `01` order, with Real Estate placed before Residential & Communities. Alternative: the order of the client's numbered list. | `registry.ts` |
| R-5 | Revised Mobile NVR page (P2) — scenes revised after Ziad's review, **IMPLEMENTED (ANIMATION REVISION 2026-10-02) — AWAITING ZIAD'S VISUAL ACCEPTANCE**, before it goes to the client | Dedicated page with the "On board" diagram. The Route scene is kept further down. If the client prefers a single animation on this page, the Route scene can move to the fleet context only. | `docs/review/p2-mnvr-revision-2/` (revision; the first set is `docs/review/p2-mnvr-revision/`) |
| R-6 | Four illustrative sample projects (Q-12) | Names and scopes in `copy/en/samples.json` | Homepage preview |
| R-7 | Footer logo usage (D-05) | Stacked white logo in the footer; interim wordmark in the header until the horizontal variant arrives | Footer |

R-3 is a neutral draft built on the approved "Select" stage wording. It makes no claims about suppliers, scale or delivery capability.
