# VISION PLUS — End-to-End Browser Coverage

This record covers the Playwright browser projects, which tests run where, and why each remaining skip is necessary. `main` has this file as of `e137ea6`, and its Route tests check the earlier city-map artwork that is still on `main`. On the working branch `claude/confident-cori-lahb3k`, both Mobile NVR scenes were replaced on 2026-10-02 (Concept A On board, Concept B fleet scene; `626c894`), and the Route and On board tests were updated to validate the new artwork (below).

## Projects

Defined in `playwright.config.ts`.
- **Every push:** CI runs the two Chromium projects.
- **`e2e-matrix.yml`:** runs all five (nightly, or on manual dispatch), with `PW_ALL_BROWSERS=1`.

| Project | Engine | Viewport | Layout mode of the Route scene |
|---|---|---|---|
| `desktop` | Chromium | 1440 × 900 | Pinned stage (≥ 1024 px) |
| `mobile` | Chromium | 390 × 844, touch | Stepped frames (< 1024 px) |
| `firefox-desktop` | Firefox | 1440 × 900 | Pinned stage |
| `webkit-desktop` | WebKit | 1440 × 900 | Pinned stage |
| `webkit-mobile` | WebKit (iPhone 13 profile) | 390 × 844 | Stepped frames |

## Route scene tests (`tests/e2e/pages.spec.ts`, "Mobile NVR Route scene (Concept B architecture)")

The tests select by the project's **viewport**, not its name (since `8fe760c`). The scene's mode is set by the layout breakpoint (`src/styles/scenes.css`: pinned stage at ≥ 1024 px, stepped frames below), not by the browser engine.

`626c894` (working branch) rewrote the tests for the Concept B artwork. Each earlier check kept its purpose and has a check on the new artwork, and new checks were added. The old assertions targeted city-map elements (`.ra-zone`, `.route-art`) that no longer exist on the branch.

| Test | Runs in | Not applicable in | What it proves | Earlier assertion it replaces |
|---|---|---|---|---|
| Desktop pinned: `--p` drives the beats | 3 desktop projects | 2 mobile projects (no pinned stage below 1024 px) | With `--p` at 0, the beat-5 alerts node waits (< 0.2); at 1 it is complete. The stage and its artwork are visible, the frames hidden, and there are 6 beat texts | Attention zone opacity 0 / 1 |
| Desktop pinned: scrolling builds forwards and unbuilds backwards **(new)** | 3 desktop projects | 2 mobile projects | Real scroll: at beat 5 the alerts node is built and the fleet node waits; scrolling back to beat 2 unbuilds the alerts node while GPS stays built | — |
| Mobile stepped: one full-width frame per beat | 2 mobile projects | 3 desktop projects (frames not rendered at ≥ 1024 px) | No stage, 6 frames, all from the stacked layout. Frame 4 shows its own beat built (viewing panes) and beat 5 waiting; the frame has real height | No stage, 6 frames, first visible |
| Reduced motion: final composition, every beat text | all five | — | No `motion-ok`, the six approved beat titles, and the alerts node in the visible artwork (stage, or frame 5) at full opacity | The same check on the attention zone |
| RTL mirrors the diagram but never the text | all five | — | The artwork group is mirrored (`translate(1000 0)` desktop, `translate(420 0)` mobile); labels sit outside it, at the mirrored x, anchored at the inline start | Mirrored group, labels outside it, mirrored frame crop |
| Data flow: pulses only on the current beat, both directions | all five | — | Beat 3, then beat 6, then back to beat 1: only the current beat's pulses run, in the artwork shown at the viewport | City-map uplink and fleet-link pulses |
| Data flow: reduced motion | all five | — | No step state, no running animations | Same |

## On board scene tests ("Mobile NVR page — On board scene (Concept A cutaway)")

All run in all five projects.
- Each step builds its layer while the next waits, the caption names the current step, and the artwork has real size.
- The view zooms on the recorder at step 2 and returns to the whole system at step 5.
- Scrolling back un-builds the later steps and returns the view.
- Reduced motion shows the complete system with no zoom, step state or caption.
- No JavaScript shows the complete system and the 5 steps.
- RTL mirrors the artwork, not the callouts.

## Hydration regression tests (since `eb98ad5`)

The Mobile NVR page, `/en/solutions/cctv-security-systems` and `/en`, in every project. Each test checks four things:
- the served RSC payload carries the `<head>` boot script inline, with no reference to another row (client module, lazy element or outlined value);
- `<html>` keeps `motion-ok`;
- on the Mobile NVR page, the On board section reaches `data-live`;
- no page error occurs.

The check reads the payload, so it never depends on timing. Root cause: the boot script was exported from the `'use client'` motion controller, so `<head>` could wait on that chunk; React then replayed `<head>` in place, resumed `<body>` at `<meta charset>` and threw #418, dropping `motion-ok`. Unit guard: `tests/unit/motion-boot.test.ts`.

The scroll test "scrolling builds the diagram forwards and unbuilds it backwards" waits for the controller (`data-live`, then `data-current`) instead of reading transient states (`a1d631e`).

## Other skips (unchanged)

All are `test.skip` conditions on the viewport width (`home.spec.ts` lines 62 and 87; the header switches at 1200 px). The behaviour does not exist at the other size.

| Test (`tests/e2e/home.spec.ts`) | Skipped in | Reason |
|---|---|---|
| Mobile navigation: drawer focus trap; accordion `aria-expanded` | Desktop projects (1440 px) | The drawer exists only below 1200 px; desktop uses the mega menu |
| Desktop navigation: mega menu keyboard; language switcher | Mobile projects (390 px) | The mega menu and desktop switcher exist only at ≥ 1200 px; mobile uses the drawer |
| Industries master–detail: selection, focus, hash, header menu, back/forward | Mobile projects (390 px) | The explorer is master–detail only at ≥ 1024 px; below it the stacked sections are tested instead |
| Industries stacked layout with chip index | Desktop projects (1440 px) | The stacked layout is the < 1024 px and no-JavaScript view (no-JS is tested separately at 1440 px) |

## Visual regression (P5-T1, `tests/visual/`)

Full-page screenshots compared pixel for pixel, generated and checked only inside the Playwright Docker image (`pnpm test:visual`; CI: `visual.yml` on dispatch and `visual`-labelled PRs). Baselines live in `tests/visual/__screenshots__/` (Git LFS). Update them only deliberately (`pnpm test:visual:update`) and review the diff.

| Scope | Screenshots | Status |
|---|---|---|
| Solution template (§26.2): 7 pages × en/ar/zh × 390/768/1440/1920 × default/reduced motion | 168 | Baselined 2026-10-03 (Git LFS) |
| Other templates (homepage, hub, Services, Industries, About, Mobile NVR with scene checkpoints, …) | — | Not yet baselined |

## Results

| Where | Commit | Command | Result |
|---|---|---|---|
| GitHub E2E matrix, [run 37002693260](https://github.com/zeyadelbadawi/vision-plus/actions/runs/37002693260) | `8fe760c` (working branch) | `pnpm test:e2e` with `PW_ALL_BROWSERS=1` (Chromium, Firefox, WebKit; ubuntu-latest) | **295 passed, 15 skipped, 0 failed** (10.9 min). Each project: 59 passed / 3 skipped (2 navigation tests and 1 Route test for the other layout) |
| GitHub E2E matrix, [run 37004469407](https://github.com/zeyadelbadawi/vision-plus/actions/runs/37004469407) | `e137ea6` (`main`) | same | **285 passed, 15 skipped, 0 failed** (10.1 min). `main` has 12 fewer tests per run (no 2026-10-02 decision or Mobile NVR revision work) |
| Previous matrix, run 36998058056 (for comparison) | `123c73e` | same | 288 passed, 22 skipped: the Route tests did not run in Firefox/WebKit |
| Local, Chromium projects | `8fe760c` | `pnpm test:e2e` | 118 passed, 6 skipped |
| GitHub E2E matrix, [run 37008405786](https://github.com/zeyadelbadawi/vision-plus/actions/runs/37008405786) | `db7a3ea` (working branch, Mobile NVR animation revision) | same | **315 passed, 15 skipped, 0 failed** (9.4 min). 63 passed / 3 skipped per project |
| Local, Chromium projects | `626c894` (Concepts A and B implemented) | `pnpm test:e2e` | 129 passed, 7 skipped (layout-only: the 4 navigation skips and 3 Route tests for the other layout) |
| Local, Chromium projects (superseded) | working branch, Mobile NVR animation revision | `pnpm test:e2e` | 126 passed, 6 skipped (the skips are the same layout-only ones) |
| Local, Chromium projects (`main` candidate: `main` + this change) | `ab86f47` | `pnpm test:e2e` | 114 passed, 6 skipped. `main` has fewer tests because it does not contain the 2026-10-02 decision and Mobile NVR revision work. |
| GitHub E2E matrix, [run 37016803278](https://github.com/zeyadelbadawi/vision-plus/actions/runs/37016803278) | `626c894` (Concepts A and B) | `pnpm test:e2e` with `PW_ALL_BROWSERS=1` | **1 failed** (webkit-desktop, Route scroll test: read transient states), 322 passed, 17 skipped |
| GitHub E2E matrix, run 37022617134 | `c8327b3` (temporary diagnostic) | same | 326 passed, 19 skipped, 0 failed |
| GitHub E2E matrix, run 37025609848 | `a1d631e` (test waits for the controller) | same | **1 failed** (firefox-desktop On board: controller never started; consistent with the React #418 found locally, not confirmed in CI because the trace could not be downloaded), 322 passed, 17 skipped |
| GitHub E2E matrix, run 37028280756 | `17f3cae` (temporary start-up diagnostic) | same | **2 failed** (firefox-desktop On board "scrolling back"; the diagnostic itself on webkit-mobile), 326 passed, 17 skipped |
| GitHub E2E matrix, [run 37038533676](https://github.com/zeyadelbadawi/vision-plus/actions/runs/37038533676) | `eb98ad5` (hydration fix) | same | **338 passed, 17 skipped, 0 failed, 0 flaky** |
| Local, Chromium projects | `eb98ad5` | `pnpm test:e2e` | 135 passed, 7 skipped |
| Local, Chromium projects | `6914e3b` (P5A-11 Company Profile) | `pnpm test:e2e` | 300 passed, 10 skipped, 0 failed (4.1 min) |
| Local, Chromium projects | `a09b802` (P5A-12 Privacy) | `pnpm test:e2e` | 316 passed, 10 skipped, 0 failed (4.5 min) |
| Local, Chromium projects | `4b57dac` (P5A-14 OG cards) | `pnpm test:e2e` | 322 passed, 10 skipped, 0 failed (4.5 min) |
| Local, Chromium projects | `ec56777` (P5B-01 scene lab) | `pnpm test:e2e` | 325 passed, 13 skipped, 0 failed (5.0 min) |
| Local, Chromium projects | `d73f3bc` (P5B ELV scene) | `pnpm test:e2e` | 331 passed, 15 skipped, 0 failed (4.7 min) |
| Local, Chromium projects | `dd3e6fa` (P5B CCTV scene) | `pnpm test:e2e` | 337 passed, 17 skipped, 0 failed (4.7 min) |
| GitHub E2E matrix, run 37112049051 | `5f9be00` (P5A-10 Contact) | `pnpm test:e2e` with `PW_ALL_BROWSERS=1` | **736 passed, 24 skipped, 0 failed** (13.0 min) |
| Local, Chromium projects | `b165ec3` (P5A-10 Contact) | `pnpm test:e2e` | 294 passed, 10 skipped, 0 failed (4.0 min) |
| GitHub E2E matrix, run 37108539686 (attempt 2; attempt 1 blocked by account billing) | `c94bf91` (P5A-09 Partners) | `pnpm test:e2e` with `PW_ALL_BROWSERS=1` | **701 passed, 24 skipped, 0 failed** (12.8 min) |
| Local, Chromium projects | `f101971` (P5A-09 Partners) | `pnpm test:e2e` | 280 passed, 10 skipped, 0 failed (3.8 min) |
| GitHub E2E matrix, run 37084530746 | `e1af358` (P5A-08 Projects) | `pnpm test:e2e` with `PW_ALL_BROWSERS=1` | **671 passed, 24 skipped, 0 failed** (22.3 min) |
| GitHub visual regression, run 37084179633 | `a1ea9a7` | `pnpm test:visual` in `mcr.microsoft.com/playwright:v1.56.1-noble` | **168 passed** (4.2 min): identical to the local baselines |
| Local, Chromium projects | `0fa3b4b` (P5A-08 Projects) | `pnpm test:e2e` | 268 passed, 10 skipped, 0 failed (3.2 min) |
| GitHub E2E matrix, run 37080638510 | `58f2beb` (P5A-07 About) | `pnpm test:e2e` with `PW_ALL_BROWSERS=1` | **601 passed, 24 skipped, 0 failed** (13.2 min) |
| Local, Chromium projects | `ddbac22` (P5A-07 About) | `pnpm test:e2e` | 240 passed, 10 skipped, 0 failed (3.0 min) |
| GitHub E2E matrix, [run 37077807521](https://github.com/zeyadelbadawi/vision-plus/actions/runs/37077807521) | `46ca5f5` (P5A-03 to P5A-06) | `pnpm test:e2e` with `PW_ALL_BROWSERS=1` | **581 passed, 24 skipped, 0 failed, 0 flaky** (20.3 min) |
| Local, Chromium projects | `52e9338` (P5A-03 to P5A-06: 404, solution template, Services, Industries) | `pnpm test:e2e` | 232 passed, 10 skipped, 0 failed (2.9 min). The 3 new skips are layout-only: the Industries master–detail tests on the mobile project and the stacked-layout test on the desktop project |

Limitations:
- Local runs cover Chromium only; Firefox and WebKit are not installed in the development container. They run on GitHub.
- These are layout and behaviour checks, not pixel comparisons. Visual snapshots are a P5 deliverable (MASTER_PROJECT_PLAN §40, §50).
