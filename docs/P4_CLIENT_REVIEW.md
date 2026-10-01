# VISION PLUS — Content & Storyboard Review (Phase 4)

**Phase status:** Ready for Acceptance — **not accepted or closed**. Nothing in this document is approved until it is signed off in §6.

**For:** the Vision Plus team. **What we need:** three sign-offs (D-18, D-19, D-20) and answers to the open questions in §4.
Nothing below adds new company information. All website text comes from your approved content (`01`), except the few items clearly marked *derived* or *draft*.

---

## 1. English copy sign-off (D-18)

- **Your approved content is complete on the website.** All 372 approved sentences, headings and list items from `01` are encoded word for word. The only changes are typographic: curly quotes, and title case for headings set in capitals. Proof: `docs/CONTENT_FIDELITY_REPORT.md`, which is checked automatically on every change.
- **Please approve or edit:**
  - **22 page-copy strings** that are *derived* (selected from your approved text or your sitemap) or *draft* (written by us), each listed with its source in the report's “Awaiting English sign-off” table. Examples:
    - the Contact headline “Tell us what you need to achieve.”;
    - the Products headline reused from your partner line;
    - the 7 product-category names taken from your sitemap.
  - **176 interface strings** (buttons, menu labels, form labels, error messages) in `messages/en.json`, shown as **165 rows** in the workbook's *Interface* sheet, because repeated strings are listed once. (Six of them were added on 2026-10-01 for the P2/P3 pages: “Home” in breadcrumbs and five preview-only notices.)
- A few lines from `01` are deliberately not used as website text. They are listed in the report with the reason, for example “Selected projects can be presented according to:” and the `[Website]` / `[Email]` placeholders.

## 2. Relations (D-19)

These links drive the “Related” sections on each page. They were derived **only** from the wording of your approved text. Please confirm or edit.

**Industry → related solutions** (from each approved industry sentence, `01` §18):

| Industry | Related solutions | Words in your approved sentence |
|---|---|---|
| Transportation & Fleet | Mobile NVR & Mobile Surveillance | “Mobile NVR” |
| Government & Public Sector | CCTV & Security · Access Control · Networking & ICT | “surveillance”, “security” · “access management” · “networking” |
| Commercial & Corporate | Networking & ICT · CCTV & Security · Access Control · Audio Visual · Smart Building & Home Automation | “ICT” · “security” · “access control” · “AV” · “automation” |
| Banking & Finance | CCTV & Security · Access Control · Networking & ICT | “surveillance”, “centralized monitoring” · “controlled access” · “connectivity” |
| Hospitality | CCTV & Security · Audio Visual · Networking & ICT | “security” · “communication”, “entertainment” · “connectivity” |
| Retail | CCTV & Security · Networking & ICT · Audio Visual | “Security”, “monitoring”, “analytics” · “connectivity” · “digital communication” |
| Education | CCTV & Security · Networking & ICT · Access Control · Mobile NVR | “security” · “networking” · “access” · “transportation monitoring” |
| Healthcare | CCTV & Security · Access Control · Networking & ICT | “security” · “access” · “networking” |
| Residential | CCTV & Security · Networking & ICT · Audio Visual · Access Control · Smart Building & Home Automation | “security” · “networking” · “entertainment” · “access” · “smart home automation” |
| Logistics & Warehousing | CCTV & Security · Access Control · Networking & ICT · Mobile NVR | “surveillance” · “access management” · “ICT infrastructure” · “fleet monitoring”, “mobile surveillance” |
| Industrial & Manufacturing | CCTV & Security · Networking & ICT | “security”, “monitoring” · “networking” |

ELV Systems and Fire Alarm Systems are named by no industry sentence, so they show as “applies across environments” rather than being linked to industries.

**Service → approach steps** (shown as “Stages: …” on the Services page):

| Service | Steps |
|---|---|
| System Design & Consultancy | Understand · Design · Select |
| Project Management | Deliver |
| Installation & Commissioning | Deliver |
| Testing & Integration | Integrate · Verify |
| Maintenance & After-Sales Support | Support |
| Technical Training & Support | Enable |

**Product category → related solution:**

| Category | Solution |
|---|---|
| CCTV & Surveillance | CCTV & Security Systems |
| Access Control | Access Control |
| Time & Attendance | Access Control (an approved Access Control capability) |
| Fire & Life Safety | Fire Alarm Systems |
| Security Networking | Networking & ICT |
| Video Intercom | none (no approved text; D-09) |
| Intrusion & Alarm | none (no approved text; D-09) |

## 3. Scene storyboards (D-20)

`docs/SCENE_STORYBOARDS.md` describes each animated scene frame by frame for desktop, mobile and reduced motion. The scenes cover the 8 solution pages; the homepage scene is already approved. Every word a scene shows is your approved text. Please tick each scene in §11 of that document. Each scene also lists one or two questions for you.

## 4. Open decisions (defaults applied, not assumed approved)

No answer to these questions has been recorded in the decision log (MASTER_PROJECT_PLAN §53.3). P4 therefore applied the plan's documented default and kept the alternative cheap to switch. **Nothing here is treated as approved.**

The list is every question the plan ties to P4:
- the P4 dependencies in the roadmap (§49.1): Q-01, Q-02, Q-04, Q-08, Q-09;
- every question the decision log marks “needed before P4”: Q-02, Q-04, Q-05, Q-07, Q-08, Q-09, Q-10, Q-14, Q-19.

| # | Question | Needed before (§53.3) | Plan default (§53.3) | How P4 applies the default (pending your answer) | If you decide otherwise |
|---|---|---|---|---|---|
| Q-01 | Approved content or the sitemap as the site structure? | P2 (and a P4 dependency, §49.1) | Approved content, with the sitemap mapped | 8 solutions, 6 services, 11 industries from `01`; every sitemap name redirects to its match (§9.2) | Registries and redirects only |
| Q-02 | How should Products launch? | P4 | A (inquiry-led) | Category names only (from your sitemap), no descriptions, an “Ask about this category” inquiry | Page layout in P5; no content change |
| Q-04 | Which Vision, Mission and Values? | P4 | `01` | Those in `01` (7 values) | Swap the About copy |
| Q-05 | Who produces the Arabic copy? | P4 | A professional translator arranged by the client | The workbook asks for a professional human translator; machine translation is refused by the build (§5) | Workbook instructions only |
| Q-07 | Brand name in Arabic and Chinese? | P4 | Keep Latin | “VISION PLUS” stays in Latin (workbook glossary rule) | One glossary line |
| Q-08 | Add “Real Estate & Compounds”? | P4 | Fold it in, unless copy is supplied | **Not added** as an industry (no approved text). No redirect yet, because “fold in” spans two industries (Residential and Commercial). | Add an industry entry once you supply approved text, or confirm which industry the old name should point to |
| Q-09 | Add Site Survey and Supply & Procurement? | P4 | Supply & Procurement, if copy is supplied | Site Survey redirects to the approach section (§9.2); **Supply & Procurement not added** (no approved text) | Add a service once you supply approved text |
| Q-10 | Confirm the industry relations | P4 | Confirm §12.4 | §2 above, marked *derived* (this is the D-19 item) | Edit the table |
| Q-14 | Are the mock-up taglines approved? | P4 | No, unless confirmed | **None encoded**: no tagline from the palette mock-ups appears in the website copy | Add the approved line to the copy |
| Q-19 | Who is “Become a Partner” for? | P4 | Clarify; it sets the partnership form's helper text | The form type exists; **no helper text written** until you answer | One string |

**Not a P4 question:** Q-17 (Arabic numerals) is needed before P8. The workbook's Arabic note already follows its default (Western digits) and says it is pending confirmation.

## 5. Translation workbook

`docs/i18n/translations.xlsx` has one row per distinct English string, with max-length hints and notes.
- **Status: prepared, not released.** The workbook is sent to translators only after D-18 is approved, so that the whole English text is locked first (plan §13: “English copy is locked” is step 1).
- **Approved rows** (352 of 374 page-copy rows) already hold the client-approved English from `01`.
- **Derived/draft rows** (the other 22 page-copy rows and all interface rows) may still change through D-18.

Arabic needs a professional human translator (Q-05, D-13); Simplified Chinese comes from you (D-12). Machine translation is not accepted for the final text, and the website build refuses it.

## 6. Sign-off record

P4 closes when these three items are signed off. Until then, each stays pending.

| Item | What to review | Decision | Who / date |
|---|---|---|---|
| D-18 English sign-off | §1 above, plus the “Awaiting English sign-off (D-18)” table in `docs/CONTENT_FIDELITY_REPORT.md` and the *Interface* sheet of `docs/i18n/translations.xlsx` | ☐ Approved ☐ Approved with edits (attach list) | |
| D-19 Relations | §2 above (industry → solution, service → approach steps, product category → solution) | ☐ Approved ☐ Approved with edits (attach list) | |
| D-20 Storyboards | `docs/SCENE_STORYBOARDS.md` §11 (one decision per scene) | ☐ All scenes approved ☐ Changes requested | |
