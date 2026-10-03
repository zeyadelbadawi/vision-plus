import type { CSSProperties } from 'react';

/**
 * CCTV & Security Systems scene "See · Know · Respond" (scene id cctv-see-know-respond; storyboard approved, D-20;
 * docs/SCENE_STORYBOARDS.md §5, MASTER_PROJECT_PLAN §23.6.4). A plan view: one main site (building footprint inside a
 * perimeter fence line), two smaller sites and a monitoring node. Cameras are small circles with an orientation tick.
 * The three approved beats:
 *  1 See: the main site's cameras open their field-of-view cones (grey fill, gold edge); the overlaps show.
 *  2 Know: one area is outlined as an analytics zone (dashed gold) and the perimeter line highlights.
 *  3 Respond: feeds from all three sites flow as gold signals into the monitoring node.
 * No text, numbers, feeds, faces or plates inside the artwork; the camera positions are illustrative (storyboard
 * "must not show"). The labels are the DOM label lists of the beats. A plan view has no handedness, so the whole
 * drawing mirrors in RTL (§23.5), and the crop windows with it.
 */
const W = 1440;
const CONE = { length: 140, half: 28 }; // illustrative field of view (no camera data is implied)

/** Main site: perimeter fence line and building footprint. */
const FENCE = 'M150 110H820V800H100V160Z';
const BUILDING = 'M250 260H620V430H520V640H250Z';
/** Main-site cameras: position and the direction they face (degrees, 0 = east, clockwise). */
export const CCTV_CAMERAS: [number, number, number][] = [
  [250, 260, 225],
  [620, 260, 315],
  [250, 640, 135],
  [520, 640, 45],
  [810, 120, 135],
  [110, 790, 315],
  [620, 430, 50],
];
/** The two smaller sites: fence, building, one camera each (no cones: beat 1 is the main site). */
const SITES = [
  { fence: 'M1160 100H1360V290H1160Z', building: [1210, 150, 110, 90], cam: [1210, 150, 225] },
  { fence: 'M1160 610H1360V800H1160Z', building: [1210, 660, 110, 90], cam: [1320, 750, 45] },
] as const;
const NODE = { x: 1010, y: 455, r: 36 };
/** Feeds, each from a site to the monitoring node (the signal travels in path direction). */
const FEEDS = [
  `M820 ${NODE.y}H${NODE.x - NODE.r}`,
  `M1160 195H1090Q${NODE.x} 195 ${NODE.x} 275V${NODE.y - NODE.r}`,
  `M1160 705H1090Q${NODE.x} 705 ${NODE.x} 635V${NODE.y + NODE.r}`,
];

/** Desktop stage: all three sites and the node. */
const STAGE = '60 70 1340 760';
/** Stepped frames (storyboard §5): the main site, the zone and perimeter, the three sites converging. */
export const CCTV_FRAMES = ['70 80 780 750', '470 400 400 440', STAGE];

/** A crop window in mirrored (RTL) coordinates: the artwork is flipped about x = W / 2, so the window is too. */
export function mirrorViewBox(box: string): string {
  const [x, y, w, h] = box.split(' ').map(Number) as [number, number, number, number];
  return `${W - x - w} ${y} ${w} ${h}`;
}

const r1 = (n: number) => Math.round(n * 10) / 10;
const rad = (deg: number) => (deg * Math.PI) / 180;
/** The field-of-view wedge, pointing east from the camera at the origin. */
const CONE_D = (() => {
  const x = r1(CONE.length * Math.cos(rad(CONE.half)));
  const y = r1(CONE.length * Math.sin(rad(CONE.half)));
  return `M0 0L${x} ${-y}A${CONE.length} ${CONE.length} 0 0 1 ${x} ${y}Z`;
})();

function Camera({ x, y, dir, cone = false }: { x: number; y: number; dir: number; cone?: boolean }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${dir})`}>
      {cone && <path className="cctv-cone" d={CONE_D} />}
      <path className="cctv-tick" d="M0 0H20" />
      <circle className="cctv-cam" r={8} />
    </g>
  );
}

export function CctvPlanArt({ rtl, viewBox, frame }: { rtl: boolean; viewBox?: string; frame?: number }) {
  const box = viewBox ?? STAGE;
  return (
    <svg className="cctv" viewBox={rtl ? mirrorViewBox(box) : box} aria-hidden="true" focusable="false" data-frame-art={frame}>
      <g transform={rtl ? `matrix(-1 0 0 1 ${W} 0)` : undefined}>
        {/* the sites and the monitoring node: fence lines, building footprints (always shown) */}
        <path className="cctv-fence" d={FENCE} />
        <path className="cctv-building" d={BUILDING} />
        {SITES.map((s, i) => (
          <g key={i}>
            <path className="cctv-fence" d={s.fence} />
            <rect className="cctv-building" x={s.building[0]} y={s.building[1]} width={s.building[2]} height={s.building[3]} />
          </g>
        ))}

        {/* see (beat 1): the main site's cameras open their cones; the overlaps show through the translucent fill */}
        <g className="cctv-cones" data-beat="1">
          {CCTV_CAMERAS.map(([x, y, dir]) => (
            <Camera key={`${x}-${y}`} x={x} y={y} dir={dir} cone />
          ))}
        </g>
        {SITES.map((s, i) => (
          <Camera key={i} x={s.cam[0]} y={s.cam[1]} dir={s.cam[2]} />
        ))}

        {/* know (beat 2): one analytics zone, and the perimeter line highlights */}
        <g data-beat="2">
          <rect className="cctv-zone" x={590} y={540} width={200} height={200} rx={6} />
          <path className="cctv-perimeter" pathLength={1} d={FENCE} />
        </g>

        {/* respond (beat 3): feeds from all three sites into the monitoring node */}
        <rect className="cctv-node" x={NODE.x - NODE.r} y={NODE.y - NODE.r} width={NODE.r * 2} height={NODE.r * 2} rx={10} />
        <g data-beat="3">
          {FEEDS.map((d, i) => (
            <g key={i} style={{ '--i': i } as CSSProperties}>
              <path className="cctv-feed" pathLength={1} d={d} />
              <path className="cctv-signal" pathLength={1} d={d} />
            </g>
          ))}
          {/* the node activates (grey → gold) as the feeds arrive */}
          <rect className="cctv-node cctv-node--on" x={NODE.x - NODE.r} y={NODE.y - NODE.r} width={NODE.r * 2} height={NODE.r * 2} rx={10} />
          <circle className="cctv-node-core" cx={NODE.x} cy={NODE.y} r={12} />
        </g>
      </g>
    </svg>
  );
}
