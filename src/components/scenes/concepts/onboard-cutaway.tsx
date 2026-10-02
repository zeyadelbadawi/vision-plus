import type { CSSProperties } from 'react';
import { makeIso, type V3 } from './iso';

/**
 * CONCEPT A — "On board" as an isometric technical cutaway (preview prototype for Ziad's review, 2026-10-02).
 * A generic, unbranded coach with its near wall and roof cut away. The five approved components sit where they are
 * installed: cameras (front, rear, cabin, side) with their ground coverage, the Mobile NVR in its cabinet behind the
 * driver with the cabling from every camera, the GPS antenna and the 4G/5G antenna on the roof, the network mast, and a
 * remote monitoring wall (empty panes: no footage, D-26). Each step builds its component and its connection; the view
 * eases towards the component being read. Static / reduced motion / no JS: the complete system at the overall view.
 * No text is drawn: numbered callouts only (outside the mirrored group); the stage caption above it names the current step.
 */
export const CUT = { w: 960, h: 600 } as const;
const iso = makeIso(30, 236, 300);
const { p, poly, line, box, circle } = iso;

const L = 12; // length (front at x = L)
const W = 2.5; // width (near side at y = W)
const FLOOR = 0.8;
const ROOF = 3.3;

// Component anchors (world coordinates)
const CAMS: { at: V3; cone: V3[] }[] = [
  {
    at: [11.75, 1.25, 3.0],
    cone: [
      [12.1, 1.25, 0],
      [16.2, -0.6, 0],
      [16.2, 3.1, 0],
    ],
  }, // front, road ahead
  {
    at: [0.25, 1.25, 3.0],
    cone: [
      [-0.1, 1.25, 0],
      [-3.6, -0.4, 0],
      [-3.6, 2.9, 0],
    ],
  }, // rear
  {
    at: [5.6, 1.25, ROOF - 0.15],
    cone: [
      [3.2, 0.25, FLOOR + 0.01],
      [8.0, 0.25, FLOOR + 0.01],
      [8.0, 2.3, FLOOR + 0.01],
      [3.2, 2.3, FLOOR + 0.01],
    ],
  }, // cabin
  {
    at: [8.3, W, 2.7],
    cone: [
      [8.3, W + 0.1, 0],
      [6.4, W + 3.4, 0],
      [10.2, W + 3.4, 0],
    ],
  }, // side, kerb
];
const NVR = { x0: 9.55, x1: 10.55, y0: 0.15, y1: 1.05, z0: FLOOR, z1: FLOOR + 0.62 };
const NVR_IN: V3 = [10.05, 0.6, NVR.z1];
const CABLES: V3[][] = [
  [CAMS[0]!.at, [11.75, 0.18, 3.0], [10.05, 0.18, 3.0], [10.05, 0.18, NVR.z1], NVR_IN],
  [CAMS[1]!.at, [0.25, 0.12, 3.05], [9.95, 0.12, 3.05], [9.95, 0.12, NVR.z1], [9.95, 0.6, NVR.z1]],
  [CAMS[2]!.at, [5.6, 0.22, ROOF - 0.15], [10.15, 0.22, ROOF - 0.15], [10.15, 0.22, NVR.z1], [10.15, 0.6, NVR.z1]],
  [CAMS[3]!.at, [8.3, W - 0.05, FLOOR + 0.02], [10.05, W - 0.05, FLOOR + 0.02], [10.05, NVR.y1, FLOOR + 0.02]],
];
const GPS: V3 = [7.4, 0.55, ROOF];
const CELL: V3 = [3.6, 0.55, ROOF];
const CELL_TIP: V3 = [3.6, 0.55, ROOF + 0.9];
const MAST = { at: [11.1, -4.6, 0] as V3, h: 6.2 };
const MAST_TOP: V3 = [11.1, -4.6, 6.2];
const WALL = { x0: 11.2, x1: 15.4, y: -10.2, z0: 4.6, z1: 7.2 };

/** Per-step view: centre (LTR artboard) and zoom. 0 = overall view (also the static view). */
export const CUT_VIEWS: Record<0 | 1 | 2 | 3 | 4 | 5, [number, number, number]> = {
  0: [CUT.w / 2, CUT.h / 2, 1],
  1: [380, 385, 1.12],
  2: [455, 400, 1.55],
  3: [395, 345, 1.3],
  4: [470, 300, 1.08],
  5: [CUT.w / 2, CUT.h / 2, 1],
};
/** Callout anchors: a world point plus a screen offset. */
const CALLOUT: Record<1 | 2 | 3 | 4 | 5, [V3, number, number]> = {
  1: [[11.75, 1.25, 3.0], 20, -22],
  2: [[NVR.x1, NVR.y1, NVR.z1], 22, -16],
  3: [GPS, 0, -34],
  4: [CELL_TIP, -24, -20],
  5: [[WALL.x1, WALL.y, WALL.z1], 18, -6],
};

const viewTransform = (n: keyof typeof CUT_VIEWS, rtl: boolean) => {
  const [cx0, cy, s] = CUT_VIEWS[n];
  const cx = rtl ? CUT.w - cx0 : cx0;
  return `translate(${CUT.w / 2 - cx * s}px, ${CUT.h / 2 - cy * s}px) scale(${s})`;
};

export function OnboardCutaway({ rtl }: { rtl: boolean }) {
  const mx = (x: number) => (rtl ? CUT.w - x : x);
  const views = Object.fromEntries(Object.keys(CUT_VIEWS).map((k) => [`--v${k}`, viewTransform(Number(k) as 0, rtl)])) as CSSProperties;
  const seats = Array.from({ length: 6 }, (_, i) => 1.4 + i * 1.3);
  const bodyFar = poly([
    [0, 0, FLOOR],
    [L, 0, FLOOR],
    [L, 0, ROOF],
    [0, 0, ROOF],
  ]);
  const rearWall = poly([
    [0, 0, FLOOR],
    [0, W, FLOOR],
    [0, W, ROOF],
    [0, 0, ROOF],
  ]);
  const floor = box(0, L, 0, W, FLOOR - 0.25, FLOOR);
  const skirt = poly([
    [0, W, FLOOR - 0.25],
    [L, W, FLOOR - 0.25],
    [L, W, 1.45],
    [0, W, 1.45],
  ]);
  const nose = poly([
    [L, 0, FLOOR - 0.25],
    [L, W, FLOOR - 0.25],
    [L, W, 1.6],
    [L, 0, 1.6],
  ]);
  const roofSection = box(0, L, 0, 0.9, ROOF, ROOF + 0.12);
  const ghost = [
    line([
      [0, W, 1.45],
      [0, W, ROOF],
      [L, W, ROOF],
      [L, W, 1.6],
    ]),
    line([
      [L, 0, ROOF],
      [L, W, ROOF],
    ]),
    line([
      [0.9, W, ROOF],
      [0.9, W, ROOF],
    ]),
  ];
  const windows = Array.from({ length: 6 }, (_, i) => 0.9 + i * 1.55).map((x) =>
    poly([
      [x, 0.01, 1.75],
      [x + 1.3, 0.01, 1.75],
      [x + 1.3, 0.01, 2.85],
      [x, 0.01, 2.85],
    ]),
  );
  const wall = box(WALL.x0, WALL.x1, WALL.y - 0.25, WALL.y, WALL.z0, WALL.z1);
  const panes = [0, 1].flatMap((r) =>
    [0, 1].map((c) => {
      const x0 = WALL.x0 + 0.3 + c * 2.25;
      const z1 = WALL.z1 - 0.3 - r * 1.45;
      return poly([
        [x0, WALL.y + 0.01, z1 - 1.2],
        [x0 + 2.0, WALL.y + 0.01, z1 - 1.2],
        [x0 + 2.0, WALL.y + 0.01, z1],
        [x0, WALL.y + 0.01, z1],
      ]);
    }),
  );
  const [ax, ay] = p(CELL_TIP);
  const [mx0, my0] = p(MAST_TOP);
  const [wx, wy] = p([WALL.x0, WALL.y, (WALL.z0 + WALL.z1) / 2]);
  const uplink = `M${ax} ${ay - 4} Q${(ax + mx0) / 2} ${Math.min(ay, my0) - 120} ${mx0} ${my0}`;
  const backhaul = `M${mx0} ${my0} Q${(mx0 + wx) / 2} ${Math.min(my0, wy) - 60} ${wx - 4} ${wy}`;
  const mast = MAST.at;
  // lattice mast: legs spread across the screen (x + k, y - k), braced, with three panel antennas at the top
  const leg = (k: number, z: number): V3 => [mast[0] + k * (1 - z / (MAST.h + 1)), mast[1] - k * (1 - z / (MAST.h + 1)), z];
  const mastLegs = [line([leg(-0.7, 0), leg(-0.7, MAST.h)]), line([leg(0.7, 0), leg(0.7, MAST.h)])].join(' ');
  const mastBraces = [0, 1.2, 2.4, 3.6, 4.8].map((z) => line([leg(-0.7, z), leg(0.7, z + 1.2), leg(-0.7, z + 1.2)]));
  const mastPanels = [-0.55, 0, 0.55].map((k) =>
    box(mast[0] + k - 0.08, mast[0] + k + 0.08, mast[1] - k - 0.08, mast[1] - k + 0.08, MAST.h - 0.9, MAST.h + 0.3),
  );

  return (
    <svg className="cut" viewBox={`0 0 ${CUT.w} ${CUT.h}`} aria-hidden="true" focusable="false" style={views}>
      <g className="cut-view">
        <g transform={rtl ? `translate(${CUT.w} 0) scale(-1 1)` : undefined}>
          {/* ground: a fine technical grid and the vehicle's contact shadow */}
          <g className="cut-grid">
            {Array.from({ length: 13 }, (_, i) => -4 + i * 2).map((x) => (
              <path
                key={`gx${x}`}
                d={line([
                  [x, -4, 0],
                  [x, 7, 0],
                ])}
              />
            ))}
            {Array.from({ length: 6 }, (_, i) => -4 + i * 2).map((y) => (
              <path
                key={`gy${y}`}
                d={line([
                  [-4, y, 0],
                  [20, y, 0],
                ])}
              />
            ))}
          </g>
          <path
            className="cut-shadow"
            d={poly([
              [0.3, 0.4, 0],
              [L + 0.5, 0.4, 0],
              [L + 0.5, W + 0.6, 0],
              [0.3, W + 0.6, 0],
            ])}
          />

          {/* 3 · position fix on the ground (behind the vehicle) */}
          <g className="cut-layer" data-layer="3">
            <path className="cut-fix" d={circle([6, 1.25, 0], 3.2, 'xy', 64)} />
            <path className="cut-fix cut-fix--inner" d={circle([6, 1.25, 0], 1.9, 'xy', 48)} />
            <path
              className="cut-cross"
              d={line([
                [6, -3, 0],
                [6, 5.5, 0],
              ])}
            />
            <path
              className="cut-cross"
              d={line([
                [1.2, 1.25, 0],
                [10.8, 1.25, 0],
              ])}
            />
          </g>

          {/* 1 · ground coverage of the outside cameras */}
          <g className="cut-layer" data-layer="1">
            {[0, 1, 3].map((i) => (
              <path key={i} className="cut-cone" d={poly(CAMS[i]!.cone)} style={{ '--i': i } as CSSProperties} />
            ))}
          </g>

          {/* vehicle: far wall, rear wall, floor, seats (cutaway) */}
          <path className="cut-wall" d={bodyFar} />
          <g className="cut-window">
            {windows.map((d) => (
              <path key={d} d={d} />
            ))}
          </g>
          <path className="cut-wall cut-wall--rear" d={rearWall} />
          <path className="cut-face-top" d={floor.top} />
          <g className="cut-seat">
            {seats.map((x) => {
              const b = box(x, x + 0.75, 0.25, 0.95, FLOOR, FLOOR + 0.45);
              const back = box(x, x + 0.14, 0.25, 0.95, FLOOR + 0.45, FLOOR + 1.15);
              return (
                <g key={x}>
                  <path className="cut-face-top" d={b.top} />
                  <path className="cut-face-front" d={b.front} />
                  <path className="cut-face-side" d={b.side} />
                  <path className="cut-face-front" d={back.front} />
                  <path className="cut-face-top" d={back.top} />
                </g>
              );
            })}
          </g>
          <path className="cut-section" d={roofSection.top} />
          <path className="cut-section cut-section--edge" d={roofSection.side} />

          {/* 1 · cabin coverage on the floor */}
          <g className="cut-layer" data-layer="1">
            <path className="cut-cone cut-cone--cabin" d={poly(CAMS[2]!.cone)} />
          </g>

          {/* 2 · cabling from every camera to the recorder, and the Mobile NVR in its cabinet */}
          <g className="cut-layer" data-layer="2">
            {CABLES.map((c, i) => (
              <path key={`c${i}`} className="cut-cable" pathLength={1} d={line(c)} />
            ))}
            {CABLES.map((c, i) => (
              <path key={`f${i}`} className="cut-flow" pathLength={1} d={line(c)} style={{ '--i': i } as CSSProperties} />
            ))}
          </g>
          <g className="cut-nvr">
            {(() => {
              const b = box(NVR.x0, NVR.x1, NVR.y0, NVR.y1, NVR.z0, NVR.z1);
              return (
                <>
                  <path className="cut-dev-top" d={b.top} />
                  <path className="cut-dev-front" d={b.front} />
                  <path className="cut-dev-side" d={b.side} />
                  {[0, 1, 2].map((k) => (
                    <path
                      key={k}
                      className="cut-bay"
                      style={{ '--i': k } as CSSProperties}
                      d={poly([
                        [NVR.x1 + 0.005, NVR.y0 + 0.12, NVR.z0 + 0.12 + k * 0.15],
                        [NVR.x1 + 0.005, NVR.y1 - 0.12, NVR.z0 + 0.12 + k * 0.15],
                        [NVR.x1 + 0.005, NVR.y1 - 0.12, NVR.z0 + 0.21 + k * 0.15],
                        [NVR.x1 + 0.005, NVR.y0 + 0.12, NVR.z0 + 0.21 + k * 0.15],
                      ])}
                    />
                  ))}
                </>
              );
            })()}
          </g>

          {/* cameras (devices) */}
          {CAMS.map((c, i) => {
            const [x, y, z] = c.at;
            // housings sized along their viewing direction; the lens sits on the visible face
            const b =
              i === 2
                ? box(x - 0.22, x + 0.22, y - 0.22, y + 0.22, z - 0.12, z + 0.1)
                : i === 3
                  ? box(x - 0.18, x + 0.18, y - 0.1, y + 0.32, z - 0.18, z + 0.12)
                  : box(x - 0.34, x + 0.12, y - 0.17, y + 0.17, z - 0.17, z + 0.13);
            const lens =
              i === 0
                ? circle([x + 0.125, y, z - 0.02], 0.11, 'yz')
                : i === 3
                  ? circle([x, y + 0.325, z - 0.03], 0.11, 'xz')
                  : i === 2
                    ? circle([x, y, z - 0.13], 0.16, 'xy')
                    : null;
            return (
              <g key={i} className="cut-cam">
                <path className="cut-dev-top" d={b.top} />
                <path className="cut-dev-front" d={b.front} />
                <path className="cut-dev-side" d={b.side} />
                {lens && <path className="cut-lens" d={lens} />}
              </g>
            );
          })}

          {/* near side and front, cut low; the rest of the body as a ghost outline */}
          <path className="cut-section" d={skirt} />
          <path className="cut-section" d={nose} />
          {[2.3, 9.6].map((x) => (
            <g key={x} className="cut-wheel">
              <path d={circle([x, W + 0.02, 0.55], 0.55, 'xz')} />
              <path className="cut-hub" d={circle([x, W + 0.03, 0.55], 0.22, 'xz')} />
            </g>
          ))}
          <g className="cut-ghost">
            {ghost.map((d) => (
              <path key={d} d={d} />
            ))}
          </g>

          {/* 3 · GPS antenna (roof) */}
          <g className="cut-gps">
            <path className="cut-dev-top" d={circle(GPS, 0.32, 'xy')} />
            <path className="cut-dev-front" d={box(GPS[0] - 0.3, GPS[0] + 0.3, GPS[1] - 0.3, GPS[1] + 0.3, ROOF, ROOF + 0.16).side} />
            <path className="cut-dev-top" d={circle([GPS[0], GPS[1], ROOF + 0.16], 0.3, 'xy')} />
          </g>
          <g className="cut-layer" data-layer="3">
            <path className="cut-cable" pathLength={1} d={line([GPS, [GPS[0], GPS[1], 0.05], [6, 1.25, 0.02]])} />
          </g>

          {/* 4 · 4G/5G antenna (roof), its signal and the uplink to the network mast */}
          <g className="cut-cell">
            <path className="cut-dev-front" d={box(CELL[0] - 0.12, CELL[0] + 0.12, CELL[1] - 0.12, CELL[1] + 0.12, ROOF, ROOF + 0.9).front} />
            <path className="cut-dev-side" d={box(CELL[0] - 0.12, CELL[0] + 0.12, CELL[1] - 0.12, CELL[1] + 0.12, ROOF, ROOF + 0.9).side} />
          </g>
          <g className="cut-mast">
            <path d={mastLegs} />
            {mastBraces.map((d) => (
              <path key={d} d={d} />
            ))}
            {mastPanels.map((b) => (
              <g key={b.top} className="cut-mast-panel">
                <path className="cut-dev-front" d={b.front} />
                <path className="cut-dev-side" d={b.side} />
              </g>
            ))}
          </g>
          <g className="cut-layer" data-layer="4">
            {[16, 26, 36].map((r, i) => (
              <path key={r} className="cut-arc" style={{ '--i': i } as CSSProperties} d={`M${ax - r} ${ay - 6} A ${r} ${r} 0 0 1 ${ax + r} ${ay - 6}`} />
            ))}
            <path className="cut-link" pathLength={1} d={uplink} />
            <path className="cut-flow" pathLength={1} d={uplink} style={{ '--i': 0 } as CSSProperties} />
          </g>

          {/* 5 · remote monitoring wall: the backhaul reaches it and its panes come on (no imagery) */}
          <g className="cut-layer" data-layer="5">
            <path className="cut-link" pathLength={1} d={backhaul} />
            <path className="cut-flow" pathLength={1} d={backhaul} style={{ '--i': 1 } as CSSProperties} />
          </g>
          <g className="cut-wall-unit">
            <path className="cut-dev-top" d={wall.top} />
            <path className="cut-dev-front" d={wall.front} />
            <path className="cut-dev-side" d={wall.side} />
            {panes.map((d, i) => (
              <path key={d} className="cut-pane" d={d} style={{ '--i': i } as CSSProperties} />
            ))}
            <path
              className="cut-stand"
              d={line([
                [(WALL.x0 + WALL.x1) / 2, WALL.y, WALL.z0],
                [(WALL.x0 + WALL.x1) / 2, WALL.y, WALL.z0 - 1.2],
              ])}
            />
          </g>
        </g>

        {/* step callouts and the current step's approved term (never mirrored) */}
        {([1, 2, 3, 4, 5] as const).map((n) => {
          const [at, dx, dy] = CALLOUT[n];
          const [x, y] = p(at);
          return (
            <g key={n} className="cut-callout" data-layer={n} transform={`translate(${mx(x + dx)} ${y + dy})`}>
              <circle r="11" />
              <text className="cut-callout__n" y="4" textAnchor="middle">
                {n}
              </text>
            </g>
          );
        })}
      </g>
    </svg>
  );
}
