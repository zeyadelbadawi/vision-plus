# VISION PLUS — Website

Trilingual (English, Arabic RTL and Simplified Chinese) corporate website for **VISION PLUS**, which provides Integrated Technology & Systems Solutions in Qatar and Egypt.

**Status:** Phase — **homepage built for review** (quality gate). Other pages are not started. See [`docs/IMPLEMENTATION_NOTES.md`](docs/IMPLEMENTATION_NOTES.md).

| Document | Purpose |
|---|---|
| [`docs/MASTER_PROJECT_PLAN.md`](docs/MASTER_PROJECT_PLAN.md) | The complete product, UX, design, motion, technical, zero-cost deployment and QA plan (the single spec) |
| [`docs/IMAGE_ASSET_MANIFEST.md`](docs/IMAGE_ASSET_MANIFEST.md) / [`.csv`](docs/image-asset-manifest.csv) | Every image slot, with exact dimensions, for the designer |
| [`docs/CLIENT_INPUT_CHECKLIST.md`](docs/CLIENT_INPUT_CHECKLIST.md) | Decisions and inputs still needed from the client |
| [`docs/IMPLEMENTATION_NOTES.md`](docs/IMPLEMENTATION_NOTES.md) | Decisions, validation results and how to run the current build |
| [`client-materials/`](client-materials/) | Client source package (the source of truth; do not edit) |

Brand: **Option B palette only** (Vision Gold `#D4AF37`, Charcoal `#1F1F1F`, Dark Gray `#3A3A3A`, Medium Gray `#6B6B6B`, Light Gray `#E5E5E5`, Off White `#F8F8F8`, White `#FFFFFF`).

## Run locally

```bash
pnpm install
pnpm build   # content/asset gates + build-time images + static export → out/
pnpm serve   # http://localhost:4173/en · /ar · /zh
pnpm lint && pnpm typecheck && pnpm test && pnpm test:e2e
```

Stack: Next.js 16.3 (static export), React 19, TypeScript, next-intl 4, Tailwind CSS 4.3. Hosting target: Cloudflare Workers (free); see plan §42.
