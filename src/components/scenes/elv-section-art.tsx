import type { CSSProperties } from 'react';

/**
 * ELV Systems scene "One Infrastructure" (scene id elv-one-infrastructure; storyboard approved, D-20;
 * docs/SCENE_STORYBOARDS.md §4, MASTER_PROJECT_PLAN §23.6.3). A building cross-section: four floors and a roof line,
 * deliberately unlike the Smart Building interior. The four approved beats:
 *  1 Coordination: per floor, six system strands (one per approved solution, told apart by stroke pattern, never
 *    colour) appear scattered and align into ordered risers; the floor trays and the backbone riser draw.
 *  2 Integration: gold links appear between some strands only ("wherever meaningful").
 *  3 Reliability: a second, redundant backbone path draws beside the first, tied in at every floor.
 *  4 Scalability: a new floor slides in on top; its strands and the two backbone paths extend into it.
 * No text, numbers, equipment or floor names inside the artwork: the legend (the six names) is DOM text in beat 1.
 * The whole drawing mirrors in RTL (§23.5: no layer has handedness).
 */
export const ELV_SYSTEMS = 6;
const W = 1200;
const BASE = 700; // top of the ground slab
const STOREY = 120;
const FLOORS = 4;
const X0 = 300; // building edges
const X1 = 900;
const COL = (j: number) => 380 + j * 70; // aligned strand columns (risers)
const SPINE = 822; // backbone riser
const SPINE2 = 852; // redundant backbone (beat 3)
const floorTop = (i: number) => BASE - (i + 1) * STOREY; // floor i, 0 = ground; i = FLOORS is the added floor
// Deterministic scatter for beat 1 (px along x before alignment), one row per floor.
const SCATTER = [
  [46, -38, 64, -22, 30, -54],
  [-30, 58, -46, 40, -62, 24],
  [62, -20, 34, -58, 18, -40],
  [-44, 26, -60, 52, -28, 44],
  [0, 0, 0, 0, 0, 0],
];
// Integration links (beat 2): [floor, from column, to column]. Only some pairs: "wherever meaningful".
const LINKS: [number, number, number][] = [
  [0, 0, 1], // CCTV ↔ access control
  [1, 1, 4], // access control ↔ fire alarm
  [2, 2, 5], // networking ↔ automation
  [3, 0, 2], // CCTV ↔ networking
  [3, 3, 5], // AV ↔ automation
];

/** Mobile frames (stepped mode): two floors each, the backbone close-up, the new floor joining (storyboard §4). */
export const ELV_FRAMES = ['290 445 600 270', '290 325 600 270', '742 335 180 225', '290 85 600 270'];

const v = (n: number): CSSProperties => ({ '--dx': `${n}px` }) as CSSProperties;
/** The desktop stage: the building and its ground line, centred on the drawing's mirror axis. */
const STAGE = '230 85 740 640';
/** A crop window in mirrored (RTL) coordinates: the artwork is flipped about x = W / 2, so the window is too. */
export function mirrorViewBox(box: string): string {
  const [x, y, w, h] = box.split(' ').map(Number) as [number, number, number, number];
  return `${W - x - w} ${y} ${w} ${h}`;
}

function Floor({ i, added = false }: { i: number; added?: boolean }) {
  const y = floorTop(i);
  const mid = y + STOREY / 2;
  return (
    <g className={added ? 'elv-floor elv-floor--added' : 'elv-floor'}>
      {added && <rect className="elv-shell" x={X0} y={y} width={X1 - X0} height={STOREY} />}
      <rect className="elv-slab" x={X0 - 10} y={y - 6} width={X1 - X0 + 20} height={6} />
      {/* strands: one per system, scattered then aligned (beat 1); the added floor's are aligned already */}
      <g className="elv-strands" data-beat={added ? undefined : '1'}>
        {Array.from({ length: ELV_SYSTEMS }, (_, j) => (
          <path key={j} className={`elv-strand elv-strand--${j + 1}`} style={v(SCATTER[i]![j]!)} d={`M${COL(j)} ${y + 22}V${y + STOREY - 22}`} />
        ))}
      </g>
      {/* tray: the floor's strands joined to the backbone (beat 1) */}
      <path className="elv-tray" data-beat={added ? undefined : '1'} pathLength={1} d={`M${COL(0)} ${mid}H${SPINE}`} />
    </g>
  );
}

export function ElvSectionArt({ rtl, viewBox, frame }: { rtl: boolean; viewBox?: string; frame?: number }) {
  const ground = BASE;
  const roof = floorTop(FLOORS - 1);
  const top = floorTop(FLOORS);
  return (
    <svg className="elv" viewBox={rtl ? mirrorViewBox(viewBox ?? STAGE) : (viewBox ?? STAGE)} aria-hidden="true" focusable="false" data-frame-art={frame}>
      <g transform={rtl ? `matrix(-1 0 0 1 ${W} 0)` : undefined}>
        {/* the building: shell, ground and roof (always shown) */}
        <rect className="elv-shell" x={X0} y={roof} width={X1 - X0} height={ground - roof} />
        <rect className="elv-ground" x={X0 - 60} y={ground} width={X1 - X0 + 120} height={10} />
        <rect className="elv-roof" x={X0 - 14} y={roof - 10} width={X1 - X0 + 28} height={10} />
        {Array.from({ length: FLOORS }, (_, i) => (
          <Floor key={i} i={i} />
        ))}

        {/* risers: each system column runs through every floor once aligned (beat 1) */}
        <g data-beat="1">
          {Array.from({ length: ELV_SYSTEMS }, (_, j) => (
            <path key={j} className="elv-riser" d={`M${COL(j)} ${ground}V${roof}`} />
          ))}
          <path className="elv-spine" pathLength={1} d={`M${SPINE} ${ground}V${roof}`} />
        </g>

        {/* integration (beat 2): gold links between some strands only */}
        <g data-beat="2">
          {LINKS.map(([f, a, b]) => {
            const y = floorTop(f) + 38;
            return (
              <path key={`${f}-${a}-${b}`} className="elv-link" pathLength={1} d={`M${COL(a)} ${y}C${COL(a)} ${y - 18} ${COL(b)} ${y - 18} ${COL(b)} ${y}`} />
            );
          })}
        </g>

        {/* reliability (beat 3): the redundant backbone path with a tie-in at every floor */}
        <g data-beat="3">
          <path className="elv-spine2" pathLength={1} d={`M${SPINE2} ${ground}V${roof}`} />
          {Array.from({ length: FLOORS }, (_, i) => (
            <path key={i} className="elv-tie" pathLength={1} d={`M${SPINE} ${floorTop(i) + STOREY / 2}H${SPINE2}`} />
          ))}
        </g>

        {/* scalability (beat 4): a new floor slides in; strands, tray and both backbone paths extend into it */}
        <g className="elv-new" data-beat="4">
          <Floor i={FLOORS} added />
          <rect className="elv-roof" x={X0 - 14} y={top - 10} width={X1 - X0 + 28} height={10} />
          {Array.from({ length: ELV_SYSTEMS }, (_, j) => (
            <path key={j} className="elv-riser" d={`M${COL(j)} ${roof}V${top + 22}`} />
          ))}
          <path className="elv-spine" pathLength={1} d={`M${SPINE} ${roof}V${top}`} />
          <path className="elv-spine2" pathLength={1} d={`M${SPINE2} ${roof}V${top}`} />
          <path className="elv-tie" pathLength={1} d={`M${SPINE} ${top + STOREY / 2}H${SPINE2}`} />
        </g>
      </g>
    </svg>
  );
}
