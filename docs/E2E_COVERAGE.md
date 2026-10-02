# VISION PLUS — End-to-End Browser Coverage

This record covers the Playwright browser projects, which tests run where, and why each remaining skip is necessary. It is the same file on `main` and on `claude/confident-cori-lahb3k`.

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

Limitations:
- Local runs cover Chromium only; Firefox and WebKit are not installed in the development container. They run on GitHub.
- These are layout and behaviour checks, not pixel comparisons. Visual snapshots are a P5 deliverable (MASTER_PROJECT_PLAN §40, §50).
