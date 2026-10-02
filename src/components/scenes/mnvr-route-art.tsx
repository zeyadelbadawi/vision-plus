import type { CSSProperties } from 'react';
import { ART, DEPOT, MASTS, NODE, PRIMARY, ROADS, SECONDARY, TRAIL, ZONE, pointAt, toPath, type Pt } from './route-geometry';

/**
 * Mobile NVR "Route" artwork (docs/SCENE_STORYBOARDS.md §2; MASTER_PROJECT_PLAN §23.6.1).
 * Plan-view city grid in hairline linework; one vehicle travels the primary route; gold = active.
 * Every layer is driven only by the inherited custom properties --b1…--b6 (scenes.css), so the same
 * markup serves the pinned stage, each stepped frame and the static (reduced-motion / no-JS) state.
 * Labels are approved terms passed in already localized; no data (speeds, counts, times) is drawn.
 *
 * Data flow (revised after Ziad's review, 2026-10-02): short gold pulses travel along the connections that already
 * exist in the artwork (`.ra-flow`, pathLength 1) — the uplink from the route to the management node (beat 4) and the
 * fleet links into it (beat 6) — while position markers ping (beat 2), mast links carry dots and arcs radiate
 * (beat 3) and the attention zone's outline runs (beat 5). They play only for the reader's current beat (the scene
 * root's data-current, MotionController [data-steps]), a few times, then rest; each sits under its beat's --bN so
 * nothing pulses along a connection that has not been drawn yet. No new components, routes or links.
 */
export interface RouteLabels {
  cameras: string;
  gps: string;
  cellular: string;
  wifi: string;
  live: string;
  playback: string;
  alerts: string;
  fleet: string;
}

const PRIMARY_PATH = toPath(PRIMARY);
const UPLINK = 'M1140 510 V330 H1275 V220';
const LINKS = ['M900 150 H1200', 'M1320 510 V220'];

function Vehicle({ at, rotate = 0 }: { at?: Pt; rotate?: number }) {
  return (
    <g transform={at ? `translate(${at[0]} ${at[1]}) rotate(${rotate})` : undefined}>
      <rect x={-20} y={-11} width={40} height={22} rx={5} className="ra-vehicle-body" />
      <path d="M-10 -11 V11 M10 -11 V11" className="ra-vehicle-line" />
    </g>
  );
}

export function MnvrRouteArt({ labels, rtl, viewBox }: { labels: RouteLabels; rtl: boolean; viewBox?: [number, number, number, number] }) {
  // Labels stay readable in RTL: their anchor point is mirrored, the text itself is never flipped.
  const lx = (x: number) => (rtl ? ART.w - x : x);
  const label = (beat: number, x: number, y: number, text: string, anchor: 'start' | 'end' = 'start') => (
    <text x={lx(x)} y={y} textAnchor={anchor} className="ra-label" data-beat={beat} style={{ '--o': `var(--b${beat})` } as CSSProperties}>
      {text}
    </text>
  );
  const vb = viewBox ?? [0, 0, ART.w, ART.h];

  return (
    <svg className="route-art" viewBox={vb.join(' ')} aria-hidden="true" focusable="false" preserveAspectRatio="xMidYMid meet">
      <g transform={rtl ? `translate(${ART.w} 0) scale(-1 1)` : undefined}>
        {/* base: road grid and blocks */}
        <g className="ra-grid">
          {ROADS.x.map((x) => (
            <path key={`x${x}`} d={`M${x} 40 V860`} />
          ))}
          {ROADS.y.map((y) => (
            <path key={`y${y}`} d={`M20 ${y} H1420`} />
          ))}
        </g>
        <g className="ra-blocks">
          {ROADS.x.slice(0, -1).flatMap((x, i) =>
            ROADS.y.slice(0, -1).map((y, j) => {
              const w = ROADS.x[i + 1]! - x;
              const h = ROADS.y[j + 1]! - y;
              return <rect key={`${i}-${j}`} x={x + 26} y={y + 26} width={w - 52} height={h - 52} />;
            }),
          )}
        </g>
        <g className="ra-depot">
          <rect x={DEPOT.x} y={DEPOT.y} width={DEPOT.w} height={DEPOT.h} />
          <path d={`M${DEPOT.x + 16} ${DEPOT.y + 50} H${DEPOT.x + DEPOT.w - 16}`} />
          <path d={`M${DEPOT.x + DEPOT.w} 690 H180`} />
        </g>

        {/* beat 6: further routes, vehicles and their links to the management node */}
        <g className="ra-fleet">
          {SECONDARY.map((r, i) => (
            <path key={i} d={toPath(r)} pathLength={1} className="ra-draw ra-route-2" />
          ))}
          {LINKS.map((d) => (
            <path key={d} d={d} pathLength={1} className="ra-draw ra-link" />
          ))}
          <g className="ra-flows ra-flows--fleet">
            {LINKS.map((d, i) => (
              <path key={d} d={d} pathLength={1} className="ra-flow" style={{ '--i': i } as CSSProperties} />
            ))}
          </g>
          <g className="ra-fleet-vehicles">
            <Vehicle at={SECONDARY[0]!.at(-1)} />
            <Vehicle at={SECONDARY[1]!.at(-1)} rotate={90} />
          </g>
        </g>

        {/* beat 1: the primary route draws */}
        <path d={PRIMARY_PATH} className="ra-route-base" />
        <path d={PRIMARY_PATH} pathLength={1} className="ra-draw ra-route" />

        {/* beat 2: location markers */}
        <g className="ra-trail">
          {TRAIL.map((f, i) => {
            const [x, y] = pointAt(PRIMARY, f);
            return <circle key={f} cx={x} cy={y} r={4.5} style={{ '--f': f, '--i': i } as CSSProperties} />;
          })}
        </g>

        {/* beat 3: network points and signal arcs */}
        <g className="ra-masts">
          {MASTS.map((m, i) => {
            const [px, py] = pointAt(PRIMARY, m.at);
            const x = px + m.dx;
            const y = py + m.dy;
            return (
              <g key={m.at} style={{ '--f': m.at, '--i': i } as CSSProperties}>
                <path d={`M${px} ${py} L${x} ${y}`} className="ra-uplink-dots" />
                <path d={`M${x} ${y - 14} V${y + 14} M${x - 9} ${y + 14} H${x + 9}`} className="ra-mast" />
                <path d={`M${x - 14} ${y - 22} A 18 18 0 0 1 ${x + 14} ${y - 22} M${x - 24} ${y - 30} A 30 30 0 0 1 ${x + 24} ${y - 30}`} className="ra-arc" />
              </g>
            );
          })}
        </g>

        {/* beat 5: one attention zone (outline only; no incident details) */}
        <rect x={ZONE.x} y={ZONE.y} width={ZONE.w} height={ZONE.h} className="ra-zone" />

        {/* beat 4: management node, uplink seam and an empty frame glyph */}
        <g className="ra-node">
          <rect x={NODE.x} y={NODE.y} width={NODE.w} height={NODE.h} className="ra-node-base" />
          <rect x={NODE.x} y={NODE.y} width={NODE.w} height={NODE.h} className="ra-node-on" />
          <g className="ra-frame">
            <rect x={NODE.x + 32} y={NODE.y + 24} width={86} height={52} />
            <path d={`M${NODE.x + 60} ${NODE.y + 88} H${NODE.x + 90}`} />
          </g>
        </g>
        <path d={UPLINK} pathLength={1} className="ra-draw ra-uplink" />
        <g className="ra-flows ra-flows--uplink">
          <path d={UPLINK} pathLength={1} className="ra-flow" style={{ '--i': 0 } as CSSProperties} />
        </g>

        {/* the vehicle (symmetric glyph, never mirrored separately) with its four coverage wedges */}
        <g className="ra-vehicle" style={{ offsetPath: `path('${PRIMARY_PATH}')` }}>
          <g className="ra-wedges">
            <path d="M22 0 L64 -24 L64 24 Z" />
            <path d="M-22 0 L-64 -24 L-64 24 Z" />
            <path d="M0 -13 L-22 -48 L22 -48 Z" />
            <path d="M0 13 L-22 48 L22 48 Z" />
          </g>
          <Vehicle />
        </g>
      </g>

      {/* approved labels (outside the mirrored group so text is never flipped) */}
      {label(1, 40, 800, labels.cameras)}
      {label(2, 220, 600, labels.gps)}
      {label(3, 774, 226, labels.cellular)}
      {label(3, 996, 650, labels.wifi, 'end')}
      {label(4, 1350, 258, labels.live, 'end')}
      {label(4, 1350, 288, labels.playback, 'end')}
      {label(5, 396, 452, labels.alerts)}
      {label(6, 1350, 84, labels.fleet, 'end')}
    </svg>
  );
}
