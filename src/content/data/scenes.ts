/**
 * Scene registry (MASTER_PROJECT_PLAN §23.5–§23.6) — the machine-readable side of docs/SCENE_STORYBOARDS.md.
 *
 * Scenes may only show approved terms (§23.6). So every beat title, label and caption is a REFERENCE into
 * the English copy, never a literal: `ref` is "<copy file>:<dot.path>" and `text` is the exact words shown.
 * tests/unit/scenes.test.ts resolves each reference and checks that `text` is that value, one of its list
 * items, one of its sentences, or (match: 'phrase', flagged for D-18) a phrase inside it.
 * Localized scenes resolve the same references in ar/zh copy, so translations flow in automatically.
 *
 * Status: storyboards drafted in P4, awaiting client approval (D-20). Artwork and code are P5B.
 */
import type { SolutionSlug } from './registry';

export interface CopyRef {
  /** "<file>:<path>", e.g. "solutions:items.cctv-security-systems.headline". */
  ref: string;
  /** The words shown on screen. */
  text: string;
  /** How `text` relates to the referenced value (default: exact value, list item or sentence). */
  match?: 'phrase';
}

export interface SceneBeat {
  key: string;
  /** Beat heading in the DOM step text (omitted for subtle scenes that have no step headings). */
  title?: CopyRef;
  /** Approved body text for the beat, if any. */
  text?: CopyRef;
  /** Short labels drawn inside the artwork. */
  labels: CopyRef[];
}

export type SceneClass = 'signature' | 'rich' | 'moderate' | 'subtle';
export type SceneMode = 'pinned' | 'stepped' | 'inview' | 'static';

export interface Scene {
  id: string;
  name: string;
  /** Solution page it belongs to; omitted for the homepage signature. */
  solution?: SolutionSlug;
  classification: SceneClass;
  /** Mode below and at/above the lg breakpoint; reduced motion and no-JS are always `static`. */
  modes: { base: SceneMode; lg: SceneMode };
  /** Gzipped SVG budget (§23.5). */
  budgetKb: number;
  beats: SceneBeat[];
  /** Closing caption or typographic coda shown after the last beat. */
  coda?: CopyRef[];
  status: 'built-approved' | 'storyboard-pending-d20';
}

const sol = (slug: SolutionSlug, path: string) => `solutions:items.${slug}.${path}`;
const caps = (slug: SolutionSlug) => sol(slug, 'capabilities.items');

const MNVR = 'mobile-nvr-mobile-surveillance';
const pillar = (i: number, key: string, title: string, text: string, labels: CopyRef[] = []): SceneBeat => ({
  key,
  title: { ref: sol(MNVR, `fleet.pillars.${i}.title`), text: title },
  text: { ref: sol(MNVR, `fleet.pillars.${i}.text`), text },
  labels,
});

export const scenes: Scene[] = [
  {
    id: 'home-integration-system',
    name: 'Integration System',
    classification: 'signature',
    modes: { base: 'stepped', lg: 'inview' },
    budgetKb: 30,
    status: 'built-approved',
    beats: [
      {
        key: 'nodes',
        title: { ref: 'home:integration.title', text: 'One Technology Partner. Multiple Capabilities.' },
        labels: [
          { ref: 'catalog:solutions.mobile-nvr-mobile-surveillance.name', text: 'Mobile NVR & Mobile Surveillance' },
          { ref: 'catalog:solutions.cctv-security-systems.name', text: 'CCTV & Security Systems' },
          { ref: 'catalog:solutions.access-control.name', text: 'Access Control' },
          { ref: 'catalog:solutions.networking-ict.name', text: 'Networking & ICT' },
          { ref: 'catalog:solutions.elv-systems.name', text: 'ELV Systems' },
          { ref: 'catalog:solutions.audio-visual.name', text: 'Audio Visual' },
          { ref: 'catalog:solutions.smart-building-home-automation.name', text: 'Smart Building & Home Automation' },
          { ref: 'catalog:solutions.fire-alarm-systems.name', text: 'Fire Alarm Systems' },
        ],
      },
    ],
  },
  {
    id: 'mnvr-route',
    name: 'Route',
    solution: MNVR,
    classification: 'rich',
    modes: { base: 'stepped', lg: 'pinned' },
    budgetKb: 45,
    status: 'storyboard-pending-d20',
    beats: [
      pillar(0, 'video', 'Video', 'Capture and record activity inside and around vehicles.', [
        { ref: caps(MNVR), text: 'Multi-Channel HD/IP Vehicle Cameras' },
      ]),
      pillar(1, 'location', 'Location', 'Understand where each connected vehicle or mobile asset is operating.', [
        { ref: caps(MNVR), text: 'GPS Tracking & Positioning' },
      ]),
      pillar(2, 'connectivity', 'Connectivity', 'Maintain communication through mobile and wireless networks.', [
        { ref: caps(MNVR), text: '4G/5G Connectivity' },
        { ref: caps(MNVR), text: 'Wi-Fi Communication' },
      ]),
      pillar(3, 'monitoring', 'Monitoring', 'Access live video, recorded footage, vehicle status, and events remotely.', [
        { ref: caps(MNVR), text: 'Remote Live Viewing' },
        { ref: caps(MNVR), text: 'Remote Video Playback' },
      ]),
      pillar(4, 'intelligence', 'Intelligence', 'Use analytics and event information to identify situations requiring attention.', [
        { ref: caps(MNVR), text: 'Emergency & Event Alerts' },
      ]),
      pillar(5, 'management', 'Management', 'Bring multiple vehicles, users, cameras, locations, and events into a centralized management environment.', [
        { ref: caps(MNVR), text: 'Centralized Fleet Monitoring' },
      ]),
    ],
    coda: [
      { ref: sol(MNVR, 'fleet.equation'), text: 'Video' },
      { ref: sol(MNVR, 'fleet.equation'), text: 'Location' },
      { ref: sol(MNVR, 'fleet.equation'), text: 'Connectivity' },
      { ref: sol(MNVR, 'fleet.equation'), text: 'Data' },
      { ref: sol(MNVR, 'fleet.equation'), text: 'Intelligence' },
    ],
  },
  {
    id: 'smart-responsive-space',
    name: 'Responsive Space',
    solution: 'smart-building-home-automation',
    classification: 'rich',
    modes: { base: 'stepped', lg: 'pinned' },
    budgetKb: 45,
    status: 'storyboard-pending-d20',
    beats: (
      [
        ['comfort', 'Comfort', ['Lighting Control', 'Climate Control']],
        ['efficiency', 'Efficiency', ['Curtains & Shading', 'Environmental Controls']],
        ['control', 'Control', ['Smart Interfaces', 'Mobile Applications', 'Centralized Management']],
        ['security', 'Security', ['Security Systems', 'Access Control']],
        ['experience', 'Experience', ['Audio Visual']],
      ] as const
    ).map(([key, word, labels], i) => ({
      key,
      title: { ref: sol('smart-building-home-automation', `values.${i}`), text: word },
      labels: labels.map((text) => ({ ref: caps('smart-building-home-automation'), text })),
    })),
    coda: [{ ref: sol('smart-building-home-automation', 'closingLead'), text: 'Instead of operating multiple independent systems, users gain one coordinated environment built around:' }],
  },
  {
    id: 'elv-one-infrastructure',
    name: 'One Infrastructure',
    solution: 'elv-systems',
    classification: 'rich',
    modes: { base: 'stepped', lg: 'pinned' },
    budgetKb: 45,
    status: 'storyboard-pending-d20',
    beats: [
      {
        key: 'coordination',
        title: { ref: sol('elv-systems', 'principles.items.0.title'), text: 'Coordination' },
        text: { ref: sol('elv-systems', 'principles.items.0.text'), text: 'Systems are considered as part of the complete project rather than individual packages.' },
        // Strand legend: only systems named by the approved solutions.
        labels: [
          { ref: 'catalog:solutions.cctv-security-systems.name', text: 'CCTV & Security Systems' },
          { ref: 'catalog:solutions.access-control.name', text: 'Access Control' },
          { ref: 'catalog:solutions.networking-ict.name', text: 'Networking & ICT' },
          { ref: 'catalog:solutions.audio-visual.name', text: 'Audio Visual' },
          { ref: 'catalog:solutions.fire-alarm-systems.name', text: 'Fire Alarm Systems' },
          { ref: 'catalog:solutions.smart-building-home-automation.name', text: 'Smart Building & Home Automation' },
        ],
      },
      {
        key: 'integration',
        title: { ref: sol('elv-systems', 'principles.items.1.title'), text: 'Integration' },
        text: { ref: sol('elv-systems', 'principles.items.1.text'), text: 'Technologies communicate wherever meaningful operational value can be achieved.' },
        labels: [],
      },
      {
        key: 'reliability',
        title: { ref: sol('elv-systems', 'principles.items.2.title'), text: 'Reliability' },
        text: { ref: sol('elv-systems', 'principles.items.2.text'), text: 'Infrastructure is engineered for dependable long-term operation.' },
        labels: [],
      },
      {
        key: 'scalability',
        title: { ref: sol('elv-systems', 'principles.items.3.title'), text: 'Scalability' },
        text: { ref: sol('elv-systems', 'principles.items.3.text'), text: 'Systems remain capable of adapting to changing requirements and future expansion.' },
        labels: [],
      },
    ],
    coda: [{ ref: sol('elv-systems', 'headline'), text: 'Multiple Systems. One Infrastructure.' }],
  },
  {
    id: 'cctv-see-know-respond',
    name: 'See · Know · Respond',
    solution: 'cctv-security-systems',
    classification: 'moderate',
    modes: { base: 'stepped', lg: 'stepped' },
    budgetKb: 30,
    status: 'storyboard-pending-d20',
    beats: [
      { key: 'see', title: { ref: sol('cctv-security-systems', 'headline'), text: 'See More.' }, labels: [{ ref: caps('cctv-security-systems'), text: 'IP CCTV Systems' }] },
      {
        key: 'know',
        title: { ref: sol('cctv-security-systems', 'headline'), text: 'Know More.' },
        labels: [
          { ref: caps('cctv-security-systems'), text: 'Intelligent Video Analytics' },
          { ref: caps('cctv-security-systems'), text: 'Perimeter Surveillance' },
        ],
      },
      {
        key: 'respond',
        title: { ref: sol('cctv-security-systems', 'headline'), text: 'Respond Better.' },
        labels: [
          { ref: caps('cctv-security-systems'), text: 'Centralized Monitoring' },
          { ref: caps('cctv-security-systems'), text: 'Multi-Site Surveillance' },
        ],
      },
    ],
  },
  {
    id: 'access-who-where-when',
    name: 'Who · Where · When',
    solution: 'access-control',
    classification: 'moderate',
    modes: { base: 'stepped', lg: 'stepped' },
    budgetKb: 30,
    status: 'storyboard-pending-d20',
    beats: [
      {
        key: 'who',
        title: { ref: sol('access-control', 'closing'), text: 'Who enters', match: 'phrase' },
        labels: [
          { ref: caps('access-control'), text: 'Card & Credential Access' },
          { ref: caps('access-control'), text: 'Biometric Authentication' },
          { ref: caps('access-control'), text: 'Mobile Credentials' },
        ],
      },
      {
        key: 'where',
        title: { ref: sol('access-control', 'closing'), text: 'Where they enter', match: 'phrase' },
        labels: [{ ref: caps('access-control'), text: 'Centralized Access Management' }],
      },
      {
        key: 'when',
        title: { ref: sol('access-control', 'closing'), text: 'When', match: 'phrase' },
        labels: [
          { ref: caps('access-control'), text: 'Time & Attendance' },
          { ref: caps('access-control'), text: 'CCTV Integration' },
          { ref: caps('access-control'), text: 'Vehicle Barriers' },
        ],
      },
    ],
    coda: [{ ref: sol('access-control', 'closing'), text: 'By connecting access control with other security technologies, organizations gain greater visibility and control over who enters, where they enter, and when.' }],
  },
  {
    id: 'fire-critical-sequence',
    name: 'Critical Sequence',
    solution: 'fire-alarm-systems',
    classification: 'moderate',
    modes: { base: 'inview', lg: 'inview' },
    budgetKb: 30,
    status: 'storyboard-pending-d20',
    beats: [
      { key: 'detection', title: { ref: caps('fire-alarm-systems'), text: 'Fire Detection' }, labels: [] },
      { key: 'notification', title: { ref: caps('fire-alarm-systems'), text: 'Alarm & Notification' }, labels: [] },
      { key: 'integration', title: { ref: caps('fire-alarm-systems'), text: 'System Integration' }, labels: [] },
      {
        key: 'commissioning',
        title: { ref: caps('fire-alarm-systems'), text: 'Testing & Commissioning' },
        labels: [{ ref: caps('fire-alarm-systems'), text: 'Documentation' }],
      },
    ],
    coda: [{ ref: sol('fire-alarm-systems', 'headline'), text: 'Technology with a Critical Purpose.' }],
  },
  {
    id: 'ict-topology',
    name: 'Topology',
    solution: 'networking-ict',
    classification: 'subtle',
    modes: { base: 'inview', lg: 'inview' },
    budgetKb: 30,
    status: 'storyboard-pending-d20',
    beats: [
      {
        key: 'build',
        labels: [
          { ref: caps('networking-ict'), text: 'Fiber-Optic Infrastructure' },
          { ref: caps('networking-ict'), text: 'Network Switching & Routing' },
          { ref: caps('networking-ict'), text: 'Structured Cabling' },
          { ref: caps('networking-ict'), text: 'Enterprise Wi-Fi' },
        ],
      },
      { key: 'today', labels: [] },
      { key: 'tomorrow', labels: [] },
    ],
    coda: [{ ref: sol('networking-ict', 'closing'), text: 'We design networks not only around today’s requirements, but around the technologies that may depend on them tomorrow.' }],
  },
  {
    id: 'av-disappear',
    name: 'Disappear',
    solution: 'audio-visual',
    classification: 'subtle',
    modes: { base: 'inview', lg: 'inview' },
    budgetKb: 30,
    status: 'storyboard-pending-d20',
    beats: [
      {
        key: 'technology',
        labels: [
          { ref: caps('audio-visual'), text: 'Video Conferencing' },
          { ref: caps('audio-visual'), text: 'Professional Displays' },
          { ref: caps('audio-visual'), text: 'Professional Audio' },
          { ref: caps('audio-visual'), text: 'Control Systems' },
        ],
      },
      { key: 'experience', labels: [] },
    ],
    coda: [{ ref: sol('audio-visual', 'closing'), text: 'Make the technology disappear into the experience.' }],
  },
];
