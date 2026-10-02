# VISION PLUS — End-to-End Browser Coverage

This record covers the Playwright browser projects, which tests run where, and why each remaining skip is necessary. `main` has this file as of `e137ea6`. The working branch `claude/confident-cori-lahb3k` adds the Mobile NVR animation revision tests below; they are not on `main`.

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

Since `8fe760c` (2026-10-02), the tests select by the project's **viewport** rather than its name. The scene's mode is set by the layout breakpoint (`src/styles/scenes.css`: pinned stage at ≥ 1024 px, stepped frames below), not by the browser engine. Before that change, three tests ran in Chromium only.

| Test | Runs in | Not applicable in | Reason |
|---|---|---|---|
| Desktop pinned: `--p` drives the beats | `desktop`, `firefox-desktop`, `webkit-desktop` | `mobile`, `webkit-mobile` | Below 1024 px the page renders no pinned stage, only the stepped frames tested below |
| Mobile stepped: one frame per beat | `mobile`, `webkit-mobile` | the three desktop projects | At ≥ 1024 px the frames are not rendered; the pinned stage is tested above |
| Reduced motion: final composition, every beat text | all five | — | Checks the artwork shown at the viewport (stage or frame 5) and that it is visible |
| RTL mirrors the route but never the text | all five | — | Checks the stage on desktop; on mobile, stepped frame 1 and its mirrored crop (`940 300 480 600`) |

### Mobile NVR animation revision tests (working branch only, 2026-10-02)

These are not on `main`. They run in all five projects; none is skipped.
- On board: the current step stays in sync as each step is read; scrolling back un-builds the later steps; reduced motion and no JavaScript show the complete diagram; RTL.
- Route data flow: pulses run only for the current beat, in both scroll directions, and there are none with reduced motion. They check the artwork shown at the viewport: the stage at ≥ 1024 px, the beat's frame below.

The four existing Route tests above are unchanged.

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
| GitHub E2E matrix, [run 37004469407](https://github.com/zeyadelbadawi/vision-plus/actions/runs/37004469407) | `e137ea6` (`main`) | same | **285 passed, 15 skipped, 0 failed** (10.1 min). `main` has 12 fewer tests per run (no 2026-10-02 decision or Mobile NVR revision work) |
| Previous matrix, run 36998058056 (for comparison) | `123c73e` | same | 288 passed, 22 skipped: the Route tests did not run in Firefox/WebKit |
| Local, Chromium projects | `8fe760c` | `pnpm test:e2e` | 118 passed, 6 skipped |
| GitHub E2E matrix, [run 37008405786](https://github.com/zeyadelbadawi/vision-plus/actions/runs/37008405786) | `db7a3ea` (working branch, Mobile NVR animation revision) | same | **315 passed, 15 skipped, 0 failed** (9.4 min). 63 passed / 3 skipped per project |
| Local, Chromium projects | working branch, Mobile NVR animation revision | `pnpm test:e2e` | 126 passed, 6 skipped (the skips are the same layout-only ones) |
| Local, Chromium projects (`main` candidate: `main` + this change) | `ab86f47` | `pnpm test:e2e` | 114 passed, 6 skipped. `main` has fewer tests because it does not contain the 2026-10-02 decision and Mobile NVR revision work. |

Limitations:
- Local runs cover Chromium only; Firefox and WebKit are not installed in the development container. They run on GitHub.
- These are layout and behaviour checks, not pixel comparisons. Visual snapshots are a P5 deliverable (MASTER_PROJECT_PLAN §40, §50).
