# VISION PLUS — Master Project Plan

**Project:** VISION PLUS corporate website, a trilingual (English / Arabic / Simplified Chinese) marketing platform
**Document status:** v1.0, planning baseline, **awaiting client decisions** (see §45 and §53)
**Date:** 2026-09-25
**Repository:** `zeyadelbadawi/vision-plus`
**Companion documents:**
- [`IMAGE_ASSET_MANIFEST.md`](./IMAGE_ASSET_MANIFEST.md) and [`image-asset-manifest.csv`](./image-asset-manifest.csv): every image slot, with exact dimensions
- [`CLIENT_INPUT_CHECKLIST.md`](./CLIENT_INPUT_CHECKLIST.md): everything still needed from the client, in client-facing form
- [`../client-materials/`](../client-materials/): the client source package, which is the source of truth

---

## How to read this document

Every statement that matters is tagged so that readers can tell *what was asked* apart from *what we propose*.

| Tag | Meaning | Who can change it |
|---|---|---|
| **[REQ]** | Client requirement, from the engagement brief or the client manifest | Client only |
| **[SRC]** | Fact or copy taken from supplied client material (file reference given) | Client only |
| **[REC]** | Our recommendation (UX, design or process). Needs client acceptance where it changes scope. | Client accepts or rejects |
| **[DEC]** | Technical decision taken by the project team, with rationale | Project team (reversible with rationale) |
| **[DEP]** | Client dependency: information or assets the client must supply | Client supplies |
| **[Q]** | Open question: a decision that is genuinely the client's | Client answers |

Reference IDs: `Q-nn` are open questions (§53.3), `D-nn` are client dependencies (§45), `R-nn` are risks (§46) and `T-nn` are technical decisions (§47).

---

## Table of contents

1. Executive Summary
2. Business Understanding (includes the source inventory)
3. Business Positioning
4. Website Objectives
5. Target Audiences
6. User Journeys
7. Requirements Matrix
8. Source-of-Truth Matrix
9. Information Architecture
10. Final Sitemap
11. Route Architecture
12. Content Architecture
13. Localization Architecture
14. Arabic RTL Strategy
15. Chinese Strategy
16. Navigation Strategy
17. UX Strategy
18. Visual Direction
19. Design Principles
20. Design System
21. Typography Strategy
22. Color System
23. Motion Strategy
24. Image Strategy
25. Image Asset Manifest (summary)
26. Page-by-Page UX Specification
27. Component Architecture
28. Frontend Architecture
29. Server/API Architecture
30. Form Architecture
31. Email Architecture
32. Google Sheets Architecture
33. Canva Embed Architecture
34. Partner Architecture
35. Project Architecture
36. SEO Architecture
37. Performance Architecture
38. Accessibility Architecture
39. Security Architecture
40. Testing Strategy
41. QA Strategy
42. Deployment Architecture
43. Environment Variables
44. External Dependencies
45. Client Dependencies
46. Risks
47. Technical Decisions
48. Recommended Project Structure
49. Complete Implementation Roadmap
50. Phase-by-Phase Deliverables
51. Definition of Done
52. Final Acceptance Checklist
53. Consistency Audit, Contradictions and Open Questions
54. Self-Review Record and Recommended Next Step

---

## 1. Executive Summary

VISION PLUS is an integrated technology and systems-integration company. It was established in **Qatar in 2017** and expanded into **Egypt in 2021** [SRC `01` §02–03]. The approved client content positions it around one idea: *"What defines us is not how many technologies we provide, but how effectively we make them work together."* [SRC `01` §02]. The company's strategy document frames it as a **Reseller + System Integrator**, which means it both supplies the right products and integrates them into complete solutions [SRC `02` p.2, p.5].

**What we will build.** A premium, art-directed, trilingual website:
- English is the default, Arabic is fully right-to-left (RTL), and Simplified Chinese is supplied by the client [REQ].
- It has no CMS, no login and no admin [REQ].
- All content lives in typed, localized content modules in the repository.
- A single server-side contact pipeline delivers each submission to **one email recipient and one Google Sheet** [REQ].
- **Solution pages carry bespoke, concept-driven visual storytelling**, classified per solution from Rich to Subtle (§23.6) [REQ].
- A dedicated Company Profile page frames the client's **Canva presentation embed** [REQ].
- Every image location is designed now and delivered later from a precise manifest [REQ].

**Recommended stack** [DEC] (versions and free tiers verified 2026-09-25). The **zero-paid-services constraint** has priority [REQ]:
- **Next.js 16.3 static export** (App Router, `output: 'export'`), React 19, TypeScript (strict), next-intl 4.14 and Tailwind CSS 4.3.
  - Every page is prerendered.
  - Images are optimized at **build time**, so no paid image CDN is needed.
- **Hosting: Cloudflare Workers with Static Assets on the Free plan.**
  - Commercial use is permitted, and static requests and bandwidth are unlimited.
  - A small Worker handles only `/` (language negotiation) and `/api/contact`.
- **Contact pipeline:**
  - The Worker validates, applies anti-spam (Turnstile, which is free, plus a honeypot, a signed time token, an origin check and a KV rate limit), then forwards to a **Google Apps Script web app** owned by the client's Google account.
  - Apps Script **appends the Sheet row and sends the notification email** (MailApp).
  - This needs no Google Cloud billing, no service-account keys and no paid email provider.
- **Maps:** Google Maps "Share → Embed a map" iframes (keyless and free), loaded on click.
- **Motion:** solution scenes are inline SVG plus CSS, driven by a ~3 KB in-house scroll controller. No paid or heavy animation libraries.
- **Result: $0 in required recurring third-party costs** (§42.6 Zero-Cost / Service Cost Matrix).

**Conflict resolved [REQ > earlier assumption]:**
- The brief names **Vercel Hobby**, but Vercel's terms restrict Hobby to *"non-commercial personal use only"*, and this explicitly covers company sites.
- Vercel Pro would break the zero-cost rule.
- Vercel is therefore **not recommended**. The build output stays portable (§42.2).

**What the source material does *not* provide, so we will not invent it:**
- product catalogue data
- partner names and logos
- project case data and photography
- office addresses, phones, emails and map locations
- the official logo files
- Arabic copy
- Chinese copy
- the Canva embed
- all final imagery

These are tracked as dependencies (§45). The architecture treats each one as a **configurable slot with a designed placeholder**, and production builds refuse to publish unapproved placeholders (§12.6).

**Key findings the client must resolve before design lock** (full list in §53):
1. **The sitemap and the approved content disagree** on the sub-items for Products, Solutions, Services and Industries. The sitemap in the strategy PDF is security-only and aimed at the Egypt market. The approved content is broader: it covers eight solution areas, including Mobile NVR, which the sitemap omits entirely. We recommend the **approved content as canonical** and map every sitemap item onto it (§9.2). [Q-01]
2. **Two different Vision/Mission/Values sets exist.** The approved content has 7 values; the PDF's "Brand Foundation" has 5, is Egypt-security-specific, and contains typos. We recommend the approved content. [Q-04]
3. **No Products data exists.** We propose an inquiry-led "Technology Portfolio" structure that fabricates nothing (§9.3). [Q-02]
4. **No Arabic source copy exists,** and only Chinese was confirmed as client-supplied. [Q-05]
5. **Mainland-China reachability** changes several integrations if the Chinese audience is inside the mainland: Google Maps is blocked, Cloudflare Turnstile is unsupported, and Vercel and Canva are unreliable there. [Q-06]
6. **Contrast:** Vision Gold `#D4AF37` measures **2.10:1 on white**, so it cannot carry text on light backgrounds. It passes at **7.84:1 on Charcoal**. The design system uses gold as text only on dark surfaces (§22).

**Recommended next step (after this plan is approved):**
- Run a *Client Decision Session* covering Q-01 to Q-08.
- Then, in parallel, run Phase 2 (a design-direction proof, built as a live coded style guide plus the homepage hero and one inner template) and Phase 3 (the engineering foundation). See §49 and §54.

---

## 2. Business Understanding

### 2.1 Source inventory (what was actually received)

| # | File in repo | Status | What it actually contains (inspected, including visuals) |
|---|---|---|---|
| 00 | `client-materials/00_README_AND_SOURCE_MANIFEST.md` | Received | The client manifest and confirmed decisions: Option B only, 3 languages, no CMS, Canva profile, partners as logo + name, one email + Sheets, Qatar and Egypt placeholders, no invented imagery, approved content scope, and no invented products. |
| 01 | `client-materials/01_Vision_Plus_Approved_Content.txt` | Received | **The approved copy.** 24 numbered sections structured like a company-profile deck (cover → about → journey → vision → mission → solutions overview → 8 solution sections, with Mobile NVR spanning two → services → approach → industries → why → values → partners → projects → philosophy → closing). Contact values appear only as `[Website] [Email] [Telephone] [Qatar Office] [Egypt Office]`. |
| 02 | `client-materials/02_Vision_Plus_Strategy_and_Brand.pdf` | Received | An 8-page Canva export titled *"Security Systems Brand Strategy — Egypt market deep search"* (author "abdulah eissa", created 2026-09-23). It is styled in blue, which is the rejected Option A look.<br>p1 cover.<br>p2 Research summary: Egypt segments, security solution types, and **market brands (Hikvision, UNV, Dahua, Axis, Bosch, Hanwha Vision, ZKTeco, Suprema, HID, Honeywell, Johnson Controls, Genetec, Milestone, Siemens, Schneider Electric)**, plus the Reseller + SI opportunity.<br>p3 Competitors: FastEgy, Do Link and GTC Company Egypt (resellers/distributors); CompuGeorge, Comatrol Systems, Softex System Integration, STC Solutions and Phoenix Technology (system integrators).<br>p4 Brand Foundation: an Egypt-specific vision/mission and 5 values.<br>p5 Market opportunity: client pains (too many choices, fragmented solutions, product-first selling), Understand / Select / Support, market position "Reseller + System Integrator", and 10 potential-customer segments.<br>**p6 Website sitemap** (image).<br>**p7 Colour palettes, Option A and Option B** (images).<br>p8 closing. |
| 03 | `03_Vision_Plus_Website_Sitemap.png` | **Not received as a file.** The same sitemap is embedded in PDF p6 and was extracted to `client-materials/_extracted/pdf-p6_sitemap.png`. | Top level: Home, Products, Solutions, Industries, Services, Projects, About Us, Contact, with sub-items (reproduced in §9.2). |
| 04 | `client-materials/04_Vision_Plus_Color_Palette_Option_B.jpg` | Received as a chat attachment, labelled "Option B". A higher-resolution copy was extracted from PDF p7 to `_extracted/pdf-p7_palette-option-b_APPROVED.png`. | Option B palette: Vision Gold #D4AF37, Charcoal #1F1F1F, Dark Gray #3A3A3A, Medium Gray #6B6B6B, Light Gray #E5E5E5, Off White #F8F8F8 and White #FFFFFF, plus two mock-up ads showing the wordmark "VISION **PLUS**" (with PLUS in gold) above a short gold dash, and charcoal architecture with gold linear light. |
| 05 | `05_Vision_Plus_Reference_Image.jpg` | **Not received.** | Unknown. The file must be requested (D-25). The Option A palette appears only inside the PDF and is **rejected**; it was deliberately not extracted. |
| — | `client-materials/_extracted/pdf-p5_market-position.png` | Derived | The "Market position / Potential customers" graphic from PDF p5. |

> **Repository state at start:** the repository had **no commits and no files**. The client package existed only as session uploads. It has been committed under `client-materials/` without modification, apart from removing upload hash prefixes from the file names.

### 2.2 What the business is [SRC `01`]

- **Identity:** VISION PLUS. Tagline: *"Connected by Technology. Driven by Intelligence."* Descriptor: *"Integrated Technology & Systems Solutions."* Markets: *"Qatar • Egypt."*
- **History:** Established in Qatar in 2017, in integrated technology, security and low-current systems. Expanded into Egypt in 2021, broadening into security, ICT, ELV, automation, audiovisual, life safety and intelligent systems. Today: "Connected Technologies. Integrated Thinking."
- **Eight solution areas:**
  1. Mobile NVR & Mobile Surveillance
  2. CCTV & Security Systems
  3. Access Control
  4. Networking & ICT
  5. ELV Systems
  6. Audio Visual
  7. Smart Building & Home Automation
  8. Fire Alarm Systems
- **Six professional services:**
  - System Design & Consultancy
  - Project Management
  - Installation & Commissioning
  - Testing & Integration
  - Maintenance & After-Sales Support
  - Technical Training & Support
- **Eight-step approach:** Understand → Design → Select → Deliver → Integrate → Verify → Enable → Support.
- **Eleven industries:**
  - Transportation & Fleet
  - Government & Public Sector
  - Commercial & Corporate
  - Banking & Finance
  - Hospitality
  - Retail
  - Education
  - Healthcare
  - Residential
  - Logistics & Warehousing
  - Industrial & Manufacturing
- **Differentiators ("Why Vision Plus?", 8 points):**
  - experience since 2017
  - engineering before equipment
  - **mobile technology expertise**
  - multi-system capability
  - integration by design
  - one point of responsibility
  - engineered for real life
  - beyond the handover
- **Seven core values**, each with a title, subtitle and body:
  1. Think Before We Build
  2. Make It Work Together
  3. Own the Outcome
  4. Engineer for Real Life
  5. Stay Ready for What's Next
  6. Earn Trust Through Action
  7. Stay Beyond the Handover
- **Partners stance:** technology-independent. Manufacturers are *"selected according to project requirements, performance, reliability, compatibility, and long-term support."*
- **Projects model:** Project Name, Location, Client / Sector, Solutions Delivered, Scope of Work, Completion Year, and Project Photography / System Images / Key Project Data.

### 2.3 Commercial model [SRC `02`]

- **Role:** a reseller and system integrator in a crowded Egyptian market, facing resellers and distributors on one side and system integrators on the other.
- **Client pains it answers:** too many choices, fragmented solutions, and product-first selling.
- **Response:** *Understand* (identify the actual requirement), *Select* (recommend the right products and technologies) and *Support* (provide ongoing assistance).
- **Potential customers:**
  - Residential
  - Commercial
  - Corporate
  - Hospitality
  - Retail
  - Industrial
  - Education
  - Healthcare
  - Real Estate Developers
  - Contractors & Integrators

**Interpretation [REC]:** the website has to do two jobs at once.
- It must **prove engineering credibility.** This is the system-integrator side, carried by the Solutions, Services, Approach and Projects pages.
- It must **make supply easy to ask for.** This is the reseller side, carried by Products and product inquiries.

It must do both without looking like a shop or a generic brochure.

---

## 3. Business Positioning

**Positioning statement** (assembled only from approved lines) [SRC `01` §02, §06, §19, §24]:
> One technology partner. Multiple capabilities. VISION PLUS engineers technology around what the client needs to achieve, makes it work together, and stays involved beyond the handover.

The five positioning pillars below are derived from the approved content. The website must make each one tangible:

| Pillar | Approved source line | How the site proves it [REC] |
|---|---|---|
| Integration | "Make technology work intelligently, reliably, and as one." | The homepage **integration system diagram** (§26.1, section 3), cross-links between solutions, and the "Integration by design" value |
| Engineering before equipment | "We start with the requirement, not the product." | The Approach timeline appears before any product mention. Products are framed as *selected* technology, not as a catalogue. |
| Mobile differentiation | "Security That Moves With You." / "Mobile Technology Expertise" | A dedicated homepage chapter, the richest solution page, and a featured slot in the mega menu |
| Lifecycle responsibility | "From Requirement to Lifecycle." / "Beyond the Handover" | The Services page is organised as a lifecycle, and every solution page links to the relevant services |
| Two-market credibility | "Qatar 2017 → Egypt 2021 → Building What's Next." | The journey strip, both offices on the Contact page, and project locations |

**Competitive frame [SRC `02` p.3]:** the competitors are either resellers/distributors or system integrators. Vision Plus's claimed difference is doing *both*, plus Mobile NVR expertise and lifecycle ownership. We will **not** name competitors on the site.

---

## 4. Website Objectives

| # | Objective | Measure [REC] |
|---|---|---|
| O1 | Generate qualified consultation and product inquiries from Qatar and Egypt | Form submissions (Sheet rows) segmented by inquiry type, country and locale |
| O2 | Establish enterprise credibility (premium, precise, trustworthy) | Qualitative client and stakeholder sign-off, time on Solutions and Projects pages, pages per session |
| O3 | Communicate the full capability breadth *and* the integration story | Solution page reach, and internal-link click-through from the homepage diagram |
| O4 | Make Mobile NVR a recognisable differentiator | Traffic and inquiries tagged `solution = mobile-nvr` |
| O5 | Serve Arabic- and Chinese-speaking stakeholders natively | Locale share, and locale-specific inquiries |
| O6 | Present the Company Profile professionally (Canva) | Company Profile page views and fullscreen opens (if analytics are enabled) |
| O7 | Be maintainable without a CMS | A developer can update any content item in ≤ 1 file change, verified by the content checks |
| O8 | Rank for the company's solution and industry terms in its markets | Search Console impressions and clicks per locale |

---

## 5. Target Audiences

The segments come from the PDF p5 potential customers and the approved industries [SRC]. The needs and priorities are our analysis [REC].

| Audience | Examples | Primary needs | Key pages |
|---|---|---|---|
| **A1. Facility and IT decision-makers (end clients)** | Corporate IT/facilities managers, bank security heads, hotel engineering, school operators, hospital facilities | Confidence that VP understands their environment; the breadth of systems; proof (projects); an easy consultation | Industries → Solutions → Projects → Contact |
| **A2. Fleet and transport operators** | Public transport, school buses, logistics, government fleets, construction and heavy equipment | Mobile NVR capabilities, the pillars, applications, reliability | Home Mobile NVR chapter → Mobile NVR solution → Contact |
| **A3. Real-estate developers, consultants and contractors** | Developers, MEP consultants, main contractors, integrators | ELV coordination, the scope of services, project management, one point of responsibility | Services → ELV → Projects → Company Profile |
| **A4. Procurement and product buyers** (reseller side) | Procurement officers, installers buying equipment | Which technology categories and brands VP supplies; fast product inquiry | Products → Partners → product inquiry |
| **A5. Government and public-sector evaluators** | Tender committees | Company history, capabilities, company profile, credibility | About → Company Profile → Projects |
| **A6. Arabic-first users** (Qatar, Egypt) | All of the above in Arabic | A fully native RTL experience | All pages in `/ar` |
| **A7. Chinese-speaking stakeholders** | Stakeholders and partners; location is unknown (Q-06) | A fully Chinese site, the company profile and contact | All pages in `/zh` |
| **A8. Prospective partners** ("Become a Partner" in the sitemap) | Vendors, subcontractors | The partnership route | Partners → Contact (Partnership) |

---

## 6. User Journeys

**J1. Consultation (A1):** a search or referral lands on an industry section or a solution page. The user reads the capabilities, sees related industries and services, and clicks the CTA **Request a consultation**. The Contact form opens pre-filled with `type=consultation` and `solution=<slug>`. The user submits and sees an in-place success message with a reference ID. The row lands in the Sheet and the email reaches the recipient.

**J2. Fleet operator (A2):** Home hero → Mobile NVR chapter (*"Security That Moves With You."*) → Mobile NVR page (pillars, 15 capabilities, 9 applications) → consultation CTA, pre-filled with Mobile NVR.

**J3. Developer or contractor (A3):** Services → Approach (8 steps) → ELV Systems → Projects filtered by sector → Company Profile (Canva) → Contact.

**J4. Product buyer (A4):** Products → category (for example Access Control) → the brands supplied (once D-09 is supplied) → **Ask about products in this category**. The form is pre-filled with `type=product` and `category=<slug>`.

**J5. Arabic visitor (A6):** lands on `/` → Accept-Language detection → `/ar`, fully mirrored. The language switch keeps the current page. The form is Arabic, but the email and phone inputs stay left-to-right (LTR).

**J6. Chinese stakeholder (A7):** receives a link to `/zh/company-profile` → reads the Chinese framing → opens the Canva presentation (the Chinese version if one is supplied, otherwise the default language with a notice) → contact details.

**J7. Tender evaluator (A5):** About (journey, vision, mission, values) → Company Profile → Projects → Contact information.

**J8. Returning visitor or sharer:** a deep link such as `/en/solutions/access-control` opens directly. The link preview shows a localized Open Graph card.

---

## 7. Requirements Matrix

Status: ✅ fully specified in this plan · ⚠ specified, but blocked by a dependency or question · ❓ needs a client decision.

| ID | Requirement | Source | Plan § | Status |
|---|---|---|---|---|
| RQ-01 | Option B palette only; Option A rejected; never mixed | REQ, `00` | 22 | ✅ |
| RQ-02 | Premium, art-directed, not AI-looking or templated | REQ | 17–19 | ✅ |
| RQ-03 | Exactly 3 languages: en (default), ar (RTL), zh (Simplified) | REQ | 13–15 | ✅ |
| RQ-04 | No machine-translated Chinese in production | REQ | 13.6 | ✅ (enforced by build gate) |
| RQ-05 | Locale-specific URLs, metadata and hreflang | REQ | 11, 36 | ✅ |
| RQ-06 | Company Profile page with a configurable Canva embed | REQ | 33 | ⚠ D-06 |
| RQ-07 | Sitemap: Home, Products, Solutions, Industries, Services, Projects, About, Contact | SRC `02` p6 | 9–11 | ✅ (reconciled, Q-01) |
| RQ-08 | No fabricated products | REQ | 9.3 | ❓ Q-02 |
| RQ-09 | Partners: homepage carousel; page with logo + name; no fakes | REQ | 34 | ⚠ D-08 |
| RQ-10 | Projects: name, location, client/sector, solutions, scope, year, images; no fakes | SRC `01` §22, REQ | 35 | ⚠ D-10 |
| RQ-11 | Use approved content without unnecessary rewriting | REQ | 8, 12.5 | ✅ |
| RQ-12 | Contact form: 1 email recipient + a Google Sheets row | REQ | 30–32 | ⚠ D-04, D-14 |
| RQ-13 | Server-side validation, sanitization, anti-spam and rate limiting; no browser secrets | REQ | 30, 39 | ✅ |
| RQ-14 | Qatar and Egypt locations: address, phone, email, map; central placeholders | REQ | 12, 26.10 | ⚠ D-01, D-02, D-03 |
| RQ-15 | No CMS, admin, login or auth | REQ | 12, 28 | ✅ |
| RQ-16 | Typed, localized content separated from components | REQ | 12 | ✅ |
| RQ-17 | No generated, stock or fake images; designed placeholders; exact dimensions per slot | REQ | 24–25, manifest | ✅ |
| RQ-18 | A complete image asset manifest usable by a designer | REQ | manifest | ✅ |
| RQ-19 | Mega menu, mobile navigation, language selector, CTA, keyboard access, RTL | REQ | 16 | ✅ |
| RQ-20 | Controlled motion; respects prefers-reduced-motion | REQ | 23 | ✅ |
| RQ-21 | Full technical SEO in 3 locales | REQ | 36 | ✅ |
| RQ-22 | Performance / Core Web Vitals | REQ | 37 | ✅ |
| RQ-23 | Accessibility built in | REQ | 38 | ✅ |
| RQ-24 | Security headers, secrets management | REQ | 39, 43 | ✅ |
| RQ-25 | Mobile NVR treated as a key differentiator on the homepage | REQ | 26.1 | ✅ |
| RQ-26 | Services communicate the lifecycle, using the source methodology | REQ, SRC `01` §17 | 26.5 | ✅ |
| RQ-27 | Industries discovery is not a repetitive card grid | REQ | 26.4 | ✅ |
| RQ-28 | Testing, QA, acceptance, deployment, environment variables, phases | REQ | 40–52 | ✅ |
| RQ-29 | Planning documents in `docs/`; no full implementation yet | REQ | — | ✅ |
| RQ-30 | Use of relevant skills | REQ | 54.2 | ✅ |
| RQ-31 | Solution pages get premium, **solution-specific**, concept-driven visual storytelling; no generic or decorative animation | REQ (addendum §1–4) | 23.6, 26.2 | ✅ (storyboards need D-20 approval) |
| RQ-32 | Classify each solution's motion intensity (rich, moderate, subtle, static) | REQ (addendum §4) | 23.6 | ✅ |
| RQ-33 | Designed desktop, tablet, mobile, reduced-motion and fallback behaviour for every scene | REQ (addendum §6–7) | 23.5–23.6 | ✅ |
| RQ-34 | Per-scene performance strategy (rendering, assets, code splitting, CWV) | REQ (addendum §8) | 23.5, 37 | ✅ |
| RQ-35 | Dedicated motion design system that animates concepts ("technology working as one") | REQ (addendum §9–10) | 23 | ✅ |
| RQ-36 | **Zero required paid services**; $0 recurring third-party cost | REQ (addendum §11) | 42.6 | ✅ |
| RQ-37 | Vercel (free) as the intended platform, with any limitation documented and a free alternative | REQ (addendum §12) | 42.1–42.2 | ✅ (conflict documented; Cloudflare recommended, Q-22) |
| RQ-38 | Google Sheets and Maps without hidden billing | REQ (addendum §13–14) | 32, 42.4 | ✅ |
| RQ-39 | Free email and free anti-spam, with limitations documented | REQ (addendum §15–16) | 30–31 | ✅ |
| RQ-40 | No paid image generation; no paid analytics dependency | REQ (addendum §17–18) | 24, 42.6 | ✅ |
| RQ-41 | Domain already owned; DNS configuration only | REQ (addendum §20) | 42.3 | ✅ |
| RQ-42 | Don't over-engineer to avoid cost | REQ (addendum §21) | 42, 47 | ✅ |

---

## 8. Source-of-Truth Matrix

| Content domain | Authoritative source | Secondary / reference only | Conflict rule |
|---|---|---|---|
| Company story, journey, vision, mission, values, philosophy, why, approach | `01` Approved Content | `02` p4 Brand Foundation (**not used for copy**) | `01` wins (Q-04 asks for confirmation) |
| Solutions (names, taglines, body, capability lists) | `01` §06–§15 | `02` p6 sitemap sub-items (mapped, §9.2) | `01` wins for naming and copy; sitemap items become navigation aliases or anchors |
| Services | `01` §16–§17 | `02` p6 sitemap sub-items | `01` wins; sitemap-only items need client copy (Q-09) |
| Industries | `01` §18 | `02` p6 and p5 | `01` wins; "Real Estate & Compounds" needs a decision (Q-08) |
| Products | `02` p6 (category names only) | `02` p2 (market solution types) | Category names come from the sitemap; **no product copy or data exists** (D-09) |
| Partners | `01` §21 (intro copy only) | `02` p2 brand list is **market research, not partners** | Never display the p2 brands as partners without D-08 confirmation |
| Projects | `01` §22 (data model and intro copy) | `02` p6 (sector categories) | Data model from `01`; filter taxonomy from the approved industries (§35) |
| Contact and locations | `00` (Qatar + Egypt, placeholders) | `01` §24 placeholders | Placeholders until D-01, D-02, D-03 |
| Brand colours | `04` / `02` p7 **Option B** | — | Option B only. Option A is never referenced in code. |
| Logo | *None supplied* (wordmark visible only in mock-ups) | Option B mock-up | D-05 |
| Typography | *None supplied* | Option B mock-ups (IBM Plex-like grotesque) | T-05 (our decision, open to client review) |
| Imagery | *None supplied* | Option B mock-ups for **mood only** | Designer delivers to the manifest |
| Chinese copy | *To be supplied by client* | — | D-12; never machine-translated in production |
| Arabic copy | *Unassigned* | — | Q-05 / D-13 |
| UI microcopy (buttons, form labels, errors) | Written by the project team [REC] | — | Team-authored English; client approves; translated with the rest |

---

## 9. Information Architecture

### 9.1 Principles [REC]
1. **Solutions are the backbone.** Every other section cross-links to solutions: Industries and Products list their "related solutions", Services say "applies to all solutions", and each Project lists the "solutions delivered".
2. **One canonical taxonomy** drives navigation, filters, relations and form options. That taxonomy is 8 solutions, 6 services, 11 industries, 7 product categories and 2 countries.
3. **Keep the sitemap's top level intact** as a client requirement. Add only what the brief separately requires: Partners, Company Profile and Privacy.
4. **Don't create thin pages.** A detail page exists only where approved content can sustain it. Otherwise, use deep-linkable sections on the hub page (§9.4).

### 9.2 Reconciliation: client sitemap (PDF p6) ↔ approved content (`01`) [REC, Q-01]

**Products** (sitemap): CCTV & Surveillance · Access Control · Time & Attendance · Video Intercom · Intrusion & Alarm · Fire & Life Safety · Security Networking
→ Kept as the **7 product categories**, with the sitemap names used verbatim.
- Only 3 categories have approved text they can reuse, each through a related solution: Access Control → Access Control solution, Fire & Life Safety → Fire Alarm Systems, and Security Networking → Networking & ICT.
- CCTV & Surveillance also relates to CCTV & Security Systems.
- *Time & Attendance* appears in `01` only as an Access Control capability.
- *Video Intercom* and *Intrusion & Alarm* appear **only in the PDF research** (p2) and have no approved description (D-09).

**Solutions** (sitemap): Video Surveillance · Integrated Security · Smart Building Security · Network & Security Infrastructure · AI & Video Analytics
→ Replaced by the **8 approved solutions**. Mapping for redirects, anchors and search terms:

| Sitemap item | Maps to (approved) | Handling |
|---|---|---|
| Video Surveillance | CCTV & Security Systems | Nav label uses the approved name; SEO keyword alias |
| Integrated Security | CCTV & Security Systems ("Security System Integration") + ELV Systems | Covered by the integration story on the solutions hub |
| Smart Building Security | Smart Building & Home Automation | Approved name |
| Network & Security Infrastructure | Networking & ICT | Approved name |
| AI & Video Analytics | "Intelligent Video Analytics", a capability in CCTV (§09) and Mobile NVR (§07) | A highlighted capability on both pages, not a separate page (no approved standalone copy) |
| *(missing in sitemap)* Mobile NVR, Access Control, ELV, Audio Visual, Fire Alarm | Approved | Included; **Mobile NVR is featured** |

**Industries** (sitemap, 10) vs approved (11):

| Sitemap | Approved (canonical) |
|---|---|
| Residential | Residential |
| Commercial / Corporate & Offices | Commercial & Corporate |
| Retail | Retail |
| Hospitality & Hotels | Hospitality |
| Industrial & Warehouses | Industrial & Manufacturing **and** Logistics & Warehousing |
| Education | Education |
| Healthcare | Healthcare |
| Government & Institutions | Government & Public Sector |
| **Real Estate & Compounds** | *No approved equivalent* (Q-08). Closest: Residential + Commercial. PDF p5 lists "Real Estate Developers" as a customer segment. |
| *(missing)* | Transportation & Fleet, Banking & Finance |

**Services** (sitemap): Security Consultation · Site Survey · Product Selection · Supply & Procurement · System & Configuration
→ Replaced by the **6 approved services** plus the approach. Mapping:
- Security Consultation → System Design & Consultancy
- Site Survey → the *Understand* step (no approved standalone copy; Q-09)
- Product Selection → the *Select* step
- **Supply & Procurement** → *no approved copy*. This is important for the reseller role (Q-09).
- System & Configuration → Installation & Commissioning plus Testing & Integration

**Projects** (sitemap): Residential · Commercial · Corporate · Hospitality · Industrial
→ These become **filter values** drawn from the approved industry taxonomy. They are not separate pages.

**About Us** (sitemap): Who We Are · Our Vision · Our Mission · Our Values · Why Vision Plus
→ Sections (anchors) of one About page, plus the approved *Journey*, *Philosophy* and a link to the *Company Profile*.

**Contact** (sitemap): Request a Consultation · General Inquiry · Become a Partner · Contact Information · Our Locations
→ The first three become **inquiry types** in one form. A fourth type, *Product inquiry*, is added [REC] to serve the Products section. The last two become page sections.

### 9.3 Products: role and launch options [Q-02]

**Analysis.** The source supports **product categories** (the sitemap) and the fact that Vision Plus is a **reseller** (PDF). It does **not** support:
- product listings, models or specifications
- datasheets or prices
- which brands are carried in which category

The PDF brand list describes *the market*, not Vision Plus's authorisations. So no product detail page can be built without fabrication.

**Recommended (Option A — "Technology Portfolio", inquiry-led)** [REC]:
- `/products` shows the 7 categories as an editorial index, not an e-commerce grid.
- Each category shows:
  - the category name [SRC sitemap]
  - a short description *only* where approved text exists, via its related solution; otherwise the description is left empty and tracked as D-09
  - "Brands we supply" (logo + name, from the partner registry, **only once D-08 and D-09 confirm them**)
  - the related solution link
  - **Ask about this category**, which opens the form with `type=product&category=<slug>`
- `/products/[category]` detail pages exist in the architecture but are **feature-flagged off** until a category has approved content (a description, brands, and optionally product lines).
- No prices, carts or model pages. This matches the "technology-independent" positioning [SRC `01` §21].

**Option B.** Hide *Products* from the navigation until the client supplies data. Simple, but it contradicts the client sitemap and the reseller positioning.

**Option C.** Full product catalogue (model-level pages with specs and datasheets). Only if the client commits to supplying and maintaining the data; this needs a separate scope estimate.

### 9.4 Detail-page decisions [REC]

| Entity | Detail pages at launch? | Rationale |
|---|---|---|
| Solutions (8) | **Yes**: `/solutions/[slug]` | Approved copy is rich (headline, 1–4 paragraphs, a 8–15 item capability list, special modules) |
| Services (6) | **No**, sections on `/services` with stable anchors (`#system-design-consultancy`) | 1–2 paragraphs each; separate pages would be thin. The architecture allows promotion to pages later. |
| Industries (11) | **No**, interactive sections on `/industries` with anchors | One approved sentence each. Pages become worthwhile once projects and related content accumulate (phase 2 backlog). |
| Product categories (7) | **Flagged off** (see 9.3) | No data |
| Projects | **Yes**: `/projects/[slug]` once real projects exist | The data model supports a meaningful page (facts, scope, gallery) |
| Partners | **No**, logo + name on `/partners` | Per the requirement; metadata is optional |
| About sections | **No**, one long-form `/about` with anchors | This is one narrative |

---

## 10. Final Sitemap

Top-level order follows the client sitemap, with one recommended change [REC, Q-03]: **Solutions is placed before Products**. The approved positioning leads with engineering ("We start with the requirement, not the product"), and Products exists to serve the reseller role. If the client prefers the original order, it is a one-line configuration change.

```
Home                                   /{locale}
├── Solutions                          /{locale}/solutions
│   ├── Mobile NVR & Mobile Surveillance   /solutions/mobile-nvr-mobile-surveillance   ★ featured
│   ├── CCTV & Security Systems            /solutions/cctv-security-systems
│   ├── Access Control                     /solutions/access-control
│   ├── Networking & ICT                   /solutions/networking-ict
│   ├── ELV Systems                        /solutions/elv-systems
│   ├── Audio Visual                       /solutions/audio-visual
│   ├── Smart Building & Home Automation   /solutions/smart-building-home-automation
│   └── Fire Alarm Systems                 /solutions/fire-alarm-systems
├── Products (Technology Portfolio)    /{locale}/products
│   └── 7 categories as sections, e.g. #access-control      (/products/[category] feature-flagged)
├── Industries                         /{locale}/industries       (11 sections, e.g. #banking-finance)
├── Services                           /{locale}/services         (6 services + Approach, e.g. #project-management, #approach)
├── Projects                           /{locale}/projects         (filters via query string)
│   └── Project detail                 /{locale}/projects/[slug]
├── About                              /{locale}/about
│   ├── #who-we-are  #journey  #vision  #mission  #values  #philosophy  #why-vision-plus
│   ├── Technology Partners            /{locale}/partners         [REQ, not in sitemap]
│   └── Company Profile                /{locale}/company-profile  [REQ, not in sitemap]
├── Contact                            /{locale}/contact
│   └── #inquiry (?type=consultation|product|general|partnership)  #locations
├── Privacy Policy                     /{locale}/privacy          [REC, required when collecting personal data; D-16]
└── 404                                localized not-found
```

---

## 11. Route Architecture

**[DEC] T-02: locale-prefixed URLs for every locale, with English slugs.**
- The URL patterns are `/en/...`, `/ar/...` and `/zh/...`, with `localePrefix: 'always'`.
- Slugs stay in English in every locale, for example `/ar/solutions/access-control`.
- Rationale:
  - Paths are stable and shareable, with no percent-encoded Arabic or Chinese in URLs.
  - A single `generateStaticParams` source serves all three locales.
  - hreflang pairs are trivial to generate.
  - The pattern is compatible with static hosting.
  - The static export is also a constraint: next-intl's `pathnames` (localized slugs) needs its proxy, and the proxy is unavailable in a static export.
  - If localized slugs are wanted later, they can be emitted as separate static routes, with 301s generated in the Worker.

| Route | Rendering | Params source |
|---|---|---|
| `/` | The Worker (§42) negotiates cookie `NEXT_LOCALE` → `Accept-Language` → `/en`, and returns a 302. The static fallback `app/page.tsx` calls `redirect('/en')`, which renders as a meta refresh on hosts without a Worker. | — |
| `/[locale]` | Static (SSG) | `locales` |
| `/[locale]/solutions`, `/[locale]/solutions/[slug]` | SSG | `solutions` registry |
| `/[locale]/products` (+ `/[slug]` only when `enabled: true`) | SSG | `productCategories` registry |
| `/[locale]/industries`, `/services`, `/about`, `/partners`, `/company-profile`, `/contact`, `/privacy` | SSG | — |
| `/[locale]/projects`, `/[locale]/projects/[slug]` | SSG; filters run client-side over the prebuilt list | `projects` registry (published only in production) |
| `/sitemap.xml`, `/robots.txt` | Generated at build | registries |
| `/api/contact` | **The only server endpoint** (edge function; see §29) | — |

**Redirects [DEC]:**
- Sitemap alias paths, for example `/en/solutions/video-surveillance` → `/en/solutions/cctv-security-systems`, get 301s generated from `content/data/aliases.ts`. This protects any links the client may have already circulated from the sitemap naming.
- There are no trailing slashes (`trailingSlash: false`).

**Query parameters used for UX, not indexed:**
- `/contact?type=product&category=access-control`
- `/projects?sector=hospitality&solution=cctv-security-systems&country=qatar`

The canonical URL always omits query parameters.

---

## 12. Content Architecture

### 12.1 Model
There is no CMS [REQ]. Content is **code-adjacent data**, typed with Zod and split along one line: **what is structural** versus **what is language**.

```
src/content/
├── schema/                 Zod schemas: the single definition of every entity's shape
├── data/                   LOCALE-AGNOSTIC structure (TypeScript)
│   ├── solutions.ts        slug, order, featured, imageIds, sceneId, relations
│   ├── services.ts         slug, order, lifecycleSteps[], imageId
│   ├── approach.ts         8 steps: order, key
│   ├── industries.ts       slug, order, relatedSolutions[], imageId
│   ├── product-categories.ts   slug, order, enabled, relatedSolution, brandIds[]
│   ├── partners.ts         slug, logo (mono/color), website? (optional), categoryIds? (optional), status
│   ├── projects/<slug>.ts  facts + relations + media + status
│   ├── locations.ts        qatar | egypt: phone, email, mapEmbedSrc, mapUrl, coordinates? (all placeholders)
│   ├── navigation.ts       menu tree built from the registries
│   ├── aliases.ts          legacy/sitemap alias → canonical redirects
│   └── site.ts             company name, founding facts, social links (placeholder), contact defaults
├── copy/                   LOCALIZED text (JSON, one folder per locale)
│   ├── en/  home.json  about.json  solutions.json  services.json  industries.json
│   │        products.json  projects.json  partners.json  contact.json  company-profile.json
│   │        seo.json  legal.json
│   ├── ar/  (same keys)
│   └── zh/  (same keys)
├── media/images.ts         image registry (the implementation of IMAGE_ASSET_MANIFEST)
├── company-profile.ts      Canva embed configuration (§33)
└── index.ts                typed loaders: getSolution(locale, slug), getNavigation(locale), …
messages/{en,ar,zh}.json    UI chrome strings for next-intl (buttons, form labels, errors, aria-labels)
```

**Why this split [DEC] T-04:**
- Translators receive and return **plain JSON** (or a spreadsheet exported from it), and never touch TypeScript.
- Relations and ordering change in **one place** for all locales.
- Zod validates every locale file at build time, so a missing key, a wrong type or an unpublished placeholder **fails the build** instead of shipping.
- Components never contain business copy. They receive typed props from loaders.

### 12.2 Example entity shapes (illustrative, not final code)
```ts
// data/solutions.ts
export const solutions = [
  { slug: 'mobile-nvr-mobile-surveillance', order: 1, featured: true,
    images: { hero: 'SOL-MNVR-HERO', card: 'SOL-MNVR-CARD', detail: 'SOL-MNVR-DETAIL', band: 'SOL-MNVR-FLEET' },
    scene: 'mnvr-route',                       // §23.6 solution scene registry
    relatedIndustries: ['transportation-fleet','education','logistics-warehousing'],
    relatedServices: 'all', relatedProductCategories: ['cctv-surveillance'] },
  // …
] as const satisfies SolutionData[];

// copy/en/solutions.json  (keys mirror slugs)
{ "mobile-nvr-mobile-surveillance": {
    "name": "Mobile NVR & Mobile Surveillance",
    "summary": "Mobile video surveillance, vehicle monitoring, GPS, connectivity, remote monitoring, and fleet intelligence.",
    "headline": "Security That Moves With You.",
    "body": ["Security requirements do not stop when an asset leaves a building.", "…"],
    "capabilities": ["Mobile Network Video Recorders", "…15 items"],
    "pillars": { "video": {"title":"Video","text":"Capture and record activity inside and around vehicles."}, "…": {} },
    "applications": ["Public Transportation", "…9 items"],
    "equation": "Video + Location + Connectivity + Data + Intelligence",
    "seo": { "title": "…", "description": "…" },
    "_meta": { "source": "01 §07–§08", "status": "approved" } } }
```

### 12.3 Content statuses and the production gate [DEC] T-06
Every localized block and data entity carries a `status`:

| Status | Meaning |
|---|---|
| `approved` | Client-approved copy |
| `derived` | Shortened or rearranged from approved copy; see 12.5 |
| `draft` | Team-written UI or microcopy awaiting approval |
| `placeholder` | Structure only |
| `draft-mt` | Machine translation for layout QA only |

- `CONTENT_MODE=preview`, used locally and on staging, renders everything. Placeholders and drafts get a discreet "Preview content" marker.
- `CONTENT_MODE=production` **fails the build** if any *published* route renders `placeholder` or `draft-mt` content, or a P0/P1 image that is still a placeholder.
- Entities that are unpublished in production are **excluded**, not shown empty:
  - projects without data
  - partners without confirmed logos
  - products with `enabled: false`
- The sections that depend on them hide, and each has a designed alternate layout.

### 12.4 Relations (derived, requires client confirmation) [REC, Q-10]
Industry → solution links are derived **only where the approved industry sentence names the technology** (`01` §18).

| Industry | Related solutions (derived from the approved wording) |
|---|---|
| Transportation & Fleet | Mobile NVR |
| Government & Public Sector | CCTV & Security ("surveillance", "security"), Access Control ("access management"), Networking & ICT ("networking") |
| Commercial & Corporate | Networking & ICT, CCTV & Security, Access Control, Audio Visual, Smart Building & Home Automation |
| Banking & Finance | CCTV & Security, Access Control, Networking & ICT |
| Hospitality | CCTV & Security, Audio Visual ("communication, entertainment"), Networking & ICT |
| Retail | CCTV & Security ("security", "analytics", "monitoring"), Networking & ICT, Audio Visual ("digital communication") |
| Education | CCTV & Security, Networking & ICT, Access Control, Mobile NVR ("transportation monitoring"; School Buses appear in the Mobile NVR applications) |
| Healthcare | CCTV & Security, Access Control, Networking & ICT |
| Residential | CCTV & Security, Networking & ICT, Audio Visual ("entertainment"), Access Control, Smart Building & Home Automation |
| Logistics & Warehousing | CCTV & Security, Access Control, Networking & ICT, Mobile NVR |
| Industrial & Manufacturing | CCTV & Security, Networking & ICT |

Two solutions are **named by no industry sentence**: Fire Alarm Systems and ELV Systems. They are therefore shown as "applies across environments" and not force-linked. [Q-10] asks the client to confirm or extend the matrix.

### 12.5 Derived-copy rule [DEC]
- UI sometimes needs shorter text, such as mega-menu descriptions, card summaries and meta descriptions. That text is taken **verbatim from the approved one-line summaries** (`01` §06 gives one per solution; `01` §18 gives one per industry). Where no approved summary exists, the text is marked `derived`.
- Derived text is limited to **selection and truncation at sentence boundaries**. No new claims are allowed.
- Every derived string records its source reference in `_meta.source`, and the client approves it with the English copy review.
- **Typographic normalisation** is allowed and documented: curly apostrophes and quotes, non-breaking spaces before units, and consistent "&". Meaning is never changed.

### 12.6 Maintainability
A developer updates:
- a solution's copy in `copy/<locale>/solutions.json`
- an office phone number in `data/locations.ts`
- a partner by adding a logo file plus one entry in `data/partners.ts`
- a project by adding one file in `data/projects/`
- the Canva embed in `content/company-profile.ts`

`pnpm content:check` validates the change, and no component changes are needed. `docs/CONTENT_EDITING_GUIDE.md` is written in Phase 11 (handover).

---

## 13. Localization Architecture

| Aspect | Decision |
|---|---|
| Locales | `en` (default), `ar`, `zh` [REQ] |
| HTML `lang` | `en`, `ar`, `zh-Hans` |
| `dir` | `ltr`, `rtl`, `ltr`, set on `<html>` from the locale config |
| Library | **next-intl 4.x** [DEC T-03]. It is mature for the App Router, has ICU messages, typed keys and static rendering support, and generates hreflang alternates. The static setup follows the version-appropriate next-intl guidance: `next/root-params` in Next ≥ 16.3, and `setRequestLocale` is legacy. |
| Routing | `localePrefix: 'always'`, English slugs (§11) |
| Default locale | English. `/` resolves as cookie → `Accept-Language` → `en`. There is **no automatic redirect once a visitor is inside a locale**. |
| Language switcher | Keeps the current path and anchor, and lists native names (English · العربية · 中文). It uses **no flags**, because languages are not countries. It sets the `NEXT_LOCALE` cookie. |
| Messages | ICU MessageFormat, with plurals where needed (for example "{count} projects"). Arabic plural categories (zero/one/two/few/many/other) are supported by ICU. |
| Formatting | `Intl` handles dates such as completion years and timestamps. Numbers use Latin digits in every locale by default (Q-17). |
| Fallback | **None in production.** A missing key is a build failure. In preview, a missing `ar`/`zh` key shows the English text wrapped in a dashed-outline `<mark>`, so gaps are visible. |
| Per-locale publishing | `PUBLISHED_LOCALES` config. A locale not yet published is excluded from routes, sitemap, hreflang and the switcher. This allows a staged launch if the client chooses one (Q-11). |
| Translation workflow | 1. English copy is locked. 2. `pnpm i18n:export` produces `translations.xlsx` (key, context, English, max length, current ar, current zh). 3. Translators or the client fill it in. 4. `pnpm i18n:import` writes the JSON. 5. Zod plus length-budget checks run. 6. RTL/CJK visual QA follows. |
| Brand name | "VISION PLUS" stays in Latin in all locales unless the client supplies approved Arabic and Chinese renderings (Q-07) |

### 13.6 Machine translation policy [REQ]
- Machine translation may be used **only** to produce `draft-mt` strings for layout QA in preview mode.
- A `draft-mt` string can never reach production, because the build gate enforces it.
- Final Chinese is supplied by the client [REQ]. Final Arabic comes from a human translator the client arranges (Q-05, D-13).

---

## 14. Arabic RTL Strategy

1. **Logical layout everywhere.** Use Tailwind logical utilities (`ms-/me-/ps-/pe-`, `inset-s-/inset-e-`; note that `start-/end-` are deprecated in Tailwind 4.2+), `text-start`, and CSS logical properties in custom CSS. A lint rule bans physical `ml-/mr-/pl-/pr-/left-/right-` classes, except for an allowlist of the few elements that must stay physical.
2. **The whole layout mirrors.** Grids, the navigation order, breadcrumbs, the timeline direction (2017 sits on the right), carousels (the marquee moves toward the reading direction) and the form layout all mirror.
3. **Directional icons.** Only *directional* icons flip, using `rtl:-scale-x-100` on chevrons and arrows (next, back, forward). Non-directional icons (phone, mail, play) and logos never flip.
4. **Mixed-direction content.**
   - Wrap Latin brand names, model names, emails, URLs and phone numbers in `<bdi>` or `dir="ltr"`.
   - Phone numbers use `dir="ltr"` with `unicode-bidi: isolate`, so `+974 …` never reorders.
   - Email and phone form inputs are `dir="ltr"`, while their labels stay RTL.
5. **Arabic typography.**
   - The typeface is IBM Plex Sans Arabic (§21).
   - Body line-height is 1.8 and headings 1.35.
   - **Letter-spacing is always 0**, because tracking breaks cursive joining.
   - No uppercase transforms and no faux italics.
   - Sizes are about 6 % larger than Latin at the same token, because Arabic has a smaller apparent x-height.
6. **Motion and scenes.** Scroll scenes compose their SVGs with a mirrored-safe layout, and horizontally travelling elements such as the Mobile NVR route and data pulses reverse direction under `[dir=rtl]` (§23). Text inside SVGs is never baked in. Labels are HTML overlays, or SVG `<text>` driven by the localized copy with `direction` set.
7. **Images** follow the RTL safe zones in the manifest. There is an optional `srcRtl` variant, and images are never auto-flipped.
8. **Numerals.** The default is Western digits (0–9) for years, phones and specs, which is common in Gulf and Egyptian business and technical contexts. Q-17 confirms this.
9. **QA.** Every template is visually regression-tested in `/ar` at 390, 768, 1440 and 1920 px, plus a manual review by a native Arabic reader (§41).

---

## 15. Chinese Strategy

1. **Script and locale:** Simplified Chinese. URL `/zh`, `lang="zh-Hans"`, hreflang `zh-Hans`. This value needs one final check against Google's current hreflang documentation in Phase 7; `zh` is the fallback.
2. **Fonts:**
   - Noto Sans SC is self-hosted at build time through `next/font`. Google's CSS splits it into numbered `unicode-range` slices, so the browser downloads only the slices a page uses. It is not preloaded.
   - The fallback stack is `"PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "Noto Sans SC", sans-serif`.
   - Fonts are **never loaded from Google's CDN at runtime**; `next/font` self-hosts them. This matters for mainland reachability.
   - IBM Plex Sans stays in the stack first, so Latin characters inside Chinese text (VISION PLUS, ELV, ICT, 4G/5G) match the rest of the site.
3. **CJK typesetting:**
   - Body line-height is 1.75 and letter-spacing 0.
   - There is no italic; emphasis uses weight 500.
   - Headings use weight 500–600, because 700 is too heavy in CJK.
   - Display sizes are about 8 % smaller at the same token, because CJK glyphs fill the full em box.
   - Use `line-break: strict`, `word-break: normal` and `text-wrap: pretty` where supported. Avoid `text-transform` and wide tracking.
   - Punctuation is full-width in copy supplied by the client.
4. **Length budgets:** Chinese is usually 30–50 % shorter than English, and Arabic about 20–30 % longer. Components are tested against **all three**, and the i18n workbook carries max-length hints for UI strings.
5. **Content:** the client provides the Chinese copy [REQ, D-12]. We supply the export workbook so it maps 1:1 to keys.
6. **Mainland China reachability [Q-06, R-05].** If the Chinese audience includes mainland users, the following are affected:
   - Google Maps embeds are blocked. The Contact page falls back to a static map image plus the address text, and an Amap or Baidu link can be added (D-03b).
   - Cloudflare Turnstile is "not supported in Mainland China", so the anti-spam design already degrades gracefully (§30.5).
   - `script.google.com` and `sheets.googleapis.com` are blocked, but they are called **server-side only**, so this is unaffected.
   - Canva global (`canva.com`) is intermittently disrupted. It can be replaced by a `canva.cn` embed for `/zh` if the client has a Canva China account, or it falls back to a PDF or poster (§33).
   - Hosting on a global CDN without an ICP licence gives variable, non-guaranteed performance in the mainland. A mainland-optimised deployment would need an ICP licence and a China CDN, which is **out of scope and not free**.
7. **Search:** Google hreflang is the baseline. Baidu SEO is out of scope unless requested, because it effectively needs mainland hosting.

---

## 16. Navigation Strategy

### 16.1 Desktop header (≥ `nav` breakpoint, initially 1200 px; tuned after measuring the longest locale)
```
[VISION PLUS logo]   Solutions ▾   Products ▾   Industries ▾   Services ▾   Projects   About ▾        EN|ع|中 ▾   [Request a consultation]
```
- **Height:** 80 px at the top of the page, compressing to 64 px after 80 px of scroll. It moves with a transform, not a height change, to avoid layout shift.
- **Surfaces:** over dark heroes the header is transparent with white text. Once the page scrolls, or over light pages, it becomes an off-white surface with a 1 px Light Gray bottom hairline. There is no glassmorphism blur [REQ].
- **Active state:** a 2 px Vision Gold rule under the current section. The rule is decorative; the text itself stays at full contrast.
- **CTA:** a Charcoal button on light surfaces and a Gold button with Charcoal text on dark surfaces.

### 16.2 Mega menus [REC]
Panels open on click **and** on hover with a 150 ms intent delay. They close on Esc, on focus leaving the panel, or on clicking outside. The panel is full width and aligned to the 12-column grid.

- **Solutions:**
  - Columns 1–8: the 8 solutions as an index of name plus the approved one-line summary (`01` §06), in two columns of four.
  - Columns 9–12: a **featured panel** for Mobile NVR with its card image (`SOL-MNVR-CARD`), *"Security That Moves With You."* and a link.
  - Footer row: "All solutions", "How we work (Approach)".
- **Products:** the 7 categories in one column, the brands strip (only when D-08/D-09 exist), and "Ask about products".
- **Industries:** 11 names in three columns. There are no icons (§18.4). Each links to its `/industries#slug` anchor.
- **Services:** 6 services, plus a compact version of the 8-step approach as a single line of step names. The line is a real sequence, so numbering is appropriate here.
- **About:** Who we are · Journey · Vision & Mission · Values · Why Vision Plus · Technology Partners · Company Profile.
- **Implementation:**
  - Menus follow the WAI-ARIA *disclosure* navigation pattern, not `role="menu"`. Each top-level item is a `<button aria-expanded aria-controls>`, and the panel content is a plain list of links.
  - The whole header is a server-rendered component, with one small client island for disclosure state.

### 16.3 Mobile and tablet (< `nav` breakpoint)
- **Bar:** logo, language switcher (compact), and a menu button labelled **"Menu"**, text plus icon for clarity.
- **Drawer:**
  - A full-screen Charcoal sheet that slides from the inline-end (from the left in RTL).
  - Each section is an accordion with its links.
  - A **pinned bottom bar** holds the "Request a consultation" button plus phone and email shortcuts, which appear only once D-01/D-02 are supplied.
  - The drawer traps focus, closes on Esc, returns focus to the menu button, and locks body scroll with `overscroll-behavior: contain`.
- **Motion:** a 320 ms sheet slide with `--ease-precise`. Under reduced motion it is an instant crossfade.

### 16.4 Secondary navigation
- **Breadcrumbs** on every page except Home, with `BreadcrumbList` JSON-LD (§36). They are mirrored in RTL.
- **In-page section index** on long pages (About, Services, Industries):
  - desktop: a sticky list at the inline-start that highlights the current section
  - mobile: a horizontally scrollable chip bar under the page hero
- **"Related" rails** at the end of each solution page: industries, services, product categories, and projects (when published).
- **Footer:**
  - Columns: Solutions, Company, Contact (Qatar and Egypt blocks), and language.
  - A bottom row holds © VISION PLUS {year} (the legal entity names come from D-15), Privacy, and social links (D-17, shown only if supplied).

### 16.5 Keyboard and accessibility
- A "Skip to content" link comes first in the tab order.
- Every navigation control is reachable by Tab, Enter/Space toggles panels, and Esc closes them.
- A visible focus ring is required (§20.9).
- `aria-current="page"` marks the active link. There are no hover-only interactions.

---

## 17. UX Strategy

1. **Narrative before inventory.** Every page answers *why this matters to your environment* before listing capabilities. The source content is already written this way: headline, then context, then capabilities, then a closing line. We preserve that order.
2. **Show integration, don't just claim it.** Cross-links, relation rails and the solution scenes (§23.6) all visualise systems connecting. This is the site's recurring idea: *technology working as one*.
3. **Two conversion paths, one form.**
   - The *consultation* path serves the system-integrator buyer.
   - The *product inquiry* path serves the reseller buyer.
   - Every CTA pre-fills the form with its context, so the visitor never re-types what they were just reading.
4. **Evidence over adjectives.** Projects and Partners appear only with real data. Until then, sections collapse gracefully instead of showing "coming soon" [REQ: no fake completeness]. There are no invented statistics, counters or testimonials.
5. **Progressive depth.** The hub pages act as index pages you can scan. Detail sits in solution pages and anchored sections. Long pages get an in-page index.
6. **Premium means calm.** Generous space, few simultaneous accents, one signature moment per page, and typography carrying the hierarchy.
7. **Solution pages are experiences, not templates [REQ, added requirements].** Each solution page is built from a shared skeleton, so that it is maintainable. The skeleton has *one solution-specific storytelling scene* whose intensity is chosen per solution (§23.6 and §26.2). The scene *explains* the solution's approved concept and is never decoration.
8. **Mobile is designed, not shrunk.** Every section specifies its mobile composition (§26). Scroll scenes switch to a **stepped** mode on mobile instead of heavy pinning.
9. **Trilingual parity.** No feature, section or CTA exists in English only. Every component is QA'd in all three scripts.
10. **Forms feel like a conversation with an engineer.** The first step asks what the visitor needs, then only the relevant fields appear. Errors explain how to fix the problem, and success gives a reference number and the next step.

---

## 18. Visual Direction

**Concept: "Engineered Light."** [REC]

The approved Option B references show charcoal architecture, precise edges and **warm gold light running along the building's seams**. We turn that into a design language:

- **Architecture = structure.** Charcoal and grey planes, a strict grid, confident negative space, hard-edged image crops, and 0–2 px radii.
- **Gold light = intelligence and connection.** Vision Gold is not a paint colour. It is *the signal*: the line that connects, the state that is active, the moment a system comes alive. Anything gold means "connected / active / Vision Plus".
- **Linework = engineering.** Technical drawings (sections, plans, topologies) in hairline greys are the site's illustration style. They power the solution scenes and diagrams. Photography carries the reality: real projects and real people.

**Surface rhythm.**
- The site is **light-dominant**, using Off White and White.
- **Charcoal "chapters"** are reserved for signature moments: the home hero, the Mobile NVR chapter, solution scenes, the closing CTA and the footer.
- This avoids the generic "all-dark with one bright accent" look. It also keeps gold where it has contrast (§22).

**What we explicitly avoid [REQ + frontend-design skill calibration]:**
- gradient washes, glassmorphism, blobs, particles and fake 3D
- identical rounded cards with soft shadows
- tracked-out ALL-CAPS eyebrows above every heading
- icons in circles for every list
- "→" appended to every link
- big-number stat rows with invented numbers
- a monospace font for decorative data labels
- fade-up on every section

**Signature element.** The **gold seam**: a 1–2 px gold line that appears at chapter openings and becomes the connective line of every system diagram and scene. It comes directly from the brand mock-ups (the dash under the wordmark and the light seams on the facades).

---

## 19. Design Principles

1. **One signal colour, used as meaning.** Gold means *active or connected*. If an element is gold without meaning that, it is removed.
2. **Grid is law, asymmetry is intent.** Everything aligns to 12 columns. Compositions are deliberately asymmetric (5/7, 4/8 and offset starts) to feel editorial and architectural, not templated.
3. **Typography leads.** Large, confident headlines from the approved copy do the heavy lifting. Body copy stays under about 72 characters per line.
4. **Structure encodes information.** Numbering is used only where the content *is* a sequence: the Approach (8 steps), the Journey (2017 → 2021 → Today) and the ELV principles as ordered beats. The eight solutions are *not* numbered in the UI, even though the source deck numbers them as slides.
5. **Spend boldness once per page.** Each page has one memorable moment (a hero, a scene or a diagram). Everything around it is quiet.
6. **Real or nothing.** No fake data, imagery, partners or projects. Missing items collapse into designed alternates.
7. **Three scripts, one system.** Every token and component is specified for Latin, Arabic and CJK from day one.
8. **Motion explains.** Every animation must answer: *what concept does this make clearer?* (§23)

---

## 20. Design System

All values are delivered as CSS custom properties in `src/styles/tokens.css` and exposed to Tailwind 4 through `@theme`. Components use **semantic tokens only**; raw palette tokens are used only inside the token file.

### 20.1 Breakpoints
| Token | Min width | Target |
|---|---|---|
| (base) | 0 | Mobile (design canvas 390) |
| `sm` | 640 | Large phones / small tablets |
| `md` | 768 | Tablet portrait (8-column grid) |
| `lg` | 1024 | Tablet landscape / small laptop (12-column grid) |
| `nav` | 1200 (provisional) | Desktop navigation appears |
| `xl` | 1280 | Laptop |
| `2xl` | 1440 | Desktop (design canvas) |
| `3xl` | 1920 | Large displays: the container stays 1440, and full-bleed media and scenes scale |

### 20.2 Grid and containers
| Range | Columns | Gutter | Side padding | Content width |
|---|---|---|---|---|
| < 768 | 4 | 16 | 20 | fluid (350 at 390) |
| 768–1023 | 8 | 24 | 32 | fluid |
| 1024–1439 | 12 | 24 → 32 (at 1280) | 48 | fluid |
| ≥ 1440 | 12 | 32 | 64 (container max 1440) | **1312** (column 80) |

- **Container variants:**
  - `container` (1440 max)
  - `container-narrow` (span 8 = 864, for long-form prose)
  - `bleed` (full viewport)
  - `bleed-start` / `bleed-end` (half-bleed media that break out on one side; logical, so they flip in RTL)
- The span formula at 1440 is `112n − 32`, and the image manifest derives its sizes from it.

### 20.3 Spacing (4 px base)
- **Scale:** `0, 4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80, 96, 128, 160, 200`.
- **Section rhythm tokens:**
  - `--space-section-sm: clamp(64px, 6vw + 40px, 112px)`
  - `--space-section: clamp(80px, 8vw + 48px, 160px)`
  - `--space-section-lg: clamp(96px, 10vw + 56px, 200px)`
- **Stack tokens:** `--stack-2xs` (8) through `--stack-2xl` (64), for vertical text rhythm.

### 20.4 Radii, borders, elevation
- **Radii:** `--radius-0: 0` (media, sections, panels), `--radius-1: 2px` (buttons, inputs, tags), `--radius-full` only for the language switcher indicator and radio dots. **No large rounded cards.**
- **Borders:** hairline `1px` in `--border-subtle` (Light Gray on light surfaces, `#3A3A3A` on dark surfaces). Emphasis borders are `1px` `--border-strong` (Medium Gray, 5.33:1 on white, which meets the 3:1 rule for UI components).
- **Elevation:** one level only, `--shadow-overlay: 0 24px 48px -24px rgb(31 31 31 / .35)`, for mega menus, the lightbox and the language menu. Content surfaces use tone and hairlines, never shadows.

### 20.5 Iconography
- **Library:** Lucide (ISC licence, free, tree-shaken per icon), for **UI function only**: chevrons, menu, close, phone, mail, map pin, external link, check, alert, download, fullscreen.
- **Style:** 1.5 px stroke, 20 or 24 px size, `currentColor`.
- **No decorative icon grids** for solutions or industries. Visual identity comes from the scenes, linework and photography.
- Directional icons flip in RTL (§14).

### 20.6 Buttons and links
| Variant | Light surface | Dark surface | Use |
|---|---|---|---|
| Primary | Charcoal fill, White text (16.5:1). Hover: Dark Gray fill plus a gold 2 px bottom seam. | Gold fill, Charcoal text (7.84:1). Hover: White fill. | One per view: the consultation CTA |
| Secondary | 1 px Charcoal border, Charcoal text. Hover: Charcoal fill, White text. | 1 px White border, White text | Secondary actions |
| Text link | Charcoal text, 1 px underline at 3 px offset. Hover: the underline becomes gold and 2 px. | White text, same behaviour | Inline and "Learn more" |

- Height 48 px (touch target ≥ 44), inline padding 24 px, `--radius-1`, and text `body-sm` at weight 500.
- Labels say what happens ("Request a consultation", "Explore Mobile NVR").
- A trailing icon appears only when it adds meaning: an external-link icon for new tabs, or a chevron on disclosure buttons.
- The disabled state reduces opacity to 40 % and sets `aria-disabled`. Buttons are never disabled merely to prevent submission; the form validates on submit instead.

### 20.7 Form controls
- Labels sit above inputs, always visible, and never as placeholder-only text.
- Fields are 48 px high (textareas are at least 160 px), with a 1 px `--border-strong` border, `--radius-1`, and a White fill on Off White pages.
- **States:**
  - Hover: the border turns Charcoal.
  - **Focus:** a 2 px Charcoal outline at 2 px offset plus a gold 2 px bottom seam.
  - **Error:** a 1 px `--status-error` border, an inline message with an icon, and `aria-invalid` plus `aria-describedby`.
  - Success: used only on the form as a whole.
- **Required fields:** the legend "Fields marked * are required" plus a visually hidden "(required)" on each label, so the marker is never conveyed by colour alone.
- **Choice inputs:** the inquiry type is a **segmented radio group** that is fully keyboard-operable and wraps to 2×2 on mobile. Checkboxes are custom-styled, 20 px, with a Charcoal check.

### 20.8 Content patterns (instead of "cards everywhere")
| Pattern | Description | Used in |
|---|---|---|
| **Index list** | Full-width rows with a large name, a one-line summary and a hover/focus reveal of the image or a gold seam. It works as a typographic table of contents. | Solutions hub, Industries, Products, mega menu |
| **Spec list** | Capability lists as a two- or three-column list with hairline separators and no bullets or icons. The heading is "Core capabilities" (approved wording where available). | Solution pages |
| **Split editorial** | A 5/7 or 7/5 split of image and text, with offset baselines | Services, About |
| **Timeline / process track** | A horizontal track with nodes and a gold progress seam (vertical on mobile). Numbered, because it is a sequence. | Approach, Journey |
| **Pillar strip** | 4–6 short concept blocks joined by the seam (for example Video · Location · …) | Mobile NVR, ELV principles, Smart Building values |
| **Statement band** | A full-width typographic statement taken from the approved "closing lines" | Every solution and home |
| **Facts table** | A definition list (`<dl>`) of project facts | Project detail |
| **Card** | Used **only** where items are genuinely parallel, browsable objects: project cards and related-solution tiles. Flat surface, no shadow, 0 radius, and an image on top in a fixed ratio. | Projects, related rails |

### 20.9 Focus, states and feedback
- **Focus ring (global):** `outline: 2px solid var(--focus-ring); outline-offset: 2px`. It is Charcoal on light surfaces and Gold on dark surfaces, and always ≥ 3:1 against adjacent colours. It is never removed.
- **Selection colour:** a Gold background with Charcoal text.
- **Loading:** a skeleton is used only for the Canva embed and the map (the static site has nothing else that loads). A button in its pending state shows an inline 16 px spinner with the label "Sending…".

### 20.10 Section headings
- The structure is: an optional **chapter marker** (a short gold seam, 24×2 px, only at the *first* heading of a charcoal chapter), then an H2 (approved headline), then a lede (approved sub-line or first sentence).
- Headings are start-aligned (left in English and Chinese, right in Arabic). Centred headings are used only in the statement band and closing CTA.
- **No eyebrow labels** unless the label carries real information (for example "2017 · Qatar" in the timeline).

### 20.11 Image treatments
- **Crops:** full-bleed, half-bleed (logical), in-grid, and index-reveal.
- **Masked reveal:** a single `clip-path: inset()` wipe along the inline direction. It runs once on first view, lasts 700 ms, and is disabled under reduced motion.
- **Scrim:** a solid Charcoal overlay at 35–60 % opacity where text overlays an image. It is a single flat or single-direction linear layer, never a decorative gradient.
- **Captions:** `caption` size, in the secondary text colour, placed below the image.

### 20.12 Placeholder component
See `IMAGE_ASSET_MANIFEST.md` §5. It uses a tonal surface, crop marks and a spec label (visible in preview only), holds the exact aspect ratio, and is hidden from assistive technology.

---

## 21. Typography Strategy

**[DEC] T-05: the IBM Plex superfamily, with Noto Sans SC for Chinese.**

- **Why IBM Plex** (a choice made for this brief, not a default):
  1. The approved Option B mock-up headlines are set in a Plex-style engineering grotesque.
  2. Plex was designed for engineering and technology and has a precise, industrial character.
  3. **IBM Plex Sans Arabic** was drawn as a true companion, not an afterthought, so English and Arabic share proportions and tone.
  4. It is open source (OFL, free) and available through `next/font/google` for build-time self-hosting.
- **Chinese:** there is no IBM Plex Sans SC on Google Fonts; only JP and KR exist. **Noto Sans SC** is the closest neutral companion.
- **Logo:** the wordmark in the mock-ups is a different geometric face. The logo is always the supplied vector (D-05) and is never re-typeset.

| Role | Latin (en) | Arabic (ar) | Chinese (zh) |
|---|---|---|---|
| Display and headings | IBM Plex Sans, 500–600 (variable weight; width axis available for the display tier) | IBM Plex Sans Arabic, 500–600 | Noto Sans SC 500–600 (Latin runs fall back to Plex) |
| Body | IBM Plex Sans, 400 | IBM Plex Sans Arabic, 400 | Noto Sans SC, 400 |
| UI and labels | IBM Plex Sans, 500 | IBM Plex Sans Arabic, 500 | Noto Sans SC, 500 |
| Numerals | `tabular-nums` in data, facts and spec labels | Latin digits (Q-17) | Latin digits |

**Loading strategy [DEC]:**
- Each locale's layout loads only its own script's font; `/ar` does not download Noto SC.
- `display: swap`, with size-adjusted fallbacks from `next/font` to prevent layout shift.
- Only the Latin subset of Plex Sans is preloaded; Arabic is preloaded on `/ar` only.
- Weights are limited to 400, 500 and 600. No italics are loaded (the design uses none), which saves bytes.

**Type scale (fluid, rem at a 16 px root):**

| Token | Size (min → max, 390 → 1440) | Line height | Tracking (Latin) | Use |
|---|---|---|---|---|
| `display-xl` | 2.75 → 5.5 rem (44 → 88 px) | 1.02 | −0.025em | Home hero only |
| `display` | 2.25 → 4 rem (36 → 64) | 1.05 | −0.02em | Chapter statements, solution hero |
| `h1` | 2 → 3.25 rem (32 → 52) | 1.1 | −0.015em | Page titles |
| `h2` | 1.625 → 2.5 rem (26 → 40) | 1.15 | −0.01em | Section headings |
| `h3` | 1.25 → 1.625 rem (20 → 26) | 1.25 | −0.005em | Sub-sections, index names |
| `h4` | 1.125 rem (18) | 1.35 | 0 | Items, facts |
| `lede` | 1.1875 → 1.375 rem (19 → 22) | 1.5 | 0 | Section intros |
| `body` | 1.0625 rem (17) | 1.6 | 0 | Paragraphs |
| `body-sm` | 0.9375 rem (15) | 1.55 | 0 | UI, lists |
| `caption` | 0.8125 rem (13) | 1.45 | 0.005em | Captions, meta |

**Locale overrides** (applied through `:lang()` on the tokens):
- `ar`: size × 1.06, body line-height 1.8, heading line-height 1.35, tracking 0.
- `zh`: display and h1 × 0.92, body line-height 1.75, heading weight max 600, tracking 0.

**Rules:**
- Sentence case everywhere. The approved headlines keep their authored casing, for example "Security That Moves With You."
- No all-caps labels. The one exception is the approved location lockup "QATAR • EGYPT", set in `caption` with 0.08em tracking in Latin only.
- A maximum of **two weights** per view.
- Long-form measure is 60–72 characters (`container-narrow`).

---

## 22. Color System

### 22.1 Brand palette: Option B only [REQ]
| Token | Hex | Name |
|---|---|---|
| `--vp-gold` | `#D4AF37` | Vision Gold |
| `--vp-charcoal` | `#1F1F1F` | Charcoal |
| `--vp-gray-dark` | `#3A3A3A` | Dark Gray |
| `--vp-gray-mid` | `#6B6B6B` | Medium Gray |
| `--vp-gray-light` | `#E5E5E5` | Light Gray |
| `--vp-off-white` | `#F8F8F8` | Off White |
| `--vp-white` | `#FFFFFF` | White |

- Option A (blue) values never appear in code, tokens, imagery grading or assets. A CI check greps for the Option A hex values and fails if any are found.
- The gold swatch in the mock-up has a metallic gradient, but **the token is flat `#D4AF37`**. Metallic gradients are not used [REQ: no excessive gradients].

### 22.2 Measured contrast (WCAG 2.x)
| Foreground → Background | Ratio | Verdict |
|---|---|---|
| Gold on Charcoal | **7.84** | ✅ AAA for large text, AA for body |
| Gold on Dark Gray | 5.41 | ✅ AA |
| Gold on White | **2.10** | ❌ fails text **and** the 3:1 UI rule |
| Gold on Off White | 1.98 | ❌ |
| Charcoal on White / Off White | 16.48 / 15.52 | ✅ |
| Dark Gray on White | 11.37 | ✅ |
| Medium Gray on White / Off White | 5.33 / 5.02 | ✅ AA (body) |
| Medium Gray on Light Gray | 4.23 | ⚠ large text only |
| Medium Gray on Charcoal | 3.09 | ❌ for body text |
| Light Gray on Charcoal | 13.08 | ✅ |

### 22.3 Rules derived from the measurements [DEC]
1. **Gold as text appears only on Charcoal or Dark Gray surfaces.**
2. **On light surfaces gold is non-text only:** seams, active underlines alongside other cues, and scene "active" states next to Charcoal linework.
   - Because gold fails 3:1 on white, it must **never be the only indicator** of a state on light surfaces. It always accompanies a weight, shape or text change.
   - The logo is exempt (WCAG exempts logotypes).
3. **Secondary text:** Medium Gray on light surfaces. On dark surfaces, use Light Gray `#E5E5E5`, or the optional derived neutral below.
4. **Gold coverage:** at most about 5 % of any viewport's area, and there is at most **one gold typographic moment per page**, on dark surfaces only.

### 22.4 Derived functional tones [REC, for client acceptance; not new brand colours]
| Token | Hex | Why | Contrast |
|---|---|---|---|
| `--vp-gray-400` (muted text on dark) | `#A3A3A3` | Medium Gray fails on Charcoal | 6.53 on Charcoal, 4.51 on Dark Gray |
| `--vp-gold-ink` (optional gold-toned small text on light) | `#8A6D1A` | Only if a gold-toned link or label on light is ever required | 4.90 on White, 4.62 on Off White |
| `--status-error` | `#B42318` (light) / `#F97066` (dark) | Form errors | 6.57 on White / 5.92 on Charcoal |
| `--status-success` | `#067647` (light) / `#47CD89` (dark) | Form success | 5.69 on White / 8.13 on Charcoal |

### 22.5 Semantic tokens (excerpt)
```
--surface-canvas: off-white       --surface-raised: white        --surface-inverse: charcoal     --surface-inverse-2: gray-dark
--text-primary: charcoal          --text-secondary: gray-mid     --text-inverse: white           --text-inverse-muted: gray-400
--border-subtle: gray-light       --border-strong: gray-mid      --border-inverse: gray-dark
--signal: gold                    --focus-ring: charcoal | gold (on inverse)
--scene-line: gray-mid | #4A4A4A on inverse   --scene-line-active: gold   --scene-fill: off-white | charcoal
```
There is no dark mode: the brand's charcoal chapters already give dark–light rhythm, and a user-toggled dark theme is not a requirement. The architecture (semantic tokens) would allow one later.

---

## 23. Motion Strategy and Motion Design System

*This section was extended to cover the additional requirements for premium, solution-specific visual storytelling.*

### 23.1 Motion principles
1. **Animate concepts, not UI.** Motion shows *systems connecting, activating and working as one*. That is the brand thesis ("Make technology work as one").
2. **Gold light is the protagonist.** Across the site, motion is almost always *the gold signal travelling or activating along engineered linework*. This one consistent idea makes the motion language recognisable as Vision Plus.
3. **Precise, not playful.** No bounce, overshoot, elastic or spring wobble. Movements are linear or strongly decelerated and end exactly on the grid.
4. **Scroll is the user's hand.** Storytelling scenes are driven by scroll *position*, not time, so the visitor controls the pace, and nothing plays while they read.
5. **One orchestrated moment per page.** The rest of the page is still, apart from interaction feedback.
6. **Information is never motion-only.** Every scene's content exists as real HTML text in the DOM, which serves SEO, screen readers and reduced motion.

### 23.2 Tokens
| Token | Value | Use |
|---|---|---|
| `--dur-instant` | 100 ms | Colour and opacity feedback (hover, press) |
| `--dur-quick` | 180 ms | Small UI: underline, focus seam, icon rotate |
| `--dur-panel` | 320 ms | Menus, drawer, accordion, language menu |
| `--dur-reveal` | 700 ms | One-time image mask reveal, chapter seam draw |
| `--dur-signal` | 600 ms per connection segment | Time-based "signal travel" (used only where scroll does not drive it) |
| `--ease-precise` | `cubic-bezier(0.2, 0, 0, 1)` | Entrances and state changes (strong deceleration) |
| `--ease-exit` | `cubic-bezier(0.4, 0, 1, 1)` | Exits |
| `--ease-linear` | `linear` | Scroll-linked progress (beat easing is applied per segment in CSS) |
| `--stagger` | 60 ms, capped at 5 items | Only inside a single composite (for example diagram nodes); never across sections |

### 23.3 Motion vocabulary (what is allowed)
| Pattern | Where | Behaviour | Reduced motion |
|---|---|---|---|
| **Seam draw** | Chapter openings, diagrams | A gold line draws along its path (`stroke-dashoffset` or `scaleX` from inline-start) | Shown fully drawn |
| **Signal travel** | Diagrams and scenes | A short gold segment moves along a connection, representing data or signal | Static gold connection |
| **Activation** | Scenes | A grey element switches to its gold "active" state (stroke or fill), with an optional brief 2 px halo stroke; **no glow blur** | Final state shown |
| **Masked image reveal** | Hero and first large image per page | `clip-path: inset()` wipe in the reading direction | Image shown |
| **Index reveal** | Index lists (desktop, pointer only) | On row hover or focus, the associated image fades in within 180 ms and the seam extends | Image swap without fade |
| **Header compress** | Global | Transform plus background change after 80 px | Instant |
| **Panel motion** | Mega menu, drawer, accordion | `--dur-panel`, opacity plus a 8–16 px translate | Opacity only, 100 ms |
| **Marquee** | Partner logos | Continuous slow scroll (~30 px/s); pauses on hover and focus and when off-screen; has a visible Pause control (WCAG 2.2.2) | **Static wrapped grid** |

**Explicitly not used:**
- fade-up on every section
- parallax on text
- cursor-follow effects
- particles, blobs or random floaters
- counters that tick up
- page-wide scroll hijacking or smooth-scroll libraries

We keep **native scrolling**, so there is no Lenis or locomotive-style smoothing.

### 23.4 Page transitions [DEC]
- There are no custom route transitions at launch.
- Next.js client navigation is already instant. Mismatched cross-fades on a multilingual site add risk (RTL and focus management) for little value.
- **Revisit trigger:** once React `<ViewTransition>` is stable in the Next.js version in use, a 200 ms shared-element transition may be added between a solutions index row and its solution hero. Tracked in the backlog.

### 23.5 Scene engine: one small shared implementation [DEC] T-12
**Rendering choice: inline SVG technical illustration plus CSS, driven by a single progress variable.**

```
<ScrollScene id="mnvr-route" beats={6} mode={{ base: 'stepped', lg: 'pinned' }}>
  <SceneArtwork />        ← server-rendered inline SVG (linework layers tagged data-beat="n")
  <SceneSteps>            ← server-rendered HTML text for each beat (approved copy) — SEO + a11y source of truth
    <SceneStep beat={1}>Video — Capture and record activity…</SceneStep> …
  </SceneSteps>
</ScrollScene>
```

**How it works:**
- A ~2 KB client controller, shared by all scenes, observes the scene root with `IntersectionObserver`.
- **Only while the scene is in view**, a `requestAnimationFrame` loop reads one `getBoundingClientRect` per frame. It writes `--p` (0→1 overall progress) and `--beat` (the active step index) as CSS custom properties on the root, and `data-active-beat` for styling.
- **All visuals are pure CSS** driven by those variables: `opacity`, `transform`, `stroke-dashoffset` and `clip-path`. They are computed with `calc()` and `clamp()` per beat segment. JavaScript never touches individual SVG nodes.
- **Progressive enhancement:**
  - Where CSS scroll-driven animations (`animation-timeline: view()`) are supported, simple scenes may use them with no JavaScript at all.
  - The controller is the universal fallback, so behaviour is identical everywhere.
  - Support is feature-detected with `@supports`, never user-agent sniffed.
- **No animation library is required.** Motion (MIT, free) remains an *optional* dependency, reserved for the mega menu or drawer only if CSS proves insufficient. GSAP is **not** used. It is now free, but it is not needed and its licence is not open-source.

**Why SVG + CSS instead of the alternatives:**

| Option | Verdict |
|---|---|
| **SVG + CSS vars (chosen)** | Vector-sharp at any DPR and a tiny file size (target ≤ 30 KB gzipped per scene). Server-rendered and styleable with tokens, so it follows Option B automatically. RTL is mirrored via a transform on non-text layers. Accessible, since the text is in the DOM. No layout shift, because the size is reserved. Ideal for "technical drawing comes alive". |
| Canvas 2D | No DOM or SSR, and harder to make accessible and theme. Only justified for thousands of moving elements, which we don't have. |
| WebGL / Three.js | 150 KB+ of JS, GPU and battery cost on mobile, a fake-3D risk, and a heavy maintenance burden. **Rejected.** |
| Video loops | Large (MB-scale), can't respond to scroll precisely, have to be re-rendered for every language or RTL change, and would need footage we don't have. **Allowed only** as an optional enhancement if the client supplies *real* footage (for example Mobile NVR camera views), as a muted, poster-first, click-to-play clip. |
| Lottie | Needs After Effects authoring (outside our pipeline) and a ~60 KB runtime, and is weaker for scroll-scrubbing than CSS. **Rejected.** |
| Layered photography | **Optional upgrade** for Smart Building (§23.6), with real, matched exposures of the same interior. Weight is budgeted there. |

**Scene modes:**
- **`pinned`** (desktop ≥ `lg`): the artwork is sticky (`position: sticky; top: header`) while the step texts scroll past. Each beat takes about 70 svh of scroll, and the total scene height is `beats × 70svh + 100svh`.
- **`stepped`** (mobile and tablet): no pinning. Each beat renders as a compact block of text plus a **cropped artwork frame** focused on that beat's region (the same SVG, with a different `viewBox` per step via CSS classes). Each frame animates its own beat once when it enters view.
- **`inview`** (subtle scenes): a single composition that plays its activation once when it enters view, or is scroll-scrubbed within its own height without pinning.
- **`static`**: the final composed state, with no motion.

**Reduced motion (`prefers-reduced-motion: reduce`):**
- The controller never starts.
- Scenes render in **`static`** mode, showing the final "all systems active" composition next to the full list of beat texts.
- Stepped frames show their end state.
- Nothing moves, and all information remains.

**RTL:**
- Scene layers carry `data-mirror="true|false"`. Mirroring applies to geography-neutral layers: routes, flows and topology direction.
- Text layers and anything with inherent handedness (vehicles with visible text, device fronts) are **not** mirrored.
- Horizontal travel reverses under `[dir=rtl]`.

**Performance rules (enforced in code review and testing):**
1. Only compositor-friendly properties are animated: `transform` and `opacity`, plus `stroke-dashoffset` on small path counts (≤ 60 animated paths per scene). No animated `filter`, blur, box-shadow, width, height or top/left.
2. One `rAF` loop per page at most, running only while a scene intersects the viewport. Scroll listeners are passive.
3. Scenes below the fold use `content-visibility: auto` with `contain-intrinsic-size`. The scene controller is loaded with `dynamic(() => import(...), { ssr: false })`, **only on pages that contain a scene**.
4. **Budgets:**
   - ≤ 30 KB gzipped SVG per scene (Rich scenes ≤ 45 KB)
   - ≤ 3 KB gzipped controller JS (shared)
   - 0 additional web fonts
   - Optional photography layers ≤ 350 KB total (AVIF) for the Smart Building upgrade
5. The scene is never the LCP element. The solution hero image or headline is the LCP.
6. **CLS = 0:** scene dimensions are reserved in CSS for every mode.
7. INP is unaffected, because scenes do no work on input events.
8. **Low-power heuristic:** where `navigator.connection.saveData` is set or `deviceMemory ≤ 2`, scenes fall back to `stepped` even on desktop.

### 23.6 Solution-specific storytelling: per-solution analysis

Every concept is grounded in the **approved copy for that solution**. Scene labels use only approved terms. **No invented data** (no fake numbers, speeds, camera counts or timestamps) appears inside scenes. Status cues are symbolic: an active node or a highlighted zone.

| Solution | Classification | Approved concept it visualises (source) | Why this intensity |
|---|---|---|---|
| Mobile NVR & Mobile Surveillance | **Rich, pinned scroll scene** | "Security That Moves With You." + the six pillars Video / Location / Connectivity / Monitoring / Intelligence / Management + "Video + Location + Connectivity + Data + Intelligence" (`01` §07–08) | The key differentiator, and its concept is inherently about *movement*, which static images can't convey |
| Smart Building & Home Automation | **Rich, pinned scroll scene** | "Spaces That Understand How They Are Used." + the integrated systems list + "Comfort • Efficiency • Control • Security • Experience" (`01` §14) | The concept is about an environment *responding*; change over time is the message |
| ELV Systems | **Rich (moderate length), pinned** | "Multiple Systems. One Infrastructure." + the four principles Coordination / Integration / Reliability / Scalability (`01` §12) | It literally depicts the brand thesis of many systems becoming one |
| CCTV & Security Systems | **Moderate, 3-beat stepped scene** | "See More. Know More. Respond Better." + centralized and multi-site monitoring (`01` §09) | Three verbs map naturally to three beats; a long pin is unnecessary |
| Access Control | **Moderate, 3-beat stepped scene** | "who enters, where they enter, and when" + zones and credentials (`01` §10) | The approved sentence *is* a 3-part story |
| Fire Alarm Systems | **Moderate, restrained, 4-beat in-view sequence** | "Technology with a Critical Purpose": Fire Detection → Alarm & Notification → System Integration → Testing & Commissioning / Documentation (`01` §15) | A serious subject: calm, sequential, no drama, **no flashing** |
| Networking & ICT | **Subtle, in-view topology build** | "The Infrastructure Behind Every Connected Environment." + "not only around today's requirements, but … tomorrow" (`01` §11) | An infrastructure concept that is best shown as structure; a quiet build is more credible than spectacle |
| Audio Visual | **Subtle, a single scroll-scrubbed transition** | "Make the technology disappear into the experience." (`01` §13) | The approved idea *is* restraint, so the motion itself disappears |

No solution is left as fully static: each has an approved concept that a small, meaningful motion clarifies. The subtle scenes, though, are nearly static by design, and all of them have static reduced-motion states.

#### 23.6.1 Mobile NVR: "Route" (Rich)
- **Artwork:** a charcoal plan-view city grid in hairline linework (roads, blocks), a depot, a central management node, and a single vehicle symbol.
- **Desktop (pinned, 6 beats plus a coda):**
  1. **Video:** the route draws; the vehicle appears; four short camera-coverage wedges open around it (interior/exterior), shown as grey fills that turn gold at their edges.
  2. **Location:** the vehicle travels along the route with progress; location markers leave a dotted trail.
  3. **Connectivity:** signal arcs pulse from the vehicle to network points along the route. They are labelled with approved terms only: "4G/5G Connectivity", "Wi-Fi Communication".
  4. **Monitoring:** a connection seam extends from the vehicle to the management node, which "opens" a simple frame symbol labelled "Remote Live Viewing / Remote Video Playback".
  5. **Intelligence:** one zone along the route is outlined in gold, with the label "Emergency & Event Alerts". There are no fake incident details.
  6. **Management:** further vehicle symbols appear on other routes and all connect to the management node ("Centralized Fleet Monitoring").
  7. **Coda:** the typographic equation "Video + Location + Connectivity + Data + Intelligence" is assembled from the pillar names.
- **Tablet:** the same scene in `stepped` mode, using a 3:4 crop of the artwork per beat.
- **Mobile:** `stepped`. Six frames with the vehicle centred in each, a local animation per frame on entry, and a sticky mini-progress bar of 6 ticks at the top of the scene section, marking the position in the sequence.
- **Reduced motion:** the full final composition (all routes, the node, the zone), followed by the six pillar blocks as text.
- **RTL:** route travel reverses and labels are right-aligned. The vehicle glyph is symmetric, so it is not mirrored.
- **Fallback (no JS):** the same as reduced motion.
- **Assets:** SVG only (≤ 45 KB gzipped). The photography slots (`SOL-MNVR-HERO`, `SOL-MNVR-FLEET`) are separate.

#### 23.6.2 Smart Building & Home Automation: "Responsive Space" (Rich)
- **Artwork (v1, SVG):**
  - An architectural *section* drawing of a contemporary interior (living area, meeting space and entrance), in linework on Charcoal.
  - Separate layers for the approved systems: Lighting Control, Climate Control, Curtains & Shading, Security Systems, Access Control, Audio Visual, and Smart Interfaces (a wall panel and a mobile).
  - **Lighting** is rendered as soft *light pools*: shaped radial fills in gold at low opacity. They are functional (they *are* light), not decorative gradients.
- **Desktop (pinned, 5 beats that follow the approved closing words):**
  1. **Comfort:** the scene starts in "evening"; lighting zones fade up zone by zone and the climate indicator settles.
  2. **Efficiency:** the unoccupied zones dim and the shading lowers.
  3. **Control:** a gold signal travels from the smart interface (wall panel or mobile) to each system. This is *centralized management*.
  4. **Security:** the entrance access point and the security layer become visible.
  5. **Experience:** the AV zone activates, and all systems show as one coordinated environment (every connection gold).
- **Optional upgrade [DEP D-21]:**
  - Replace the SVG base with **matched real photography**: 3–5 exposures of the *same* real interior taken from a locked-off tripod (ambient, lights on per zone, shades down).
  - The exposures are crossfaded by scroll, and SVG annotation lines stay on top.
  - Budget: ≤ 350 KB AVIF total, lazy-loaded when the scene is within 1 viewport.
  - This needs a real project shoot. **No renders.**
- **Tablet and mobile:**
  - `stepped`, with 5 frames.
  - On mobile the section drawing is cropped to one room per beat.
  - The light-pool opacity animates only within the active frame.
- **Reduced motion:** the final "all active" state plus the five words as text blocks.
- **RTL:** layers are mirrored, except the text and the wall-panel UI glyph.

#### 23.6.3 ELV Systems: "One Infrastructure" (Rich, moderate length)
- **Artwork:** a vertical building cross-section showing several floors. It deliberately differs from the Smart Building interior and the home diagram.
- **Desktop (pinned, 4 beats):**
  1. **Coordination:** separate grey system "strands" are drawn per floor, one per ELV system, taken only from systems named in the approved solutions (CCTV, access control, networking, AV, fire alarm, automation). They then align into ordered risers.
  2. **Integration:** gold connections appear between strands where they interact.
  3. **Reliability:** the backbone riser is reinforced with a second, redundant path drawn in parallel.
  4. **Scalability:** a new floor or segment is added to the section, and its strands connect seamlessly to the existing backbone.
- **Mobile:** `stepped`, with 4 frames cropped to 2 floors each.
- **Reduced motion:** the final state plus the four principles as text.

#### 23.6.4 CCTV & Security Systems: "See · Know · Respond" (Moderate)
- **Artwork:** a plan view of one site, plus two smaller sites and a monitoring node.
- **Beats (stepped on every breakpoint; sticky artwork on desktop only for 3 short beats):**
  1. **See:** camera positions on the site plan open their field-of-view cones, and the coverage overlaps become visible.
  2. **Know:** one area is outlined as an analytics zone ("Intelligent Video Analytics"), and the perimeter line highlights ("Perimeter Surveillance").
  3. **Respond:** the feeds from all three sites flow to the monitoring node ("Centralized Monitoring", "Multi-Site Surveillance").
- **Mobile:** 3 frames.
- **Reduced motion:** the final state.

#### 23.6.5 Access Control: "Who · Where · When" (Moderate)
- **Artwork:** concentric security layers in plan view (site perimeter → building → secured area), with an entry for a person and one for a vehicle.
- **Beats:**
  1. **Who:** a person symbol reaches an entry. Credential options appear as small labelled glyphs: Card & Credential Access, Biometric Authentication, Mobile Credentials. The entry state switches to gold (granted).
  2. **Where:** the permitted zones light up progressively, while the secured area remains grey (not permitted).
  3. **When:** a simple day-segment track (no fabricated times) indicates Time & Attendance / scheduled access, and the CCTV Integration link connects the checkpoint to a camera symbol. A vehicle passes the barrier ("Vehicle Barriers").
- **Mobile:** 3 frames. **Reduced motion:** the final state.

#### 23.6.6 Fire Alarm Systems: "Critical Sequence" (Moderate, restrained)
- **Artwork:** a single-floor plan with detectors, a control panel, and notification devices.
- **Beats (`inview`, played sequentially once per beat as it enters; no pin):**
  1. **Fire Detection:** one detector activates. Its state changes to gold with a steady (non-blinking) ring.
  2. **Alarm & Notification:** the signal travels to the panel and then to the notification devices on the floor.
  3. **System Integration:** the panel connects to an "Integrated systems" node. This is generic; no specific actions are claimed.
  4. **Testing & Commissioning · Documentation:** the drawing settles into an "as-built" state with a document glyph, representing disciplined implementation.
- **Constraints:**
  - **No flashing at any rate** (WCAG 2.3.1).
  - No red and no flames. Gold is used for "active", consistent with the site.
  - Calm easing, and short: the whole sequence takes about 1 viewport.
- **Mobile:** the same sequence, stacked. **Reduced motion:** the final state.

#### 23.6.7 Networking & ICT: "Topology" (Subtle)
- **Artwork:** a layered topology (core → distribution → access → devices) over a faint building footprint.
- **Motion:**
  - On entry, the layers draw from the core outward, scroll-scrubbed within the section's own height with no pin.
  - Then **one** slow signal pulse travels a single path, representing that "today's" network carries traffic.
  - At the end, dashed "future" branches appear, representing "technologies that may depend on them tomorrow".
- **Mobile:** the same, simplified to 3 layers. **Reduced motion:** the fully drawn topology.

#### 23.6.8 Audio Visual: "Disappear" (Subtle)
- **Artwork:** an elevation drawing of a meeting room: a display, a camera, microphones, speakers, and a control panel.
- **Motion:**
  - As the section scrolls through the viewport, the technology linework is drawn in gold and labelled with approved terms (Video Conferencing, Professional Displays, Professional Audio, Control Systems).
  - It then **recedes to 15 % opacity** while the room and its people (simple figure outlines) remain.
  - The approved line "Make the technology disappear into the experience." resolves at the end.
- **Mobile:** the same, as a 2-state crossfade. **Reduced motion:** a two-panel static comparison (with, then receded).

#### 23.6.9 Homepage signature: "Integration System" (Rich, `inview` on desktop, stepped on mobile)
- **Artwork:** the 8 solutions as nodes on an engineered "bus" line: a horizontal architectural rail on desktop, and a vertical spine on mobile.
- **Motion:**
  - On entry, the rail draws.
  - Each node activates in sequence, giving an overall sense of "one technology partner, multiple capabilities".
  - Hovering or focusing a node shows its approved one-line summary and link.
  - The keyboard reaches the nodes as a list.
- **Reduced motion:** a static labelled diagram.
- This scene is the only rich motion on the homepage besides the hero reveal. The Mobile NVR chapter on the homepage uses photography plus a **seam-draw of the equation only**, deliberately *not* a copy of the full solution scene, so the solution page stays special.

**Scene authoring workflow [DEC]:**
1. Concept storyboards: 1 frame per beat, made in the design phase and reviewed with the client.
2. SVG artwork is drawn by the designer or front-end team in Figma or Illustrator to a **scene spec sheet**. The sheet gives the layer names, `data-beat` tags, stroke weights (1 px or 1.5 px), the palette tokens used as `currentColor` or CSS variables, and the artboard 1440 × 900 with mobile crops.
3. Export through SVGO (keeping IDs and data attributes), then inline it as a server component.
4. Build a Storybook-free **scene lab** at `/[locale]/_lab/scenes`, available in preview only, to scrub each scene with a slider in all modes, including reduced motion and RTL.

---

## 24. Image Strategy

1. **Real only** [REQ]: Vision Plus project photography, team and office photography with consent, and licensed partner media. No stock and no AI generation, whether paid or free.
2. **Art direction (brief for the designer and photographer):**
   - charcoal architecture, dusk and night light, warm linear light sources, and precise framing
   - real installed technology in context
   - people shown working, not posing
   - grading toward Option B neutrals, with warm gold highlights allowed where light naturally exists
3. **Illustration vs photography split:**
   - **Photography** shows *reality*: heroes, projects, industries, services and journey.
   - **SVG technical linework** shows *how systems work*: scenes and diagrams.
   - Both are needed, and they never impersonate each other.
4. **Responsive delivery [DEC, zero-cost]:**
   - Masters are processed at **build time** by a sharp-based script into AVIF and WebP at the widths `[390, 640, 828, 1080, 1280, 1620, 1920, 2400, 2880]`, capped at the master width.
   - A `<Picture>` component outputs `srcset` and `sizes` from the grid spans, `width`/`height` for zero layout shift, `object-position` from the focal point, `<source media>` for separate mobile art, and `loading="lazy"` except for the LCP image (`fetchpriority="high"`).
   - No paid image CDN and no runtime transformation; see §42 for why.
5. **The placeholder system** is designed and consistent (manifest §5), and production gates check it (§12.3).
6. **Alt text:**
   - Descriptive alt text is required for every content image in all published locales.
   - Decorative images and scene artwork are `alt=""`/`aria-hidden`, because scenes carry their meaning in DOM text.
   - Logos use the partner name.

## 25. Image Asset Manifest (summary)

The full, designer-ready manifest is in [`IMAGE_ASSET_MANIFEST.md`](./IMAGE_ASSET_MANIFEST.md), with a CSV copy.

- It has **69 fixed slots**: P0 × 1 (the logo), P1 × 35, P2 × 28 and P3 × 5.
- It adds **4 per-item families**: project cover, hero and gallery, plus partner logos.
- There are **11 layout families** (F1–F11), with dimensions derived from the grid formula.
- Solution scenes are **SVG artwork, not photo slots**. They are specified in §23.6 and tracked as design deliverables (Phase 4), not as manifest images. The exception is the optional Smart Building photography layers (D-21), which will be added to the manifest as `SOL-SMART-SCENE-{01..05}` (F1 ratio, 2880×1800, *identical framing*) if the client opts in.

---

## 26. Page-by-Page UX Specification

Notation: D = desktop (≥ 1024), T = tablet (768–1023), M = mobile (< 768). "Copy" references are to `01` Approved Content unless stated otherwise.

### 26.1 Home (`/{locale}`)
| # | Section | Content (source) | Layout D / T / M | Motion | Images |
|---|---|---|---|---|---|
| 1 | **Hero** (charcoal) | "Connected by Technology. Driven by Intelligence." / "Integrated Technology & Systems Solutions" / "QATAR • EGYPT" (§01). CTAs: *Explore solutions* and *Request a consultation*. | **D:** full-bleed image, headline at the inline-start bottom, set in `display-xl` across 7 columns; the gold seam runs from the headline to the viewport edge. **T:** the same, with the headline across 8 columns. **M:** 4:5 image on top, then the headline block on charcoal below it, with CTAs stacked full-width. | A mask reveal of the image (700 ms) with the seam drawing, running once. | `HOME-HERO` (F1) |
| 2 | **Positioning** (light) | "Built on Experience. Driven by What's Next." plus "What defines us is not how many technologies we provide, but how effectively we make them work together." plus the closing "Make technology work intelligently, reliably, and as one." (§02) | **D:** 7/5 split, with the statement in `display` and the image in 5 columns offset down 96 px. **M:** statement, then the image. | None | `HOME-STATEMENT` (F4) |
| 3 | **Integration system** (light) | "One Technology Partner. Multiple Capabilities." plus the lede (§06) and 8 nodes with approved summaries | **D:** the horizontal rail diagram across the full container. **T:** a 2-row rail. **M:** a vertical spine of 8 rows, each linking to its solution. | §23.6.9 | — (SVG) |
| 4 | **Mobile NVR chapter** (charcoal) | "Security That Moves With You." plus the first 2 paragraphs (§07), the equation (§08), and the 9 applications as a quiet inline list. CTA: *Explore Mobile NVR*. | **D:** half-bleed image (F3) at the inline-end, with text across 5 columns. **M:** image, then text. | A seam-draw of the equation only | `HOME-MNVR` (F3) |
| 5 | **Approach** (light) | "From Requirement to Lifecycle." plus 8 steps (§17), ending with "Understand. Design. Deliver. Integrate. Support." | **D:** a horizontal 8-node process track, where the step titles are always visible and the step descriptions sit below. **T:** a 4×2 layout. **M:** a vertical track. | The gold progress seam fills with scroll (scrubbed within the section; no pin) | — |
| 6 | **Industries index** (off-white) | "Different Environments. Different Challenges. One Engineering Approach." plus 11 industries with approved lines (§18) | **D:** the index list on the inline-start (7 columns) and a sticky 4:5 image panel (5 columns) that swaps on hover or focus. **M:** a plain list with a small 4:5 thumbnail per row. | Index reveal | `IND-*` (F5) |
| 7 | **Why Vision Plus** (light) | "We Think Beyond the Equipment." plus 8 points (§19) | **D:** an editorial 2-column list with hairline separators and the headline sticky at the inline-start. **M:** a stacked list. | None | — |
| 8 | **Projects preview** | "Technology in Action." (§22) plus 2–3 published projects | **D:** 1 large project and 2 small. **M:** a horizontal snap list. **Hidden in production when no projects are published.** | None | `PROJ-*-COVER` |
| 9 | **Partners** | "Strong Solutions Start with the Right Technology." plus "The Right Technology. For the Right Application." (§21), and a logo marquee | A full-width marquee with a pause control. **Hidden when no confirmed partners exist.** | Marquee (static under reduced motion) | `PARTNER-*` |
| 10 | **Journey strip** | "Qatar 2017 → Egypt 2021 → Building What's Next." (§03) | A 3-node horizontal timeline (vertical on mobile), linking to About | Seam draw | `ABOUT-JOURNEY-2017/2021` (optional) |
| 11 | **Closing CTA** (charcoal) | "Technology Is Everywhere. Making It Work Together Is What Matters." (§24). CTA: consultation. Plus two office mini-blocks (placeholders). | Centred statement band | None | `HOME-CLOSING` (F6, optional) |

### 26.2 Solution detail (`/solutions/[slug]`): shared skeleton, bespoke scene
| # | Section | Notes |
|---|---|---|
| 1 | **Hero** | Breadcrumb, solution name (h1), approved headline (`display`) and the approved opening paragraph. Below it, a full-bleed F2 image band. On mobile, the image comes first, then the text. |
| 2 | **Context** | The remaining approved body paragraphs, set across `container-narrow` with a split image (`SOL-*-DETAIL`) on desktop. |
| 3 | **Scene** | The solution-specific scene (§23.6), with its intensity per classification. It is always followed by, or interleaved with, the approved beat texts. |
| 4 | **Capabilities** | The spec list of approved capabilities, with its approved intro ("Our capabilities include:", "Solutions can incorporate:", and so on). |
| 5 | **Solution-specific module** | Mobile NVR: 9 Applications plus the `SOL-MNVR-FLEET` band. ELV: principles (if not already covered in the scene). Smart Building: the 5-word strip. Fire: the standards statement ("…applicable standards, and relevant authority requirements."). AV: the closing line. CCTV: the "From individual facilities…" statement. Access: "who enters, where they enter, and when." Networking: "We design networks not only around today's requirements…" |
| 6 | **Delivered through our lifecycle** | The compact 8-step approach track, linking to Services |
| 7 | **Related** | Industries (§12.4), product categories (if enabled), projects (if published), and 2 neighbouring solutions |
| 8 | **CTA band** | "Request a consultation" pre-filled with this solution. The headline is team microcopy (`draft`, for approval), for example "Discuss your {solution} requirements." |

### 26.3 Solutions hub (`/solutions`)
- **Hero:** "One Technology Partner. Multiple Capabilities." plus the lede (§06), with `SOL-HUB-HERO`.
- **Index:** the 8 solutions as large index rows: name, approved summary, a card image revealed on hover or focus (on mobile the thumbnail is always visible), and a link. Mobile NVR comes first with a "Featured" marker.
- **Integration statement:** the approved line "Make technology work intelligently, reliably, and as one." together with the ELV "Multiple Systems. One Infrastructure." teaser.
- **Approach teaser**, then the **CTA**.

### 26.4 Industries (`/industries`)
- **Hero:** "Different Environments. Different Challenges. One Engineering Approach." with `IND-HUB-HERO`.
- **Discovery pattern [REC] (not a grid):**
  - **D:** a *master–detail explorer*. The inline-start is a sticky list of 11 industries; the inline-end is the detail panel with a 4:5 image, the approved description, related solutions (links), related projects (if any) and a CTA. Selecting an industry updates the URL hash (`#banking-finance`).
  - **Without JS**, it renders as 11 stacked anchored sections, which is the SSR baseline, so all content is crawlable.
  - **M:** 11 stacked sections with a sticky chip index.
- The closing CTA pre-fills the industry.

### 26.5 Services (`/services`)
- **Hero:** "Technology Requires More Than Products." plus "The performance of any system depends on how it is designed, implemented, integrated, and supported." (§16), with `SRV-HUB-HERO`.
- **Lifecycle map:** the 8-step Approach (§17) as the page's organising spine: a sticky process track on desktop, highlighting the current step as you scroll.
- **The 6 services** as alternating split-editorial sections (`SRV-*`). Each carries a small "Stages: Understand · Design" marker linking it to the approach steps. This mapping is [REC, derived] and needs approval:
  - Consultancy → Understand, Design, Select
  - PM → Deliver
  - Install → Deliver
  - Test & Integration → Integrate, Verify
  - Training → Enable
  - Maintenance → Support
- **Closing:** "Understand. Design. Deliver. Integrate. Support.", then the CTA.
- Anchors cover each service and `#approach`. The sitemap aliases (Site Survey, Product Selection, and so on) map to anchors (§9.2).

### 26.6 Products (`/products`): see §9.3
- **Hero:** there is no approved headline. We propose reusing the approved partner line "The Right Technology. For the Right Application." (§21) [REC, derived], with `PROD-HUB-HERO`.
- **Category index:** 7 rows, each with the category name, an approved description only where one exists, the brands (if confirmed), the related solution and an *Ask about this category* button. `PROD-*` images are optional (P2).
- **Explanation band:** "Our technology-independent approach allows us to evaluate solutions according to the needs of each project…" (§21).
- **CTA:** a product inquiry.

### 26.7 Projects (`/projects`, `/projects/[slug]`)
- **Hub:**
  - "Technology in Action." plus "Every project represents a different operational challenge." (§22), with `PROJ-HUB-HERO`.
  - **Filter bar:** Sector, Solution and Country, each a single-select `<select>` on mobile and segmented chips on desktop. The bar renders **only when ≥ 6 projects are published**, and each filter only when it has ≥ 2 values.
  - Results are a 2-column grid of project cards (1 column on mobile), and the URL query syncs.
  - The empty state is team microcopy with a reset button.
- **Detail:**
  - Hero (F2), then a **facts table**: Location, Client / Sector, Solutions Delivered (links), Completion Year.
  - Then **Scope of Work** (prose or list), a **gallery** (F8, lightbox with keyboard, swipe and captions), related solutions, the next project and a CTA.
- If the client cannot name a client for confidentiality reasons, the field renders the sector only ("Confidential client, Banking & Finance"). This is an option per project (D-10).

### 26.8 About (`/about`)
In-page index, then:
1. **Who we are:** the full §02 text, with `ABOUT-HERO`.
2. **Journey:** 2017 | Qatar → 2021 | Egypt → Today (§03), as a horizontal timeline with photos (F7) and a seam draw. It closes with "Qatar 2017 → Egypt 2021 → Building What's Next."
3. **Vision:** "To Make Technology Work as One." (§04).
4. **Interlude:** `ABOUT-VISION` (F6).
5. **Mission:** "From Requirement to Reality — and Beyond." (§05), with its closing line in `display`.
6. **Values:** "Think before we build" plus the 7 values (§20). They are *not* cards: a two-column editorial list with the title as H3, the subtitle as `lede` and the body as `body`.
7. **Philosophy:** "Technology Should Solve Complexity, Not Create It." plus the four closing lines (§23), with `ABOUT-PHILOSOPHY`.
8. **Why Vision Plus:** 8 points (§19). The homepage shows a compact version.
9. **Links out:** Technology Partners and Company Profile, as two large link blocks.

### 26.9 Partners (`/partners`)
- **Intro:** the approved §21 text.
- **Logo grid:** logo plus name in uniform cells (240×96 logo box, name below). Logos are monochrome by default and switch to colour on hover or focus if the client prefers (Q-13).
- The grid is alphabetical, optionally grouped by product category if D-09 supplies a mapping.
- **Until partners are supplied**, preview shows labelled placeholder cells and production hides the page from the navigation (Q-12).

### 26.10 Contact (`/contact`)
- **Hero:** there is no approved headline. We propose the team microcopy "Tell us what you need to achieve." (`draft`), which echoes "We start with what the client needs to achieve" (§19).
- **Inquiry form** (§30): 7/12 columns on desktop, full width on mobile.
- **Locations:** Qatar and Egypt blocks (5/12 columns, sticky on desktop). Each has the address, phone (`tel:`), email (`mailto:`), an optional hours field (only if supplied), **Get directions** (a Google Maps URL link) and a **click-to-load map** (§42.4).
- **Placeholders:** every value comes from `data/locations.ts`. In preview it renders `[Qatar office address — pending client]` in a placeholder style. **In production the build fails if a location value is still a placeholder** (D-01, D-02, D-03).

### 26.11 Company Profile (`/company-profile`): see §33
### 26.12 Privacy (`/privacy`)
The content comes from the client or their counsel (D-16), laid out as long-form prose with a table of contents.
### 26.13 404
Localized, typographic, and links to the key sections. There are no images.

---

## 27. Component Architecture

**Rules [DEC]:**
- **Server components by default.** A component becomes a client component (`'use client'`) only when it needs state, effects or browser APIs, and it must be a *leaf island*.
- **Components receive typed props and never import copy.** Pages call content loaders and pass data down.
- **Composition over configuration.** Sections are assembled from primitives. There is no "mega-component" driven by dozens of props.
- **Every component** has logical-property styles, an RTL story in the scene/design lab, and keyboard behaviour defined where it is interactive.

| Layer | Components | Client? |
|---|---|---|
| **Primitives** (`components/ui`) | `Button`, `LinkButton`, `TextLink`, `Icon` (with the directional-flip prop), `VisuallyHidden`, `Field`, `Input`, `Textarea`, `Select`, `Checkbox`, `RadioGroup` (segmented), `Tag`, `Spinner` | No, except the controlled form parts |
| **Layout** (`components/layout`) | `SiteHeader`, `DesktopNav` + `MegaPanel`, `MobileNavDrawer`, `LanguageSwitcher`, `SiteFooter`, `Container`, `Section` (surface + rhythm), `Breadcrumbs`, `SkipLink`, `InPageIndex` | `DesktopNav`, `MobileNavDrawer`, `LanguageSwitcher` and `InPageIndex` are small islands |
| **Media** (`components/media`) | `Picture` (build-time srcset), `ImageSlot` (registry lookup → `Picture` or `ImagePlaceholder`), `ImagePlaceholder`, `Gallery`, `Lightbox` | `Lightbox` only |
| **Motion** (`components/motion`) | `ScrollScene`, `SceneArtwork`, `SceneStep(s)`, `SceneProgress` (mobile ticks), `SeamLine`, `MaskReveal`, `useSceneController` (a single shared controller) | The controller only, loaded dynamically |
| **Scenes** (`components/scenes`) | `MnvrRouteScene`, `SmartSpaceScene`, `ElvInfrastructureScene`, `CctvScene`, `AccessScene`, `FireSequenceScene`, `NetworkTopologyScene`, `AvDisappearScene`, `HomeIntegrationScene`. Each is an inline-SVG server component plus its own CSS module of beat rules. | No (they use the shared controller) |
| **Sections** (`components/sections`) | Shared: `PageHero`, `StatementBand`, `SplitEditorial`, `IndexList`, `SpecList`, `ProcessTrack`, `PillarStrip`, `RelatedRail`, `CtaBand`, `Timeline`. Page-specific: `home/*`, `about/*`, `industries/IndustryExplorer`, `services/LifecycleMap`, `projects/ProjectFilters` | `IndustryExplorer`, `ProjectFilters` and the index hover reveal are islands |
| **Domain** | `partners/PartnerMarquee`, `partners/PartnerGrid`, `projects/ProjectCard`, `projects/ProjectFacts`, `company-profile/CanvaEmbed`, `contact/InquiryForm`, `contact/LocationCard`, `contact/ClickToLoadMap` | `PartnerMarquee` (pause control), `CanvaEmbed`, `InquiryForm`, `ClickToLoadMap` |
| **SEO** (`lib/seo`) | `buildMetadata()`, `JsonLd` (Organization, WebSite, BreadcrumbList, LocalBusiness ×2), `alternates()` | No |

**Client JavaScript per route (target, gzipped):**
- React plus the framework runtime (unavoidable)
- navigation islands ≈ 6 KB
- scene controller ≈ 3 KB, only on routes with a scene
- form ≈ 10 KB with Zod client-side, only on Contact
- Canva embed ≈ 2 KB, only on Company Profile

No motion library is shipped by default (§23.5).

---

## 28. Frontend Architecture

| Concern | Decision |
|---|---|
| Framework | Next.js 16.3.x App Router, React 19, TypeScript `strict` [DEC T-01]. This is the team's primary stack; it has first-class static generation and mature i18n (next-intl). |
| Output | **Static-first**: every page is prerendered at build time. See §42 for the final build and output mode chosen under the zero-cost constraint. |
| Styling | Tailwind CSS 4.3 with CSS-first `@theme` tokens (§20), plus CSS Modules only for scene beat rules (complex `calc()` chains read better in CSS files). The logical-property lint is enforced. |
| i18n | next-intl 4.x (§13) |
| Validation | Zod for content schemas (build time), the form schema (shared by client and server) and environment variables |
| State | No global state library. URL state is used for filters and the inquiry type. Local component state is used for disclosure and form UI. |
| Data | Local typed modules only (no runtime fetching of content) |
| Tooling | pnpm, ESLint (Next config, jsx-a11y, custom no-physical-direction rule), Prettier, TypeScript `--noEmit` in CI, Vitest, Playwright (Chromium is preinstalled in the dev container; WebKit and Firefox run in CI) |
| Error boundaries | `not-found.tsx` per locale. `error.tsx` exists only where a client island can fail (Canva, map, form), with a localized fallback. |
| Conventions | Kebab-case files, named exports, one component per file, co-located `*.test.ts`, and `@/` path alias |

---

## 29. Server/API Architecture

The site has **one** runtime endpoint. Everything else is static.

```
Browser (static page, /{locale}/contact)
   │  1. GET /api/contact/token            → Worker returns an HMAC-signed {issuedAt, nonce} token (time-trap)
   │  2. Turnstile widget (if it loads)    → token from challenges.cloudflare.com
   │  3. POST /api/contact  (JSON)         → Worker
   ▼
Cloudflare Worker  (worker/index.ts; runs ONLY for "/" and "/api/*"; all other paths are static assets)
   ├─ origin check (Origin/Referer ∈ SITE_ORIGINS)                    → 403 on mismatch
   ├─ method, content-type and size guard (≤ 16 KB)                   → 405/415/413
   ├─ Zod validation (the shared schema) + normalisation/sanitisation → 422 with field errors
   ├─ honeypot empty? form token valid and age ≥ 4 s and ≤ 2 h?       → a silent 200 "accepted" for bots (no processing)
   ├─ Turnstile siteverify (if a token is present) → verified | fallback
   ├─ rate limit: KV counter keyed by SHA-256(IP + salt), ≤ 5/hour, ≤ 20/day → 429
   ├─ build the submission {id: ULID, receivedAt, …fields, locale, sourcePath, verification}
   └─ POST → Apps Script web app (server-to-server, HMAC-signed body, 8 s timeout, 1 retry on 5xx/timeout)
            │
            ▼
Google Apps Script (owned by the client's Google account)
   ├─ verify HMAC signature + timestamp (±5 min) + replay cache (CacheService, 10 min)
   ├─ LockService → SpreadsheetApp append row          (the durable record)
   ├─ MailApp.sendEmail → CONTACT_RECIPIENT (Reply-To: visitor)
   ├─ on partial failure: email an ops alert to the OPS address (if mail works), and log it
   └─ return {ok, sheet: 'ok'|'failed', email: 'ok'|'failed'}
   ▼
Worker → Browser: {ok: true, reference: "VP-…"} | {ok: false, code}
```

**Why a Worker in front of Apps Script (not browser → Apps Script directly) [DEC] T-08:**
- Apps Script **cannot read request headers or the client IP**, so it cannot rate-limit per visitor or check the origin.
- Browser CORS to Apps Script is fragile: there is no preflight support and a 302 redirect on every response.
- `script.google.com` is blocked in mainland China, but the Worker calls it server-side.
- Secrets (the Turnstile secret, the HMAC key) stay on the server.
- The Worker adds no cost: form traffic is tiny against the 100,000 requests per day on the Free plan, and **static page views never invoke the Worker**.

**Why Apps Script rather than the Sheets API plus an email API [DEC] T-09:**
- **No Google Cloud project billing, no service-account JSON keys, and no email provider account.** New Workspace organisations may block service-account key creation by default, and Google has announced that Sheets API quota overages may become billable later in 2026.
- Apps Script sends mail *from Google's own infrastructure*, using the owning account. That gives good deliverability without DNS changes for a sending domain.
- The client owns the Sheet and the script in their own account, and it keeps working after handover.

The limits are documented in §31.

**Error handling contract:**

| Situation | HTTP | User sees (localized) | Logged |
|---|---|---|---|
| Validation error | 422 | Field-level messages | Count only |
| Bot (honeypot or too fast) | 200 (fake OK) | Success (no processing) | `spam.honeypot` / `spam.timing` |
| Rate-limited | 429 | "Too many requests from your network. Please try again later or email us directly at {email}." | `ratelimit` with the hashed IP |
| Turnstile failed (token present but invalid) | 403 | "We couldn't verify this submission. Please try again." | `turnstile.fail` |
| Apps Script: sheet OK, email failed | 200 | Success + reference | `delivery.email_failed` plus an ops alert |
| Apps Script: sheet failed, email OK | 200 | Success + reference | `delivery.sheet_failed`; the email body notes "NOT recorded in Sheet" |
| Both failed, or Apps Script unreachable after the retry | 502 | "Your message could not be sent. Nothing was lost on this page. Please try again, or contact us at {email} / {phone}." The form data is kept. | `delivery.failed` (error-level) |

---

## 30. Form Architecture

### 30.1 Fields (derived from the sitemap Contact items plus UX analysis)
| Field | Type | Required | Rules | Shown when |
|---|---|---|---|---|
| Inquiry type | Segmented radio | ✅ | `consultation` · `product` · `general` · `partnership` | Always (first) |
| Full name | text | ✅ | 2–100 characters, trimmed | Always |
| Company / organization | text | ✅ for consultation and partnership; optional otherwise | ≤ 120 | Always |
| Email | email, `dir=ltr` | ✅ | RFC-light regex, ≤ 254, lower-cased | Always |
| Phone | tel, `dir=ltr` | Optional | `+` and digits, spaces or dashes, 7–20 characters; no strict libphonenumber (weight) | Always |
| Project location | select | ✅ | `qatar` · `egypt` · `other` | Always |
| Industry | select | Optional | the 11 approved industries + `other` | consultation |
| Solution of interest | select | Optional | the 8 solutions + `services` + `not-sure` | consultation, general |
| Product category | select | Optional | the 7 categories | product |
| Message | textarea | ✅ | 10–3,000 characters; ≤ 3 URLs | Always |
| Consent | checkbox | ✅ | Must be true. The label links to Privacy (D-16). | Always |
| *Hidden:* locale, sourcePath, utm_source/medium/campaign (if present), formToken, turnstileToken, `company_website` (**honeypot**, visually hidden, `tabindex=-1`, `autocomplete=off`) | — | — | Server-validated | — |

**Pre-fill:** query parameters (`type`, `solution`, `category`, `industry`) set the initial values. The source CTA context is kept as `sourcePath`.

**Microcopy:** written by the team (`draft`, for D-18 approval) and localized.

### 30.2 Client-side behaviour
- Uses the same Zod schema as the server, imported from `features/contact/schema.ts`.
- Validation runs on blur and on submit. The first invalid field receives focus, and an error summary at the top (`role="alert"`) links to each field.
- The submit button shows a pending state ("Sending…") and blocks double submission.
- **Success:** the form is replaced in place with a confirmation panel: a heading, the reference `VP-XXXX`, the next step, and the office contacts. Focus moves to the panel heading.
- **Failure:** the form data is kept, a message is shown, and the alternatives are listed.
- **No JavaScript:** a `<noscript>` block tells the visitor that the form needs JavaScript and shows the office email and phone. Anti-spam verification needs JS; this trade-off is documented.

### 30.3 Server-side validation and sanitisation (Worker)
- The same Zod schema runs **strict** (unknown keys are rejected). Unicode is NFKC-normalised, control characters are stripped (except newlines in the message), and all fields are trimmed.
- Values are treated as **plain text end to end**:
  - The email HTML template escapes every value, and there is a plain-text part.
  - Sheet cells are written as strings. Any value starting with `= + - @` or a tab or CR is prefixed with `'` to prevent **formula/CSV injection**.

### 30.4 Localization and accessibility
- Every label, hint, error and status string lives in `messages/{locale}.json`, and the Worker returns error *codes*, not prose.
- Email and phone inputs are `dir="ltr"` in Arabic.
- Everything is keyboard-operable, with visible labels, `aria-describedby` hints and errors, `autocomplete` tokens (`name`, `organization`, `email`, `tel`), and a live region for the status.

### 30.5 Anti-spam (all free) [REQ addendum §16]
| Layer | Mechanism | Cost | Notes |
|---|---|---|---|
| 1 | **Honeypot** field | $0 | Bots are answered with a fake success |
| 2 | **Signed time token** (HMAC, issued by the Worker when the form is first focused) | $0 | Rejects submissions faster than 4 s and replays after 2 h |
| 3 | **Origin/Referer check** | $0 | Blocks cross-site posting |
| 4 | **Cloudflare Turnstile** (managed or invisible mode) | $0 (Free plan: unlimited challenges) | **Not supported in mainland China.** If the widget fails to load, the submission proceeds with `verification: "fallback"`, under stricter limits (≤ 2 per hour per IP) and a flag in the Sheet. |
| 5 | **KV rate limit** per hashed IP (5/hour, 20/day) | $0 (KV Free: 1,000 writes/day, more than enough for form volume) | It fails open if KV is exhausted; layers 1–4 still apply |
| 6 | Optional **WAF rate-limiting rule** on `/api/contact` | $0 (Free: 1 rule, fixed 10 s period, needs a proxied zone) | A burst shield, one dashboard toggle |
| 7 | **Apps Script** replay cache, global throttle (≤ 60/hour), and a duplicate check (same email + message hash within 10 min) | $0 | A final backstop behind the Worker |
| 8 | Content heuristics (URL count, length) | $0 | Validation-level |

---

## 31. Email Architecture

| Item | Decision |
|---|---|
| **Delivery mechanism** | Google Apps Script `MailApp.sendEmail()` inside the web app (§29) |
| **Sender** | The Google account that owns the script, with display name "Vision Plus Website". **Recommended:** a Google Workspace mailbox on the company domain (for example `website@<domain>`, D-14). With a consumer `@gmail.com` owner, the From address is that Gmail address. |
| **Recipient** | One address, `CONTACT_RECIPIENT` in Apps Script **Script Properties**. The placeholder is `inquiries@example.com` (D-04); no address is ever hard-coded in the repository. |
| **Reply-To** | The visitor's email, so the team replies directly |
| **Subject** | `[Website] {Inquiry type} — {Full name}{ · Company} ({Country})`, for example `[Website] Consultation — Ahmed Ali · ACME (Qatar)` |
| **Body** | An HTML table plus a plain-text alternative, **in English regardless of the visitor's locale** (the recipient team's language; the visitor's message is quoted as typed). Rows: Reference, Received (UTC and Doha time), Inquiry type, Name, Company, Email, Phone, Location, Industry, Solution / Product, Message, Website language, Page, UTM, Verification, Sheet status and a link to the Sheet. |
| **Authentication** | The Worker signs the payload with HMAC-SHA256 (`APPS_SCRIPT_HMAC_SECRET`) and Apps Script verifies it. There are no mail credentials anywhere in the website or the Worker. |
| **Limits** (verified 2026-09-25) | **100 recipients/day** on consumer Google accounts, and **1,500/day** on Google Workspace. Each inquiry uses 1 recipient (2 if an ops alert fires). The quota resets daily. **These are not unlimited.** At a realistic B2B volume (< 20/day) there is ample headroom. `MailApp.getRemainingDailyQuota()` is checked, and at < 10 remaining the script emails an ops warning. |
| **Failure handling** | The Sheet row is written first. If mail fails, the result reports `email: failed`, the Worker logs it, and the user still sees success, because the row exists. A **daily 08:00 Doha digest trigger** (optional, free) emails the owner any rows whose "Email status" = failed. |
| **Visitor auto-reply** | **Not enabled** [REC, Q-20]. It would double quota use and can be abused to send mail to arbitrary addresses. It can be enabled later with the same template system. |
| **Documented free alternatives** (not required) | Resend Free (3,000/month, 100/day, one verified domain, no card) or Brevo Free (300/day), called from the Worker. Each needs sender-domain DNS (SPF/DKIM). Use only if the client prefers not to use a Google account. |
| **Rejected** | Cloudflare Email Service `send_email`: the Free plan sends only to verified addresses (that would suffice), but it needs Email Routing MX records, which can conflict with the client's existing mail provider. |

---

## 32. Google Sheets Architecture

**Ownership:** the Sheet "Vision Plus — Website Inquiries" is created in the client's Google account (D-14) and shared with the team as Editor during the build. The Apps Script is **bound** to this Sheet (Extensions → Apps Script).

**Tab `Inquiries`: columns (row 1 frozen and bold, filters on)**

| Col | Header | Source | Notes |
|---|---|---|---|
| A | Reference | Worker | `VP-` + ULID (time-sortable, unique); also in the email |
| B | Received (UTC) | Worker | `YYYY-MM-DD HH:mm:ss` |
| C | Received (Doha) | Apps Script | Formatted in `Asia/Qatar`. Egypt staff can add their own view. |
| D | Inquiry type | form | Consultation / Product / General / Partnership (English labels) |
| E | Full name | form | |
| F | Company | form | |
| G | Email | form | |
| H | Phone | form | Stored as text, which preserves `+` |
| I | Project location | form | Qatar / Egypt / Other |
| J | Industry | form | Approved English name |
| K | Solution / product interest | form | Approved English name |
| L | Message | form | Plain text |
| M | Website language | form | en / ar / zh |
| N | Source page | form | Path, for example `/ar/solutions/access-control` |
| O | UTM source / medium / campaign | form | `source / medium / campaign` in one cell, empty if none |
| P | Verification | Worker | turnstile / fallback |
| Q | Consent | form | TRUE, with the privacy-policy version date |
| R | Email status | Apps Script | sent / failed |
| S | **Status** | *team (manual)* | Data-validation dropdown: New · Contacted · Qualified · Closed · Spam. Defaults to "New". |
| T | **Owner** | *team (manual)* | Free text |
| U | **Internal notes** | *team (manual)* | Free text |

Columns S–U turn the Sheet into a lightweight inquiry tracker without introducing a CRM or dashboard, which respects the no-CMS/no-admin rule. The script **only appends**. It never edits rows the team works on.

**Concurrency:** `LockService.getScriptLock()` with a 10 s wait wraps each `appendRow`.

**Setup procedure (documented in `docs/INTEGRATIONS_SETUP.md`, Phase 6):**
1. In the client's Google account, create the Sheet and add the headers (a provided `setup()` function creates them).
2. Open Extensions → Apps Script and paste the versioned script from `integrations/apps-script/Code.gs`, which is kept in the repository.
3. Under Project Settings → Script Properties, set `CONTACT_RECIPIENT`, `OPS_ALERT_EMAIL`, `HMAC_SECRET` (the same value as the Worker secret) and `SHEET_NAME`.
4. Deploy as a **Web app** with *Execute as: Me*, *Who has access: Anyone*. The endpoint is public, but every request must carry a valid HMAC signature, so unsigned requests are rejected.
5. Authorise the Sheets and Mail scopes when prompted. This is one-time; no billing account is required.
6. Copy the `/exec` URL into the Worker secret `APPS_SCRIPT_URL`.
7. Optional: add a daily time-driven trigger for `failedEmailDigest`.
8. Test from staging with the `pnpm test:integration:contact` script (§40), then remove the test rows.

**Separate staging Sheet [REC]:** a "Vision Plus — Website Inquiries (STAGING)" Sheet with its own script deployment and secrets, so tests never touch real leads.

**Script versioning:** the script source lives in the repository. Deployments are recorded (the version number and date) in `INTEGRATIONS_SETUP.md`. Every change creates a new deployment version, and the URL stays stable ("Manage deployments → Edit → New version").

---

## 33. Canva Embed Architecture

**Configuration (single source)** in `src/content/company-profile.ts`:
```ts
export const companyProfile = {
  embeds: {
    en: { src: 'https://www.canva.com/design/PLACEHOLDER/PLACEHOLDER/view?embed', aspectRatio: '16 / 9', status: 'placeholder' },
    ar: null,   // null → falls back to en and shows the notice "This presentation is available in English."
    zh: null,   // optional canva.cn source if Q-06 = mainland (D-27)
  },
  poster: 'CP-POSTER',                 // image registry ID (F11)
  pdf: null,                           // optional downloadable PDF path
  title: { en: '…', ar: '…', zh: '…' } // or use messages
} satisfies CompanyProfileConfig;
```

**The client pastes the HTML embed code into a helper**, `pnpm canva:parse "<html…>"`. It extracts only the `src` and aspect ratio, and **validates the host** (`www.canva.com` or `www.canva.cn`, path `/design/…/view`, `embed` parameter). Raw HTML is never stored or injected.

**Page experience (`/company-profile`):**
1. Intro (charcoal): the page title, one or two sentences of team microcopy (`draft`), and "QATAR • EGYPT".
2. **The presentation frame:**
   - Centred within the container at up to span 12 (1312 px), keeping the aspect ratio.
   - A 1 px `#3A3A3A` frame and a gold seam above it.
   - The poster image (`CP-POSTER`) shows first, with a **"View presentation"** button (click-to-load). This keeps the ~1 MB+ third-party iframe off the initial load and respects bandwidth and privacy.
   - After the click, the `<iframe loading="lazy" allow="fullscreen" allowfullscreen title="VISION PLUS Company Profile" referrerpolicy="strict-origin-when-cross-origin">` mounts.
   - A skeleton shimmer is shown while loading (static under reduced motion).
3. **Controls under the frame:**
   - **Open fullscreen**, using the Fullscreen API on the iframe wrapper.
   - **Open in Canva**, which opens `…/view` in a new tab (useful on mobile).
   - **Download PDF**, only if configured.
4. **Mobile:**
   - A 16:9 presentation on a 390 px screen is only 219 px tall, which is too small to read.
   - So on mobile the poster links primarily to **"Open presentation"** in fullscreen (or a new tab). The inline iframe remains available.
   - Landscape orientation is suggested with a small hint.
5. **Fallback:**
   - If the iframe fails to load within 15 s (for example if the network blocks canva.com), show the message "The presentation couldn't load here", with **Open in Canva** and the PDF (if any).
   - `<noscript>` shows the direct link.
6. **Security:** CSP `frame-src https://www.canva.com https://www.canva.cn`.
7. **Canva constraint (documented to the client):** embedding makes the design **public**, and edits in Canva update the website automatically, with no redeploy needed.

---

## 34. Partner Architecture

- **Data:** `src/content/data/partners.ts`:
  ```ts
  { slug: 'brand-x', name: 'Brand X', logo: { mono: '/images/partners/brand-x-mono.svg', color?: '/images/partners/brand-x.svg' },
    website?: 'https://…', productCategories?: ['cctv-surveillance'], status: 'confirmed' | 'placeholder' }
  ```
  - Required fields: `name`, `logo`.
  - Optional [REC]: `website` (adds a real outbound link), and `productCategories` (enables "brands we supply" per product category).
  - Descriptions are **not** planned [REQ: not mandatory].
- **Homepage marquee:**
  - Uses mono logos in a 160×64 box, optically normalised via per-logo `scale` metadata where needed.
  - Rows are duplicated for a seamless loop, and the duplicate is `aria-hidden`.
  - It is a `<ul>` list of `<li><img alt="{name}">`.
  - **Visible pause/play control**; it pauses on hover and focus.
  - Under reduced motion it becomes a static wrapped grid.
  - It is shown only when ≥ 4 confirmed partners exist; below that, a static row is shown.
- **Partners page:** a responsive grid (2, 3, 4 or 6 columns), with a logo and a name caption (`h3` visually styled as a caption), alphabetical, with no filters until there are more than 24 partners.
- **Production gate:** `placeholder` partners never render in production. The market brands in the PDF (p2) are **never** added without D-08 confirmation and permission.

---

## 35. Project Architecture

- **Data:** one file per project in `src/content/data/projects/<slug>.ts`, plus localized copy in `copy/<locale>/projects/<slug>.json`:
  ```ts
  { slug, status: 'placeholder' | 'published',
    location: { city?: string, country: 'qatar' | 'egypt' | 'other' },
    client: { name?: string, confidential: boolean }, sector: IndustrySlug,
    solutions: SolutionSlug[], completionYear: number,
    media: { cover: 'PROJ-<slug>-COVER', hero: 'PROJ-<slug>-HERO', gallery: string[] },
    featured?: boolean }
  // localized: name, summary, scopeOfWork (paragraphs | list), gallery captions/alt
  ```
- **Taxonomy:**
  - The sector uses the approved 11 industries. The sitemap's Residential, Commercial, Corporate, Hospitality and Industrial map onto them.
  - Solutions use the 8 approved solutions, and countries are Qatar, Egypt or Other.
- **Listing:** SSG with the complete list embedded. Filtering happens on the client over at most ~100 items, so no server is needed.
- **Sorting:** featured first, then completion year descending.
- **Filters:** shown only when useful (§26.7), synced to the URL, with an accessible live result count ("{n} projects").
- **Detail:** facts `<dl>`, scope, and a gallery with an accessible lightbox:
  - It is a dialog that traps focus and closes on Esc.
  - Arrow keys move between images, mirrored in RTL, and captions are included.
- **Placeholders:** 2 sample projects with `status: 'placeholder'` exist **only** to develop the templates. In preview they carry a visible "Sample layout — not a real project" banner, and production excludes them. They are never shown to the public.

---

## 36. SEO Architecture

| Area | Implementation |
|---|---|
| Metadata | `generateMetadata` per route and locale, with title template `%s — VISION PLUS` (the Arabic and Chinese templates are localized). Titles are ≤ 60 characters and descriptions ≤ 155, taken from `copy/<locale>/seo.json` and derived from approved copy. |
| Canonical | Self-referencing, absolute (`NEXT_PUBLIC_SITE_URL`), with no query strings |
| hreflang | `en`, `ar`, `zh-Hans` (final check, §15) plus `x-default` → `/en/...`. Only **published** locales are included, and the alternates are emitted in both `<head>` and the sitemap. |
| Sitemap | `sitemap.xml` generated at build time from the registries, excluding unpublished and placeholder entities, with `xhtml:link` alternates. Localized `lastmod` comes from the git commit date of the content file. |
| Robots | `robots.txt` allows all except `/_lab`. Preview and staging deployments get `Disallow: /` plus `X-Robots-Tag: noindex` (via `CONTENT_MODE=preview`). |
| Structured data | `Organization` (name, logo, url, sameAs = socials if D-17), `WebSite`, `BreadcrumbList` on every inner page, and `LocalBusiness` ×2 (Qatar and Egypt, **only once D-01/D-02 are real**, never with placeholder data). There are no `Product` or `Review` schemas, because no such data exists. |
| Open Graph / social | Per-page `og:title`, `og:description`, `og:locale` and `og:locale:alternate`. `og:locale` requires a language_TERRITORY value: `en_US`, `zh_CN`, and `ar_QA` or `ar_EG` (Q-23). OG images are **generated at build time** as typographic brand cards (1200×630, per locale, with the correct font per script), so no photos are fabricated. |
| Semantics | One `h1` per page, a strict heading hierarchy, landmark elements (`header`, `nav`, `main`, `footer`), `<address>` for offices, `<dl>` for facts, `<time>` for years |
| Internal linking | Relation rails, breadcrumbs, the mega menu, the footer, and in-copy links from industries and services to solutions |
| Images | Descriptive, localized alt text. File names are descriptive (the manifest). Dimensions are set, and `<Picture>` AVIF/WebP is used. |
| 404 | A localized `not-found`, returning a real 404 status. The Worker serves `/{locale}/404.html` with status 404 for unknown paths under a locale prefix. |
| Redirects | Alias 301s (§11) are in the Worker/`_redirects` |
| Search Console | Verified via a DNS TXT record (free). The sitemap is submitted. International targeting relies on hreflang. |
| Performance → SEO | See §37 (CWV "good" thresholds) |

---

## 37. Performance Architecture

**Targets (field p75, mobile):** LCP ≤ 2.0 s (the "good" threshold is 2.5 s), INP ≤ 150 ms, CLS ≤ 0.05. **Lighthouse (mobile, throttled) budgets per template:** Performance ≥ 90, Accessibility 100, Best Practices ≥ 95, SEO 100.

| Area | Strategy |
|---|---|
| Rendering | 100 % static HTML served from Cloudflare's CDN edge, with no per-request server rendering |
| JS | Server components by default; only islands hydrate (§27). **Per-route first-load JS budget: ≤ 130 KB gzipped** for the heaviest route (framework included), with CI failing on a > 10 % regression. |
| Scenes | §23.5 rules: CSS-driven, controller loaded only on scene routes, `content-visibility`, compositor-only properties, SVG budgets, and fallback to stepped mode on save-data or low-memory devices |
| Images | Build-time AVIF/WebP at the manifest widths, exact `sizes`, a width/height box, lazy by default, and `fetchpriority="high"` only for the LCP hero. Hero masters are compressed to AVIF target ≤ 250 KB (desktop) and ≤ 120 KB (mobile). |
| Fonts | Self-hosted, per-locale, subset. Latin (and Arabic on `/ar`) is preloaded; the CJK slices come on demand. `swap` + size-adjust. No more than 3 weights. |
| Third parties | **None on initial load.** Turnstile loads on Contact only, the Canva iframe on click only, the Maps iframe on click only, and analytics (optional) is a single deferred beacon. |
| Caching | Hashed assets (`/_next/static/*`, images) get `Cache-Control: public, max-age=31536000, immutable`. HTML gets `max-age=0, must-revalidate`, served from the edge. The Worker `/api/*` responses get `no-store`. |
| CSS | Tailwind v4 produces purged, per-build CSS (target ≤ 30 KB gzipped). Critical CSS is inlined by Next automatically. |
| Monitoring | Lighthouse CI on every PR (free GitHub Actions minutes). Optional Cloudflare Web Analytics (free) gives field CWV for real users. |

---

## 38. Accessibility Architecture

**Target: WCAG 2.2 AA** throughout. AAA contrast is met where the palette allows it.

- **Semantics and landmarks:** a skip link; a single `h1`; lists as lists; `<address>`, `<dl>` and `<figure>`/`<figcaption>`.
- **Language and direction:** `<html lang dir>` per locale. Embedded other-language fragments get `lang` (for example the brand in Latin inside Arabic).
- **Keyboard:** every interactive element is reachable in DOM order, which matches the visual order in RTL. The navigation follows the disclosure pattern. Dialogs (drawer, lightbox) trap focus and restore it. The marquee can be paused. No keyboard traps; scenes have no interactive-only content.
- **Focus:** a global visible ring (§20.9), never removed. `:focus-visible` is used for mouse users.
- **Colour:** the §22 rules (gold is never used as text on light surfaces, and never as the only indicator); all pairs are verified; non-text UI contrast is ≥ 3:1.
- **Motion:**
  - `prefers-reduced-motion` switches every scene to static, removes reveals and the marquee movement, and makes panel transitions instant.
  - **No flashing** anywhere (WCAG 2.3.1).
  - Auto-moving content has pause controls (2.2.2).
- **Scenes:** the SVG artwork is `aria-hidden`. The meaning lives in real DOM text (the beat steps), in reading order. Beat changes are **not** announced, so the page doesn't chatter.
- **Images:** alt text as in §24; decorative images `alt=""`; placeholders are `aria-hidden`.
- **Forms:** visible labels, the required indicator in text, an error summary with links, `aria-invalid`/`aria-describedby`, a status live region, and `autocomplete`. Turnstile's managed mode is accessible; the fallback path doesn't require solving a puzzle.
- **Target size:** ≥ 44×44 px for touch targets (48 px controls).
- **Zoom and reflow:** works at 400 % zoom and 320 px width without horizontal scroll, except for scene artwork, which scales.
- **Iframes:** Canva and Maps get `title` attributes, and click-to-load buttons have descriptive labels.
- **Testing:** axe-core in Playwright on every template × locale; manual screen-reader passes (NVDA + Firefox, VoiceOver + Safari macOS/iOS, TalkBack + Chrome) on key flows, including Arabic VoiceOver; keyboard-only walkthroughs (§40–41).

---

## 39. Security Architecture

| Area | Measure |
|---|---|
| Attack surface | Static files plus one Worker endpoint. No database, no auth, no admin and no CMS [REQ]. |
| Secrets | Held only in **Cloudflare Worker secrets** (`wrangler secret put`) and **Apps Script Script Properties**. None are in the repository, the client bundle or `NEXT_PUBLIC_*`. `.env.example` lists names only. Gitleaks/secret scanning runs in CI. |
| Worker ↔ Apps Script | HMAC-SHA256 over `timestamp + body`, a ±5-minute window, a nonce replay cache, and HTTPS only. The Apps Script URL is also kept secret, as defence in depth, not as the control. |
| Input handling | Strict Zod, size limits, normalisation, plain-text handling, HTML-escaping in email, and formula-injection neutralisation in the Sheet (§30.3) |
| Abuse | The §30.5 layers. Error messages are generic, with no stack traces, and codes are mapped to localized text. |
| Headers (via static `_headers`, and set by the Worker for `/api/*`) | `Strict-Transport-Security: max-age=31536000; includeSubDomains` (preload only after client consent) · `Content-Security-Policy` (below) · `X-Content-Type-Options: nosniff` · `Referrer-Policy: strict-origin-when-cross-origin` · `Permissions-Policy: camera=(), microphone=(), geolocation=(), fullscreen=(self "https://www.canva.com")` · `X-Frame-Options: DENY` + CSP `frame-ancestors 'none'` · `Cross-Origin-Opener-Policy: same-origin` |
| CSP | `default-src 'self'; script-src 'self' 'unsafe-inline' https://challenges.cloudflare.com https://static.cloudflareinsights.com; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self'; connect-src 'self' https://cloudflareinsights.com; frame-src https://challenges.cloudflare.com https://www.canva.com https://www.canva.cn https://www.google.com; form-action 'self'; base-uri 'self'; object-src 'none'; upgrade-insecure-requests` |
| CSP trade-off (documented) | A static export cannot use per-request nonces, and Next's inline bootstrap scripts need `'unsafe-inline'` (or build-time hashes). Hash-based CSP (`experimental.sri` or a post-build hash step) is evaluated in Phase 10. The risk is low: no user-generated content is ever rendered back into pages. |
| Privacy | Minimal fields, consent checkbox, privacy policy (D-16), no tracking cookies (cookieless analytics optional), click-to-load for Maps and Canva (no third-party cookies until the user acts), and IP stored only as a salted hash in KV with a TTL (never in the Sheet). The Sheet's access is limited to named client staff. |
| Dependencies | Minimal dependency set, `pnpm audit` in CI, Renovate or Dependabot (free) with weekly grouped updates, and a pinned lockfile |
| Supply chain | No third-party scripts except Turnstile (Contact only) and optional Cloudflare analytics |

---

## 40. Testing Strategy

| Level | Tool | Scope |
|---|---|---|
| Static checks | TypeScript strict, ESLint (jsx-a11y, the no-physical-direction rule, a custom rule banning Option A hex values), Prettier | Every commit |
| Content | `pnpm content:check`: Zod over all locale JSON and data; key parity across en/ar/zh; the status gate (§12.3); relation integrity (every slug referenced exists); length budgets | CI + pre-build |
| Assets | `pnpm assets:check`: manifest ↔ registry ↔ files, pixel dimensions and ratio (±1 %), alt text per published locale, P0/P1 presence in production | CI + pre-build |
| Unit | Vitest: form schema (valid, invalid and edge cases per locale), sanitisation and formula-injection guard, HMAC signing, the token time-trap, locale negotiation, the SEO helpers (alternates, canonical), the Canva `src` parser/validator, and the scene progress math | CI |
| Component | Vitest + Testing Library: navigation disclosure, drawer focus trap, language switcher path preservation, form states, marquee pause, industry explorer, project filters | CI |
| Worker | Vitest with Miniflare/`wrangler` unstable_dev: method/size/origin guards, validation errors, honeypot fake-OK, rate-limit 429, Turnstile verify (mocked), Apps Script success, partial failure and total failure paths, retry behaviour | CI |
| Apps Script | A `test_*` function suite run in the Apps Script editor against the **staging Sheet**: header setup, append, formula guard, HMAC reject, replay reject, quota warning | Phase 6 + before each script deployment |
| Integration (live staging) | `pnpm test:integration:contact` posts signed test submissions to the **staging** Worker → the staging Apps Script. It asserts the Sheet row appears (read back via a script test endpoint) and the email arrives at a test inbox, then cleans up. | Phase 6, pre-launch, after any integration change |
| E2E | Playwright (Chromium, WebKit, Firefox): key journeys J1–J8 (§6) in all 3 locales; nav and keyboard; Canva click-to-load and fallback; map click-to-load; 404; root locale negotiation; RTL mirroring assertions (computed `dir`, logical positions) | CI (Chromium on every PR; the full matrix nightly and pre-release) |
| Accessibility | @axe-core/playwright on every template × locale × 2 viewports (0 violations); manual SR and keyboard passes (§38) | CI + Phase 10 |
| Visual regression | Playwright screenshots of every template × {en, ar, zh} × {390, 768, 1440, 1920} × {default, reduced-motion}. Scenes are captured at beat checkpoints by setting `--p` deterministically through a test hook. | CI (on labelled PRs) + Phase 10 |
| Performance | Lighthouse CI (mobile) on key templates with budgets (§37); bundle-size check; WebPageTest (free) runs from Doha, Cairo and Hong Kong/Singapore before launch | CI + Phase 10 |
| SEO | Automated checks for: one `h1`, title and description length, canonical, hreflang reciprocity, sitemap validity, robots on preview vs production, JSON-LD validation (schema.org validator in CI) | CI |
| Motion | Per scene: reduced-motion static state renders all information; stepped mode on a 390 px viewport; no layout shift (CLS measured during a scroll-through); frame budget in the Chrome performance trace (≥ 55 fps on a mid-range Android profile, CPU 4× throttle) | Phase 5/10 |
| Browsers | Current and previous versions of Chrome, Edge, Firefox and Safari (macOS + iOS 17+), and Samsung Internet. Scene fallbacks are verified in Firefox (no scroll-timeline) and older Safari. | Phase 10 |

---

## 41. QA Strategy

1. **Definition-of-done gates per PR:** CI green (lint, types, content, assets, unit, component, Worker, a11y smoke, Lighthouse budgets) plus a preview deployment link for review.
2. **Template QA matrix:** every template is checked in 3 locales × 4 widths × reduced-motion on/off × keyboard-only, and tracked in `docs/QA_MATRIX.md` (created in Phase 10).
3. **Language QA:**
   - A native Arabic reviewer checks RTL layout, typography, bidi (phones, emails, brand), numerals and tone.
   - A native Chinese reviewer checks typesetting, line breaks, punctuation and terminology.
   - Both work on staging with a checklist, and issues are logged by URL + screenshot.
4. **Content proof:** the client's English copy sign-off (D-18) is checked against `01` for fidelity. A diff report lists every `derived` and `draft` string.
5. **Motion QA:**
   - Each scene is reviewed against its approved storyboard (D-20).
   - Criteria: purpose clear, beats legible, pace comfortable, reduced-motion state complete, mobile stepped version premium, no jank.
6. **Integration QA:** end-to-end submission from each locale and inquiry type reaches the staging Sheet (correct columns) and inbox (correct subject, Reply-To and escaping), including failure simulations (a revoked script, a quota warning).
7. **Pre-launch rehearsal:**
   - Deploy the production build to the production Worker on the `*.workers.dev` URL, which is not indexed, using production secrets pointed at the **real** Sheet.
   - Send 1 test submission per inquiry type, then delete those rows.
8. **Launch-day checklist** (§42.5), then **post-launch monitoring**, first at +1 hour and then at +24 hours (§42.7).

---

## 42. Deployment Architecture (zero-cost)

### 42.1 Vercel Hobby: the limitation, documented [REQ addendum §12]
| Step | Finding |
|---|---|
| 1. The limitation | Vercel's fair-use terms: *"Hobby teams are restricted to non-commercial personal use only. All commercial usage of the platform requires either a Pro or Enterprise plan."* Commercial use is defined as a deployment *"used for the purpose of financial gain of anyone involved in any part of the production of the project, including a paid employee or consultant writing the code."* (Vercel docs, fair-use guidelines; verified by search excerpt 2026-09-25.) |
| 2. What causes it | It is a **licensing / terms-of-service restriction, not a technical limit**. A company website promoting Vision Plus's services, built by a paid developer, is commercial use. Community guidance confirms static company sites are not exempt. |
| 3. Can the functionality be achieved without paying? | *Technically*, yes: the site would build and run on Hobby. *Contractually*, no: running it there would breach Vercel's terms and risk the deployment being suspended without notice, which is unacceptable for a production company site. Vercel Pro ($20 per deploying seat per month) would break the zero-paid-services constraint. |
| 4. Genuinely free alternative | **Cloudflare Workers with Static Assets (Free plan)**, where commercial use is permitted (no non-commercial clause). Details below. |
| 5. No hidden paid requirement | The recommended stack has **no** component that requires payment (§42.6). |

**Alternatives assessed:**

| Platform (free tier) | Commercial use | Fit | Verdict |
|---|---|---|---|
| **Cloudflare Workers + Static Assets** | Allowed | Unlimited static requests and bandwidth; Worker 100,000 requests/day (not consumed by static hits); 20,000 files, 25 MiB per file; Workers Builds 3,000 min/month; Turnstile, KV and WAF on the same account | ✅ **Recommended** |
| Cloudflare Pages | Allowed | Similar, but Cloudflare now directs new projects to Workers, and Pages Functions lack the Rate Limiting binding | ◻ Viable, not preferred |
| Netlify Free (credits) | No non-commercial clause, but positioned for "personal projects or prototypes" | 300 credits/month hard cap; **15 credits per production deploy** (~20 deploys/month would exhaust it); bandwidth 20 credits/GB | ✗ Too constrained for iterative deploys |
| Vercel Hobby | ✗ Prohibited | — | ✗ ToS |
| GitHub Pages | Intended for project/personal sites; no server endpoint | Would still need Cloudflare for the form | ✗ No benefit |

> **Client decision [Q-22]:** if the client nevertheless insists on Vercel, the only compliant options are Vercel Pro (paid, violating the zero-cost rule) or accepting a ToS breach. We do not recommend either. The static build is portable, so moving later is cheap (§42.2).

### 42.2 Recommended topology
```
GitHub repo (private, free) ──push──► Workers Builds (Git integration, free) or GitHub Actions + wrangler
                                          │  pnpm build  → next build (output: 'export') → out/
                                          │            → scripts/images (sharp → AVIF/WebP)
                                          │            → content/assets/i18n checks (fail = no deploy)
                                          ▼
Cloudflare Worker "vision-plus-web"  (wrangler.jsonc)
  assets: { directory: "./out", not_found_handling: "404-page", run_worker_first: ["/", "/api/*"] }
  bindings: KV "RATE_LIMIT", secrets (TURNSTILE_SECRET, FORM_TOKEN_SECRET, APPS_SCRIPT_URL, APPS_SCRIPT_HMAC_SECRET, IP_HASH_SALT)
  routes: custom domain  <domain>  and  www.<domain> → 301 to apex (or the reverse, per client)
Environments: "preview" (per-branch *.workers.dev versions, CONTENT_MODE=preview, noindex, staging Sheet)
              "production" (custom domain, CONTENT_MODE=production, real Sheet)
```
- **Portability:**
  - `out/` is plain static files.
  - The Worker's form logic is a Web-standard `(Request, env) → Response` module, `worker/contact.ts`.
  - Moving to another host means redeploying `out/` and adapting ~30 lines of glue.
- **Verify in Phase 3 (flagged, not assumed):**
  - `_headers` and `_redirects` support for Workers static assets.
  - `run_worker_first` array patterns.
  - If either is missing, the Worker applies headers and redirects itself for HTML routes. That costs Worker requests (100,000/day is still ample for this site's traffic), so it's documented as a fallback.

### 42.3 Domain and DNS (the client already owns the domain [REQ])
- **Requirement:** a Workers custom domain needs the domain's DNS zone to be on Cloudflare. Cloudflare's **Free plan** DNS is free; partial CNAME setup is a paid (Business) feature and **not** used.
- **Procedure (D-07):**
  1. Add the site to Cloudflare Free, which auto-imports existing DNS records.
  2. **Audit every record against the current DNS host**, especially mail: MX, SPF TXT, DKIM, DMARC, autodiscover and any verification TXT. Mail must be unaffected.
  3. Lower the TTLs at the current host 24–48 hours before the switch.
  4. Change the nameservers at the registrar.
  5. Wait for activation, then attach the custom domain to the Worker. TLS certificates are automatic and free.
  6. Add the Search Console TXT record.
  7. Keep the old DNS export as a rollback reference.
- **Risk R-08:** a mis-copied MX record would disrupt company email. Mitigation: the audit checklist, a paired review with the client's IT, and a switch outside business hours.

### 42.4 Maps: free approach [REQ addendum §14]
- **Per office** (D-03), with no API key and no billing:
  1. A **Google Maps "Share → Embed a map" iframe `src`** (`https://www.google.com/maps/embed?pb=…`), a consumer feature.
  2. A **"Get directions / Open in Google Maps" link** from the place's share URL, or `https://www.google.com/maps/search/?api=1&query=<encoded address or place>`.
- **Not used:** the Maps Embed API and the JavaScript API. They are free-with-limits but **require an API key and a billing-enabled Cloud project**, which is not acceptable as a hidden dependency.
- **UX:** a click-to-load map (poster `CONTACT-MAP-*`, or a neutral surface with the address) → an iframe with `title`. No Google request or cookies happen until the click.
- **Mainland China (Q-06):** Google is blocked there. The address text and the optional Amap/Baidu link (D-03b) are always visible, and the map remains optional.

### 42.5 Release, rollback and launch
- **Branching:** trunk-based on `main`, plus short-lived feature branches (the current working branch for this plan is `claude/confident-cori-lahb3k`). Every PR gets an automatic preview version.
- **Release:**
  - Merging to `main` builds and deploys to production after CI passes.
  - The production deploy is gated by the `CONTENT_MODE=production` checks, so an incomplete site *cannot* deploy.
- **Rollback:** Cloudflare keeps prior Worker versions, so rollback is one command or click (`wrangler rollback`) and takes seconds. Apps Script keeps prior deployment versions.
- **Launch checklist (Phase 11):**
  - DNS switched and verified, including a mail-flow test.
  - HTTPS, and apex↔www redirect.
  - Production secrets set.
  - Real Sheet connected; test submission per inquiry type, then cleaned up.
  - `robots.txt` in production mode.
  - Sitemap submitted; Search Console verified.
  - Analytics (if opted in).
  - Uptime monitor (optional).
  - 404 check.
  - Language negotiation from real browsers in `ar` and `zh`.

### 42.6 ZERO-COST / SERVICE COST MATRIX [REQ addendum §19]
| Service | Purpose | Required? | Free? | Free-tier limits (verified 2026-09-25) | Requires billing / card? | Recurring cost | Alternative | Final recommendation |
|---|---|---|---|---|---|---|---|---|
| **Hosting**: Cloudflare Workers + Static Assets | Serve the site + the form endpoint | ✅ | ✅ | Static: unlimited requests and bandwidth. Worker: 100,000 requests/day, 10 ms CPU/request. 20,000 files, 25 MiB/file. No SLA on Free. | No | **$0** | Cloudflare Pages (free); ~~Vercel Hobby~~ (ToS); Netlify Free (credit cap) | **Use** |
| **CI/CD**: Workers Builds or GitHub Actions | Build and deploy, run tests | ✅ | ✅ | Workers Builds 3,000 build-min/month. GitHub Actions free minutes on private repos (plan-dependent). | No | **$0** | Local `wrangler deploy` | **Use Workers Builds for deploys; GitHub Actions for tests** (monitor minutes) |
| **Source hosting**: GitHub | Repository | ✅ | ✅ | Free private repos | No | **$0** | — | **Use** (already in place) |
| **Domain** | Public address | ✅ | Owned by client | — | — | **$0** (already owned; renewal is the client's existing cost, outside project scope) | — | **Use existing** |
| **DNS**: Cloudflare Free | Required for the Workers custom domain | ✅ | ✅ | Free plan DNS, TLS and CDN | No | **$0** | Keeping the current DNS host is **not** possible with Workers custom domains on Free | **Move nameservers** (§42.3) |
| **CDN / TLS** | Edge delivery, HTTPS | ✅ | ✅ | Included | No | **$0** | — | **Included** |
| **Google Sheets** (via Apps Script) | Inquiry records | ✅ | ✅ | SpreadsheetApp within Apps Script quotas (runtime 6 min/execution, 30 simultaneous) — far above need | No (default Apps Script project; no Cloud billing) | **$0** | Sheets REST API + service account (free today; Google has flagged overage charges "planned later in 2026"; key creation may be blocked in new Workspace orgs) | **Apps Script** |
| **Email**: Apps Script MailApp | Notification to one recipient | ✅ | ✅ | **100 recipients/day (consumer Google account)**, **1,500/day (Workspace)** | No | **$0** | Resend Free (100/day, 3,000/month, no card, needs domain DNS); Brevo Free (300/day) | **MailApp**, owned by a Workspace account if available |
| **Anti-spam**: Turnstile | Bot challenge | ✅ (with fallback) | ✅ | Free: unlimited challenges, 20 widgets. **Not supported in mainland China.** | No | **$0** | hCaptcha free (third-party tracking concerns) | **Use**, with the fallback path |
| **Anti-spam**: honeypot, time token, origin check | Bot filtering | ✅ | ✅ | — | No | **$0** | — | **Use** |
| **Rate limiting**: Workers KV | Per-IP-hash throttling | ✅ | ✅ | KV Free: 100,000 reads/day, **1,000 writes/day** | No | **$0** | Workers Rate Limiting binding (GA; Free-plan availability unverified); WAF rule (Free: 1 rule, 10 s period) | **KV**, plus an optional WAF rule |
| **Maps**: Google Maps share-embed + Maps URLs | Two office maps + directions | ✅ | ✅ | Keyless consumer embed. Blocked in mainland China. | **No** (the Maps Embed API *would* require billing, so it is **not used**) | **$0** | OpenStreetMap embed (free, keyless) | **Google share-embed, click-to-load** |
| **Canva embed** | Company Profile presentation | ✅ | ✅ (a client Canva account; free plan supports embed) | The design becomes public when embedded | No | **$0** | PDF fallback | **Use** |
| **Fonts**: Google Fonts via `next/font` (self-hosted at build) | Typography | ✅ | ✅ (OFL licences) | — | No | **$0** | — | **Use** |
| **Images** | Hosting + optimisation | ✅ | ✅ | Static assets (25 MiB/file). Optimised **at build** with sharp (Apache-2.0). | No | **$0** | Cloudflare Images (paid beyond the free allowance) — **not used** | **Build-time pipeline** |
| **Animation** | Solution scenes, UI motion | ✅ | ✅ | In-house controller + CSS/SVG | No | **$0** | Motion (MIT) optional; GSAP (free "no-charge" licence) not needed | **In-house** |
| **Icons**: Lucide | UI icons | ✅ | ✅ (ISC) | — | No | **$0** | — | **Use** |
| **Analytics** | Traffic insight | ❌ Optional | ✅ | Cloudflare Web Analytics: free, cookieless, no consent banner needed | No | **$0** | GA4 (free; needs a cookie-consent banner) | **Optional:** Cloudflare Web Analytics if Q-18 = yes |
| **Uptime monitoring** | Alert if the site is down | ❌ Optional | ✅ | UptimeRobot Free: 50 monitors, 5-min interval (commercial use stated as allowed; re-check terms at setup) | No | **$0** | Cloudflare Health Checks (paid) — not used | **Optional** |
| **Error tracking** | Client/Worker error capture | ❌ Optional | ✅ | Sentry Developer: free, 5,000 errors/month, 1 user | No | **$0** | Workers logs + Apps Script execution log (built in) | **Not needed at launch**; built-in logs suffice |
| **Logs** | Operational visibility | ✅ | ✅ | Workers observability logs (free-tier retention limits apply; verify in Phase 3); Apps Script executions log | No | **$0** | — | **Use built-in** |
| **Search Console** | Indexing, SEO | ✅ | ✅ | — | No | **$0** | Bing Webmaster (free) | **Use** |
| **Dependency updates**: Dependabot/Renovate | Security updates | ✅ | ✅ | — | No | **$0** | — | **Use** |
| **Image generation** | — | ❌ **Prohibited** | — | — | — | — | Designer-created assets [REQ] | **Not used** |

**Total required recurring third-party cost: $0.**

Costs that remain outside this matrix and belong to the client:
- domain renewal (already owned)
- optional Google Workspace (if the client already has it)
- designer and photographer fees
- translation fees

### 42.7 Operations and monitoring (free)
- **Worker:** structured JSON logs (`event`, `reference`, `code`, `durationMs`; **no PII**). Free-tier log retention is short, so errors are also surfaced by the Apps Script ops-alert email.
- **Apps Script:** execution log, plus ops-alert emails on partial failure, low quota or an exception, plus the optional daily failed-email digest.
- **Optional:** an UptimeRobot 5-minute monitor on `/en` and on `/api/contact/health` (a GET health route that performs no side effects), and Cloudflare Web Analytics for traffic and CWV.
- **Ownership:** all accounts are client-owned with the team as members (D-14, D-22), and handover docs are provided (Phase 11).

---

## 43. Environment Variables

No secret is ever exposed to the browser. `NEXT_PUBLIC_*` values are compiled into static files, so they must be **public by nature**.

| Variable | Where | Scope | Sensitive? | Example / placeholder | Purpose |
|---|---|---|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | Build | Public | No | `https://www.example.com` (D-07) | Canonicals, sitemap, OG |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` | Build | Public | No (a site key is public) | `0x4AAAA…` | Turnstile widget |
| `NEXT_PUBLIC_CF_ANALYTICS_TOKEN` | Build | Public | No | *(empty = disabled)* | Optional analytics beacon |
| `CONTENT_MODE` | Build | Build-only | No | `preview` \| `production` | Placeholder gates, noindex |
| `PUBLISHED_LOCALES` | Build | Build-only | No | `en,ar,zh` | Staged locale launch |
| `TURNSTILE_SECRET_KEY` | Worker secret | Server | **Yes** | — | Turnstile siteverify |
| `FORM_TOKEN_SECRET` | Worker secret | Server | **Yes** | 32+ random bytes | HMAC for the time-trap token |
| `APPS_SCRIPT_URL` | Worker secret | Server | **Yes** (defence in depth) | `https://script.google.com/macros/s/…/exec` | Delivery endpoint |
| `APPS_SCRIPT_HMAC_SECRET` | Worker secret **and** Apps Script property `HMAC_SECRET` | Server | **Yes** | 32+ random bytes | Worker→script authentication |
| `IP_HASH_SALT` | Worker secret | Server | **Yes** | random | Privacy-preserving rate-limit keys |
| `SITE_ORIGINS` | Worker var | Server | No | `https://www.example.com,https://example.com` | Origin check |
| `RATE_LIMIT` | Worker KV binding | Server | — | namespace ID | Rate-limit counters |
| `CONTACT_RECIPIENT` | Apps Script property | Server | Personal data | `inquiries@example.com` (D-04) | Notification recipient |
| `OPS_ALERT_EMAIL` | Apps Script property | Server | Personal data | (team or client IT) | Failure alerts |
| `SHEET_NAME` | Apps Script property | Server | No | `Inquiries` | Target tab |

Separate values exist for the **preview** and **production** environments. `.env.example` and `docs/INTEGRATIONS_SETUP.md` list them, and secrets are rotated at handover.

---

## 44. External Dependencies

| Dependency | Type | Licence / cost | Risk | Mitigation |
|---|---|---|---|---|
| Next.js 16.3.x, React 19 | Framework | MIT / $0 | Upgrade churn | Pin minor; Renovate |
| next-intl 4.x | i18n | MIT / $0 | API changes (root params) | Follow the documented static-export setup |
| Tailwind CSS 4.3 | Styling | MIT / $0 | Utility deprecations (`start-*`→`inset-s-*`) | Lint |
| Zod | Validation | MIT / $0 | — | — |
| sharp | Build-time images | Apache-2.0 / $0 | Native binary in CI | Use prebuilt binaries |
| Lucide | Icons | ISC / $0 | — | — |
| wrangler | Deploy tooling | MIT/Apache / $0 | — | Pin |
| Vitest, Playwright, axe-core, Lighthouse CI | Testing | MIT/Apache/MPL / $0 | — | — |
| Cloudflare (Workers, KV, Turnstile, DNS, optional Analytics) | Platform | Free plan / $0 | Free-plan changes; no SLA | Portable build; documented alternatives |
| Google Apps Script, Sheets, Gmail/MailApp | Integration | Free / $0 | Quota; Google account dependency | Workspace owner; quota alert; Resend/Brevo fallback documented |
| Google Maps (share-embed) | Embed | Free / $0 | Blocked in the mainland; undocumented URL changes | Click-to-load; link fallback |
| Canva (embed) | Embed | Client account / $0 | Public design; mainland reachability | Poster + PDF fallback |
| Optional: Motion (MIT), Sentry, UptimeRobot | Optional | $0 | — | Not installed unless needed |

---

## 45. Client Dependencies

The authoritative, client-facing list is [`CLIENT_INPUT_CHECKLIST.md`](./CLIENT_INPUT_CHECKLIST.md). The summary below gives the blocking level and the phase that needs each item.

| ID | Dependency | Blocks | Needed by phase |
|---|---|---|---|
| D-01 / D-02 | Qatar and Egypt office details | Launch | 9 |
| D-03 | Map share and embed links per office (b: Amap/Baidu if mainland) | Launch | 9 |
| D-04 | Notification recipient email | Launch | 6 (staging uses a team inbox) |
| D-05 | Official logo vectors | Launch; affects Phase 2 fidelity | 2 (interim wordmark in preview only) |
| D-06 | Canva embed code (+ language versions, cover PNG, optional PDF) | Company Profile section | 9 |
| D-07 | Domain + DNS access; nameserver change approval | Launch | 11 (prep in 10) |
| D-08 | Partner names + logos + display authorisation | Partners sections | 9 |
| D-09 | Product category descriptions + brands per category | Product category content | 9 |
| D-10 | Project data + images + permissions | Projects section | 9 |
| D-11 | All manifest images (P1 blocking) | Launch | 9 |
| D-12 | Chinese copy | `/zh` launch | 8 |
| D-13 | Arabic copy (translator) | `/ar` launch | 8 |
| D-14 | Company Google account to own the Sheet and script | Form | 6 |
| D-15 | Legal entity names | Footer / schema | 9 |
| D-16 | Privacy policy text | Launch (form consent) | 9 |
| D-17 | Social links | — | 9 |
| D-18 | English copy + microcopy sign-off | Translation start | 4 → 8 |
| D-19 | Relation matrices sign-off | Content lock | 4 |
| D-20 | Scene storyboard approvals | Scene production | 4 |
| D-21 | Optional Smart Building photo sequence | Scene upgrade only | 9 |
| D-22 | Client-owned Cloudflare account | Deployment | 3 (preview) |
| D-23 | Analytics opt-in | — | 11 |
| D-24 | Arabic/Chinese brand renderings (if any) | — | 8 |
| D-25 | Missing source files (03 original, **05 reference image**) | Design-direction confidence | 2 |
| D-26 | Optional Mobile NVR real footage | — | 9 |
| D-27 | Optional canva.cn embed | — | 9 |

---

## 46. Risks

| ID | Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|---|
| R-01 | Client content, images and data arrive late (projects, partners, images, translations) | High | High | Placeholder architecture, production gates, staged locale launch (Q-11), sections that hide gracefully, and an early checklist hand-off |
| R-02 | The IA conflict (sitemap vs approved content) is resolved late and forces rework | Medium | High | Q-01 decided **before** Phase 4; registries make renames cheap |
| R-03 | No Arabic source, so the Arabic launch is delayed | High | Medium | Q-05 early; staged locale publishing |
| R-04 | Gold contrast misuse by future editors | Medium | Medium | Semantic tokens; lint and visual tests; documented rules |
| R-05 | Mainland China: Turnstile, Google and Canva are unreliable | Medium (depends on Q-06) | Medium | Fallbacks: server-side Google calls, a Turnstile fallback path, the static map, a PDF profile |
| R-06 | Free-tier terms or limits change (Cloudflare, Google, Canva) | Low–Medium | Medium | Portable static build; documented free alternatives; limits reviewed at each major release |
| R-07 | Apps Script quota (100/day on a consumer account) is exceeded by a spam burst or high volume | Low | Medium | Anti-spam layers ahead of the script; a Workspace owner (1,500/day); quota warning email; Resend or Brevo fallback |
| R-08 | The DNS nameserver move breaks company email | Low | **High** | Record audit, client IT review, TTL reduction, off-hours switch, a rollback export |
| R-09 | Scene ambition exceeds budget or credits; scenes feel gimmicky | Medium | Medium | Classification (only 3 rich scenes), storyboard approval before build, the shared engine, SVG-only v1, a strict purpose test |
| R-10 | Scene performance on low-end mobile | Medium | Medium | Stepped mode on mobile, budgets, compositor-only properties, the low-power heuristic, and performance tests on a throttled Android profile |
| R-11 | Partner logo use without authorisation | Medium | Medium | D-08 requires confirmation of display rights |
| R-12 | Privacy compliance (Qatar Law No. 13 of 2016; Egypt Law No. 151 of 2020) for form data | Medium | Medium | Minimal data, consent, a privacy policy by the client's counsel (D-16), restricted Sheet access. *We give no legal advice.* |
| R-13 | Vercel expectation vs recommendation | Medium | Low | Documented ToS analysis (§42.1); client decision Q-22 |
| R-14 | Static export limits: no ISR, and every content change needs a deploy | Certain | Low | Deploys take minutes and are free; the content editing guide covers it |
| R-15 | The CSP needs `'unsafe-inline'` scripts in a static export | Certain | Low | No user content rendered; hash-based CSP evaluated in Phase 10 |
| R-16 | Claude Code credit budget (~$250) overrun | Medium | Medium | Phase gating, template-first implementation, deterministic scripts, reuse of the scene engine, and no speculative iterations (§49.3) |
| R-17 | Source file 05 (reference image) is still unknown and might change direction | Low | Medium | Request it (D-25) before Phase 2 sign-off |

---

## 47. Technical Decisions

| ID | Decision | Rationale | Alternatives rejected |
|---|---|---|---|
| T-01 | Next.js 16.3 App Router, React 19, TypeScript strict, **static export** | Team stack; mature i18n; everything is static; zero-cost hosting | Astro (a strong fit, but less familiar to the team and a weaker React island ecosystem for the explorer and filters); SSR on OpenNext (the 10 ms CPU Free limit; unnecessary) |
| T-02 | Locale-prefixed URLs with English slugs | Stable, static-compatible, simple hreflang | Localized slugs (need a proxy; low value) |
| T-03 | next-intl 4.x, static setup without a proxy | Mature; documented static-export mode | Custom i18n (reinvention) |
| T-04 | Content = TS structure + per-locale JSON copy, validated by Zod | Translator-friendly, typed, no CMS | MDX (harder for translators); a single file with inline locales (noisy diffs) |
| T-05 | IBM Plex Sans / Plex Sans Arabic + Noto Sans SC, self-hosted | Matches the Option B references; a true Arabic companion; free | Inter (generic); Montserrat (weak Arabic pairing) |
| T-06 | Content-status production gate | Enforces "no fake completeness" | Manual review only |
| T-07 | Cloudflare Workers + Static Assets (Free) | Commercial use allowed; $0; edge CDN; Turnstile, KV and DNS in one account | Vercel Hobby (ToS); Vercel Pro (cost); Netlify Free (credit cap) |
| T-08 | Worker endpoint in front of Apps Script | IP-aware rate limiting, origin check, secrets on the server, mainland-safe server-side calls | Browser → Apps Script directly (no IP, CORS fragility) |
| T-09 | Apps Script for Sheets + email | $0, no billing, no keys, no email vendor, client-owned | Sheets API + service account + Resend (more moving parts, keys, domain DNS) |
| T-10 | Build-time image optimisation (sharp → AVIF/WebP) | Static export has no image optimiser; $0; fastest at runtime | Runtime image CDN (paid beyond free) |
| T-11 | Click-to-load for Maps and Canva | Performance, privacy, mainland resilience | Eager iframes |
| T-12 | In-house scroll-scene engine (SVG + CSS custom properties) | ~3 KB, accessible, SSR, themeable, RTL-aware | GSAP/ScrollTrigger (unneeded weight; non-OSI licence); WebGL (weight, battery); Lottie (tooling, runtime) |
| T-13 | No custom page transitions at launch | Risk vs value; revisit with React `<ViewTransition>` | Framework-level transition libraries |
| T-14 | Disclosure navigation pattern (not ARIA menu) | Correct semantics for site navigation | `role="menu"` |
| T-15 | pnpm, Vitest, Playwright, Lighthouse CI | Fast, free, standard | Jest (slower) |
| T-16 | No dark-mode toggle | Brand rhythm is already light/charcoal; not required | — |

---

## 48. Recommended Project Structure

```
vision-plus/
├── client-materials/                 # client source package: read-only source of truth
│   └── _extracted/                   # images extracted from the PDF (sitemap, Option B palette, market position)
├── docs/
│   ├── MASTER_PROJECT_PLAN.md        # this document
│   ├── IMAGE_ASSET_MANIFEST.md       # + image-asset-manifest.csv
│   ├── CLIENT_INPUT_CHECKLIST.md
│   ├── INTEGRATIONS_SETUP.md         # Phase 6: Sheet, Apps Script, Turnstile, KV, secrets
│   ├── SCENE_STORYBOARDS.md          # Phase 4: one frame description per beat, approvals log
│   ├── QA_MATRIX.md                  # Phase 10
│   └── CONTENT_EDITING_GUIDE.md      # Phase 11 handover
├── integrations/
│   └── apps-script/Code.gs           # versioned source of the Google Apps Script web app (+ tests.gs)
├── messages/{en,ar,zh}.json          # UI strings (next-intl)
├── public/
│   ├── images/<area>/…               # designer masters (manifest paths)
│   ├── fonts/                        # (only if any font is not served via next/font)
│   ├── _headers  _redirects          # static headers and redirects (verify Workers support; §42.2)
│   └── favicon.svg, icons
├── scripts/
│   ├── images.ts                     # sharp: masters → AVIF/WebP width sets + registry metadata
│   ├── content-check.ts              # Zod, key parity, status gate, relations, length budgets
│   ├── assets-check.ts               # manifest ↔ registry ↔ files, dimensions, alt text
│   ├── i18n-export.ts / i18n-import.ts   # translations.xlsx round-trip
│   ├── canva-parse.ts                # validates the pasted embed code → config
│   └── manifest.ts                   # regenerates IMAGE_ASSET_MANIFEST.md + CSV from the layout families
├── src/
│   ├── app/
│   │   ├── layout.tsx  page.tsx       # root pass-through + static redirect fallback
│   │   └── [locale]/
│   │       ├── layout.tsx             # <html lang dir>, fonts per locale, header/footer
│   │       ├── page.tsx               # Home
│   │       ├── solutions/page.tsx  solutions/[slug]/page.tsx
│   │       ├── products/page.tsx   products/[slug]/page.tsx   (generateStaticParams → enabled only)
│   │       ├── industries/page.tsx  services/page.tsx  about/page.tsx  partners/page.tsx
│   │       ├── projects/page.tsx   projects/[slug]/page.tsx
│   │       ├── company-profile/page.tsx  contact/page.tsx  privacy/page.tsx
│   │       ├── _lab/scenes/page.tsx   # preview-only scene lab (excluded in production)
│   │       └── not-found.tsx
│   │   ├── sitemap.ts  robots.ts
│   ├── i18n/  routing.ts  request.ts  navigation.ts  locales.ts
│   ├── content/  schema/  data/  copy/{en,ar,zh}/  media/images.ts  company-profile.ts  index.ts
│   ├── components/ ui/  layout/  media/  motion/  scenes/  sections/  partners/  projects/  company-profile/  contact/
│   ├── features/contact/  schema.ts  client.ts  messages.ts
│   ├── lib/  seo.ts  jsonld.ts  env.ts  cn.ts  format.ts
│   └── styles/  tokens.css  globals.css  scenes/*.module.css
├── worker/
│   ├── index.ts                      # routes "/" (locale negotiation) and "/api/*"; delegates the rest to ASSETS
│   ├── contact.ts                    # Web-standard handler: guards → validate → anti-spam → Apps Script
│   ├── token.ts  turnstile.ts  ratelimit.ts  hmac.ts  log.ts
│   └── contact.test.ts
├── tests/  e2e/  a11y/  visual/  integration/
├── wrangler.jsonc                    # assets dir, run_worker_first, KV, vars; secrets are set via CLI
├── next.config.ts                    # output: 'export', images: { loader: 'custom' }, trailingSlash: false
├── .env.example                      # names only
└── package.json / pnpm-lock.yaml / tsconfig.json / eslint.config.mjs / playwright.config.ts / vitest.config.ts
```

---

## 49. Complete Implementation Roadmap

The phases were derived from the dependency chain found in this analysis:
- The client decisions shape the IA.
- The design proof locks the visual language before any mass production.
- The foundation is built before templates.
- The content and storyboards come before the scenes.
- Client assets and translations flow in when they are ready, in parallel with engineering.
- QA and launch come last.

```
P0 Discovery & Plan ✅
 └► P1 Client decisions ──► P2 Design direction proof ──► P4 Content encoding + scene storyboards ──► P5 Templates, scene engine & scenes ─┐
                    └────► P3 Engineering foundation ─────┴─────────────────────────────────────────► P6 Contact integration ────────────┤
                                                                                                        P7 SEO ─────────────────────────┤
                            Client inputs (continuous) ──► P8 Localization (ar, zh) ── P9 Client asset integration ───────────────────────┤
                                                                                                                                         ▼
                                                                                              P10 QA & hardening ──► P11 Launch & handover ──► P12 Post-launch
```

### 49.1 Phases in detail
Each phase lists its objective, scope, inputs, outputs, dependencies, expected files, validation, acceptance, completion definition, and risks or blockers.

**P0: Discovery & Master Plan** *(this deliverable, complete)*
- **Objective:** understand the business, reconcile sources, and architect the project.
- **Outputs:** this plan, the manifest (plus CSV), the client checklist, and `client-materials/` committed.
- **Acceptance:** the plan is reviewed, and the client decision session is scheduled.

**P1: Client Decisions & Input Kickoff**
- **Objective:** resolve the questions that change scope before design and build.
- **Scope:** Q-01 to Q-23 (the minimum before P2 is Q-01 to Q-08, Q-14, Q-16 and Q-22). Send the checklist, collect D-05, D-07, D-14, D-22 and D-25 first.
- **Inputs:** §53, `CLIENT_INPUT_CHECKLIST.md`.
- **Outputs:** a decision log appended to §53.3 (answer, date, who), and updated registries in the plan.
- **Dependencies:** client availability.
- **Validation:** every decision is traced to the affected sections.
- **Acceptance:** all "before P2" questions are answered or have an accepted default.
- **Done when:** the decision log is committed.
- **Risks:** late answers delay P2 and P4 (R-02).

**P2: Design Direction Proof** (a coded proof, cheaper and more truthful than static mockups)
- **Objective:** lock the visual language ("Engineered Light") in all 3 scripts before production.
- **Scope:**
  - A live style guide route in preview: tokens, type scale in en/ar/zh, buttons, forms, placeholders and seam motifs.
  - The homepage **hero + Integration System section**.
  - **One full solution page (Mobile NVR)**, including a **working first cut of the Route scene** in pinned, stepped and reduced-motion modes.
  - The header and mega menu at desktop and mobile.
- **Inputs:** §18–23, the D-05 logo (or the interim wordmark in preview), the D-25 reference image.
- **Outputs:** a preview URL, and screenshots at 390, 768, 1440 and 1920 in 3 locales.
- **Dependencies:** a thin slice of P3 (scaffold + tokens) is built first.
- **Expected files:** `styles/tokens.css`, `components/ui/*`, `layout/SiteHeader`, `sections/home/Hero`, `scenes/MnvrRouteScene`, `motion/*`, `[locale]/_lab/*`.
- **Validation:**
  - Self-critique against §19 and the frontend-design calibration list.
  - Contrast checks.
  - A performance trace of the scene on a throttled mobile profile.
- **Acceptance:** written client approval of the direction, type and motion character.
- **Done when:** approved, with adjustments logged.
- **Risks:** subjective iteration loops. Mitigation: a maximum of 2 revision rounds, with feedback collected as a single consolidated list.

**P3: Engineering Foundation**
- **Objective:** a production-grade skeleton that every later phase builds on.
- **Scope:**
  - Next 16 static export, next-intl static setup, locales/`dir`/fonts per locale, and Tailwind tokens.
  - ESLint rules (logical properties, Option A hex ban), content schemas plus loaders, and the image pipeline plus `Picture`/`ImageSlot`.
  - Layout shell (header, mega menu, drawer, language switcher, footer, breadcrumbs, skip link).
  - The Worker skeleton (root negotiation, `/api/contact/health`).
  - CI (lint, types, unit, content, assets, Lighthouse, axe smoke), preview deploys on Cloudflare, and `.env.example`.
  - **Verification of the flagged items:** `_headers`/`_redirects`/`run_worker_first` on Workers assets, the next-intl static-export setup on Next 16.3, and hreflang `zh-Hans`.
- **Inputs:** §11–16, 20–21, 27–29, 42–43, 48.
- **Outputs:** a deployable preview with empty templates in 3 locales.
- **Dependencies:** D-22 (Cloudflare account). A team account can be used temporarily and transferred.
- **Expected files:** see §48.
- **Validation:** CI green; `/en`, `/ar` and `/zh` render with the correct `lang`/`dir`; root negotiation works; the Lighthouse baseline is ≥ 95.
- **Acceptance:** the foundation checklist (§51), and the preview URL is shared.
- **Done when:** merged to `main`.
- **Risks:** static-export and i18n edge cases. Mitigation: verify early (this phase).

**P4: Content Encoding & Scene Storyboards**
- **Objective:** all approved English content lives in typed content files; the scenes are storyboarded and approved.
- **Scope:**
  - Encode `01` fully (with source references).
  - Relations (§12.4) and aliases.
  - Draft microcopy and SEO strings (`draft`).
  - The translation workbook export.
  - `SCENE_STORYBOARDS.md` for the 8 solutions plus the home scene: frames per beat for desktop and mobile, plus the reduced-motion state.
- **Inputs:** `01`, the decisions from P1.
- **Outputs:** content JSON/TS, `translations.xlsx`, storyboards.
- **Dependencies:** P1 (Q-01, Q-02, Q-04, Q-08, Q-09), P3 schemas.
- **Validation:**
  - `content:check` passes.
  - A fidelity diff against `01` (every approved sentence is present; derived strings are flagged).
- **Acceptance:** D-18 (English sign-off), D-19 (relations), D-20 (storyboards).
- **Done when:** English is locked and the translation workbook has been sent.
- **Risks:** copy churn after lock; handled with a change log.
- **Status (2026-10-01):** Ready for Acceptance — **not accepted or closed**. Implemented and validated; acceptance waits on three separate client sign-offs, D-18, D-19 and D-20 (record: `docs/P4_CLIENT_REVIEW.md` §6). The ten P4-related open questions remain unanswered, with defaults pending confirmation (§4 of that file). The translation workbook is prepared but **not released** to translators until D-18 is approved. P5 has not started and needs its own approval.

**P5: Page Templates, Scene Engine & Solution Scenes**
- **Objective:** build every page and section to spec, with placeholders, and every approved scene.
- **Scope, 5A (templates):** Home, Solutions hub + detail, Industries explorer, Services lifecycle, About, Products, Projects (list/detail with sample placeholders), Partners, Company Profile (config placeholder), Contact UI, Privacy, 404, and OG card generation.
- **Scope, 5B (scenes):** harden the engine, then build the scenes in the order Mobile NVR (finish), Smart Building, ELV, CCTV, Access Control, Fire Alarm, Networking, AV, Home Integration.
- **Inputs:** §26, §23.6, the storyboards, and the content.
- **Outputs:** the complete site in preview mode.
- **Dependencies:** P2 approval, P3, P4.
- **Validation:** per template, a11y (axe 0), visual snapshots (3 locales × 4 widths), Lighthouse budgets, and scene performance and reduced-motion tests.
- **Acceptance:** a client walkthrough on preview.
- **Done when:** all templates and scenes are merged and a QA pass has been logged.
- **Risks:** R-09 and R-10 (scene scope and performance), mitigated by the classification and the budgets.

**P6: Contact Integration**
- **Objective:** a secure, free, reliable Sheet + email pipeline.
- **Scope:**
  - Worker contact handler, token, Turnstile, KV rate limit and HMAC.
  - Apps Script source and tests, the staging and production Sheets.
  - `INTEGRATIONS_SETUP.md`.
  - Failure alerts and digest, and the integration test script.
- **Inputs:** §29–32, D-04, D-14.
- **Outputs:** a working staging pipeline.
- **Dependencies:** P3 (Worker), the P5 Contact UI.
- **Validation:** the §40 Worker, Apps Script and integration tests, and failure-path simulations.
- **Acceptance:** 10 test submissions across the 4 inquiry types and 3 locales arrive correctly, and the failure paths behave as specified.
- **Done when:** staging is complete, and the production Sheet and script are provisioned (secrets not yet live).
- **Risks:** Google account access delays (D-14). A team-owned staging account is used meanwhile.

**P7: SEO & Metadata**
- **Scope:** §36 in full.
- **Validation:** the SEO checks in CI, and structured-data validation.
- **Acceptance:** 100 % of routes have unique titles and descriptions per locale, hreflang is reciprocal, and the sitemap is valid.
- **Dependencies:** P4 SEO strings, P5 routes.

**P8: Localization (Arabic, Chinese)**
- **Objective:** a genuinely native Arabic RTL site and Chinese site.
- **Scope:** import D-12 and D-13; length and bidi fixes; per-locale typography tuning; native reviewer QA on staging; flipping `PUBLISHED_LOCALES`.
- **Dependencies:** D-12, D-13, P5.
- **Validation:** `content:check` (no `draft-mt` in published locales), RTL visual regression, and the native review checklists.
- **Acceptance:** written sign-off from the native reviewers.
- **Risks:** R-03.

**P9: Client Asset Integration**
- **Scope:** the logo, all manifest images (with an alt-text pass), partners, projects, product category data, Canva embed(s) and poster, locations and maps, legal entity names, the privacy policy and socials.
- **Dependencies:** D-01 to D-11, D-15 to D-17, D-21, D-26 and D-27.
- **Validation:** `assets:check` and `content:check` in production mode.
- **Acceptance:** the production build succeeds, with zero placeholders in published routes.
- **Risks:** R-01.

**P10: QA & Hardening**
- **Scope:** the full §40–41 matrix; browser and device testing; screen readers; performance tuning; hash-based CSP evaluation; security header verification; the DNS migration plan prepared with the client's IT; `QA_MATRIX.md`.
- **Acceptance:** §52 checklist items green, except the launch-day items.

**P11: Launch & Handover**
- **Scope:** the §42.5 launch checklist; the DNS switch; production secrets; Search Console; optional analytics and uptime; `CONTENT_EDITING_GUIDE.md`; handover of account ownership; secret rotation.
- **Acceptance:** live on the client domain, with test submissions verified and the client's written acceptance.

**P12: Post-launch** (the first 30 days)
- **Scope:** monitor logs, quota and CWV field data; fix defects; the backlog (industry detail pages when content allows, product category pages when enabled, React ViewTransition, the optional Smart Building photographic scene, Supply & Procurement if Q-09 = yes).

### 49.2 Parallelisation
- **P3 can start immediately after P1**, in parallel with the P2 visual work (P2 needs only the scaffold and tokens slice).
- **P6 and P7** can proceed in parallel with P5B.
- **P8 and P9** follow client inputs and can overlap with P5 and P6.

### 49.3 Claude Code credit strategy (~$250 available) [REC]
The goal is deterministic, template-first work with no blind iteration.

| Phase | Relative share of implementation effort | How credits are protected |
|---|---|---|
| P2 Design proof | ~10 % | One consolidated feedback round; screenshots reviewed in batches |
| P3 Foundation | ~15 % | Built once from §48; generators instead of hand-writing repetitive files |
| P4 Content + storyboards | ~10 % | A scripted import of `01` into JSON; storyboards in text, not images |
| P5A Templates | ~22 % | The shared section library first, then pages assembled from it |
| P5B Scenes | ~18 % | One engine; scenes built strictly from the approved storyboards; the 3 rich scenes get the most budget |
| P6 Integrations | ~8 % | A spec-first handler with tests; a single Apps Script file |
| P7 SEO | ~4 % | Helper-driven metadata |
| P10 QA | ~8 % | Automated suites do the repetitive checking |
| Reserve | ~5 % | Client change requests and fixes |

**Working rules:**
1. **Never start a phase whose blocking questions are still open.** Use sensible defaults only when they are documented.
2. **One PR per coherent unit** (for example "Solutions detail template"), with CI as the validator rather than repeated manual regeneration.
3. **Reuse before create:** every new section must first try the §20.8 patterns.
4. **Keep this plan as the single spec:** changes are made here first (a short diff), then in code.

---

## 50. Phase-by-Phase Deliverables

| Phase | Deliverables (files and artefacts) |
|---|---|
| P0 | `docs/MASTER_PROJECT_PLAN.md`, `docs/IMAGE_ASSET_MANIFEST.md`, `docs/image-asset-manifest.csv`, `docs/CLIENT_INPUT_CHECKLIST.md`, `client-materials/` (+ `_extracted/`), `README.md` |
| P1 | The decision log (§53.3 updated); the checklist sent; the initial accounts (Cloudflare, Google) |
| P2 | Preview URL: style guide, home hero + integration section, Mobile NVR page + Route scene v1, header/mega/drawer; screenshot set; approval record |
| P3 | The repository scaffold (§48), CI workflows, preview deploy pipeline, `wrangler.jsonc`, `.env.example`, Worker skeleton, image pipeline, content schemas |
| P4 | `src/content/**` (English complete), `messages/en.json`, `translations.xlsx`, `docs/SCENE_STORYBOARDS.md`, the fidelity report |
| P5 | All routes and sections; 9 scenes; the scene lab; OG generator; visual baseline snapshots |
| P6 | `worker/contact.ts` + tests, `integrations/apps-script/*`, staging and production Sheets, `docs/INTEGRATIONS_SETUP.md` |
| P7 | Metadata, sitemap, robots, JSON-LD, hreflang; the SEO CI checks |
| P8 | `copy/ar/**`, `copy/zh/**`, `messages/{ar,zh}.json`; native-review sign-offs |
| P9 | `public/images/**`, `data/partners.ts`, `data/projects/**`, `data/locations.ts`, `company-profile.ts`, the privacy copy |
| P10 | `docs/QA_MATRIX.md`, the fixed-defects log, performance and a11y reports, the DNS migration runbook |
| P11 | The live site, `docs/CONTENT_EDITING_GUIDE.md`, the account handover record, the launch report |
| P12 | Monitoring notes, backlog tickets |

---

## 51. Definition of Done

**For any work item (PR):**
- [ ] It meets its section's spec in this plan, or the plan is updated in the same PR with the rationale.
- [ ] TypeScript strict, ESLint (including the logical-property and Option A-ban rules) and Prettier are clean.
- [ ] Unit and component tests are added or updated; the Worker tests pass if it touched `worker/`.
- [ ] `content:check` and `assets:check` pass (in preview mode).
- [ ] Verified in **en, ar and zh** at **390, 768, 1440 and 1920 px**, with **reduced motion** and **keyboard-only**.
- [ ] axe reports 0 violations on the affected templates; the Lighthouse budgets are not regressed.
- [ ] No business copy is hard-coded in components, no secret is in the client code, and no placeholder data is presented as real.
- [ ] Visual snapshots are updated intentionally (the diff is reviewed).
- [ ] The preview deployment link is attached for review.

**For a scene:**
- [ ] It matches the approved storyboard (D-20), and every label is approved copy.
- [ ] Pinned (desktop), stepped (mobile/tablet), reduced-motion static and no-JS modes all convey the full information.
- [ ] SVG ≤ 30 KB gzipped (≤ 45 KB for rich scenes), CLS = 0, ≥ 55 fps on the throttled mid-range profile, and no animated non-compositor properties beyond the allowed stroke animations.
- [ ] RTL direction is verified. There is no flashing, and gold is used only as the active signal.

**For a phase:** its §49.1 acceptance criteria are met, and its deliverables (§50) are committed.

---

## 52. Final Acceptance Checklist

Launch is approved only when **every** item is ✅.

**Design and brand**
- [ ] Only Option B colours are used anywhere; the Option A CI check passes.
- [ ] Gold usage rules are respected (never as text on light surfaces; one gold typographic moment per page at most).
- [ ] The official logo is in place (D-05); favicon and app icons are generated from it.
- [ ] Every page matches the approved design direction (P2) in all 3 locales.
- [ ] No template-like, card-grid-everywhere compositions: the reviewer confirms the §19 principles.

**Content**
- [ ] All approved content from `01` is present, with the fidelity report signed.
- [ ] No fabricated products, partners, projects, statistics, certifications, addresses, phones, emails or clients.
- [ ] All `derived` and `draft` strings are approved (D-18); zero placeholders on published routes.
- [ ] The privacy policy is published (D-16).

**Localization**
- [ ] `/en`, `/ar` and `/zh` are complete; there is no `draft-mt` in production.
- [ ] Arabic: full RTL mirroring, bidi-safe phones, emails and brand, correct typography; native reviewer sign-off.
- [ ] Chinese: correct fonts and typesetting, no mixed-script glitches; native reviewer sign-off.
- [ ] The language switcher preserves the page; root negotiation works (cookie → Accept-Language → en).

**Responsive and motion**
- [ ] All templates pass 390, 768, 1024, 1440 and 1920, with no horizontal overflow at 320 px.
- [ ] All scenes pass the scene DoD (§51) on desktop, tablet and mobile, with reduced motion verified site-wide.

**Accessibility**
- [ ] WCAG 2.2 AA: axe 0 violations; the manual screen-reader passes (NVDA, VoiceOver macOS/iOS incl. Arabic, TalkBack) logged; keyboard-only complete.

**SEO**
- [ ] Unique localized titles and descriptions; canonicals; reciprocal hreflang; `x-default`.
- [ ] The sitemap is valid and submitted; `robots.txt` is correct in production and `noindex` in preview.
- [ ] JSON-LD is valid (Organization, WebSite, BreadcrumbList, and LocalBusiness with real data only).
- [ ] OG cards per locale; 404 returns a 404 status.

**Performance**
- [ ] Lighthouse mobile Performance ≥ 90, Accessibility 100, Best Practices ≥ 95 and SEO 100 on all key templates.
- [ ] LCP ≤ 2.5 s, CLS ≤ 0.05 and INP ≤ 200 ms in lab tests on mid-tier mobile; JS budgets met.
- [ ] No third-party requests on initial load, except where documented.

**Forms and integrations**
- [ ] Each inquiry type in each locale produces the correct Sheet row and email (subject, Reply-To, escaping).
- [ ] Failure paths are verified: email failure → row + alert; sheet failure → email noting it; both → user error with alternatives.
- [ ] Anti-spam is verified: honeypot, time token, origin, Turnstile + fallback, rate limit 429.
- [ ] The recipient is the real address (D-04), and the Sheet is owned by the client account (D-14).

**Security**
- [ ] No secrets in the repository or bundle (secret scan clean); Worker and Apps Script secrets are production-rotated.
- [ ] Security headers are verified (CSP, HSTS, nosniff, frame protection, Referrer-Policy, Permissions-Policy); `pnpm audit` has no high or critical findings.

**Images, Canva, partners, projects, locations**
- [ ] All P0 and P1 images are final with alt text; `assets:check` passes in production mode.
- [ ] Canva: the embed works on desktop and mobile, with fullscreen, fallback and poster.
- [ ] Partners and Projects are shown only with confirmed real data and permissions.
- [ ] Both offices have real details, working `tel:` and `mailto:` links, a map click-to-load and a directions link.

**Deployment and operations**
- [ ] Live on the client domain over HTTPS, with apex/www redirect; DNS migration done and mail flow verified.
- [ ] $0 required recurring third-party cost is confirmed against §42.6.
- [ ] Rollback tested (a previous version restored once on staging).
- [ ] Accounts are owned by the client, the handover documentation is delivered, and the client has accepted in writing.

---

## 53. Consistency Audit, Contradictions and Open Questions

### 53.1 Contradictions found (and how they are handled)
| ID | Contradiction | Sources | Resolution |
|---|---|---|---|
| C-01 | The sitemap's Products, Solutions, Services and Industries sub-items differ from the approved content | `02` p6 vs `01` | Approved content is canonical; sitemap items are mapped (§9.2) — **Q-01** |
| C-02 | Two Vision, Mission and Values sets (Egypt-specific, 5 values vs 7 values) | `02` p4 vs `01` §04–05, §20 | Use `01` — **Q-04** |
| C-03 | The PDF core value "Customer Focus" repeats the "Integration" description, and there are typos ("trust security solutions partner", "reliabe", "requirment") | `02` p4–5 | Indicates a draft; not used as copy |
| C-04 | The sitemap omits Mobile NVR, which the approved content and the brief treat as the key differentiator | `02` p6 vs `01` §07–08, §19 | Included and featured |
| C-05 | The sitemap lacks Partners, Company Profile and Privacy, which the brief requires | `02` p6 vs brief | Added under About and the footer |
| C-06 | The PDF lists well-known manufacturer brands, but the brief forbids fabricated partners | `02` p2 vs brief | Treated as market research only; partners come from D-08 only |
| C-07 | The PDF and sitemap graphics are styled in blue (the Option A look) | `02` | Content is used; styling ignored; Option B only |
| C-08 | The Option B mock-ups contain taglines absent from the approved content | `04` | Not used — **Q-14** |
| C-09 | The brief says the materials are in the repository, but the repository was empty; files 03 and 05 were not received | Session | Materials committed; 03 recovered from the PDF; **05 requested (D-25)** |
| C-10 | The brief targets Vercel free, but Vercel Hobby prohibits commercial use | Addendum §12 vs Vercel terms | Documented; Cloudflare Free recommended — **Q-22** |
| C-11 | This plan's *earlier draft* assumed Vercel Pro, Resend, Upstash and a Google service account | Draft vs addendum §11 | **Superseded** by the zero-cost architecture (T-07 to T-10). Recorded here for traceability. |
| C-12 | The brief asks for "service detail experiences", but the approved service copy is 1–2 paragraphs each | Brief vs `01` §16 | Rich in-page detail sections with deep-link anchors; promotable to pages later |
| C-13 | The mock-ups show gold text on white ("FOR A BETTER TOMORROW"), which measures 2.10:1 and fails WCAG | `04` vs WCAG | Gold text only on dark surfaces (§22.3) |
| C-14 | The approved project model includes "Client", which may conflict with client confidentiality | `01` §22 | A per-project `confidential` option (§35) |
| C-15 | The approved content is structured like the company-profile deck the client will build in Canva, so there is overlap | `01` vs brief §06 | Accepted: the web copy is approved for the web, and the profile page embeds the deck without re-transcribing it |
| C-16 | The original brief asks for a "secure server-side endpoint"; a static export has no server | Brief vs T-01 | Satisfied by the Cloudflare Worker endpoint (§29) |

### 53.2 Assumptions (explicit; change them via the decision log)
| ID | Assumption |
|---|---|
| A-01 | `01` is approved for website use in full, per the client manifest (`00`). |
| A-02 | The Option B hex values in the images are exact. |
| A-03 | Inquiry volume is modest (well under 100/day), which is within the Apps Script and Worker free quotas. |
| A-04 | The client can provide a company Google account and a Cloudflare account, and can authorise a DNS nameserver change. |
| A-05 | The notification email and the Sheet are operated in English. |
| A-06 | Each locale has one version of the site (no country-specific variants for Qatar or Egypt). |
| A-07 | No e-commerce, pricing or quotation engine is in scope. |

### 53.3 Open questions (decision log)
The client answers Q-01 to Q-14, Q-17, Q-18, Q-20 and Q-21 through `CLIENT_INPUT_CHECKLIST.md` §A. The rest are listed here.

| ID | Question | Recommendation | Needed before |
|---|---|---|---|
| Q-01 | Approved content or the sitemap as canonical IA? | Approved content, with the sitemap mapped | P2 |
| Q-02 | Products launch option (A inquiry-led / B hidden / C catalogue) | A | P4 |
| Q-03 | Solutions before Products in the navigation? | Yes | P2 |
| Q-04 | Vision, Mission and Values source | `01` | P4 |
| Q-05 | Who produces the Arabic copy? | A professional translator arranged by the client | P4 |
| Q-06 | Is the Chinese audience in mainland China? | Clarify; fallbacks already designed | P3 |
| Q-07 | Brand-name rendering in Arabic and Chinese | Keep Latin | P4 |
| Q-08 | Add "Real Estate & Compounds"? | Fold it in, unless copy is supplied | P4 |
| Q-09 | Add Site Survey and Supply & Procurement? | Supply & Procurement, if copy is supplied | P4 |
| Q-10 | Confirm the industry→solution relations | Confirm §12.4 | P4 |
| Q-11 | Launch all locales together, and Canva per language? | Together if ready; one Canva with a notice if needed | P8 |
| Q-12 | Hide Projects and Partners until real data? | Yes | P5 |
| Q-13 | Partner logos: monochrome or colour? | Monochrome, colour on hover | P5 |
| Q-14 | Are the mock-up taglines approved? | No, unless confirmed | P4 |
| Q-15 | Canonical host: apex or `www`? | `www` → apex, or per client IT preference | P11 |
| Q-16 | Is the Sheet and script owner a Google Workspace or consumer account? | Workspace (1,500 emails/day, branded sender) | P6 |
| Q-17 | Arabic numerals: Western or Arabic-Indic? | Western | P8 |
| Q-18 | Analytics? | Optional Cloudflare Web Analytics | P11 |
| Q-19 | What does "Become a Partner" mean: manufacturers, resellers, installers or subcontractors? | Clarify; it sets the partnership form's helper text | P4 |
| Q-20 | Visitor auto-reply? | No at launch | P6 |
| Q-21 | WhatsApp and social links? | Only if supplied | P9 |
| Q-22 | Accept Cloudflare Free instead of Vercel (Hobby is non-commercial)? | Yes | P3 |
| Q-23 | Primary Arabic market for `og:locale` / region (`ar_QA` or `ar_EG`) | `ar_QA` (HQ since 2017) — confirm | P7 |

### 53.4 Audit coverage
The audit covered:
- client requirements
- repository files
- sitemap and approved content
- the Option B palette
- UX and IA
- localization, RTL and Chinese
- images
- form, email and Sheets
- Canva
- partners and projects
- technical architecture
- SEO, accessibility, performance and security
- deployment and cost

It found no unresolved contradiction beyond those listed in §53.1, each of which has a resolution or an owner question.

---

## 54. Self-Review Record and Recommended Next Step

### 54.1 Self-review (performed 2026-09-25)
| # | Check | Result |
|---|---|---|
| 1 | Missing requirements | All brief sections and addendum items are mapped in §7 (RQ-01 to RQ-42) |
| 2 | Contradictions | 16 identified and resolved or escalated (§53.1) |
| 3 | Repository vs plan | The repository contains only `client-materials/`, `docs/` and `README.md`; no implementation files were created, per the "plan first" rule |
| 4 | Image manifest | 69 fixed slots + 4 families; dimensions derived from the grid formula; CSV generated from the same data; RTL safe zones defined |
| 5 | Multilingual architecture | Locale routing, content split, workbook flow, publish gates and the no-MT rule are defined |
| 6 | RTL | Logical properties + lint, mirroring rules, bidi isolation, scene mirroring and typography |
| 7 | Chinese | Fonts (no Plex SC exists → Noto Sans SC), typesetting, length budgets, mainland reachability |
| 8 | Form | Fields, validation, anti-spam layers and states |
| 9 | Google Sheets | Ownership, columns, setup, concurrency, staging vs production; no billing |
| 10 | Canva | Config, validation, click-to-load, mobile strategy, fallback, public-design caveat |
| 11 | SEO | Metadata, hreflang, sitemap, JSON-LD (real data only), OG generation |
| 12 | Accessibility | WCAG 2.2 AA plan, including scenes and the marquee |
| 13 | Performance | Budgets, scene rules, build-time images, no third parties on first load |
| 14 | Security | One endpoint, secrets placement, HMAC, headers, the CSP trade-off documented |
| 15 | Deployment | Vercel limitation documented; zero-cost Cloudflare topology; DNS runbook; rollback |
| 16 | Acceptance criteria | DoD (§51) and the final checklist (§52) cover design → deployment |
| 17 | Zero-cost | §42.6 matrix: required recurring cost **$0**; no hidden billing (the Maps Embed API and Sheets API key route were explicitly avoided) |

**Honest limitations of this plan:**
- The **05 reference image** has not been seen.
- Vendor limits were verified on 2026-09-25, partly from official documentation source repositories and partly from search excerpts (marked in the research notes). Items flagged "verify in Phase 3" are not assumed.
- Scene concepts are storyboards only; their final quality depends on P2 and P4 approvals.

### 54.2 Skills used
- **frontend-design** (installed): applied to the visual direction, typography choice, restraint rules, the avoidance list, "numbers only for real sequences", and the motion principle of one orchestrated moment.
- **PDF reading**: poppler rendering and image extraction, to inspect the sitemap and palette *visually*, not just as text.
- **Research sub-agents**: verified current versions and free-tier terms.
- **"UI/UX Pro Max" is not installed** in this environment, so it could not be used. The installed `brand-guidelines` and `theme-factory` skills apply Anthropic's own theme, so they were deliberately **not** used.
- **dataviz**: not applicable (no charts).

### 54.3 Recommended next step
1. **The client decision session** (about 45 minutes) on the "before P2" questions: Q-01 to Q-08, Q-14, Q-16 and Q-22. At the same time, send `CLIENT_INPUT_CHECKLIST.md` and request D-05 (logo), D-25 (the 05 reference image), D-14 (Google account) and D-22 (Cloudflare account).
2. **Then start P3 (the foundation) and P2 (the design proof) together.** P2 delivers the live style guide, the home hero and integration system, and the **Mobile NVR page with its Route scene**. That single slice validates the visual language, the trilingual typography, RTL, the scene engine and the performance budgets before any mass production.

**Implementation has not started.** This plan stops here for approval, as required.
