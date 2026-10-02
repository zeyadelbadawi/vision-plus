import type { CSSProperties } from 'react';

/**
 * Mobile NVR "On board" system diagram (P2 revision; animation revised after Ziad's review, 2026-10-02): a side
 * elevation of a generic vehicle that demonstrates the system step by step as the reader scrolls (styles: mnvr.css).
 *
 *   1 cameras activate and open their coverage  ·  2 cabling draws to the on-board Mobile NVR, video flows in and
 *   local storage fills  ·  3 the GPS antenna links to a position marker  ·  4 the 4G/5G antenna radiates and the
 *   uplink carries data to the network mast  ·  5 the link reaches the remote viewing screen and its panes come on
 *
 * The parent [data-steps] container gets data-current / data-reached from the MotionController (both scroll
 * directions). Reached layers stay lit; only the current step's data-flow pulses run, a few times, then rest.
 * Flow pulses are short dashes travelling along the existing connection paths (`.sys-flow`, pathLength 1).
 *
 * Decorative and aria-hidden: the step list beside it carries the words (approved copy). No text is drawn, only
 * step numbers, which sit outside the mirrored group so they never flip in RTL. Nothing here depicts real footage,
 * a real vehicle, a place, a time or a number of devices (storyboard rules, SCENE_STORYBOARDS §0.2; D-26).
 */
export const SYSTEM_ART = { w: 640, h: 350 } as const;

/** Uplink from the roof antenna to the network mast. */
export const UPLINK = 'M380 118 Q464 62 544 124';
/** Cabling from each camera to the recorder (front, rear, interior, side) — drawn in step 2, data flows along it. */
export const CABLES = ['M478 196 V266 H272', 'M68 196 V266 H200', 'M250 162 V248', 'M300 290 V278 H272'] as const;
/** Mast to the remote viewing screen (step 5). */
export const SCREEN_LINK = 'M548 126 V98';

/** Step callouts in LTR artboard coordinates. */
export const CALLOUTS: Record<1 | 2 | 3 | 4 | 5, [number, number]> = {
  1: [506, 232],
  2: [292, 236],
  3: [178, 92],
  4: [468, 114],
  5: [452, 22],
};

export function MnvrSystemArt({ rtl }: { rtl: boolean }) {
  const mx = (x: number) => (rtl ? SYSTEM_ART.w - x : x);
  return (
    <svg className="sys-art" viewBox={`0 0 ${SYSTEM_ART.w} ${SYSTEM_ART.h}`} aria-hidden="true" focusable="false">
      <g transform={rtl ? `translate(${SYSTEM_ART.w} 0) scale(-1 1)` : undefined}>
        {/* Ground and vehicle (always visible) */}
        <path className="sys-base" d="M16 326 H624" />
        <path
          className="sys-body"
          d="M60 300 V170 Q60 150 80 150 H420 Q444 150 458 172 L480 212 Q486 224 486 238 V300 H428 A28 28 0 0 0 372 300 H158 A28 28 0 0 0 102 300 Z"
        />
        <g className="sys-base">
          <rect x="80" y="166" width="56" height="38" />
          <rect x="146" y="166" width="56" height="38" />
          <rect x="212" y="166" width="56" height="38" />
          <rect x="278" y="166" width="56" height="38" />
          <rect x="344" y="166" width="56" height="38" />
          <path d="M412 166 H436 Q446 166 452 176 L466 204 H412 Z" />
          <circle cx="130" cy="302" r="22" />
          <circle cx="400" cy="302" r="22" />
          <circle cx="130" cy="302" r="8" />
          <circle cx="400" cy="302" r="8" />
        </g>
        {/* Network mast (context for step 4) */}
        <g className="sys-base">
          <path d="M536 326 L548 128 L560 326 M541 250 H555 M544 190 H552" />
        </g>

        {/* 1 · Cameras and their coverage */}
        <g className="sys-layer" data-layer="1">
          <path className="sys-wedge" data-dir="fwd" d="M488 190 L528 172 V208 Z" />
          <path className="sys-wedge" data-dir="back" d="M58 190 L18 172 V208 Z" />
          <path className="sys-wedge" data-dir="down" d="M250 160 L224 206 H276 Z" />
          <path className="sys-wedge" data-dir="down" d="M300 304 L276 340 H324 Z" />
          <rect className="sys-device sys-cam" x="474" y="184" width="12" height="12" rx="2" />
          <rect className="sys-device sys-cam" x="60" y="184" width="12" height="12" rx="2" />
          <rect className="sys-device sys-cam" x="244" y="152" width="12" height="10" rx="2" />
          <rect className="sys-device sys-cam" x="294" y="290" width="12" height="10" rx="2" />
        </g>

        {/* 2 · On-board Mobile NVR: cabling, video flowing in from every camera, local storage */}
        <g className="sys-layer" data-layer="2">
          {CABLES.map((d) => (
            <path key={d} className="sys-cable" pathLength={1} d={d} />
          ))}
          {CABLES.map((d, i) => (
            <path key={`f${d}`} className="sys-flow" pathLength={1} d={d} style={{ '--i': i } as CSSProperties} />
          ))}
          <rect className="sys-device sys-recorder" x="200" y="248" width="72" height="38" rx="3" />
          {[256, 265, 274].map((y, i) => (
            <rect key={y} className="sys-store" x="208" y={y} width="56" height="5" style={{ '--i': i } as CSSProperties} />
          ))}
        </g>

        {/* 3 · GPS antenna linked to the vehicle's position */}
        <g className="sys-layer" data-layer="3">
          <path className="sys-device" d="M140 150 V144 Q150 136 160 144 V150" />
          <path className="sys-cable" pathLength={1} d="M150 136 V112" />
          <g className="sys-pin-drop">
            <path className="sys-pin" d="M150 104 C138 92 136 74 150 68 C164 74 162 92 150 104 Z" />
          </g>
          <circle className="sys-ring" cx="150" cy="84" r="24" />
        </g>

        {/* 4 · 4G/5G antenna radiating; the uplink carries data to the network mast */}
        <g className="sys-layer" data-layer="4">
          <path className="sys-device" d="M380 150 V120" />
          <path className="sys-arc" style={{ '--i': 0 } as CSSProperties} d="M370 112 Q380 102 390 112" />
          <path className="sys-arc" style={{ '--i': 1 } as CSSProperties} d="M364 106 Q380 90 396 106" />
          <path className="sys-cable sys-cable--link" pathLength={1} d={UPLINK} />
          <path className="sys-flow" pathLength={1} d={UPLINK} style={{ '--i': 0 } as CSSProperties} />
        </g>

        {/* 5 · Remote viewing: the link reaches an empty outlined screen and its panes come on (no imagery) */}
        <g className="sys-layer" data-layer="5">
          <path className="sys-cable" pathLength={1} d={SCREEN_LINK} />
          <path className="sys-flow" pathLength={1} d={SCREEN_LINK} style={{ '--i': 0 } as CSSProperties} />
          <rect className="sys-device sys-screen" x="474" y="10" width="148" height="88" rx="3" />
          {[
            [484, 20],
            [552, 20],
            [484, 58],
            [552, 58],
          ].map(([x, y], i) => (
            <rect key={`${x}-${y}`} className="sys-pane" x={x} y={y} width="60" height="30" style={{ '--i': i } as CSSProperties} />
          ))}
        </g>
      </g>

      {/* Step callouts (never mirrored) */}
      {(Object.entries(CALLOUTS) as [string, [number, number]][]).map(([n, [x, y]]) => (
        <g key={n} className="sys-callout" data-layer={n} transform={`translate(${mx(x)} ${y})`}>
          <circle r="11" />
          <text y="4" textAnchor="middle">
            {n}
          </text>
        </g>
      ))}
    </svg>
  );
}
