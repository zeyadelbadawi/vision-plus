# VISION PLUS — Client Input Checklist

**For:** the Vision Plus team.
**Purpose:** everything we still need from you to finish the website.

Nothing on this list exists in the materials you sent us, so we will **not** invent any of it. Until each item arrives, the website shows a clearly marked placeholder in preview. A public (production) release is **blocked** for anything marked **Launch blocker**.

**How to send:** use a shared folder named `vision-plus-client-inputs/`, with one subfolder per section below. Copy (text) can go in the translation workbook we will send you (`translations.xlsx`) or in a plain document.

Legend:
- 🔴 **Launch blocker:** the site cannot go public without it.
- 🟠 **Needed for launch of that section.** The section hides until the item is supplied.
- 🟢 **Optional or improvement.**

---

## Status after the client decisions of 2026-10-02

Full record (answer → action → status): **`docs/CLIENT_DECISIONS.md`**. The tables below this section are the original requests, kept unchanged.

**Decided:**
- Q-01: approved content first, sitemap mapped.
- Q-02: Products hidden.
- Q-08: 12 industries.
- Q-09: Site Survey goes in the Understand stage; Supply & Procurement once its text is approved.
- Q-12: preview shows 4 illustrative sample projects.
- Q-05 / Q-07: covered by D-13 and D-24.
- **P2:** approved except the Mobile NVR page (revision submitted).
- **P3:** accepted with open items.
- **P4:** approved (D-18, D-19, D-20).
- Git: `main` created and the reviewed work merged.

**Still needed from you:**

| Item | What is still needed | Priority |
|---|---|---|
| Q-03 | The exact menu order of Solutions, Products and Industries (the proposed order was not accepted). | 🟠 |
| Q-04 | The exact Vision, Mission and Core Values wording (the proposed content was not accepted). | 🟠 |
| Review | Revised Mobile NVR page: both scenes replaced with the approved Concepts A and B (`docs/review/p2-mnvr-final/`), **IMPLEMENTED 2026-10-02 (`626c894`) — AWAITING ZIAD'S REVIEW OF THE IMPLEMENTED PAGE**, then client review as applicable. P2 closes only after approval; P5 also needs Ziad's explicit authorisation. | 🔴 |
| Review | New wording since the English sign-off: Real Estate & Property Development summary, the Understand-stage sentence with Site Survey, the Supply & Procurement description, the industry order, and the 4 sample projects (`CLIENT_DECISIONS.md` §5). | 🟠 |
| D-01, D-02, D-03 | Verified office details and map links. Labelled dummy data is shown in preview until then. | 🔴 |
| D-04 | Inquiry notification email. | 🔴 |
| D-05 | Missing logo variants: horizontal lock-up (light and dark), monogram, favicon and app icons. The footer already uses your stacked logo; the header needs the horizontal one. | 🔴 |
| D-06, D-27, Q-06 | Canva profile, and whether Chinese visitors are in mainland China (decides canva.cn or PDF). | 🟠 |
| D-07, D-14, D-22 | Domain/DNS access, Google account, Cloudflare account. **D-22 blocks the preview link.** | 🔴 |
| D-08, D-09, D-10 | Verified partners, product data and real projects (samples are replaced before launch). | 🟠 |
| D-11, D-21, D-26 | Images and optional footage. Placeholders show the exact sizes until then. | 🔴 for P1 slots |
| D-12, D-13 | Names of the human reviewers for the Arabic and Chinese drafts. | 🔴 before launch |
| D-15, D-16, D-17 | Legal entity names, a legally reviewed privacy policy, social links. | 🔴 / 🔴 / 🟢 |
| D-23, Q-18 | Analytics decision (disabled until approved). | 🟢 |
| D-25 | `05_Vision_Plus_Reference_Image.jpg` (never received) and `03_…Sitemap.png` (the copy in the PDF is used). | 🟢 |
| Q-10, Q-11, Q-13–Q-23 | Not answered yet. | as listed below |

---

## A. Decisions we need from you first (short meeting, ~45 min)

These decide how we build. The full reasoning is in `MASTER_PROJECT_PLAN.md` §53.

| # | Question | Our recommendation |
|---|---|---|
| Q-01 | The website sitemap in the strategy PDF lists different Solutions, Services and Industries from the **approved content** (for example, the sitemap has no Mobile NVR, and its Services list is Security Consultation, Site Survey and so on). **Which should the website follow?** | Follow the **approved content** (8 solutions, 6 services, 11 industries) and map every sitemap item onto it (plan §9.2). |
| Q-02 | **Products:** we have category names only, and no products, brands per category or descriptions. How should Products launch? | Launch a "Technology Portfolio": 7 categories with an "Ask about this category" inquiry button. Brand logos per category are added when you confirm them. |
| Q-03 | Menu order: may **Solutions come before Products**? | Yes. It matches "We start with the requirement, not the product." |
| Q-04 | The PDF's Vision, Mission and 5 Core Values differ from the **approved content's** Vision, Mission and 7 Core Values. Confirm that we use the approved content. | Use the approved content. |
| Q-05 | **Who provides the Arabic text?** Only Chinese was confirmed as coming from you. | A professional human translator, reviewed by your Arabic-speaking team. |
| Q-06 | Are your Chinese-speaking visitors **inside mainland China**? | If yes, some Google and Cloudflare services are blocked there, and we will use fallbacks (plan §15.6). |
| Q-07 | Should "VISION PLUS" appear in Latin letters on the Arabic and Chinese pages, or do you have official Arabic and Chinese versions of the name? | Keep Latin unless you have official versions. |
| Q-08 | The sitemap lists "Real Estate & Compounds" as an industry, but the approved content does not. Add it (with approved text), or fold it into Residential and Commercial? | Fold it in, unless you supply approved text. |
| Q-09 | "Site Survey" and "Supply & Procurement" appear in the sitemap but have no approved text. Add them as services? | "Supply & Procurement" is valuable for your reseller role. Add it **if** you provide approved text. |
| Q-10 | Confirm the industry-to-solution links we derived from your approved text (plan §12.4). | Confirm or edit the table. |
| Q-11 | Launch all three languages together, or English first? | Together, if the Arabic and Chinese copy are ready. The site supports either. |
| Q-12 | Show the Projects and Partners sections only once real data exists? | Yes. We never show fake projects or partners. |
| Q-13 | Partner logos: uniform monochrome (more premium and consistent), or original colours? | Monochrome, with colour on hover. |
| Q-14 | The taglines in the palette mock-ups ("Smarter Security, Brighter Tomorrow", and so on) are not in the approved content. Are they approved website copy? | We do not use them unless you approve them. |
| Q-17 | Arabic pages: Western digits (2017, +974…) or Arabic-Indic digits (٢٠١٧)? | Western digits for years, phone numbers and technical data. |
| Q-18 | Do you want website analytics? | Optional. Free, cookie-less analytics (no consent banner needed). |
| Q-20 | Should visitors receive an automatic "we received your message" email? | Not at launch. It can be abused to send email to strangers. We show a confirmation on screen instead. |
| Q-21 | Do you want WhatsApp or social media links? | Only if you provide them. |
| Q-15 | Should the main address be `www.yourdomain` or `yourdomain` (no www)? | Either works; the other one redirects. Your IT preference decides. |
| Q-16 | Is your company Google account **Google Workspace** (company email) or a personal Gmail? | Workspace: it allows 1,500 emails/day (Gmail allows 100/day) and sends from your company address. |
| Q-19 | "Become a Partner" (in your sitemap): who is it for — manufacturers, resellers, installers or subcontractors? | Tell us, and we'll word the form accordingly. |
| Q-22 | **Hosting:** Vercel's free plan is for **non-commercial personal use only**, and a company website is commercial. May we host on **Cloudflare's free plan** instead? Commercial use is allowed there and it costs $0. | Yes (plan §42.1). |
| Q-23 | Which Arabic market is primary for search engines: Qatar or Egypt? | Qatar (headquarters since 2017), unless you prefer Egypt. *Interim (P5A-14): the Arabic social cards declare `ar_QA`; one constant changes it.* |

---

## B. Company and contact information

| ID | Item | Details | Priority |
|---|---|---|---|
| D-01 | **Qatar office** | Full address (as it should appear, in English; Arabic and Chinese in the workbook), phone number(s) in international format, office email, and business hours (optional) | 🔴 |
| D-02 | **Egypt office** | Same as Qatar | 🔴 |
| D-03 | **Map locations** | For each office, open the location in Google Maps and send (1) the **Share → "Send a link"** URL and (2) the **Share → "Embed a map" → HTML** code. No API key is needed. *(b)* If mainland-China visitors matter (Q-06), also send an Amap (高德) or Baidu Maps link. | 🔴 |
| D-04 | **Form notification email** | The **one** address that receives website inquiries | 🔴 |
| D-15 | **Legal entity names** | The registered company names in Qatar and in Egypt, as they should appear in the footer "©" line and in search-engine data | 🟠 |
| D-16 | **Privacy policy** | The privacy text, reviewed by your legal adviser. The form collects names, emails and phone numbers, and Qatar and Egypt both have personal-data laws. We can supply a structure, but not legal wording. | 🔴 |
| D-17 | **Social media** | Profile URLs (LinkedIn and others), if any | 🟢 |
| D-24 | **Name in Arabic / Chinese** | Only if official versions exist (Q-07) | 🟢 |

## C. Brand

| ID | Item | Details | Priority |
|---|---|---|---|
| D-05 | **Official logo** | Vector files (SVG, plus AI/EPS or PDF): horizontal logo on light and dark backgrounds, a symbol or monogram if one exists, and any brand rules (clear space, minimum size). The hero banner you sent (2026-09-29) shows the "VisionPlus" logo with the VP monogram. Please send it as vectors so the header and footer can use it; we cannot trace a logo from a picture. Also confirm whether "From vision to execution" is approved copy. | 🔴 |
| D-25 | **Missing source files** | `03_Vision_Plus_Website_Sitemap.png` (we used the copy inside the PDF) and **`05_Vision_Plus_Reference_Image.jpg` (not received; contents unknown)** | 🟠 |

## D. Content

| ID | Item | Details | Priority |
|---|---|---|---|
| D-12 | **Chinese (Simplified) text** | Fill in the Chinese column of `translations.xlsx` (we send it after the English is locked). Please do not use machine translation. | 🔴 for the Chinese launch |
| D-13 | **Arabic text** | Fill in the Arabic column of `translations.xlsx` (see Q-05) | 🔴 for the Arabic launch |
| D-18 | **English sign-off** | Approve (1) the short summaries we cut from your approved text, and (2) new interface wording such as button labels, form messages and headings for Contact and Products. Every item is marked in the workbook. **Ready for review (P4):** `docs/P4_CLIENT_REVIEW.md` §1, the “Awaiting English sign-off” table in `docs/CONTENT_FIDELITY_REPORT.md`, and the *Interface* sheet of `docs/i18n/translations.xlsx`. Record the decision in `docs/P4_CLIENT_REVIEW.md` §6. | 🔴 |
| D-19 | **Relationship tables** | Confirm the industry-to-solution table (plan §12.4) and the service-to-approach-step mapping (plan §26.5). **Ready for review (P4):** `docs/P4_CLIENT_REVIEW.md` §2; record the decision in §6. | 🟠 |
| D-09 | **Products** | For each of the 7 categories (CCTV & Surveillance, Access Control, Time & Attendance, Video Intercom, Intrusion & Alarm, Fire & Life Safety, Security Networking): a 1–2 sentence description, the brands you supply in that category, and optionally key product lines. Note that the brands in the strategy PDF are a **market list**; we will only show brands you confirm you supply. | 🟠 |

## E. Partners

| ID | Item | Details | Priority |
|---|---|---|---|
| D-08 | **Technology partners** | For each: the official name, and the official logo (SVG preferred; monochrome **and** colour versions if available). Please confirm Vision Plus is **authorised to display** each logo, because many manufacturers restrict logo use to authorised partners. The website link is optional. | 🟠 (the section is hidden until supplied) |

## F. Projects

| ID | Item | Details | Priority |
|---|---|---|---|
| D-10 | **Project portfolio** | For each project: Project Name · Location (city, country) · Client name **or** "Confidential" plus sector · Solutions Delivered (from the 8) · Scope of Work (3–6 sentences or bullet points) · Completion Year · images: 1 cover, 1 wide hero, and 4–12 gallery images (sizes in `IMAGE_ASSET_MANIFEST.md`) · **the client's permission to publish** the name and photos. We recommend at least 6 projects for launch so that filtering is useful. | 🟠 (the section is hidden until supplied) |

## G. Images

| ID | Item | Details | Priority |
|---|---|---|---|
| D-11 | **Website imagery** | All slots in `IMAGE_ASSET_MANIFEST.md` / `image-asset-manifest.csv`, with exact sizes, crops and file names. Real photography only, with consent from people who appear and permission for client sites. **HOME-HERO is received** (1500×938). Please also send the full-size master (2880×1800) and, ideally, a dedicated 4:5 mobile version (1080×1350). | P1 slots 🔴 |
| D-21 | **Smart Building photo sequence** *(optional upgrade)* | 3–5 photos of the **same real interior** from a fixed tripod position (lights off, zones on, shades down, and so on), for the interactive Smart Building scene | 🟢 |
| D-26 | **Mobile NVR footage** *(optional)* | Real, cleared camera footage or screenshots from a Vision Plus mobile surveillance system, used as an optional short clip | 🟢 |

## H. Company Profile (Canva)

| ID | Item | Details | Priority |
|---|---|---|---|
| D-06 | **Canva embed** | In Canva: Share → Embed → copy the **HTML embed code**. Note that Canva makes an embedded design **public**. Tell us: one presentation for all languages, or separate English, Arabic and Chinese versions? Also send a PNG of the cover slide (1920×1080) for the loading and fallback image. A downloadable PDF is optional. | 🟠 |
| D-27 | **Canva China** *(only if Q-06 = yes)* | An embed from canva.cn for Chinese visitors, or a PDF fallback | 🟢 |

## I. Accounts and access (all free; the client owns them)

Everything runs on free services. **You own the accounts, and we are added as collaborators.** Nothing is billed.

| ID | Item | Details | Priority |
|---|---|---|---|
| D-07 | **Domain and DNS** | The domain name, and who manages its DNS (registrar or DNS host). There is no purchase, because you already own it. Free Cloudflare hosting needs the domain's **nameservers moved to Cloudflare** (also free). Existing records, **including company email (MX)**, are copied over first and checked with your IT before the switch (plan §42.3). We need someone who can change nameservers at the registrar on the agreed day. | 🔴 |
| D-14 | **Google account** | The company Google account (Google Workspace preferred) that will **own the inquiries spreadsheet** and the small script that writes to it and sends the email. We never need its password; you share access with us. | 🔴 |
| D-22 | **Cloudflare account** (Free plan) | Created with a company email you control, with us invited as members. It hosts the website, the form's anti-spam and the DNS. No card is needed. **To switch on preview deployments we need:** (1) the member invitation, (2) a workers.dev subdomain chosen in Workers & Pages, (3) an API token from the **"Edit Cloudflare Workers"** template, scoped to this account, and (4) the Account ID. Items 3 and 4 are stored only as GitHub secrets (`CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_ACCOUNT_ID`). Step by step: `docs/DEPLOYMENT.md` §2. | 🔴 |
| D-23 | **Analytics** *(if Q-18 = yes)* | Cloudflare Web Analytics (free, no cookies), switched on in the same account | 🟢 |

## J. Approvals during the project

| ID | Item | When |
|---|---|---|
| D-20 | Storyboards of the solution-page animations. **Approved 2026-10-02.** The new Mobile NVR “On board” diagram (§2a) is pending review. | Phase 4 |
| — | Design direction proof (live style guide + homepage hero + one solution page). **Ready for review:** homepage (approval relayed), Mobile NVR page with the Route scene first cut, and the style guide — screenshots in `docs/review/p2/`; a live preview link needs D-22 | Phase 2 |
| — | English copy lock: **done (D-18, 2026-10-02)**; later additions are reviewed separately | Before translation |
| — | Arabic and Chinese review by native speakers on the staging site | Phase 8 |
| — | Final launch approval | Phase 11 |
