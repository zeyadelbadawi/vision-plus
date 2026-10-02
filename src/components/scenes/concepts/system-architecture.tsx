import type { CSSProperties, ReactNode } from 'react';

/**
 * CONCEPT B — the system as an architecture schematic (preview prototype for Ziad's review, 2026-10-02).
 * Three zones read in the language direction: the vehicle (cameras and GPS feeding the Mobile NVR with its local
 * storage), the networks (4G/5G and Wi-Fi), and the remote platform (live viewing, playback, alerts, fleet
 * monitoring). The six approved beats (Video, Location, Connectivity, Monitoring, Intelligence, Management) light the
 * zone and connection they describe, and data pulses travel the connections. Beat 6 adds further vehicles that join
 * the same networks: the count is symbolic. Every label is an approved capability term; no data, footage or numbers.
 */
export const ARCH = { w: 1000, h: 700 } as const;

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

const CAM_Y = [150, 214, 278, 342];
const NVR = { x: 190, y: 200, w: 180, h: 190 };
const CAM_LINKS = CAM_Y.map((y, i) => `M112 ${y + 20} H${140 + i * 10} V${228 + i * 36} H${NVR.x}`);
const GPS_LINK = `M280 482 V${NVR.y + NVR.h}`; // GPS card top → recorder
const UP_CELL = `M${NVR.x + NVR.w} 250 H420 V230 H486`;
const UP_WIFI = `M${NVR.x + NVR.w} 330 H420 V420 H486`;
const CELL_OUT = 'M554 230 H684';
const WIFI_OUT = 'M554 420 H620 V412 H684';
const FLEET_LINKS = ['M416 640 H512 V454', 'M432 656 H528 V454'];

/** Mobile frames: the part of the artboard each beat needs (x, y, w, h), in LTR coordinates. */
export const ARCH_FRAMES: [number, number, number, number][] = [
  [20, 76, 400, 330],
  [20, 160, 400, 400],
  [330, 194, 380, 304],
  [606, 70, 384, 306],
  [606, 330, 384, 310],
  [0, 40, 1000, 680],
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
    bars: (
      <>
        <path d="M-12 10 V4 M-4 10 V-1 M4 10 V-6 M12 10 V-11" />
      </>
    ),
    wifi: (
      <>
        <path d="M-14 -3 A20 20 0 0 1 14 -3 M-9 3 A13 13 0 0 1 9 3 M-4 9 A6 6 0 0 1 4 9" />
      </>
    ),
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

export function SystemArchitecture({
  rtl,
  terms,
  viewBox,
  frame,
}: {
  rtl: boolean;
  terms: ArchTerms;
  viewBox?: [number, number, number, number];
  frame?: number;
}) {
  const mx = (x: number) => (rtl ? ARCH.w - x : x);
  const vb = viewBox ? (rtl ? [ARCH.w - viewBox[0] - viewBox[2], viewBox[1], viewBox[2], viewBox[3]] : viewBox) : [0, 0, ARCH.w, ARCH.h];
  // Text never mirrors: its anchor point does. 'start' follows the document direction (the right edge in RTL).
  const label = (beat: number, x: number, y: number, text: string, cls = '') => (
    <text className={`ax-label ${cls}`} data-beat={beat} x={mx(x)} y={y} textAnchor="start">
      {text}
    </text>
  );
  const flow = (d: string, i = 0) => <path className="ax-flow" pathLength={1} d={d} style={{ '--i': i } as CSSProperties} />;

  return (
    <svg className="ax" viewBox={vb.join(' ')} aria-hidden="true" focusable="false" data-frame={frame}>
      <g transform={rtl ? `translate(${ARCH.w} 0) scale(-1 1)` : undefined}>
        {/* beat 6: further vehicles behind the first (symbolic count) */}
        <g className="ax-part" data-beat="6">
          <rect className="ax-zone ax-zone--ghost" x={56} y={92} width={376} height={580} rx={18} />
          <rect className="ax-zone ax-zone--ghost" x={40} y={76} width={376} height={580} rx={18} />
          {FLEET_LINKS.map((d, i) => (
            <g key={d}>
              <path className="ax-wire ax-wire--fleet" pathLength={1} d={d} />
              {flow(d, i)}
            </g>
          ))}
        </g>

        {/* zone frames */}
        <rect className="ax-zone" x={24} y={60} width={376} height={580} rx={18} />
        <Glyph kind="vehicle" x={62} y={92} />
        <rect className="ax-zone ax-zone--platform" x={660} y={60} width={316} height={580} rx={18} />

        {/* beat 1 · cameras → recorder */}
        <g className="ax-part" data-beat="1">
          {CAM_LINKS.map((d, i) => (
            <g key={d}>
              <path className="ax-wire" pathLength={1} d={d} />
              {flow(d, i)}
            </g>
          ))}
        </g>
        {CAM_Y.map((y) => (
          <g key={y} className="ax-node ax-node--cam" data-beat="1">
            <rect x={52} y={y} width={60} height={40} rx={8} />
            <Glyph kind="camera" x={82} y={y + 20} />
          </g>
        ))}

        {/* the Mobile NVR with local storage (always present: it is the hub) */}
        <g className="ax-node ax-node--nvr" data-beat="1">
          <rect x={NVR.x} y={NVR.y} width={NVR.w} height={NVR.h} rx={12} />
          <path className="ax-nvr-face" d={`M${NVR.x + 18} ${NVR.y + 22} H${NVR.x + NVR.w - 18}`} />
          <circle className="ax-led" cx={NVR.x + NVR.w - 26} cy={NVR.y + 40} r={4} />
          {[0, 1, 2].map((k) => (
            <rect
              key={k}
              className="ax-bay"
              x={NVR.x + 18}
              y={NVR.y + 70 + k * 22}
              width={NVR.w - 36}
              height={12}
              rx={3}
              style={{ '--i': k } as CSSProperties}
            />
          ))}
        </g>

        {/* beat 2 · GPS → recorder */}
        <g className="ax-part" data-beat="2">
          <path className="ax-wire" pathLength={1} d={GPS_LINK} />
          {flow(GPS_LINK)}
        </g>
        <g className="ax-node" data-beat="2">
          <rect x={52} y={482} width={320} height={64} rx={10} />
          <Glyph kind="pin" x={86} y={514} />
        </g>

        {/* beat 3 · uplinks through 4G/5G and Wi-Fi to the platform */}
        <g className="ax-part" data-beat="3">
          {[UP_CELL, UP_WIFI, CELL_OUT, WIFI_OUT].map((d, i) => (
            <g key={d}>
              <path className="ax-wire" pathLength={1} d={d} />
              {flow(d, i)}
            </g>
          ))}
        </g>
        {[230, 420].map((y, i) => (
          <g key={y} className="ax-node ax-node--net" data-beat="3">
            <circle cx={520} cy={y} r={34} />
            <Glyph kind={i ? 'wifi' : 'bars'} x={520} y={y + (i ? 2 : 0)} />
            <circle className="ax-ring" cx={520} cy={y} r={34} />
          </g>
        ))}

        {/* beat 4 · remote live viewing and playback */}
        <g className="ax-node ax-node--view" data-beat="4">
          {[0, 1].flatMap((r) =>
            [0, 1].map((c) => (
              <rect
                key={`${r}${c}`}
                className="ax-pane"
                x={684 + c * 138}
                y={96 + r * 84}
                width={130}
                height={76}
                rx={4}
                style={{ '--i': r * 2 + c } as CSSProperties}
              />
            )),
          )}
        </g>
        <g className="ax-node ax-node--play" data-beat="4">
          <rect x={684} y={300} width={268} height={40} rx={6} />
          <Glyph kind="play" x={706} y={320} />
          <path className="ax-track" d="M730 320 H936" />
          <path className="ax-track ax-track--on" pathLength={1} d="M730 320 H936" />
        </g>

        {/* beat 5 · event alerts (steady gold, never red or blinking) */}
        <g className="ax-node ax-node--alert" data-beat="5">
          <rect x={684} y={392} width={268} height={52} rx={6} />
          <Glyph kind="bell" x={708} y={416} />
        </g>

        {/* beat 6 · centralized fleet monitoring */}
        <g className="ax-node ax-node--fleet" data-beat="6">
          <rect x={684} y={470} width={268} height={146} rx={6} />
          {[0, 1, 2].map((k) => (
            <g key={k} className="ax-row" style={{ '--i': k } as CSSProperties}>
              <Glyph kind="vehicle" x={712} y={524 + k * 30} />
              <path d={`M740 ${524 + k * 30} H${900 - k * 40}`} />
            </g>
          ))}
        </g>
      </g>

      {/* approved terms (never mirrored) */}
      {label(1, 52, 132, terms.cameras)}
      {label(1, 190, 188, terms.nvr, 'ax-label--strong')}
      {label(1, 208, 172 + NVR.y, terms.storage, 'ax-label--muted')}
      {label(2, 114, 520, terms.gps)}
      <text className="ax-label" data-beat="3" x={mx(520)} y={290} textAnchor="middle">
        {terms.cellular}
      </text>
      <text className="ax-label" data-beat="3" x={mx(520)} y={372} textAnchor="middle">
        {terms.wifi}
      </text>
      {label(4, 684, 284, terms.live)}
      {label(4, 684, 364, terms.playback)}
      {label(5, 732, 422, terms.alerts)}
      {label(6, 700, 498, terms.fleet)}
    </svg>
  );
}
