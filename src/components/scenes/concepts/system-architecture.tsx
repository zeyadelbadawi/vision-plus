import type { CSSProperties, ReactNode } from 'react';

/**
 * CONCEPT B — the system as an architecture schematic (preview prototype for Ziad's review, 2026-10-02).
 * Proposed replacement for the Mobile NVR page's second scene (the Route scene; scope authorised by Ziad for the
 * Mobile NVR revision only). Three zones read in the language direction: the vehicle (cameras and GPS feeding the
 * Mobile NVR with its local storage), the networks (4G/5G and Wi-Fi), and the remote platform (live viewing,
 * playback, alerts, fleet monitoring). The six approved beats (Video, Location, Connectivity, Monitoring,
 * Intelligence, Management) light the zone and connection they describe, and data pulses travel the connections.
 * Beat 6 adds further vehicles that join the same networks: the count is symbolic. Every label is an approved
 * capability term; no data, footage or numbers.
 *
 * Two layouts share the same parts: 'wide' (desktop stage, zones side by side) and 'tall' (mobile, zones stacked so
 * each beat's frame is a full-width crop with complete labels).
 */
export interface ArchTerms {
  cameras: string;
  nvr: string;
  storage: string;
  gps: string;
  cellular: string;
  wifi: string;
  live: string;
  playback: string;
  alerts: string;
  fleet: string;
}

type Box = { x: number; y: number; w: number; h: number };
type Label = { x: number; y: number; anchor?: 'start' | 'middle' };
interface Geometry {
  w: number;
  h: number;
  vehicleZone: Box;
  ghosts: Box[];
  platformZone: Box;
  vehicleGlyph: [number, number];
  cams: Box[];
  camLinks: string[];
  nvr: Box;
  bays: Box[];
  gps: Box;
  gpsLink: string;
  net: [number, number][];
  netR: number;
  uplinks: string[];
  fleetLinks: string[];
  panes: Box[];
  play: Box;
  alert: Box;
  fleet: Box;
  rows: { y: number; x0: number; x1: number }[];
  labels: Record<keyof ArchTerms, Label>;
}

const range = (n: number) => Array.from({ length: n }, (_, i) => i);

const WIDE: Geometry = (() => {
  const nvr = { x: 190, y: 200, w: 180, h: 190 };
  const camY = [150, 214, 278, 342];
  return {
    w: 1000,
    h: 700,
    vehicleZone: { x: 24, y: 60, w: 376, h: 580 },
    ghosts: [
      { x: 56, y: 92, w: 376, h: 580 },
      { x: 40, y: 76, w: 376, h: 580 },
    ],
    platformZone: { x: 660, y: 60, w: 316, h: 580 },
    vehicleGlyph: [62, 92],
    cams: camY.map((y) => ({ x: 52, y, w: 60, h: 40 })),
    camLinks: camY.map((y, i) => `M112 ${y + 20} H${140 + i * 10} V${228 + i * 36} H${nvr.x}`),
    nvr,
    bays: range(3).map((k) => ({ x: nvr.x + 18, y: nvr.y + 70 + k * 22, w: nvr.w - 36, h: 12 })),
    gps: { x: 52, y: 482, w: 320, h: 64 },
    gpsLink: `M280 482 V${nvr.y + nvr.h}`,
    net: [
      [520, 230],
      [520, 420],
    ],
    netR: 34,
    uplinks: [`M${nvr.x + nvr.w} 250 H420 V230 H486`, `M${nvr.x + nvr.w} 330 H420 V420 H486`, 'M554 230 H684', 'M554 420 H620 V412 H684'],
    fleetLinks: ['M416 640 H512 V454', 'M432 656 H528 V454'],
    panes: range(4).map((i) => ({ x: 684 + (i % 2) * 138, y: 96 + Math.floor(i / 2) * 84, w: 130, h: 76 })),
    play: { x: 684, y: 300, w: 268, h: 40 },
    alert: { x: 684, y: 392, w: 268, h: 52 },
    fleet: { x: 684, y: 470, w: 268, h: 146 },
    rows: range(3).map((k) => ({ y: 524 + k * 30, x0: 740, x1: 900 - k * 40 })),
    labels: {
      cameras: { x: 52, y: 132 },
      nvr: { x: 190, y: 188 },
      storage: { x: 208, y: 372 },
      gps: { x: 114, y: 520 },
      cellular: { x: 520, y: 290, anchor: 'middle' },
      wifi: { x: 520, y: 372, anchor: 'middle' },
      live: { x: 684, y: 284 },
      playback: { x: 684, y: 364 },
      alerts: { x: 732, y: 422 },
      fleet: { x: 700, y: 498 },
    },
  };
})();

const TALL: Geometry = (() => {
  const nvr = { x: 36, y: 190, w: 328, h: 130 };
  const camX = [36, 108, 180, 252];
  return {
    w: 420,
    h: 1140,
    vehicleZone: { x: 16, y: 20, w: 368, h: 400 },
    ghosts: [
      { x: 40, y: 44, w: 368, h: 400 },
      { x: 28, y: 32, w: 368, h: 400 },
    ],
    platformZone: { x: 16, y: 600, w: 368, h: 520 },
    vehicleGlyph: [52, 50],
    cams: camX.map((x) => ({ x, y: 100, w: 60, h: 38 })),
    camLinks: camX.map((x, i) => `M${x + 30} 138 V${152 + i * 6} H${110 + i * 60} V${nvr.y}`),
    nvr,
    bays: range(3).map((k) => ({ x: nvr.x + 18, y: nvr.y + 44 + k * 20, w: nvr.w - 36, h: 10 })),
    gps: { x: 36, y: 344, w: 328, h: 56 },
    gpsLink: `M200 344 V${nvr.y + nvr.h}`,
    net: [
      [120, 520],
      [280, 520],
    ],
    netR: 30,
    uplinks: [`M${nvr.x} 300 H26 V512 H91`, `M${nvr.x + nvr.w} 300 H374 V512 H309`, 'M120 550 V620', 'M280 550 V620'],
    fleetLinks: ['M392 432 V528 H307', 'M404 444 V540 H302'],
    fleet: { x: 36, y: 620, w: 328, h: 132 },
    rows: range(3).map((k) => ({ y: 680 + k * 26, x0: 98, x1: 330 - k * 50 })),
    panes: range(4).map((i) => ({ x: 36 + (i % 2) * 168, y: 772 + Math.floor(i / 2) * 86, w: 160, h: 78 })),
    play: { x: 36, y: 974, w: 328, h: 38 },
    alert: { x: 36, y: 1050, w: 328, h: 50 },
    labels: {
      cameras: { x: 36, y: 86 },
      nvr: { x: 54, y: 216 },
      storage: { x: 54, y: 308 },
      gps: { x: 92, y: 378 },
      cellular: { x: 120, y: 478, anchor: 'middle' },
      wifi: { x: 280, y: 478, anchor: 'middle' },
      live: { x: 36, y: 958 },
      playback: { x: 36, y: 1034 },
      alerts: { x: 86, y: 1081 },
      fleet: { x: 54, y: 648 },
    },
  };
})();

export const ARCH = { w: WIDE.w, h: WIDE.h } as const;

/** Mobile frames (tall layout): the full-width band each beat needs (x, y, w, h), LTR coordinates. */
export const ARCH_FRAMES: [number, number, number, number][] = [
  [0, 30, 420, 300],
  [0, 176, 420, 240],
  [0, 284, 420, 290],
  [0, 756, 420, 290],
  [0, 966, 420, 152],
  [0, 404, 420, 360],
];

function Glyph({ kind, x, y }: { kind: 'camera' | 'pin' | 'bars' | 'wifi' | 'play' | 'bell' | 'vehicle'; x: number; y: number }) {
  const g: Record<typeof kind, ReactNode> = {
    camera: (
      <>
        <rect x={-14} y={-9} width={22} height={18} rx={3} />
        <path d="M8 -4 L16 -8 V8 L8 4" />
        <circle cx={-3} cy={0} r={4.5} />
      </>
    ),
    pin: (
      <>
        <path d="M0 13 C-9 3 -11 -3 -11 -6 A11 11 0 0 1 11 -6 C11 -3 9 3 0 13 Z" />
        <circle cx={0} cy={-6} r={3.5} />
      </>
    ),
    bars: <path d="M-12 10 V4 M-4 10 V-1 M4 10 V-6 M12 10 V-11" />,
    wifi: <path d="M-14 -3 A20 20 0 0 1 14 -3 M-9 3 A13 13 0 0 1 9 3 M-4 9 A6 6 0 0 1 4 9" />,
    play: <path d="M-5 -7 L7 0 L-5 7 Z" />,
    bell: (
      <>
        <path d="M-9 6 V-1 A9 9 0 0 1 9 -1 V6 L11 9 H-11 Z" />
        <path d="M-3 12 H3" />
      </>
    ),
    vehicle: (
      <>
        <rect x={-15} y={-8} width={30} height={14} rx={3} />
        <circle cx={-8} cy={8} r={3} />
        <circle cx={8} cy={8} r={3} />
      </>
    ),
  };
  return (
    <g className="ax-glyph" transform={`translate(${x} ${y})`}>
      {g[kind]}
    </g>
  );
}

const R = ({ b, rx, className }: { b: Box; rx: number; className?: string }) => <rect className={className} x={b.x} y={b.y} width={b.w} height={b.h} rx={rx} />;

export function SystemArchitecture({
  rtl,
  terms,
  layout = 'wide',
  viewBox,
  frame,
}: {
  rtl: boolean;
  terms: ArchTerms;
  layout?: 'wide' | 'tall';
  viewBox?: [number, number, number, number];
  frame?: number;
}) {
  const G = layout === 'tall' ? TALL : WIDE;
  const mx = (x: number) => (rtl ? G.w - x : x);
  const vb = viewBox ? (rtl ? [G.w - viewBox[0] - viewBox[2], viewBox[1], viewBox[2], viewBox[3]] : viewBox) : [0, 0, G.w, G.h];
  // Text never mirrors: its anchor point does. 'start' follows the document direction (the right edge in RTL).
  const label = (beat: number, key: keyof ArchTerms, cls = '') => {
    const l = G.labels[key];
    return (
      <text className={`ax-label ${cls}`} data-beat={beat} x={mx(l.x)} y={l.y} textAnchor={l.anchor ?? 'start'}>
        {terms[key]}
      </text>
    );
  };
  const flow = (d: string, i = 0) => <path className="ax-flow" pathLength={1} d={d} style={{ '--i': i } as CSSProperties} />;
  const wire = (d: string, i: number, cls = 'ax-wire') => (
    <g key={d}>
      <path className={cls} pathLength={1} d={d} />
      {flow(d, i)}
    </g>
  );
  const { nvr } = G;

  return (
    <svg className="ax" viewBox={vb.join(' ')} aria-hidden="true" focusable="false" data-frame={frame} data-layout={layout}>
      <g transform={rtl ? `translate(${G.w} 0) scale(-1 1)` : undefined}>
        {/* beat 6: further vehicles behind the first (symbolic count) and their links into the networks */}
        <g className="ax-part" data-beat="6">
          {G.ghosts.map((b) => (
            <R key={`${b.x}-${b.y}`} b={b} rx={18} className="ax-zone ax-zone--ghost" />
          ))}
          {G.fleetLinks.map((d, i) => wire(d, i, 'ax-wire ax-wire--fleet'))}
        </g>

        {/* zone frames */}
        <R b={G.vehicleZone} rx={18} className="ax-zone" />
        <Glyph kind="vehicle" x={G.vehicleGlyph[0]} y={G.vehicleGlyph[1]} />
        <R b={G.platformZone} rx={18} className="ax-zone ax-zone--platform" />

        {/* beat 1 · cameras → recorder */}
        <g className="ax-part" data-beat="1">
          {G.camLinks.map((d, i) => wire(d, i))}
        </g>
        {G.cams.map((c) => (
          <g key={`${c.x}-${c.y}`} className="ax-node ax-node--cam" data-beat="1">
            <R b={c} rx={8} />
            <Glyph kind="camera" x={c.x + c.w / 2} y={c.y + c.h / 2} />
          </g>
        ))}

        {/* the Mobile NVR with local storage (the hub) */}
        <g className="ax-node ax-node--nvr" data-beat="1">
          <R b={nvr} rx={12} />
          <circle className="ax-led" cx={nvr.x + nvr.w - 26} cy={nvr.y + 22} r={4} />
          {G.bays.map((b, k) => (
            <rect key={k} className="ax-bay" x={b.x} y={b.y} width={b.w} height={b.h} rx={3} style={{ '--i': k } as CSSProperties} />
          ))}
        </g>

        {/* beat 2 · GPS → recorder */}
        <g className="ax-part" data-beat="2">
          {wire(G.gpsLink, 0)}
        </g>
        <g className="ax-node" data-beat="2">
          <R b={G.gps} rx={10} />
          <Glyph kind="pin" x={G.gps.x + 30} y={G.gps.y + G.gps.h / 2} />
        </g>

        {/* beat 3 · uplinks through 4G/5G and Wi-Fi to the platform */}
        <g className="ax-part" data-beat="3">
          {G.uplinks.map((d, i) => wire(d, i))}
        </g>
        {G.net.map(([x, y], i) => (
          <g key={x + y} className="ax-node ax-node--net" data-beat="3">
            <circle cx={x} cy={y} r={G.netR} />
            <Glyph kind={i ? 'wifi' : 'bars'} x={x} y={y + (i ? 2 : 0)} />
            <circle className="ax-ring" cx={x} cy={y} r={G.netR} />
          </g>
        ))}

        {/* beat 4 · remote live viewing and playback */}
        <g className="ax-node ax-node--view" data-beat="4">
          {G.panes.map((b, i) => (
            <rect key={i} className="ax-pane" x={b.x} y={b.y} width={b.w} height={b.h} rx={4} style={{ '--i': i } as CSSProperties} />
          ))}
        </g>
        <g className="ax-node ax-node--play" data-beat="4">
          <R b={G.play} rx={6} />
          <Glyph kind="play" x={G.play.x + 22} y={G.play.y + G.play.h / 2} />
          <path className="ax-track" d={`M${G.play.x + 46} ${G.play.y + G.play.h / 2} H${G.play.x + G.play.w - 16}`} />
          <path className="ax-track ax-track--on" pathLength={1} d={`M${G.play.x + 46} ${G.play.y + G.play.h / 2} H${G.play.x + G.play.w - 16}`} />
        </g>

        {/* beat 5 · event alerts (steady gold, never red or blinking) */}
        <g className="ax-node ax-node--alert" data-beat="5">
          <R b={G.alert} rx={6} />
          <Glyph kind="bell" x={G.alert.x + 24} y={G.alert.y + G.alert.h / 2} />
        </g>

        {/* beat 6 · centralized fleet monitoring */}
        <g className="ax-node ax-node--fleet" data-beat="6">
          <R b={G.fleet} rx={6} />
          {G.rows.map((r, k) => (
            <g key={k} className="ax-row" style={{ '--i': k } as CSSProperties}>
              <Glyph kind="vehicle" x={r.x0 - 28} y={r.y} />
              <path d={`M${r.x0} ${r.y} H${r.x1}`} />
            </g>
          ))}
        </g>
      </g>

      {/* approved terms (never mirrored) */}
      {label(1, 'cameras')}
      {label(1, 'nvr', 'ax-label--strong')}
      {label(1, 'storage', 'ax-label--muted')}
      {label(2, 'gps')}
      {label(3, 'cellular')}
      {label(3, 'wifi')}
      {label(4, 'live')}
      {label(4, 'playback')}
      {label(5, 'alerts')}
      {label(6, 'fleet')}
    </svg>
  );
}
