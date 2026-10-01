# Logo package v1 (received 2026-10-01): technical review

**Status: NOT INTEGRATED. Returned to the designer for revision.**

The files in `as-received/` are kept exactly as delivered, so there is a record. None of them is used by the website yet. The homepage still shows the interim wordmark (preview only; BRAND-LOGO P0 still blocks production).

The specification is in `docs/CLIENT_INPUT_CHECKLIST.md` (D-05) and in the logo handoff list sent to the designer.

## Blocking issues

| # | Issue | Files affected | Required fix |
|---|---|---|---|
| 1 | **No horizontal lock-up exists.** Both "horizontal" files contain the *stacked* logo (monogram above "VisionPlus" above the tagline), shrunk to 96 × 92 px in the middle of the 460 × 100 artboard. In the 32 px header the logo would be about 30 px tall, with the wordmark around 9 px and the tagline around 1 px. | `vision-plus--logo--horizontal--white.svg.svg`, `vision-plus-logo--horizontal---charcoal.svg` | Draw the horizontal lock-up: monogram on the left, "VisionPlus" on the right, **no tagline**. It should fill the 460 × 100 artboard edge to edge (ratio about 4.6 : 1). |
| 2 | **The monogram files are not the monogram.** They contain the full stacked logo with wordmark and tagline. | `vision-plus--monogram--charcoal.svg.svg`, `vision-plus--monogram--white.svg.svg` | The **VP mark only**, trimmed to a 140 × 100 artboard. |
| 3 | **The favicon is the full stacked logo** in 32 × 32, which is illegible in a browser tab. | `favicon.svg.svg` | VP mark only, about 28 × 20, centred on a 32 × 32 transparent canvas. |
| 4 | **The icons are the full stacked logo on a transparent background.** The spec asked for the white monogram on solid charcoal, with no transparency. iOS renders a transparent touch icon on black. | all 6 PNGs | Solid charcoal background, **monogram only**, at the specified size inside. |
| 5 | **Wrong pixel sizes.** | `apple-touch-icon-white` 180 × **181**; `icon--512-*` **513 × 513**; `icon-192-charcoal` **193** × 192; `icon-192-white` **193 × 193** | Exactly 180 × 180, 192 × 192 and 512 × 512. |
| 6 | **Missing files.** | — | `icon-maskable-512.png` (512 × 512, monogram inside the central 410 px circle, full-bleed charcoal) and `logo-512.png` (512 × 512, stacked logo, charcoal on white). |
| 7 | **Gradients in every SVG** (`#d3942c → #7f5421` on the "P" loop), plus a second flat gold `#c08f42`. The spec says flat colours and no gradients. | all 7 SVGs | Flat colours only (see the decision below). |

## Brand decision needed (client)

- **Logo gold vs. the approved palette.**
  - The logo uses a bronze gold: a `#c08f42` flat fill and a `#d3942c`→`#7f5421` gradient.
  - The approved Option B palette's Vision Gold is **`#D4AF37`**.
  - Question: should the logo be delivered in `#D4AF37` (consistent with the website), or is the bronze the official logo colour? If the bronze is official, the website palette would need a deliberate review.
  - We will not recolour an official logo ourselves.
- **Charcoal value.** The logo uses `#232323`; the palette uses `#1F1F1F`. These are visually identical, but please deliver `#1F1F1F` for consistency.
- **Colour mapping differs between versions.**
  - In the charcoal versions the wordmark is charcoal and the tagline gold.
  - In the white versions the wordmark is **gold** and the tagline white.
  - Please confirm this is intentional. Otherwise the white version should mirror the charcoal one (white wordmark, gold tagline).

## Minor (non-blocking)

- **File names** have doubled extensions and extra dashes (for example `favicon.svg.svg`, `vision-plus-logo-stacked-white.svg---.svg`). Please use the exact agreed names.
- **The stacked SVGs are not trimmed.** The drawing is 206 × 200 inside a 330 × 320 artboard, with about 60 px of padding. They are usable, but a tight artboard is preferred.
- **SVG sizes** are 10.1–11.6 KB, slightly over the 10 KB target. That is acceptable.

## What is usable as delivered

- `vision-plus-logo-stacked-charcoal.svg.svg` and `vision-plus-logo-stacked-white.svg---.svg` are the correct variant: valid SVG, outlined (no `<text>`), and no embedded raster.
- They still carry issue 7 (gradient) and the colour decision above. They are held back so they can be integrated together with the corrected package, avoiding partial brand changes.
