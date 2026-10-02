# VISION PLUS — Website

Trilingual (English, Arabic RTL and Simplified Chinese) corporate website for **VISION PLUS**, which provides Integrated Technology & Systems Solutions in Qatar and Egypt.

**Status (2026-10-02):** the client decisions of 2026-10-02 are applied (`docs/CLIENT_DECISIONS.md`). P2 is approved except the Mobile NVR page: Ziad replaced both of its scenes with new concepts (Concept A On board, Concept B fleet level), approved the direction, and the implementation is **IMPLEMENTED 2026-10-02 (`626c894`) — AWAITING ZIAD'S REVIEW OF THE IMPLEMENTED PAGE**. P2 stays open until then. P3 is accepted with open items. P4 is approved. P5 has not started and is not authorised. Every route other than the homepage and the Mobile NVR page is a P3 empty template, and Products is hidden. Nothing is deployed yet (Cloudflare account pending, D-22). Phase-by-phase evidence: [`docs/PHASE_STATUS.md`](docs/PHASE_STATUS.md).

| Document | Purpose |
|---|---|
| [`docs/MASTER_PROJECT_PLAN.md`](docs/MASTER_PROJECT_PLAN.md) | The complete product, UX, design, motion, technical, zero-cost deployment and QA plan (the single spec) |
| [`docs/IMAGE_ASSET_MANIFEST.md`](docs/IMAGE_ASSET_MANIFEST.md) / [`.csv`](docs/image-asset-manifest.csv) | Every image slot, with exact dimensions, for the designer |
| [`docs/CLIENT_INPUT_CHECKLIST.md`](docs/CLIENT_INPUT_CHECKLIST.md) | Decisions and inputs still needed from the client |
| [`docs/IMPLEMENTATION_NOTES.md`](docs/IMPLEMENTATION_NOTES.md) | Decisions, validation results and how to run the current build |
| [`docs/PHASE_STATUS.md`](docs/PHASE_STATUS.md) | What is built, verified, blocked and awaiting approval, per phase |
| [`docs/PRE_P5_HANDOFF.md`](docs/PRE_P5_HANDOFF.md) | Repository/branch audit, homepage and Mobile NVR review notes, leak and gate checks, P5 boundary, handoff checklist |
| [`docs/CLIENT_DECISIONS.md`](docs/CLIENT_DECISIONS.md) | Client decisions (2026-10-02): answer, action, status, evidence; items submitted for review |
| [`docs/DEPLOYMENT.md`](docs/DEPLOYMENT.md) | Cloudflare setup, CI/CD and the access needed (D-22) |
| [`client-materials/`](client-materials/) | Client source package (the source of truth; do not edit) |

Brand: **Option B palette only** (Vision Gold `#D4AF37`, Charcoal `#1F1F1F`, Dark Gray `#3A3A3A`, Medium Gray `#6B6B6B`, Light Gray `#E5E5E5`, Off White `#F8F8F8`, White `#FFFFFF`).

## Run locally

```bash
pnpm install
pnpm build   # content/asset gates + build-time images + static export → out/
pnpm serve   # http://localhost:4173/en · /ar · /zh  (style guide: /en/_lab)
pnpm lint && pnpm format:check && pnpm typecheck && pnpm test && pnpm test:e2e
pnpm content:fidelity && pnpm site:check && pnpm budget && pnpm worker:smoke
```

Stack: Next.js 16.3 (static export), React 19, TypeScript, next-intl 4, Tailwind CSS 4.3. Hosting target: Cloudflare Workers (free); see plan §42.
