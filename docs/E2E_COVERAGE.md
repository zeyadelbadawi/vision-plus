# VISION PLUS — End-to-End Browser Coverage

This record covers the Playwright browser projects, which tests run where, and why each remaining skip is necessary. It is the same file on `main` and on `claude/confident-cori-lahb3k`.

**Update — Mobile NVR integration (2026-10-02, branch `claude/mnvr-main-integration`):** `76d5850` adds the hydration regression tests and `885b397` replaces the Route scene tests with tests for the approved Concept B artwork and adds the On board tests (sections below). From here on this file on `main` differs from the copy on `claude/confident-cori-lahb3k`, which also covers the 2026-10-02 client-decision tests that are not on `main`.

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

## Route scene tests (`tests/e2e/pages.spec.ts`, "Mobile NVR Route scene")

**Historical: city-map artwork (`ab86f47`–`e137ea6`).** `885b397` replaced this artwork and its tests; see "Mobile NVR tests (Concept A and B)" below.

Since `8fe760c` (2026-10-02), the tests select by the project's **viewport** rather than its name. The scene's mode is set by the layout breakpoint (`src/styles/scenes.css`: pinned stage at ≥ 1024 px, stepped frames below), not by the browser engine. Before that change, three tests ran in Chromium only.

| Test | Runs in | Not applicable in | Reason |
|---|---|---|---|
| Desktop pinned: `--p` drives the beats | `desktop`, `firefox-desktop`, `webkit-desktop` | `mobile`, `webkit-mobile` | Below 1024 px the page renders no pinned stage, only the stepped frames tested below |
| Mobile stepped: one frame per beat | `mobile`, `webkit-mobile` | the three desktop projects | At ≥ 1024 px the frames are not rendered; the pinned stage is tested above |
| Reduced motion: final composition, every beat text | all five | — | Checks the artwork shown at the viewport (stage or frame 5) and that it is visible |
| RTL mirrors the route but never the text | all five | — | Checks the stage on desktop; on mobile, stepped frame 1 and its mirrored crop (`940 300 480 600`) |

## Mobile NVR tests (Concept A and B, since `885b397`)

Ported from `claude/confident-cori-lahb3k` at `eb98ad5` (`626c894`, with the start-up waits of `a1d631e`). The Route tests still select by the project's **viewport**, not its name (pinned stage at ≥ 1024 px, stepped frames below). Each earlier check kept its purpose and has a check on the new artwork; the old assertions targeted city-map elements (`.ra-zone`, `.route-art`) that no longer exist.

### Route scene ("Mobile NVR Route scene (Concept B architecture)" and "— data flow (Concept B)")

| Test | Runs in | Not applicable in | What it proves | Earlier assertion it replaces |
|---|---|---|---|---|
| Desktop pinned: `--p` drives the beats | 3 desktop projects | 2 mobile projects (no pinned stage below 1024 px) | With `--p` at 0, the beat-5 alerts node waits (< 0.2); at 1 it is complete. The stage and its artwork are visible, the frames hidden, and there are 6 beat texts | Attention zone opacity 0 / 1 |
| Desktop pinned: scrolling builds forwards and unbuilds backwards **(new)** | 3 desktop projects | 2 mobile projects | Real scroll, once the motion controller runs (`data-live`) and has processed each position (`data-current`): at beat 5 the alerts node is built and the fleet node is not; scrolling back to beat 2 unbuilds the alerts node while GPS stays built | — |
| Mobile stepped: one full-width frame per beat | 2 mobile projects | 3 desktop projects (frames not rendered at ≥ 1024 px) | No stage, 6 frames, all from the stacked layout. Frame 4 shows its own beat built (viewing panes) and beat 5 waiting; the frame has real height | No stage, 6 frames, first visible |
| Reduced motion: final composition, every beat text | all five | — | No `motion-ok`, the six approved beat titles, and the alerts node in the visible artwork (stage, or frame 5) at full opacity | The same check on the attention zone |
| RTL mirrors the diagram but never the text | all five | — | The artwork group is mirrored (`translate(1000 0)` desktop, `translate(420 0)` mobile); labels sit outside it, at the mirrored x, anchored at the inline start | Mirrored group, labels outside it, mirrored frame crop |
| Data flow: pulses only on the current beat, both directions | all five | — | Beat 3, then beat 6, then back to beat 1: only the current beat's pulses run, in the artwork shown at the viewport | City-map uplink and fleet-link pulses |
| Data flow: reduced motion | all five | — | No step state, no running animations | Same |

### On board scene ("Mobile NVR page — On board scene (Concept A cutaway)", new)

All run in all five projects.
- Each step builds its layer while the next waits, the caption names the current step, and the artwork has real size (checked only once the controller has started: `.sys[data-live]`).
- The view zooms on the recorder at step 2 and returns to the whole system at step 5.
- Scrolling back un-builds the later steps and returns the view.
- Reduced motion shows the complete system with no zoom, step state or caption.
- No JavaScript shows the complete system and the 5 steps.
- RTL mirrors the artwork, not the callouts.

## Hydration regression tests (since `76d5850`)

`/en`, the Mobile NVR page and `/en/solutions/cctv-security-systems`, in every project: the served RSC payload carries the `<head>` boot script inline, with no reference to another row (a client module, a lazy element or an outlined value); `<html>` keeps `motion-ok`; no page error. On the Mobile NVR page the On board section also reaches `data-live` (`885b397`). The check reads the payload, so it never depends on timing. Root cause: the boot script was exported from the `'use client'` motion controller, so `<head>` waited on that module's chunk; when React replayed `<head>` in place it resumed `<body>` at `<meta charset>` and threw #418, re-rendering `<html>` without `motion-ok`. Unit guard: `tests/unit/motion-boot.test.ts`.

## Other skips (unchanged)

All are `test.skip` conditions on the viewport width (`home.spec.ts` lines 62 and 87; the header switches at 1200 px). The behaviour does not exist at the other size.

| Test (`tests/e2e/home.spec.ts`) | Skipped in | Reason |
|---|---|---|
| Mobile navigation: drawer focus trap; accordion `aria-expanded` | Desktop projects (1440 px) | The drawer exists only below 1200 px; desktop uses the mega menu |
| Desktop navigation: mega menu keyboard; language switcher | Mobile projects (390 px) | The mega menu and desktop switcher exist only at ≥ 1200 px; mobile uses the drawer |

## Results

| Where | Commit | Command | Result |
|---|---|---|---|
| GitHub E2E matrix, [run 37002693260](https://github.com/zeyadelbadawi/vision-plus/actions/runs/37002693260) | `8fe760c` (working branch) | `pnpm test:e2e` with `PW_ALL_BROWSERS=1` (Chromium, Firefox, WebKit; ubuntu-latest) | **295 passed, 15 skipped, 0 failed** (10.9 min). Each project: 59 passed / 3 skipped (2 navigation tests and 1 Route test for the other layout) |
| Previous matrix, run 36998058056 (for comparison) | `123c73e` | same | 288 passed, 22 skipped: the Route tests did not run in Firefox/WebKit |
| Local, Chromium projects | `8fe760c` | `pnpm test:e2e` | 118 passed, 6 skipped |
| Local, Chromium projects (`main` candidate: `main` + this change) | `ab86f47` | `pnpm test:e2e` | 114 passed, 6 skipped. `main` has fewer tests because it does not contain the 2026-10-02 decision and Mobile NVR revision work. |
| E2E matrix on the working branch, [run 37038533676](https://github.com/zeyadelbadawi/vision-plus/actions/runs/37038533676) | `eb98ad5` (`claude/confident-cori-lahb3k`: the reviewed source of this integration, plus the 2026-10-02 client-decision tests) | `pnpm test:e2e` with `PW_ALL_BROWSERS=1` | **338 passed, 17 skipped, 0 failed, 0 flaky** |
| Local, Chromium projects (integration candidate, hydration fix only) | `76d5850` | `pnpm test:e2e` | 120 passed, 6 skipped (`main`'s 114 plus 6 hydration tests) |
| Local, Chromium projects (integration candidate, with the Mobile NVR page) | `885b397` | `pnpm test:e2e` | 137 passed, 7 skipped. The skips are layout-only: 4 navigation tests and 3 Route tests for the other layout. The candidate's GitHub CI and five-project matrix results are recorded in its pull request. |

Limitations:
- Local runs cover Chromium only; Firefox and WebKit are not installed in the development container. They run on GitHub.
- These are layout and behaviour checks, not pixel comparisons. Visual snapshots are a P5 deliverable (MASTER_PROJECT_PLAN §40, §50).
