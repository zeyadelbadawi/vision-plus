# VISION PLUS — Content & Storyboard Review (Phase 4)

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
  - **170 interface strings** (buttons, menu labels, form labels, error messages) in the workbook's *Interface* sheet.
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

These questions were never answered, so P4 applied the plan's documented default **and kept the alternative cheap to switch**. Nothing here is treated as approved.

| # | Question | Default applied in P4 | What changes if you decide otherwise |
|---|---|---|---|
| Q-01 | Approved content or the sitemap as the site structure? | Approved content (8 solutions, 6 services, 11 industries), with every sitemap name redirected to its match | Registries and redirects only |
| Q-02 | How should Products launch? | Category names only (from your sitemap), no descriptions, an “Ask about this category” inquiry | Page layout in P5; no content change |
| Q-04 | Which Vision, Mission and Values? | Those in `01` (7 values) | Swap the About copy |
| Q-07 | Brand name in Arabic and Chinese? | “VISION PLUS” stays in Latin (workbook rule) | One glossary line |
| Q-08 | Add “Real Estate & Compounds”? | **Not added** (no approved text); no redirect yet | Add an industry entry once you supply approved text |
| Q-09 | Add Site Survey and Supply & Procurement? | Site Survey points to the approach section; **Supply & Procurement not added** (no approved text) | Add a service once you supply approved text |
| Q-10 | Confirm the industry relations | §2 above, marked *derived* | Edit the table |
| Q-17 | Arabic numerals? | Western digits (workbook rule) | One workbook rule |
| Q-19 | Who is “Become a Partner” for? | The form type exists; **no helper text written** until you answer | One string |

## 5. Translation workbook

`docs/i18n/translations.xlsx` has one row per distinct English string, with max-length hints and notes.
- **Approved rows** (352 of 374 page-copy rows) can be translated **now**.
- **Derived/draft rows** wait for D-18.

Arabic needs a professional human translator (Q-05, D-13); Simplified Chinese comes from you (D-12). Machine translation is not accepted for the final text, and the website build refuses it.
