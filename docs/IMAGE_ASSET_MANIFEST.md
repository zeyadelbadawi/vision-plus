# VISION PLUS — Image Asset Manifest

**Audience:** graphic designer / photographer / art director, frontend developers.
**Status:** Planning baseline v1.0 (2026-09-25). Dimensions are derived from the layout system in `MASTER_PROJECT_PLAN.md` §20 and §25. If a layout changes during implementation, this file and `image-asset-manifest.csv` must be regenerated in the same change.
**Machine-readable copy:** [`image-asset-manifest.csv`](./image-asset-manifest.csv). The designer can track progress in it.

---

## 1. Ground rules

1. **No generated images and no fabricated imagery.** Every final image must be real photography or real artwork that Vision Plus has the rights to use: its own projects, team, offices, or licensed partner media. Do not use AI renders, random stock "technology" composites, fake dashboards or fake project photos.
2. **Treat the Option B reference as mood only.** It shows charcoal architecture, warm linear gold light, precise composition and restrained colour. Its images are not website assets, and its taglines ("Smarter Security / Brighter Tomorrow", "Integrated Security For A Better Tomorrow", "People / Technology / Safer Spaces", "Trust / Protect / Connect") are **not approved website copy**.
3. **Only Option B colours may appear in graded imagery.** Grade toward neutral charcoal and grey, with warm highlights close to Vision Gold `#D4AF37` where light naturally appears. Do not use blue-tinted "tech" grading, because that is the rejected Option A direction.
4. **Never bake text, logos or UI into an image.** Headlines are live HTML text because the site is trilingual and Arabic is right-to-left.
5. **Account for right-to-left layouts.** The same image is used in English, Chinese and Arabic. Arabic mirrors the layout, so text that sits on the left in English sits on the right in Arabic. Every slot that has overlaid text therefore defines a **central subject zone**, and the outer bands on both sides must stay free of critical detail. Images are never flipped automatically, because that would reverse signage and devices. If a slot cannot follow the rule, deliver a dedicated `-rtl` variant. The registry supports one (see §6).
6. **People:** only real Vision Plus staff or client personnel, with written consent. The same applies to identifiable client sites (see `CLIENT_INPUT_CHECKLIST.md`).

## 2. How dimensions are derived (the rule)

- **Design canvases:** desktop 1440 × 900 CSS px, mobile 390 × 844 CSS px.
- **Grid at 1440:** the container is 1440 wide with 64 px side padding, giving 1312 px of content. It has 12 columns of 80 px with 32 px gutters, so a span of *n* columns is `112n − 32` px wide.
  Span 4 = 416 px, span 5 = 528 px, span 6 = 640 px, span 7 = 752 px, span 12 = 1312 px, full-bleed = 1440 px.
- **Desktop deliverable ≥ 2 × the rendered CSS size at 1440,** rounded up to a clean size. This covers 2× retina at 1440 and about 1.5× on 1920 screens. the build-time image pipeline (sharp) generates every smaller AVIF/WebP variant, so the designer supplies **one master per slot**, not multiple sizes.
- **Mobile deliverable:** full-bleed mobile slots are **1080 px wide**, which is at least 2.5× the 430 px widest phone. In-grid mobile slots reuse the desktop file when the aspect ratio is the same.
- **Aspect ratios are fixed per slot.** The layout reserves the ratio before the image loads, so there is no layout shift. The only exception is the Home hero (F1), whose height follows the viewport. That slot defines a **safe band** instead.

## 3. Layout families

| Family | Used for | Desktop rendered (CSS @1440) | **Desktop deliver** | Ratio | Mobile rendered (CSS @390) | **Mobile deliver** | Separate mobile art? |
|---|---|---|---|---|---|---|---|
| F1 | Home hero, full-bleed | 1440 × 900 (100svh, clamped 720–960) | **2880 × 1800** | 16:10 | 390 × 488 | **1080 × 1350** | Yes (4:5) |
| F2 | Inner page hero band, full-bleed | 1440 × 640 (height clamp 360–760) | **2880 × 1280** | 9:4 | 390 × 293 | **1080 × 810** | Yes (4:3) |
| F3 | Half-bleed split media | 720 × 810 | **1440 × 1620** | 8:9 | 390 × 293 | **1080 × 810** | Yes (4:3) |
| F4 | Feature landscape (span 6–7), cards | 752 × 501 | **1620 × 1080** | 3:2 | 350 × 233 | same file | No |
| F5 | Portrait (span 5), industry panels | 528 × 660 | **1080 × 1350** | 4:5 | 350 × 438 | same file | No |
| F6 | Wide architectural band | 1440 × 600 | **2880 × 1200** | 12:5 | 390 × 488 | **1080 × 1350** (optional) | Yes (4:5) |
| F7 | Standard (span 4), timeline, product categories | 416 × 312 | **1200 × 900** | 4:3 | 350 × 263 | same file | No |
| F8 | Project gallery (lightbox) | up to 1440 wide | **2400 px long edge** | 3:2 or 4:5 | full width | same file | No |
| F9 | Logos (brand, partners) | cell 240 × 96 / 160 × 64 | **SVG** (or transparent PNG ≥ 800 px wide) | free | cell 140 × 56 | same file | No |
| F10 | Open Graph card | — | **1200 × 630** | 1.91:1 | — | — | No |
| F11 | Canva presentation poster | ≤ 1312 wide | **1920 × 1080** | 16:9 | 350 × 197 | same file | No |

**Safe zones:**
- **F1:** on screens 1920 px or wider the hero renders at about 2:1, so keep the subject inside the **central 2880 × 1440 band**. Headline text can cover the **outer 30 % on either side**.
- **F2:** at 1920 px wide the band crops to about 2.5:1, so keep the subject inside the **central 80 % of the height**.
- **F6:** keep the **inline-start 50–60 %** low in detail, because text sits there (the left in English and Chinese, the right in Arabic).

## 4. File delivery specification

| Item | Specification |
|---|---|
| Photo format | JPG, sRGB, quality 90 or higher, progressive, **≤ 3 MB** per master. Do not supply WebP/AVIF, because the build generates them. |
| Transparency | PNG-24, or SVG for logos and vector artwork |
| Colour | sRGB IEC61966-2.1 embedded. Grade to Option B greys and warm highlights. |
| Naming | lower-case kebab-case, exactly as in the "Replacement path" column. Mobile variants take a `-mobile` suffix and RTL variants take `-rtl`. |
| Metadata | Strip GPS/EXIF location data, because client sites may be sensitive. Keep the copyright field. |
| Alt text | For each image, supply one sentence describing what it shows in English. Arabic and Chinese alt text is then produced with the rest of the translations. |
| Rights | For each image, record the source and the right to use it (own shoot, client permission, partner media kit) in the CSV `Notes` column the designer adds. |

## 5. Placeholder system (what appears until a real image exists)

Every slot is already built into the layout with its final aspect ratio. Until the real file is delivered, the `ImageSlot` component draws a designed placeholder:

- **Surface:** a tonal fill that matches its section. Off-white `#F8F8F8` with a light-grey `#E5E5E5` hairline grid at 4 % opacity on light sections, or dark grey `#3A3A3A` with charcoal lines on dark sections.
- **Crop marks:** four print-style corner marks, 16 px long and 1 px thick, in medium grey. This suits the brand's precision and engineering character and makes it obvious that artwork belongs here.
- **Spec label:** a small label in the inline-start bottom corner, 12 px, tabular numerals, secondary text colour. It is laid out on separate lines:

  ```
  HOME-HERO
  2880 × 1800 · 16:10
  Mobile 1080 × 1350 · 4:5
  ```
- **Behaviour by mode:**
  - When `CONTENT_MODE=preview` (local, staging), the label is visible.
  - When `CONTENT_MODE=production`, the label is hidden and the slot falls back as listed in the "Placeholder / fallback" column. Most in-body images fall back to a text-only layout variant, so production never shows "unfinished" boxes.
  - `pnpm assets:check` fails the production build if any **P0/P1** asset for a published page is missing.
- **Accessibility:** placeholders are `aria-hidden="true"`. They never carry alt text that claims to be a real image.

## 6. Replacement workflow

1. The designer delivers files named exactly as in the "Replacement path" column.
2. A developer copies them into `public/images/<area>/`.
3. The developer updates the matching entry in `src/content/media/images.ts`:
   ```ts
   'HOME-HERO': {
     src: '/images/home/home-hero.jpg',
     srcMobile: '/images/home/home-hero-mobile.jpg',
     // srcRtl?: optional mirrored-composition variant
     width: 2880, height: 1800,
     focal: { x: 0.5, y: 0.45 },           // object-position for responsive crops
     alt: { en: '…', ar: '…', zh: '…' },   // required before production
     status: 'final',                       // 'placeholder' | 'final'
   }
   ```
4. Run `pnpm assets:check && pnpm build`. The check compares the pixel dimensions and ratio of each file to this manifest, with a ±1 % ratio tolerance, and requires alt text in every published locale.
5. Review the page in all three locales at 390, 768, 1440 and 1920 px, then commit.

## 7. Priorities

- **P0:** blocks all public release (the official logo).
- **P1:** required for launch of the page it belongs to.
- **P2:** strongly desired at launch; the page has a designed fallback.
- **P3:** enhancement after launch.

Totals: **69 fixed slots** (P0 × 1, P1 × 35, P2 × 28, P3 × 5), plus **4 per-item families**:
- Project cover, hero and gallery: 2 images plus 4–12 gallery images per published project.
- Partner logo: 1 per partner.

## 8. Slot inventory

Each group lists the slots in a table. Expand "Art direction…" under a group for the subject brief, focal point and crop, fallback and exact file path of each slot.

### Global

| Asset ID | Section | Purpose | Family | Desktop deliver | Ratio | Mobile deliver | Mobile ratio | Priority |
|---|---|---|---|---|---|---|---|---|
| `BRAND-LOGO` | Header / footer / favicon | Primary VISION PLUS logo (horizontal, positive + negative, monogram if one exists) | F9 | SVG (preferred) or PNG ≥ 800 px wide, transparent | free (fit box) | same file | free | P0 |
| `OG-DEFAULT` | Social sharing | Default Open Graph / social card | F10 | 1200×630 | 1.91:1 | — | — | P3 |

<details><summary>Art direction, crop, fallback and file paths</summary>

- **`BRAND-LOGO`** — Official vector logo supplied by client. Not an image slot to be designed by us.  
  *Focal/crop:* n/a  
  *Format:* SVG / PNG · *Fallback:* Interim typographic wordmark in preview only; launch blocked without official logo  
  *File:* `public/images/brand/vision-plus-logo.svg`
- **`OG-DEFAULT`** — Generated in code from brand typography (no photo). Designer may supply a custom version.  
  *Focal/crop:* Text safe area: central 1080×510  
  *Format:* PNG · *Fallback:* Code-generated typographic card  
  *File:* `public/images/og/og-default.png`

</details>

### Home

| Asset ID | Section | Purpose | Family | Desktop deliver | Ratio | Mobile deliver | Mobile ratio | Priority |
|---|---|---|---|---|---|---|---|---|
| `HOME-HERO` | 1 Hero | Flagship first impression: architecture + integrated technology | F1 | 2880×1800 | 16:10 | 1080×1350 | 4:5 | P1 |
| `HOME-STATEMENT` | 2 Positioning statement | Editorial detail image beside the positioning statement | F4 | 1620×1080 | 3:2 | same file | 3:2 | P2 |
| `HOME-MNVR` | 4 Mobile NVR chapter | Signature differentiator: security that moves | F3 | 1440×1620 | 8:9 | 1080×810 | 4:3 | P1 |
| `HOME-CLOSING` | 11 Closing CTA | Background for closing statement (rendered at ~35% under a charcoal scrim) | F6 | 2880×1200 | 12:5 | 1080×1350 | 4:5 | P2 |

<details><summary>Art direction, crop, fallback and file paths</summary>

- **`HOME-HERO`** — Real architectural photograph at dusk/night (charcoal facade, warm linear light) showing an installed system in context — mood per approved Option B reference. No renders, no stock clichés.  
  *Focal/crop:* Subject in central 50% width. Outer 30% each side may sit under headline text (left in EN/ZH, right in AR). On ≥1920 screens crop is 2:1: keep subject inside central 2880×1440 band.  
  *Format:* JPG (sRGB, q≥90) · *Fallback:* Charcoal surface + crop-mark placeholder  
  *File:* `public/images/home/home-hero.jpg + public/images/home/home-hero-mobile.jpg`
- **`HOME-STATEMENT`** — Close architectural/technical detail: a cabinet, device or cabling done with precision; real Vision Plus work.  
  *Focal/crop:* Centered; allow 10% trim on any edge  
  *Format:* JPG (sRGB, q≥90) · *Fallback:* Section renders text-only (layout variant B)  
  *File:* `public/images/home/home-statement.jpg`
- **`HOME-MNVR`** — Real vehicle / fleet / bus with Vision Plus mobile surveillance installation (cameras, MNVR unit, driver cabin).  
  *Focal/crop:* Desktop: subject in upper-center; bottom 25% may carry caption overlay. Mobile: subject center.  
  *Format:* JPG (sRGB, q≥90) · *Fallback:* Dark-gray surface + crop-mark placeholder  
  *File:* `public/images/home/home-mnvr.jpg + public/images/home/home-mnvr-mobile.jpg`
- **`HOME-CLOSING`** — Wide architectural night scene, low detail, room for text; can be the same shoot as HOME-HERO.  
  *Focal/crop:* Low-detail zones on inline-start 60% (text). Mobile artwork optional (P3) — mobile shows solid charcoal if absent.  
  *Format:* JPG (sRGB, q≥90) · *Fallback:* Solid charcoal band (valid final design)  
  *File:* `public/images/home/home-closing.jpg + public/images/home/home-closing-mobile.jpg`

</details>

### Solutions hub (incl. index cards)

| Asset ID | Section | Purpose | Family | Desktop deliver | Ratio | Mobile deliver | Mobile ratio | Priority |
|---|---|---|---|---|---|---|---|---|
| `SOL-HUB-HERO` | Page hero band | Solutions overview hero | F2 | 2880×1280 | 9:4 | 1080×810 | 4:3 | P1 |
| `SOL-MNVR-CARD` | Index row: Mobile NVR & Mobile Surveillance | Mobile NVR & Mobile Surveillance index image | F4 | 1620×1080 | 3:2 | same file | 3:2 | P1 |
| `SOL-CCTV-CARD` | Index row: CCTV & Security Systems | CCTV & Security Systems index image | F4 | 1620×1080 | 3:2 | same file | 3:2 | P1 |
| `SOL-ACCESS-CARD` | Index row: Access Control | Access Control index image | F4 | 1620×1080 | 3:2 | same file | 3:2 | P1 |
| `SOL-ICT-CARD` | Index row: Networking & ICT | Networking & ICT index image | F4 | 1620×1080 | 3:2 | same file | 3:2 | P1 |
| `SOL-ELV-CARD` | Index row: ELV Systems | ELV Systems index image | F4 | 1620×1080 | 3:2 | same file | 3:2 | P1 |
| `SOL-AV-CARD` | Index row: Audio Visual | Audio Visual index image | F4 | 1620×1080 | 3:2 | same file | 3:2 | P1 |
| `SOL-SMART-CARD` | Index row: Smart Building & Home Automation | Smart Building & Home Automation index image | F4 | 1620×1080 | 3:2 | same file | 3:2 | P1 |
| `SOL-FIRE-CARD` | Index row: Fire Alarm Systems | Fire Alarm Systems index image | F4 | 1620×1080 | 3:2 | same file | 3:2 | P1 |

<details><summary>Art direction, crop, fallback and file paths</summary>

- **`SOL-HUB-HERO`** — Integrated environment: building/control room where several systems coexist.  
  *Focal/crop:* Subject within central 80% height; keep top 15% clear on mobile crop  
  *Format:* JPG (sRGB, q≥90) · *Fallback:* Placeholder band  
  *File:* `public/images/solutions/sol-hub-hero.jpg + public/images/solutions/sol-hub-hero-mobile.jpg`
- **`SOL-MNVR-CARD`** — Vehicle-mounted cameras / MNVR unit / fleet in operation. May be a different crop of the hero master.  
  *Focal/crop:* Centered subject; 3:2 crop  
  *Format:* JPG (sRGB, q≥90) · *Fallback:* Placeholder (preview) / index row text-only (production)  
  *File:* `public/images/solutions/sol-mnvr-card.jpg`
- **`SOL-CCTV-CARD`** — Installed IP cameras on real site; monitoring room with VMS. May be a different crop of the hero master.  
  *Focal/crop:* Centered subject; 3:2 crop  
  *Format:* JPG (sRGB, q≥90) · *Fallback:* Placeholder (preview) / index row text-only (production)  
  *File:* `public/images/solutions/sol-cctv-card.jpg`
- **`SOL-ACCESS-CARD`** — Turnstiles, readers, biometric terminal, vehicle barrier on site. May be a different crop of the hero master.  
  *Focal/crop:* Centered subject; 3:2 crop  
  *Format:* JPG (sRGB, q≥90) · *Fallback:* Placeholder (preview) / index row text-only (production)  
  *File:* `public/images/solutions/sol-access-card.jpg`
- **`SOL-ICT-CARD`** — Structured cabling, racks, fiber termination — clean, labelled. May be a different crop of the hero master.  
  *Focal/crop:* Centered subject; 3:2 crop  
  *Format:* JPG (sRGB, q≥90) · *Fallback:* Placeholder (preview) / index row text-only (production)  
  *File:* `public/images/solutions/sol-ict-card.jpg`
- **`SOL-ELV-CARD`** — Coordinated ELV room / multiple low-current systems in one infrastructure. May be a different crop of the hero master.  
  *Focal/crop:* Centered subject; 3:2 crop  
  *Format:* JPG (sRGB, q≥90) · *Fallback:* Placeholder (preview) / index row text-only (production)  
  *File:* `public/images/solutions/sol-elv-card.jpg`
- **`SOL-AV-CARD`** — Meeting/conference room, display wall, digital signage in use. May be a different crop of the hero master.  
  *Focal/crop:* Centered subject; 3:2 crop  
  *Format:* JPG (sRGB, q≥90) · *Fallback:* Placeholder (preview) / index row text-only (production)  
  *File:* `public/images/solutions/sol-av-card.jpg`
- **`SOL-SMART-CARD`** — Control interface / keypad / automated lighting & shading in a real space. May be a different crop of the hero master.  
  *Focal/crop:* Centered subject; 3:2 crop  
  *Format:* JPG (sRGB, q≥90) · *Fallback:* Placeholder (preview) / index row text-only (production)  
  *File:* `public/images/solutions/sol-smart-card.jpg`
- **`SOL-FIRE-CARD`** — Fire alarm control panel, detectors, notification devices installed. May be a different crop of the hero master.  
  *Focal/crop:* Centered subject; 3:2 crop  
  *Format:* JPG (sRGB, q≥90) · *Fallback:* Placeholder (preview) / index row text-only (production)  
  *File:* `public/images/solutions/sol-fire-card.jpg`

</details>

### Solution detail pages

| Asset ID | Section | Purpose | Family | Desktop deliver | Ratio | Mobile deliver | Mobile ratio | Priority |
|---|---|---|---|---|---|---|---|---|
| `SOL-MNVR-HERO` | Page hero band | Mobile NVR & Mobile Surveillance detail hero | F2 | 2880×1280 | 9:4 | 1080×810 | 4:3 | P1 |
| `SOL-MNVR-DETAIL` | Body media (beside capabilities list) | Supporting in-body image for Mobile NVR & Mobile Surveillance | F5 | 1080×1350 | 4:5 | same file | 4:5 | P2 |
| `SOL-CCTV-HERO` | Page hero band | CCTV & Security Systems detail hero | F2 | 2880×1280 | 9:4 | 1080×810 | 4:3 | P1 |
| `SOL-CCTV-DETAIL` | Body media (beside capabilities list) | Supporting in-body image for CCTV & Security Systems | F5 | 1080×1350 | 4:5 | same file | 4:5 | P2 |
| `SOL-ACCESS-HERO` | Page hero band | Access Control detail hero | F2 | 2880×1280 | 9:4 | 1080×810 | 4:3 | P1 |
| `SOL-ACCESS-DETAIL` | Body media (beside capabilities list) | Supporting in-body image for Access Control | F5 | 1080×1350 | 4:5 | same file | 4:5 | P2 |
| `SOL-ICT-HERO` | Page hero band | Networking & ICT detail hero | F2 | 2880×1280 | 9:4 | 1080×810 | 4:3 | P1 |
| `SOL-ICT-DETAIL` | Body media (beside capabilities list) | Supporting in-body image for Networking & ICT | F5 | 1080×1350 | 4:5 | same file | 4:5 | P2 |
| `SOL-ELV-HERO` | Page hero band | ELV Systems detail hero | F2 | 2880×1280 | 9:4 | 1080×810 | 4:3 | P1 |
| `SOL-ELV-DETAIL` | Body media (beside capabilities list) | Supporting in-body image for ELV Systems | F5 | 1080×1350 | 4:5 | same file | 4:5 | P2 |
| `SOL-AV-HERO` | Page hero band | Audio Visual detail hero | F2 | 2880×1280 | 9:4 | 1080×810 | 4:3 | P1 |
| `SOL-AV-DETAIL` | Body media (beside capabilities list) | Supporting in-body image for Audio Visual | F5 | 1080×1350 | 4:5 | same file | 4:5 | P2 |
| `SOL-SMART-HERO` | Page hero band | Smart Building & Home Automation detail hero | F2 | 2880×1280 | 9:4 | 1080×810 | 4:3 | P1 |
| `SOL-SMART-DETAIL` | Body media (beside capabilities list) | Supporting in-body image for Smart Building & Home Automation | F5 | 1080×1350 | 4:5 | same file | 4:5 | P2 |
| `SOL-FIRE-HERO` | Page hero band | Fire Alarm Systems detail hero | F2 | 2880×1280 | 9:4 | 1080×810 | 4:3 | P1 |
| `SOL-FIRE-DETAIL` | Body media (beside capabilities list) | Supporting in-body image for Fire Alarm Systems | F5 | 1080×1350 | 4:5 | same file | 4:5 | P2 |
| `SOL-MNVR-FLEET` | Applications band | Wide fleet/transport scene introducing the applications list | F6 | 2880×1200 | 12:5 | 1080×1350 | 4:5 | P2 |

<details><summary>Art direction, crop, fallback and file paths</summary>

- **`SOL-MNVR-HERO`** — Vehicle-mounted cameras / MNVR unit / fleet in operation. Real project photography preferred.  
  *Focal/crop:* Subject within central 80% height and central 60% width  
  *Format:* JPG (sRGB, q≥90) · *Fallback:* Placeholder band  
  *File:* `public/images/solutions/sol-mnvr-hero.jpg + public/images/solutions/sol-mnvr-hero-mobile.jpg`
- **`SOL-MNVR-DETAIL`** — Detail view: equipment, installation or system in use.  
  *Focal/crop:* Subject upper-center; bottom 10% may be trimmed  
  *Format:* JPG (sRGB, q≥90) · *Fallback:* Layout collapses to single column (no image)  
  *File:* `public/images/solutions/sol-mnvr-detail.jpg`
- **`SOL-CCTV-HERO`** — Installed IP cameras on real site; monitoring room with VMS. Real project photography preferred.  
  *Focal/crop:* Subject within central 80% height and central 60% width  
  *Format:* JPG (sRGB, q≥90) · *Fallback:* Placeholder band  
  *File:* `public/images/solutions/sol-cctv-hero.jpg + public/images/solutions/sol-cctv-hero-mobile.jpg`
- **`SOL-CCTV-DETAIL`** — Detail view: equipment, installation or system in use.  
  *Focal/crop:* Subject upper-center; bottom 10% may be trimmed  
  *Format:* JPG (sRGB, q≥90) · *Fallback:* Layout collapses to single column (no image)  
  *File:* `public/images/solutions/sol-cctv-detail.jpg`
- **`SOL-ACCESS-HERO`** — Turnstiles, readers, biometric terminal, vehicle barrier on site. Real project photography preferred.  
  *Focal/crop:* Subject within central 80% height and central 60% width  
  *Format:* JPG (sRGB, q≥90) · *Fallback:* Placeholder band  
  *File:* `public/images/solutions/sol-access-hero.jpg + public/images/solutions/sol-access-hero-mobile.jpg`
- **`SOL-ACCESS-DETAIL`** — Detail view: equipment, installation or system in use.  
  *Focal/crop:* Subject upper-center; bottom 10% may be trimmed  
  *Format:* JPG (sRGB, q≥90) · *Fallback:* Layout collapses to single column (no image)  
  *File:* `public/images/solutions/sol-access-detail.jpg`
- **`SOL-ICT-HERO`** — Structured cabling, racks, fiber termination — clean, labelled. Real project photography preferred.  
  *Focal/crop:* Subject within central 80% height and central 60% width  
  *Format:* JPG (sRGB, q≥90) · *Fallback:* Placeholder band  
  *File:* `public/images/solutions/sol-ict-hero.jpg + public/images/solutions/sol-ict-hero-mobile.jpg`
- **`SOL-ICT-DETAIL`** — Detail view: equipment, installation or system in use.  
  *Focal/crop:* Subject upper-center; bottom 10% may be trimmed  
  *Format:* JPG (sRGB, q≥90) · *Fallback:* Layout collapses to single column (no image)  
  *File:* `public/images/solutions/sol-ict-detail.jpg`
- **`SOL-ELV-HERO`** — Coordinated ELV room / multiple low-current systems in one infrastructure. Real project photography preferred.  
  *Focal/crop:* Subject within central 80% height and central 60% width  
  *Format:* JPG (sRGB, q≥90) · *Fallback:* Placeholder band  
  *File:* `public/images/solutions/sol-elv-hero.jpg + public/images/solutions/sol-elv-hero-mobile.jpg`
- **`SOL-ELV-DETAIL`** — Detail view: equipment, installation or system in use.  
  *Focal/crop:* Subject upper-center; bottom 10% may be trimmed  
  *Format:* JPG (sRGB, q≥90) · *Fallback:* Layout collapses to single column (no image)  
  *File:* `public/images/solutions/sol-elv-detail.jpg`
- **`SOL-AV-HERO`** — Meeting/conference room, display wall, digital signage in use. Real project photography preferred.  
  *Focal/crop:* Subject within central 80% height and central 60% width  
  *Format:* JPG (sRGB, q≥90) · *Fallback:* Placeholder band  
  *File:* `public/images/solutions/sol-av-hero.jpg + public/images/solutions/sol-av-hero-mobile.jpg`
- **`SOL-AV-DETAIL`** — Detail view: equipment, installation or system in use.  
  *Focal/crop:* Subject upper-center; bottom 10% may be trimmed  
  *Format:* JPG (sRGB, q≥90) · *Fallback:* Layout collapses to single column (no image)  
  *File:* `public/images/solutions/sol-av-detail.jpg`
- **`SOL-SMART-HERO`** — Control interface / keypad / automated lighting & shading in a real space. Real project photography preferred.  
  *Focal/crop:* Subject within central 80% height and central 60% width  
  *Format:* JPG (sRGB, q≥90) · *Fallback:* Placeholder band  
  *File:* `public/images/solutions/sol-smart-hero.jpg + public/images/solutions/sol-smart-hero-mobile.jpg`
- **`SOL-SMART-DETAIL`** — Detail view: equipment, installation or system in use.  
  *Focal/crop:* Subject upper-center; bottom 10% may be trimmed  
  *Format:* JPG (sRGB, q≥90) · *Fallback:* Layout collapses to single column (no image)  
  *File:* `public/images/solutions/sol-smart-detail.jpg`
- **`SOL-FIRE-HERO`** — Fire alarm control panel, detectors, notification devices installed. Real project photography preferred.  
  *Focal/crop:* Subject within central 80% height and central 60% width  
  *Format:* JPG (sRGB, q≥90) · *Fallback:* Placeholder band  
  *File:* `public/images/solutions/sol-fire-hero.jpg + public/images/solutions/sol-fire-hero-mobile.jpg`
- **`SOL-FIRE-DETAIL`** — Detail view: equipment, installation or system in use.  
  *Focal/crop:* Subject upper-center; bottom 10% may be trimmed  
  *Format:* JPG (sRGB, q≥90) · *Fallback:* Layout collapses to single column (no image)  
  *File:* `public/images/solutions/sol-fire-detail.jpg`
- **`SOL-MNVR-FLEET`** — Fleet/depot/transport environment (buses, service vehicles, heavy equipment).  
  *Focal/crop:* Low-detail zone inline-start 50%  
  *Format:* JPG (sRGB, q≥90) · *Fallback:* Band renders on charcoal without image  
  *File:* `public/images/solutions/sol-mnvr-fleet.jpg + public/images/solutions/sol-mnvr-fleet-mobile.jpg`

</details>

### Products

| Asset ID | Section | Purpose | Family | Desktop deliver | Ratio | Mobile deliver | Mobile ratio | Priority |
|---|---|---|---|---|---|---|---|---|
| `PROD-HUB-HERO` | Page hero band | Products / technology portfolio hero | F2 | 2880×1280 | 9:4 | 1080×810 | 4:3 | P2 |
| `PROD-CCTV` | Category: CCTV & Surveillance | CCTV & Surveillance category image | F7 | 1200×900 | 4:3 | same file | 4:3 | P2 |
| `PROD-ACCESS` | Category: Access Control | Access Control category image | F7 | 1200×900 | 4:3 | same file | 4:3 | P2 |
| `PROD-TA` | Category: Time & Attendance | Time & Attendance category image | F7 | 1200×900 | 4:3 | same file | 4:3 | P2 |
| `PROD-INTERCOM` | Category: Video Intercom | Video Intercom category image | F7 | 1200×900 | 4:3 | same file | 4:3 | P2 |
| `PROD-INTRUSION` | Category: Intrusion & Alarm | Intrusion & Alarm category image | F7 | 1200×900 | 4:3 | same file | 4:3 | P2 |
| `PROD-FIRE` | Category: Fire & Life Safety | Fire & Life Safety category image | F7 | 1200×900 | 4:3 | same file | 4:3 | P2 |
| `PROD-NET` | Category: Security Networking | Security Networking category image | F7 | 1200×900 | 4:3 | same file | 4:3 | P2 |

<details><summary>Art direction, crop, fallback and file paths</summary>

- **`PROD-HUB-HERO`** — Curated equipment still-life or distribution/stock environment (real).  
  *Focal/crop:* Central 80% height  
  *Format:* JPG (sRGB, q≥90) · *Fallback:* Placeholder band  
  *File:* `public/images/products/prod-hub-hero.jpg + public/images/products/prod-hub-hero-mobile.jpg`
- **`PROD-CCTV`** — Product photography of the category (from partner media kits with usage rights, or own photography), neutral background.  
  *Focal/crop:* Product centered, 12% padding all sides  
  *Format:* JPG (sRGB, q≥90) · *Fallback:* Placeholder (preview) / text-only row (production)  
  *File:* `public/images/products/prod-cctv.jpg`
- **`PROD-ACCESS`** — Product photography of the category (from partner media kits with usage rights, or own photography), neutral background.  
  *Focal/crop:* Product centered, 12% padding all sides  
  *Format:* JPG (sRGB, q≥90) · *Fallback:* Placeholder (preview) / text-only row (production)  
  *File:* `public/images/products/prod-access.jpg`
- **`PROD-TA`** — Product photography of the category (from partner media kits with usage rights, or own photography), neutral background.  
  *Focal/crop:* Product centered, 12% padding all sides  
  *Format:* JPG (sRGB, q≥90) · *Fallback:* Placeholder (preview) / text-only row (production)  
  *File:* `public/images/products/prod-ta.jpg`
- **`PROD-INTERCOM`** — Product photography of the category (from partner media kits with usage rights, or own photography), neutral background.  
  *Focal/crop:* Product centered, 12% padding all sides  
  *Format:* JPG (sRGB, q≥90) · *Fallback:* Placeholder (preview) / text-only row (production)  
  *File:* `public/images/products/prod-intercom.jpg`
- **`PROD-INTRUSION`** — Product photography of the category (from partner media kits with usage rights, or own photography), neutral background.  
  *Focal/crop:* Product centered, 12% padding all sides  
  *Format:* JPG (sRGB, q≥90) · *Fallback:* Placeholder (preview) / text-only row (production)  
  *File:* `public/images/products/prod-intrusion.jpg`
- **`PROD-FIRE`** — Product photography of the category (from partner media kits with usage rights, or own photography), neutral background.  
  *Focal/crop:* Product centered, 12% padding all sides  
  *Format:* JPG (sRGB, q≥90) · *Fallback:* Placeholder (preview) / text-only row (production)  
  *File:* `public/images/products/prod-fire.jpg`
- **`PROD-NET`** — Product photography of the category (from partner media kits with usage rights, or own photography), neutral background.  
  *Focal/crop:* Product centered, 12% padding all sides  
  *Format:* JPG (sRGB, q≥90) · *Fallback:* Placeholder (preview) / text-only row (production)  
  *File:* `public/images/products/prod-net.jpg`

</details>

### Industries

| Asset ID | Section | Purpose | Family | Desktop deliver | Ratio | Mobile deliver | Mobile ratio | Priority |
|---|---|---|---|---|---|---|---|---|
| `IND-HUB-HERO` | Page hero band | Industries overview hero | F2 | 2880×1280 | 9:4 | 1080×810 | 4:3 | P1 |
| `IND-TRANSPORT` | Industry: Transportation & Fleet | Transportation & Fleet environment image | F5 | 1080×1350 | 4:5 | same file | 4:5 | P1 |
| `IND-GOV` | Industry: Government & Public Sector | Government & Public Sector environment image | F5 | 1080×1350 | 4:5 | same file | 4:5 | P1 |
| `IND-COMMERCIAL` | Industry: Commercial & Corporate | Commercial & Corporate environment image | F5 | 1080×1350 | 4:5 | same file | 4:5 | P1 |
| `IND-BANKING` | Industry: Banking & Finance | Banking & Finance environment image | F5 | 1080×1350 | 4:5 | same file | 4:5 | P1 |
| `IND-HOSPITALITY` | Industry: Hospitality | Hospitality environment image | F5 | 1080×1350 | 4:5 | same file | 4:5 | P1 |
| `IND-RETAIL` | Industry: Retail | Retail environment image | F5 | 1080×1350 | 4:5 | same file | 4:5 | P1 |
| `IND-EDUCATION` | Industry: Education | Education environment image | F5 | 1080×1350 | 4:5 | same file | 4:5 | P1 |
| `IND-HEALTHCARE` | Industry: Healthcare | Healthcare environment image | F5 | 1080×1350 | 4:5 | same file | 4:5 | P1 |
| `IND-RESIDENTIAL` | Industry: Residential | Residential environment image | F5 | 1080×1350 | 4:5 | same file | 4:5 | P1 |
| `IND-LOGISTICS` | Industry: Logistics & Warehousing | Logistics & Warehousing environment image | F5 | 1080×1350 | 4:5 | same file | 4:5 | P1 |
| `IND-INDUSTRIAL` | Industry: Industrial & Manufacturing | Industrial & Manufacturing environment image | F5 | 1080×1350 | 4:5 | same file | 4:5 | P1 |

<details><summary>Art direction, crop, fallback and file paths</summary>

- **`IND-HUB-HERO`** — Composite-free, single real scene conveying “different environments” (e.g., city/building/infrastructure).  
  *Focal/crop:* Central 80% height  
  *Format:* JPG (sRGB, q≥90) · *Fallback:* Placeholder band  
  *File:* `public/images/industries/ind-hub-hero.jpg + public/images/industries/ind-hub-hero-mobile.jpg`
- **`IND-TRANSPORT`** — Real transportation & fleet environment, ideally showing installed technology in context.  
  *Focal/crop:* Subject center; safe area central 80%  
  *Format:* JPG (sRGB, q≥90) · *Fallback:* Placeholder (preview) / panel without image (production)  
  *File:* `public/images/industries/ind-transport.jpg`
- **`IND-GOV`** — Real government & public sector environment, ideally showing installed technology in context.  
  *Focal/crop:* Subject center; safe area central 80%  
  *Format:* JPG (sRGB, q≥90) · *Fallback:* Placeholder (preview) / panel without image (production)  
  *File:* `public/images/industries/ind-gov.jpg`
- **`IND-COMMERCIAL`** — Real commercial & corporate environment, ideally showing installed technology in context.  
  *Focal/crop:* Subject center; safe area central 80%  
  *Format:* JPG (sRGB, q≥90) · *Fallback:* Placeholder (preview) / panel without image (production)  
  *File:* `public/images/industries/ind-commercial.jpg`
- **`IND-BANKING`** — Real banking & finance environment, ideally showing installed technology in context.  
  *Focal/crop:* Subject center; safe area central 80%  
  *Format:* JPG (sRGB, q≥90) · *Fallback:* Placeholder (preview) / panel without image (production)  
  *File:* `public/images/industries/ind-banking.jpg`
- **`IND-HOSPITALITY`** — Real hospitality environment, ideally showing installed technology in context.  
  *Focal/crop:* Subject center; safe area central 80%  
  *Format:* JPG (sRGB, q≥90) · *Fallback:* Placeholder (preview) / panel without image (production)  
  *File:* `public/images/industries/ind-hospitality.jpg`
- **`IND-RETAIL`** — Real retail environment, ideally showing installed technology in context.  
  *Focal/crop:* Subject center; safe area central 80%  
  *Format:* JPG (sRGB, q≥90) · *Fallback:* Placeholder (preview) / panel without image (production)  
  *File:* `public/images/industries/ind-retail.jpg`
- **`IND-EDUCATION`** — Real education environment, ideally showing installed technology in context.  
  *Focal/crop:* Subject center; safe area central 80%  
  *Format:* JPG (sRGB, q≥90) · *Fallback:* Placeholder (preview) / panel without image (production)  
  *File:* `public/images/industries/ind-education.jpg`
- **`IND-HEALTHCARE`** — Real healthcare environment, ideally showing installed technology in context.  
  *Focal/crop:* Subject center; safe area central 80%  
  *Format:* JPG (sRGB, q≥90) · *Fallback:* Placeholder (preview) / panel without image (production)  
  *File:* `public/images/industries/ind-healthcare.jpg`
- **`IND-RESIDENTIAL`** — Real residential environment, ideally showing installed technology in context.  
  *Focal/crop:* Subject center; safe area central 80%  
  *Format:* JPG (sRGB, q≥90) · *Fallback:* Placeholder (preview) / panel without image (production)  
  *File:* `public/images/industries/ind-residential.jpg`
- **`IND-LOGISTICS`** — Real logistics & warehousing environment, ideally showing installed technology in context.  
  *Focal/crop:* Subject center; safe area central 80%  
  *Format:* JPG (sRGB, q≥90) · *Fallback:* Placeholder (preview) / panel without image (production)  
  *File:* `public/images/industries/ind-logistics.jpg`
- **`IND-INDUSTRIAL`** — Real industrial & manufacturing environment, ideally showing installed technology in context.  
  *Focal/crop:* Subject center; safe area central 80%  
  *Format:* JPG (sRGB, q≥90) · *Fallback:* Placeholder (preview) / panel without image (production)  
  *File:* `public/images/industries/ind-industrial.jpg`

</details>

### Services

| Asset ID | Section | Purpose | Family | Desktop deliver | Ratio | Mobile deliver | Mobile ratio | Priority |
|---|---|---|---|---|---|---|---|---|
| `SRV-HUB-HERO` | Page hero band | Services / lifecycle hero | F2 | 2880×1280 | 9:4 | 1080×810 | 4:3 | P1 |
| `SRV-DESIGN` | Service: System Design & Consultancy | System Design & Consultancy section image | F4 | 1620×1080 | 3:2 | same file | 3:2 | P2 |
| `SRV-PM` | Service: Project Management | Project Management section image | F4 | 1620×1080 | 3:2 | same file | 3:2 | P2 |
| `SRV-INSTALL` | Service: Installation & Commissioning | Installation & Commissioning section image | F4 | 1620×1080 | 3:2 | same file | 3:2 | P2 |
| `SRV-TEST` | Service: Testing & Integration | Testing & Integration section image | F4 | 1620×1080 | 3:2 | same file | 3:2 | P2 |
| `SRV-MAINT` | Service: Maintenance & After-Sales Support | Maintenance & After-Sales Support section image | F4 | 1620×1080 | 3:2 | same file | 3:2 | P2 |
| `SRV-TRAIN` | Service: Technical Training & Support | Technical Training & Support section image | F4 | 1620×1080 | 3:2 | same file | 3:2 | P2 |

<details><summary>Art direction, crop, fallback and file paths</summary>

- **`SRV-HUB-HERO`** — Vision Plus engineers at work on site (real team, with consent).  
  *Focal/crop:* Faces within central 60% width  
  *Format:* JPG (sRGB, q≥90) · *Fallback:* Placeholder band  
  *File:* `public/images/services/srv-hub-hero.jpg + public/images/services/srv-hub-hero-mobile.jpg`
- **`SRV-DESIGN`** — Engineers reviewing drawings / site survey — real Vision Plus people and sites.  
  *Focal/crop:* Faces/hands in central 60%  
  *Format:* JPG (sRGB, q≥90) · *Fallback:* Section renders text-only (alternating layout keeps rhythm)  
  *File:* `public/images/services/srv-design.jpg`
- **`SRV-PM`** — Site coordination meeting / planning — real Vision Plus people and sites.  
  *Focal/crop:* Faces/hands in central 60%  
  *Format:* JPG (sRGB, q≥90) · *Fallback:* Section renders text-only (alternating layout keeps rhythm)  
  *File:* `public/images/services/srv-pm.jpg`
- **`SRV-INSTALL`** — Technicians installing equipment — real Vision Plus people and sites.  
  *Focal/crop:* Faces/hands in central 60%  
  *Format:* JPG (sRGB, q≥90) · *Fallback:* Section renders text-only (alternating layout keeps rhythm)  
  *File:* `public/images/services/srv-install.jpg`
- **`SRV-TEST`** — Testing / configuration at a rack or workstation — real Vision Plus people and sites.  
  *Focal/crop:* Faces/hands in central 60%  
  *Format:* JPG (sRGB, q≥90) · *Fallback:* Section renders text-only (alternating layout keeps rhythm)  
  *File:* `public/images/services/srv-test.jpg`
- **`SRV-MAINT`** — Preventive maintenance visit — real Vision Plus people and sites.  
  *Focal/crop:* Faces/hands in central 60%  
  *Format:* JPG (sRGB, q≥90) · *Fallback:* Section renders text-only (alternating layout keeps rhythm)  
  *File:* `public/images/services/srv-maint.jpg`
- **`SRV-TRAIN`** — Client team being trained on a system — real Vision Plus people and sites.  
  *Focal/crop:* Faces/hands in central 60%  
  *Format:* JPG (sRGB, q≥90) · *Fallback:* Section renders text-only (alternating layout keeps rhythm)  
  *File:* `public/images/services/srv-train.jpg`

</details>

### Projects hub

| Asset ID | Section | Purpose | Family | Desktop deliver | Ratio | Mobile deliver | Mobile ratio | Priority |
|---|---|---|---|---|---|---|---|---|
| `PROJ-HUB-HERO` | Page hero band | Projects overview hero | F2 | 2880×1280 | 9:4 | 1080×810 | 4:3 | P1 (if Projects published) |
| `PROJ-{slug}-COVER` | Project card | Per-project cover (one per project) | F4 | 1620×1080 | 3:2 | same file | 3:2 | P1 per published project |

<details><summary>Art direction, crop, fallback and file paths</summary>

- **`PROJ-HUB-HERO`** — Strongest real project photograph available.  
  *Focal/crop:* Central 80% height  
  *Format:* JPG (sRGB, q≥90) · *Fallback:* Placeholder band  
  *File:* `public/images/projects/proj-hub-hero.jpg + public/images/projects/proj-hub-hero-mobile.jpg`
- **`PROJ-{slug}-COVER`** — Real photo of the delivered project/system.  
  *Focal/crop:* Centered; 3:2  
  *Format:* JPG (sRGB, q≥90) · *Fallback:* Project cannot be published without a cover  
  *File:* `public/images/projects/{slug}/cover.jpg`

</details>

### Project detail

| Asset ID | Section | Purpose | Family | Desktop deliver | Ratio | Mobile deliver | Mobile ratio | Priority |
|---|---|---|---|---|---|---|---|---|
| `PROJ-{slug}-HERO` | Page hero band | Per-project hero (one per project) | F2 | 2880×1280 | 9:4 | 1080×810 | 4:3 | P1 per published project |
| `PROJ-{slug}-GALLERY-{nn}` | Gallery | Per-project gallery (4–12 images) | F8 | 2400 px long edge (3:2 or 4:5) | 3:2 / 4:5 | same file | 3:2 / 4:5 | P2 |

<details><summary>Art direction, crop, fallback and file paths</summary>

- **`PROJ-{slug}-HERO`** — Real wide project photograph (may be same source as cover, different crop).  
  *Focal/crop:* Central 80% height  
  *Format:* JPG (sRGB, q≥90) · *Fallback:* Falls back to COVER cropped (acceptable)  
  *File:* `public/images/projects/{slug}/hero.jpg + public/images/projects/{slug}/hero-mobile.jpg`
- **`PROJ-{slug}-GALLERY-{nn}`** — Installation, system, control room, devices — real, with client permission.  
  *Focal/crop:* Deliver as shot; no text overlays  
  *Format:* JPG (sRGB, q≥90) · *Fallback:* Gallery hidden if none  
  *File:* `public/images/projects/{slug}/gallery-{nn}.jpg`

</details>

### About

| Asset ID | Section | Purpose | Family | Desktop deliver | Ratio | Mobile deliver | Mobile ratio | Priority |
|---|---|---|---|---|---|---|---|---|
| `ABOUT-HERO` | Page hero band | About page hero | F2 | 2880×1280 | 9:4 | 1080×810 | 4:3 | P1 |
| `ABOUT-JOURNEY-2017` | Journey: 2017 Qatar | Beginnings in Qatar | F7 | 1200×900 | 4:3 | same file | 4:3 | P2 |
| `ABOUT-JOURNEY-2021` | Journey: 2021 Egypt | Expansion into Egypt | F7 | 1200×900 | 4:3 | same file | 4:3 | P2 |
| `ABOUT-JOURNEY-TODAY` | Journey: Today | Connected technologies today | F7 | 1200×900 | 4:3 | same file | 4:3 | P3 |
| `ABOUT-VISION` | Vision / Mission interlude | Full-width image moment between Vision and Mission | F6 | 2880×1200 | 12:5 | 1080×1350 | 4:5 | P2 |
| `ABOUT-PHILOSOPHY` | Philosophy | Image beside “Technology Should Solve Complexity, Not Create It.” | F5 | 1080×1350 | 4:5 | same file | 4:5 | P3 |

<details><summary>Art direction, crop, fallback and file paths</summary>

- **`ABOUT-HERO`** — Real Vision Plus office / team / flagship project.  
  *Focal/crop:* Central 80% height  
  *Format:* JPG (sRGB, q≥90) · *Fallback:* Placeholder band  
  *File:* `public/images/about/about-hero.jpg + public/images/about/about-hero-mobile.jpg`
- **`ABOUT-JOURNEY-2017`** — Authentic photo from Qatar operations (early project, office, team). Must be genuine — no stock skyline.  
  *Focal/crop:* Centered  
  *Format:* JPG (sRGB, q≥90) · *Fallback:* Timeline renders text-only  
  *File:* `public/images/about/about-journey-2017.jpg`
- **`ABOUT-JOURNEY-2021`** — Authentic photo from Egypt operations.  
  *Focal/crop:* Centered  
  *Format:* JPG (sRGB, q≥90) · *Fallback:* Timeline renders text-only  
  *File:* `public/images/about/about-journey-2021.jpg`
- **`ABOUT-JOURNEY-TODAY`** — Recent integrated project or current team.  
  *Focal/crop:* Centered  
  *Format:* JPG (sRGB, q≥90) · *Fallback:* Timeline renders text-only  
  *File:* `public/images/about/about-journey-today.jpg`
- **`ABOUT-VISION`** — Wide architectural scene expressing “technology working as one”.  
  *Focal/crop:* Low-detail inline-start 50% (quote overlay on desktop)  
  *Format:* JPG (sRGB, q≥90) · *Fallback:* Interlude renders as charcoal typographic band  
  *File:* `public/images/about/about-vision.jpg + public/images/about/about-vision-mobile.jpg`
- **`ABOUT-PHILOSOPHY`** — Calm, orderly technical detail (clean rack, tidy installation).  
  *Focal/crop:* Center  
  *Format:* JPG (sRGB, q≥90) · *Fallback:* Section renders text-only  
  *File:* `public/images/about/about-philosophy.jpg`

</details>

### Partners

| Asset ID | Section | Purpose | Family | Desktop deliver | Ratio | Mobile deliver | Mobile ratio | Priority |
|---|---|---|---|---|---|---|---|---|
| `PARTNER-{slug}-LOGO` | Partner logo | One per confirmed partner | F9 | SVG (preferred) or PNG ≥ 800 px wide, transparent | free (fit box) | same file | free | P1 (per partner shown) |

<details><summary>Art direction, crop, fallback and file paths</summary>

- **`PARTNER-{slug}-LOGO`** — Official logo from the partner’s brand kit (monochrome + full-color versions), with confirmation that Vision Plus may display it.  
  *Focal/crop:* Trim to artwork bounds, no padding baked in  
  *Format:* SVG / PNG · *Fallback:* Partner not rendered without a logo  
  *File:* `public/images/partners/{slug}.svg`

</details>

### Company Profile

| Asset ID | Section | Purpose | Family | Desktop deliver | Ratio | Mobile deliver | Mobile ratio | Priority |
|---|---|---|---|---|---|---|---|---|
| `CP-POSTER` | Embed poster / fallback | Cover image shown before the Canva embed loads and if it fails | F11 | 1920×1080 | 16:9 | same file | 16:9 | P1 |

<details><summary>Art direction, crop, fallback and file paths</summary>

- **`CP-POSTER`** — Export of the Canva presentation cover slide (PNG/JPG).  
  *Focal/crop:* Whole slide  
  *Format:* JPG (sRGB, q≥90) · *Fallback:* Charcoal 16:9 surface with title  
  *File:* `public/images/company-profile/cp-poster.jpg`

</details>

### Contact

| Asset ID | Section | Purpose | Family | Desktop deliver | Ratio | Mobile deliver | Mobile ratio | Priority |
|---|---|---|---|---|---|---|---|---|
| `CONTACT-MAP-QATAR` | Qatar location (click-to-load map preview) | Static preview shown before the Google Map iframe is loaded | F4 | 1620×1080 | 3:2 | same file | 3:2 | P3 |
| `CONTACT-MAP-EGYPT` | Egypt location (click-to-load map preview) | Static preview shown before the Google Map iframe is loaded | F4 | 1620×1080 | 3:2 | same file | 3:2 | P3 |

<details><summary>Art direction, crop, fallback and file paths</summary>

- **`CONTACT-MAP-QATAR`** — Stylised map crop around the office (designer-made in Option B greys) or a photo of the building entrance.  
  *Focal/crop:* Office location at center  
  *Format:* JPG (sRGB, q≥90) · *Fallback:* Neutral surface with address + “Show map” button  
  *File:* `public/images/contact/contact-map-qatar.jpg`
- **`CONTACT-MAP-EGYPT`** — Same treatment as Qatar.  
  *Focal/crop:* Office location at center  
  *Format:* JPG (sRGB, q≥90) · *Fallback:* Neutral surface with address + “Show map” button  
  *File:* `public/images/contact/contact-map-egypt.jpg`

</details>