# VISION PLUS — Scene Storyboards

**Phase:** P4 · **For client approval:** D-20 (one decision per scene, logged in §11).
**Spec:** MASTER_PROJECT_PLAN §23.5 (engine) and §23.6 (per-solution concepts). **Built in:** P5B (artwork and code), only after approval. Exception, as the plan specifies: the Mobile NVR Route scene has a P2 *first cut* for direction review (built 2026-10-01); its final version still follows D-20.
**Mobile NVR update (2026-10-02, `885b397`):** on the Mobile NVR page, the Route scene's visual is now Concept B, the architecture schematic (§2.0), and a second scene, On board, uses Concept A, the isometric cutaway (§2a). Ziad approved both as the direction and limited the change to the Mobile NVR page. The implemented page awaits his review, then the client's approval. The beat text of §2 is unchanged.
**Machine-readable twin:** `src/content/data/scenes.ts`. Every word a scene shows is a reference into the approved copy; `tests/unit/scenes.test.ts` fails the build if a label is not approved text.

Per the plan's working rule, the storyboards are text, not images. Each frame below describes exactly what is drawn, so the client can approve the idea before any artwork is produced. Small composition sketches show layout only, not style.

---

## 0. How to read these storyboards

### 0.1 Notation
| Mark | Meaning |
|---|---|
| **D** | Desktop, ≥ 1024 px (`lg`). Pinned scenes keep the artwork fixed while the step texts scroll past. |
| **T** | Tablet, 768–1023 px. Stepped, with a 3:4 crop of the artwork per beat. |
| **M** | Mobile, < 768 px. Stepped: one compact text block plus a 4:5 artwork frame per beat, playing once as it enters. |
| **RM** | `prefers-reduced-motion: reduce`, and also the no-JavaScript state. Nothing moves; the final composition and all texts are shown. |
| **DOM text** | The real HTML text for the beat, read by screen readers and search engines. It is approved copy (key given), never text inside the drawing. |
| **Label** | A short approved term drawn next to an element. It is localised from the copy files, never baked into the artwork. |

### 0.2 Rules that apply to every scene
1. **Concept, not decoration.** Each scene visualises one approved idea from `01` (source given per scene).
2. **Approved words only.** Labels and beat titles come from the approved copy. Where a beat title is a *phrase* taken from an approved sentence, it is flagged for the English sign-off (D-18). Today that is only the three Access Control beat titles.
3. **No invented data.** No numbers, speeds, camera counts, timestamps, plate numbers, names, alarms, prices or fake screens. Status is symbolic: an element is grey (idle) or gold (active).
4. **Visual language.** Hairline technical linework at 1 px and 1.5 px. Colours come only from the Option B tokens: `--color-charcoal`, `--color-gray-dark`, `--color-gray-mid`, `--color-gray-light`, `--color-off-white`, `--color-white`, and `--color-gold` for “active / signal”. No glow blur, no gradients except Smart Building light pools, no red, and **no flashing**.
5. **Motion vocabulary (§23.3).**
   - *Draw*: a line draws along its path.
   - *Signal*: a short gold segment travels along a connection.
   - *Activate*: an element switches from grey to gold, with an optional 2 px halo stroke.
   - *Recede*: opacity falls.

   There is no bounce or overshoot. Easing is `--ease-precise`; scroll-linked progress is linear per beat.
6. **Artboard.** 1440 × 900 for desktop, with named mobile crops per beat. Layers are tagged `data-beat="n"` and `data-mirror="true|false"`.
7. **Budgets.** SVG ≤ 45 KB gzipped for rich scenes and ≤ 30 KB for the others. The shared controller is ≤ 3 KB. No extra fonts. A scene is never the LCP element.
8. **Scroll length (pinned).** About 70 svh per beat. Total height = beats × 70 svh + 100 svh.
9. **RTL.** Route, flow and topology layers mirror. Text, device fronts and anything with inherent handedness do not.
10. **Low power.** On `saveData` or `deviceMemory ≤ 2`, desktop also uses stepped mode.

### 0.3 Scene inventory
| # | Scene | Page | Class | D / T / M | Beats | Status |
|---|---|---|---|---|---|---|
| 1 | Integration System | Home | Signature | in-view / stepped / stepped | 8 nodes | **Built and approved with the homepage**: documented as built, no change |
| 2 | Route | Mobile NVR & Mobile Surveillance | Rich | pinned / stepped / stepped | 6 + coda | **First cut built in P2** (`6932552`, on the Mobile NVR page; screenshots `docs/review/p2/route-*`). Storyboard still awaiting D-20 |
| 2a | On board | Mobile NVR & Mobile Surveillance | Rich, step-synchronised | sticky / sticky / sticky (static in RM) | 5 | **Concept A implemented (`885b397`)**; awaiting Ziad's review of the implemented page. Scene 2's visual was replaced by Concept B in the same commit (§2.0) |
| 3 | Responsive Space | Smart Building & Home Automation | Rich | pinned / stepped / stepped | 5 + coda | Awaiting D-20 |
| 4 | One Infrastructure | ELV Systems | Rich (moderate length) | pinned / stepped / stepped | 4 + coda | Awaiting D-20 |
| 5 | See · Know · Respond | CCTV & Security Systems | Moderate | stepped (sticky art on D) | 3 | Awaiting D-20 |
| 6 | Who · Where · When | Access Control | Moderate | stepped (sticky art on D) | 3 + coda | Awaiting D-20 |
| 7 | Critical Sequence | Fire Alarm Systems | Moderate, restrained | in-view sequence | 4 + coda | Awaiting D-20 |
| 8 | Topology | Networking & ICT | Subtle | in-view, scrubbed in its own height | 3 phases + caption | Awaiting D-20 |
| 9 | Disappear | Audio Visual | Subtle | in-view, scrubbed in its own height | 2 phases + caption | Awaiting D-20 |

---

## 1. Integration System — Homepage (as built, approved)

**Concept:** “One Technology Partner. Multiple Capabilities.” (`01` §06). One origin, VISION PLUS, on a single engineered bus; the eight capabilities connect to it.
**Source in code:** `src/components/sections/home/integration-system.tsx`, `src/styles/home.css` (`.isys`). This section records the approved behaviour so later work cannot drift from it.

| State | Desktop (≥ 1024) | Mobile / tablet (< 1024) |
|---|---|---|
| Layout | Horizontal rail across the container, with the “VISION PLUS” origin node at the inline start and 8 capability nodes dropping from the rail. A readout panel shows the active node's name and approved summary. | Vertical spine at the inline start, with 8 rows. Each row shows the name, link and approved summary. |
| Motion | When the diagram enters view, one gold signal pass draws the rail (1.8 s, time-based). Each node's marker turns gold as the signal passes it. | The spine's gold fill grows with scroll position, and each marker turns gold as the reader reaches it. |
| Interaction | Hover or focus on a node makes it active: gold underline, marker outline, and its summary in the readout. Keyboard users reach the nodes as an ordered list of links. | Every summary is always visible; the rows are links. |
| RM / no JS | Fully drawn rail, all markers gold, all summaries in the DOM. | Fully drawn spine, all markers gold. |
| Labels | The 8 solution names (`catalog.json` `solutions.*.name`) and the summaries (`solutions.*.summary`), all approved (`01` §06). | Same. |

The homepage Mobile NVR chapter deliberately animates only the **equation** (a gold signal through “Video + Location + Connectivity + Data + Intelligence”), so the full Route scene stays special to its own page (§23.6.9).

---

## 2. Route — Mobile NVR & Mobile Surveillance (Rich)

### 2.0 Implemented visual: Concept B, the architecture schematic (replaces the city map, 2026-10-02, `885b397`)

The six beats, their DOM text and their labels are unchanged (the beat table below). Only the artwork changed. Ziad found the city-map diagram static and asked for a more professional visual. He authorised the replacement for the Mobile NVR page only and approved Concept B as the direction. The implemented page awaits his review.

| | |
|---|---|
| **Artwork** | `src/components/scenes/mnvr-architecture-art.tsx`. Three zones in a dark, hairline schematic, reading in the language direction: **the vehicle** (four camera nodes and GPS feeding the Mobile NVR with its local storage); **the networks** (4G/5G and Wi-Fi); **the remote platform** (2 × 2 live-view panes, a playback strip, event alerts, fleet monitoring). Every label is an approved capability term. There is no footage, data or number; the fleet count is symbolic. |
| **Modes** | Shared scene engine (`scroll-scene.tsx`, `scenes.css`). **Desktop (≥ 1024 px):** the stage is pinned beside the six beat texts. Each part follows its beat's `--bN`, so the diagram builds with the scroll and unbuilds when scrolling back. **Below 1024 px:** one full-width frame per beat, cropped from a stacked layout (`layout="tall"`) so every label is complete. Each frame shows its own beat built, earlier beats built and later beats waiting (14 %). **Reduced motion / no JS:** the complete diagram on desktop, and every frame complete on mobile. |
| **Motion** | Building is opacity and stroke-dashoffset only. The current beat (`data-current`, MotionController `[data-steps]`) runs data pulses along its connections three times, then rests; its nodes and glyphs turn gold. No loops, no flashing, never red. |
| **RTL** | The artwork mirrors, so the flow runs from the inline end. Labels are never mirrored and anchor at the inline start. |

| Beat | What builds | Data flow (current beat) |
|---|---|---|
| 1 Video | Camera nodes, cabling into the Mobile NVR, storage bars | Pulses from every camera into the recorder |
| 2 Location | GPS node and its link into the recorder | Pulse along the GPS link |
| 3 Connectivity | 4G/5G and Wi-Fi nodes; uplinks from the recorder through both networks to the platform | Pulses along the uplinks; the network rings ping |
| 4 Monitoring | Live-view panes light; the playback strip runs | — (the panes and the strip are the emphasis) |
| 5 Intelligence | Event alerts node (steady gold) | — |
| 6 Management | Further vehicles behind the first, with their links into the networks; fleet-monitoring rows | Pulses along the fleet links |

The table and composition below describe the **earlier city-map artwork** (`6932552`), kept as the record.


| | |
|---|---|
| **Approved concept** | “Security That Moves With You.” The six pillars Video / Location / Connectivity / Monitoring / Intelligence / Management, and “Video + Location + Connectivity + Data + Intelligence” (`01` §07–§08). |
| **Why this intensity** | The key differentiator, and the idea *is* movement, which still images cannot show. |
| **Placement** | Solution page section 3, after Context (§26.2). |
| **Modes** | D pinned (6 beats + coda, ~520 svh); T stepped (3:4 crops); M stepped (6 frames + sticky 6-tick progress bar). |
| **Budget** | ≤ 45 KB gzipped SVG. The photography slots `SOL-MNVR-HERO` and `SOL-MNVR-FLEET` are separate. |

**Artwork:** a plan view of a city grid in hairline charcoal and grey linework (roads, blocks). It contains:

| Layer | `data-beat` | Mirror |
|---|---|---|
| Base grid | 0 | yes |
| Depot (small outlined compound at the inline-start edge) | 0 | yes |
| Management node (a square node with a frame glyph, inline-end side) | 4 | yes (position) |
| Vehicle (symmetric top-down glyph, no text) | 1 | **no** |
| Primary route | 1 | yes |
| Coverage wedges | 1 | yes |
| Trail markers | 2 | yes |
| Network points (3 small masts along the route) | 3 | yes |
| Uplink seam | 4 | yes |
| Attention zone | 5 | yes |
| Secondary routes and vehicles | 6 | yes |

```
D composition (1440 × 900)            ┌──────────────────────────────────────────────┐
  step texts scroll on the            │ ░ grid ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ │
  inline-start column (5 cols);       │ [depot]══route═══╗           ┌───┐            │
  artwork pinned in 7 cols            │        ▲ masts   ╚══◆══╗      │ ▣ │ mgmt node │
                                      │                       ╚═════└───┘            │
                                      └──────────────────────────────────────────────┘
```

| Beat | DOM text (approved key) | D frame | M frame (4:5 crop) | Labels | Motion |
|---|---|---|---|---|---|
| 1 Video | “Video”, “Capture and record activity inside and around vehicles.” (`solutions:…fleet.pillars.0`) | The primary route draws from the depot. The vehicle appears at the route start. Four short coverage wedges open around it (front, rear, two sides), grey fills with gold edges. | Vehicle centred, wedges opening. | Multi-Channel HD/IP Vehicle Cameras | Draw → activate |
| 2 Location | “Location”, “Understand where each connected vehicle or mobile asset is operating.” (`pillars.1`) | The vehicle travels along the route with scroll progress, leaving a dotted trail of small location markers. | Vehicle centred on a route segment; the trail appears behind it. | GPS Tracking & Positioning | Scroll-linked travel |
| 3 Connectivity | “Connectivity”, “Maintain communication through mobile and wireless networks.” (`pillars.2`) | Short signal arcs pass from the vehicle to the three network points as it nears each one. | Vehicle plus one mast; one arc. | 4G/5G Connectivity · Wi-Fi Communication | Signal (no pulsing) |
| 4 Monitoring | “Monitoring”, “Access live video, recorded footage, vehicle status, and events remotely.” (`pillars.3`) | A gold seam extends from the vehicle to the management node, which opens a simple frame glyph (an empty outlined screen). There is no fake footage. | Node and frame glyph, with the seam entering from the frame edge. | Remote Live Viewing · Remote Video Playback | Draw → activate |
| 5 Intelligence | “Intelligence”, “Use analytics and event information to identify situations requiring attention.” (`pillars.4`) | One zone along the route is outlined in gold (a dashed rectangle) as the vehicle passes it. There are no incident details. | Zone outline around the vehicle. | Emergency & Event Alerts | Activate (steady, not blinking) |
| 6 Management | “Management”, “Bring multiple vehicles, users, cameras, locations, and events into a centralized management environment.” (`pillars.5`) | Two more routes draw, each with a vehicle. All three vehicles connect to the management node. The count is symbolic: the scene states no fleet size. | Node at the centre with three seams converging. | Centralized Fleet Monitoring | Draw → signal |
| Coda | Equation (`fleet.equation`) | The five pillar words assemble into “Video + Location + Connectivity + Data + Intelligence”, with gold plus signs, centred under the artwork. | The equation wraps over 2–3 lines. | — | Fade in by term |

- **Mobile extra:** a sticky 6-tick progress bar sits at the top of the scene section. The current tick is gold. It is `aria-hidden`, because the DOM step list carries the order.
- **RM / no JS:** the final composition (all three routes, all wedges, the node with its frame glyph, the zone outline) followed by the six pillar blocks as text and the equation.
- **RTL:** the route runs from the inline end. The depot and node positions mirror, labels are right-aligned, and the vehicle glyph is symmetric (not mirrored).
- **Must not show:** a branded vehicle, licence plates, speeds, times, maps of real places, “live” screens with imagery, or red alerts.
- **Questions for the client:**
  - Beats 1 and 2 add one approved capability label each (cameras, GPS), which the plan left unlabelled. Keep them?
  - Is a generic symmetric vehicle glyph acceptable (bus or van silhouette), or should it be abstract (a rounded rectangle)?

---

## 2a. On board — Concept A, the isometric technical cutaway (2026-10-02, `885b397`)

Ziad asked for the earlier vehicle illustration to be replaced by a more professional and convincing visual, and approved Concept A as the direction. The implemented page awaits his review. This scene was added after the storyboard set above.

| | |
|---|---|
| **Approved concept** | “Our approach brings together video, location, connectivity, data, and intelligent monitoring within one coordinated mobile security environment.” (`01` §07), shown as the system installed on one vehicle. |
| **Placement** | Section 2 of the dedicated Mobile NVR page, before the fleet-level scene (§2). |
| **Artwork** | `src/components/scenes/mnvr-onboard-art.tsx`, with geometry from `iso.ts`: an isometric cutaway of a generic, unbranded coach, with the near wall and roof cut away. Light surfaces, Option B tokens only, gold = active. The components are the five approved ones: cameras (front, rear, cabin, side) with their coverage; the Mobile NVR cabinet behind the driver, with cabling from every camera; the roof GPS antenna; the roof 4G/5G antenna with an uplink to a network mast; a remote monitoring wall whose panes light (**empty**, no imagery, D-26). No text in the art: numbered callouts only (never mirrored). The current step's approved title appears in a caption above the artwork (decorative; `aria-hidden`). |
| **Modes** | Step-synchronised (MotionController `[data-steps]`: `data-current`, `data-reached`, in both directions). Desktop: the stage is sticky in 8 columns beside the steps. Mobile and tablet: a compact sticky stage under the compact header. **Reduced motion / no JS:** the complete system at the overall view, with compact steps. |
| **Budget** | Inline SVG; no animation library. Only opacity, transform, fill and stroke-dashoffset animate. |

| Step | DOM text (approved key) | Builds when reached | Current-step emphasis (finite) | View |
|---|---|---|---|---|
| 1 | “Multi-Channel HD/IP Vehicle Cameras” · pillar Video text | Camera housings light; coverage on the road ahead, behind, at the kerb and on the cabin floor | Coverage sweeps twice | The vehicle and its coverage (the monitoring wall stays out of frame) |
| 2 | “Mobile Network Video Recorders” + “Secure Local Video Storage” · `body.2` | Cabling draws from every camera; the recorder lights and its storage bays fill | The recorder lifts slightly; video pulses run into it (3×) | Close on the recorder |
| 3 | “GPS Tracking & Positioning” · pillar Location text | The roof antenna lights; a position fix appears on the ground under the vehicle | The fix pings (3×) | Roof and ground |
| 4 | “4G/5G Connectivity” + “Wi-Fi Communication”, “Real-Time Video Transmission” · pillar Connectivity text | The antenna radiates; the uplink draws to the network mast | Arcs radiate; pulses travel the uplink (3×) | Vehicle and mast |
| 5 | “Remote Live Viewing” + “Remote Video Playback”, “Centralized Management Platforms” · pillar Monitoring text | The backhaul reaches the monitoring wall; its panes light | Pulses travel the backhaul (3×) | The whole system |

- **RTL:** the artwork mirrors; step numbers, callouts and text do not.
- **Must not show:** branding, plates, people, places, times, device counts, footage or alarms.
- **Arabic and Chinese step copy:** still the English placeholder (P8, D-12/D-13).
- **Tests:** `tests/unit/mnvr-page.test.ts` (approved copy references, callouts and views inside the artboard, the step 1 view excluding the wall); `tests/e2e/pages.spec.ts` (each step builds its part, the view follows the step, back-scroll un-builds, reduced motion, no JavaScript, RTL, axe).
- **Review evidence:** screenshots of the implemented scenes are kept on `claude/confident-cori-lahb3k` (`docs/review/p2-mnvr-final/`), not on `main`.

---

## 3. Responsive Space — Smart Building & Home Automation (Rich)

| | |
|---|---|
| **Approved concept** | “Spaces That Understand How They Are Used.” The integrated systems, and “Comfort • Efficiency • Control • Security • Experience” (`01` §14). |
| **Why this intensity** | The idea is an environment *responding*: change over time is the message. |
| **Modes** | D pinned (5 beats + coda, ~450 svh); T stepped; M stepped (5 frames, one room per frame). |
| **Budget** | ≤ 45 KB gzipped SVG. The optional photography upgrade (D-21, real matched exposures only) is ≤ 350 KB AVIF. |

**Artwork:** an architectural **section** drawing of a contemporary interior: entrance, living area and meeting space. It is charcoal linework on an off-white ground. Layers:

| Layer | `data-beat` | Mirror |
|---|---|---|
| Structure | 0 | yes |
| Light pools (soft gold radial fills, the only gradient allowed, because they *are* light) | 1 | yes |
| Climate indicator (a small dial glyph, no numbers) | 1 | yes |
| Shading (blinds) | 2 | yes |
| Wall panel + phone glyphs | 3 | **no** |
| Signal paths | 3 | yes |
| Entrance access point + security layer | 4 | yes |
| AV zone (display outline + speaker glyphs) | 5 | yes |

```
D composition — section view
  ┌──────────────┬───────────────────────┬──────────────┐
  │  entrance    │   living area          │  meeting     │
  │  [▯ access]  │  ◌ light pool  ▤ shade │  ▭ display   │
  │              │  ▢ panel     ◔ climate │  ◌ light     │
  └──────────────┴───────────────────────┴──────────────┘
```

| Beat | DOM text (approved key) | D frame | M frame (one room) | Labels | Motion |
|---|---|---|---|---|---|
| 1 Comfort | “Comfort” (`values.0`) | The scene starts in “evening” (grey). Light pools fade up zone by zone, and the climate dial settles to its rest position. | Living area | Lighting Control · Climate Control | Light-pool opacity, dial rotate |
| 2 Efficiency | “Efficiency” (`values.1`) | The unoccupied meeting space dims, and the blinds lower on the façade side. | Meeting space | Curtains & Shading · Environmental Controls | Opacity, blind translate |
| 3 Control | “Control” (`values.2`) | A gold signal travels from the wall panel and the phone to each system in turn. This is centralised management. | Panel and phone with paths fanning out | Smart Interfaces · Mobile Applications · Centralized Management | Signal |
| 4 Security | “Security” (`values.3`) | The entrance access point and the security layer (door contact and camera glyphs) become visible and turn gold. | Entrance | Security Systems · Access Control | Draw → activate |
| 5 Experience | “Experience” (`values.4`) | The AV zone activates. Every connection shows gold: one coordinated environment. | Meeting space with all paths | Audio Visual | Activate all |
| Coda | “Instead of operating multiple independent systems, users gain one coordinated environment built around:” (`closingLead`), then the five words | The five words line up under the drawing, separated by gold bullets. | Stacked | — | — |

- **RM / no JS:** the final “all active” state, then the five words as text blocks.
- **RTL:** all layers mirror except text and the panel/phone UI glyphs.
- **Must not show:** temperatures, percentages, energy figures, brand interfaces, or people's faces.
- **Questions for the client:**
  - Do you want the optional photography upgrade (D-21)? It needs a real shoot of one interior from a locked tripod (3–5 exposures), with no renders.
  - Is the section drawing (cut-through view) acceptable, or would you prefer a plan view?

---

## 4. One Infrastructure — ELV Systems (Rich, moderate length)

| | |
|---|---|
| **Approved concept** | “Multiple Systems. One Infrastructure.” and the four principles Coordination / Integration / Reliability / Scalability (`01` §12) |
| **Why this intensity** | It literally depicts the brand thesis: many systems becoming one. |
| **Modes** | D pinned (4 beats + coda, ~380 svh); T stepped; M stepped (4 frames, 2 floors each). |
| **Budget** | ≤ 45 KB gzipped SVG |

**Artwork:** a vertical building **cross-section** with four floors and a roof line, deliberately different from the Smart Building interior. Layers:
- floors (beat 0)
- six system strands per floor, one per approved system (beat 1)
- risers (beat 1)
- integration links (beat 2)
- the redundant backbone path (beat 3)
- the added floor (beat 4)

All layers mirror.

| Beat | DOM text (approved key) | D frame | M frame | Labels | Motion |
|---|---|---|---|---|---|
| 1 Coordination | “Coordination”, “Systems are considered as part of the complete project rather than individual packages.” (`principles.items.0`) | Six grey strands appear on each floor in scattered positions, then align into ordered vertical risers. | Floors 1–2 | Strand legend: CCTV & Security Systems · Access Control · Networking & ICT · Audio Visual · Fire Alarm Systems · Smart Building & Home Automation | Draw → translate into alignment |
| 2 Integration | “Integration”, “Technologies communicate wherever meaningful operational value can be achieved.” (`items.1`) | Short gold links appear *only* between some strands, not all. This is “wherever meaningful”. | Floors 2–3 | — | Activate links |
| 3 Reliability | “Reliability”, “Infrastructure is engineered for dependable long-term operation.” (`items.2`) | A second backbone path draws in parallel with the main riser. | Backbone close-up | — | Draw |
| 4 Scalability | “Scalability”, “Systems remain capable of adapting to changing requirements and future expansion.” (`items.3`) | A new floor slides in at the top; its strands connect to the existing backbone. | New floor joining | — | Translate → draw |
| Coda | “Multiple Systems. One Infrastructure.” (`headline`) | The whole section shows, ordered and gold-linked. | — | — | — |

- **Legend placement:** the six system names sit in a legend with a short coloured-weight key (stroke patterns, not colours), not on the strands. This keeps long names readable in all three languages.
- **RM / no JS:** the final state plus the four principles as text.
- **Must not show:** cable counts, floor numbers, building names, or vendor equipment.
- **Question for the client:** the strands represent the six systems named in your approved solutions (automation shown as Smart Building & Home Automation). Should any be removed?

---

## 5. See · Know · Respond — CCTV & Security Systems (Moderate)

| | |
|---|---|
| **Approved concept** | “See More. Know More. Respond Better.” plus centralised and multi-site monitoring (`01` §09) |
| **Modes** | Stepped on every breakpoint. On D the artwork stays sticky for 3 short beats (~210 svh). M has 3 frames. |
| **Budget** | ≤ 30 KB |

**Artwork:** a plan view of one main site (building footprint + perimeter fence line), two smaller site outlines, and a monitoring node. Camera symbols are small circles with an orientation tick.

| Beat | DOM title (approved key) | D frame | M frame | Labels | Motion |
|---|---|---|---|---|---|
| 1 See | “See More.” (sentence 1 of `headline`) | Camera positions on the main site open their field-of-view cones (grey fill, gold edge), and the overlaps become visible. | Main site | IP CCTV Systems | Cone sweep open (once) |
| 2 Know | “Know More.” (sentence 2) | One area is outlined as an analytics zone (dashed gold), and the perimeter line highlights. | Zone + perimeter | Intelligent Video Analytics · Perimeter Surveillance | Activate |
| 3 Respond | “Respond Better.” (sentence 3) | Feeds from all three sites flow as gold signals into the monitoring node. | Three sites converging | Centralized Monitoring · Multi-Site Surveillance | Signal |

- **DOM body:** each beat title is followed by its labels as a short list. The page's capability list and closing statement follow the scene.
- **RM / no JS:** the final state.
- **Must not show:** camera feeds, faces, licence plates, or camera counts. The positions are illustrative.

---

## 6. Who · Where · When — Access Control (Moderate)

| | |
|---|---|
| **Approved concept** | “…greater visibility and control over **who enters, where they enter, and when**.” and zones and credentials (`01` §10) |
| **Modes** | Stepped on every breakpoint, with sticky art on D (~210 svh). M has 3 frames. |
| **Budget** | ≤ 30 KB |

**Artwork:** concentric security layers in plan view (site perimeter → building → secured area). It has one pedestrian entry (a turnstile glyph), one vehicle entry (a barrier glyph) and a camera symbol near the checkpoint.

| Beat | DOM title | D frame | M frame | Labels | Motion |
|---|---|---|---|---|---|
| 1 Who enters | “Who enters” (**phrase** of `closing`; D-18) | A person symbol reaches the pedestrian entry. Three small credential glyphs appear beside it (card, fingerprint, phone). The entry turns gold (granted). | Entry close-up | Card & Credential Access · Biometric Authentication · Mobile Credentials | Translate → activate |
| 2 Where they enter | “Where they enter” (phrase; D-18) | Permitted zones light up progressively (gold outline). The secured area stays grey (not permitted). | Zones | Centralized Access Management | Activate in sequence |
| 3 When | “When” (phrase; D-18) | A simple day-segment track appears (a bar with segments and **no times**), representing scheduled access. A gold link connects the checkpoint to the camera. A vehicle passes the barrier. | Track + barrier | Time & Attendance · CCTV Integration · Vehicle Barriers | Draw → signal → translate |
| Coda | The full approved sentence (`closing`) | — | — | — | — |

- **RM / no JS:** the final state, with the full sentence.
- **Must not show:** names, ID numbers, photos, clock times, or red “denied” states. Denied is shown as grey (not lit).
- **Question for the client:** the three beat titles are phrases cut from your approved sentence. Approve them with the English copy (D-18), or we will use the full sentence only.

---

## 7. Critical Sequence — Fire Alarm Systems (Moderate, restrained)

| | |
|---|---|
| **Approved concept** | “Technology with a Critical Purpose.” Fire Detection → Alarm & Notification → System Integration → Testing & Commissioning / Documentation (`01` §15) |
| **Modes** | In-view: each beat plays once as it enters, with no pin. The whole sequence spans about one viewport. M uses the same sequence, stacked. |
| **Budget** | ≤ 30 KB |
| **Hard constraints** | **No flashing at any rate** (WCAG 2.3.1). **No red, no flames, no smoke.** Gold means “active”, as everywhere on the site. Calm easing. |

**Artwork:** a single-floor plan with ceiling detectors (small circles), a control panel (rectangle) and notification devices (small horn/strobe glyphs drawn as static outlines).

| Beat | DOM title (approved key) | Frame (all breakpoints) | Labels | Motion |
|---|---|---|---|---|
| 1 Fire Detection | “Fire Detection” (capability) | One detector turns gold with a **steady** ring. | — | Activate (no blink) |
| 2 Alarm & Notification | “Alarm & Notification” | A signal travels from the detector to the panel, then to the notification devices, which turn gold one by one. | — | Signal → activate |
| 3 System Integration | “System Integration” | The panel connects to a generic “integrated systems” node (an unlabelled square). No specific actions are claimed. | — | Draw |
| 4 Testing & Commissioning | “Testing & Commissioning” | The drawing settles into a clean “as-built” state (all lines solid charcoal, gold markers kept) and a document glyph appears. | Documentation | Settle → appear |
| Coda | “Technology with a Critical Purpose.” (`headline`) | — | — | — |

- **RM / no JS:** the final state.
- **Must not show:** fire, smoke, evacuation people, sirens or alarm sounds, or standards logos. The page's standards sentence (`closing`) follows the scene as text.

---

## 8. Topology — Networking & ICT (Subtle)

| | |
|---|---|
| **Approved concept** | “The Infrastructure Behind Every Connected Environment.” and “…not only around today’s requirements, but around the technologies that may depend on them tomorrow.” (`01` §11) |
| **Modes** | In-view, scrubbed within the section's own height with no pin. M is simplified to 3 layers. |
| **Budget** | ≤ 30 KB |

**Artwork:** a layered topology over a faint building footprint: one core node, a backbone ring, distribution nodes, and endpoint dots.

| Phase | Frame | Labels | Motion |
|---|---|---|---|
| Build | The layers draw from the core outward, with scroll progress. | Fiber-Optic Infrastructure · Network Switching & Routing · Structured Cabling · Enterprise Wi-Fi | Draw |
| Today | **One** slow gold signal pulse travels a single path, from the core to one endpoint. | — | Signal (once) |
| Tomorrow | Dashed “future” branches extend from two distribution nodes to empty endpoints. | — | Draw (dashed) |
| Caption | The approved sentence (`closing`) under the drawing | — | — |

- **Note:** the layer names “core / distribution / access” are **not** approved copy, so they are not shown. The four labels are approved capability names placed on the matching layers.
- **RM / no JS:** the fully drawn topology, including the dashed branches, and the caption.

---

## 9. Disappear — Audio Visual (Subtle)

| | |
|---|---|
| **Approved concept** | “Make the technology disappear into the experience.” (`01` §13) |
| **Modes** | In-view, scrubbed within its own height. M uses a 2-state crossfade. |
| **Budget** | ≤ 30 KB |

**Artwork:** an elevation drawing of a meeting room with a display, a camera above it, ceiling microphones, wall speakers, a control panel, a table, and 4–5 simple seated figure outlines (no faces).

| Phase | Frame | Labels | Motion |
|---|---|---|---|
| Technology | The technology linework draws in gold and is labelled. | Video Conferencing · Professional Displays · Professional Audio · Control Systems | Draw |
| Experience | The technology recedes to 15 % opacity; the room and the people remain in charcoal. | — | Recede |
| Caption | “Make the technology disappear into the experience.” (`closing`) resolves under the drawing. | — | Fade in |

- **RM / no JS:** a two-panel static comparison (*with* technology highlighted, then *receded*) and the caption.

---

## 10. Production notes for P5B (after approval)

1. **Order of build:** Mobile NVR (finish), Smart Building, ELV, CCTV, Access Control, Fire Alarm, Networking, AV (§49 P5B).
2. **Scene spec sheet per scene:** layer names, `data-beat` tags, stroke weights, tokens used via `currentColor` or CSS variables, artboard 1440 × 900 and the named mobile crops. Export through SVGO, keeping IDs and data attributes.
3. **Labels** are rendered from the localized copy at build time (SVG `<text>` or positioned HTML), so Arabic and Chinese flow in from the translation workbook with no new artwork.
4. **Scene lab:** `/[locale]/_lab/scenes` (preview only) scrubs each scene in every mode, including RM and RTL.
5. **Tests:** scene performance (compositor-only properties, ≤ 60 animated paths), reduced motion, no-JS, RTL screenshots, and `tests/unit/scenes.test.ts` (approved labels only).

---

## 11. Approval log (D-20)

Tick one box per scene, or add comments. Changes are made here first, then in `scenes.ts`.

| # | Scene | Decision | Comments | Who / date |
|---|---|---|---|---|
| 1 | Integration System (home) | Approved with the homepage | — | Client, homepage approval |
| 2 | Route — Mobile NVR | ☐ Approved ☐ Changes | | |
| 3 | Responsive Space — Smart Building | ☐ Approved ☐ Changes · Photography upgrade (D-21): ☐ yes ☐ no | | |
| 4 | One Infrastructure — ELV | ☐ Approved ☐ Changes | | |
| 5 | See · Know · Respond — CCTV | ☐ Approved ☐ Changes | | |
| 6 | Who · Where · When — Access Control | ☐ Approved ☐ Changes · Phrase titles (D-18): ☐ yes ☐ full sentence only | | |
| 7 | Critical Sequence — Fire Alarm | ☐ Approved ☐ Changes | | |
| 8 | Topology — Networking & ICT | ☐ Approved ☐ Changes | | |
| 9 | Disappear — Audio Visual | ☐ Approved ☐ Changes | | |
