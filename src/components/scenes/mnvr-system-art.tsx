/**
 * Mobile NVR "On board" system diagram (P2 revision, client decision 2026-10-02): a side elevation of a generic
 * vehicle showing how the solution works, built up in five steps as the reader scrolls (styles: mnvr.css).
 *
 *   1 cameras capture  ·  2 the on-board Mobile NVR records  ·  3 GPS positions  ·  4 4G/5G transmits  ·  5 remote viewing
 *
 * Decorative and aria-hidden: the step list beside it carries the words (approved copy). No text is drawn, only
 * step numbers, which sit outside the mirrored group so they never flip in RTL. Nothing here depicts real footage,
 * a real vehicle, a place, a time or a number of devices (storyboard rules, SCENE_STORYBOARDS §0.2; D-26).
 */
export const SYSTEM_ART = { w: 640, h: 350 } as const;

/** Uplink from the roof antenna to the network mast (also the CSS offset-path of the travelling signal). */
export const UPLINK = 'M380 118 Q464 62 544 124';

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
          <path className="sys-wedge" d="M488 190 L528 172 V208 Z" />
          <path className="sys-wedge" d="M58 190 L18 172 V208 Z" />
          <path className="sys-wedge" d="M250 160 L224 206 H276 Z" />
          <path className="sys-wedge" d="M300 304 L276 340 H324 Z" />
          <rect className="sys-device" x="474" y="184" width="12" height="12" rx="2" />
          <rect className="sys-device" x="60" y="184" width="12" height="12" rx="2" />
          <rect className="sys-device" x="244" y="152" width="12" height="10" rx="2" />
          <rect className="sys-device" x="294" y="290" width="12" height="10" rx="2" />
        </g>

        {/* 2 · On-board Mobile NVR: cabling and local storage */}
        <g className="sys-layer" data-layer="2">
          <path className="sys-cable" pathLength={1} d="M478 196 V266 H272" />
          <path className="sys-cable" pathLength={1} d="M68 196 V266 H200" />
          <path className="sys-cable" pathLength={1} d="M250 162 V248" />
          <path className="sys-cable" pathLength={1} d="M300 290 V278 H272" />
          <rect className="sys-device" x="200" y="248" width="72" height="38" rx="3" />
          <rect className="sys-store" x="208" y="256" width="56" height="5" />
          <rect className="sys-store" x="208" y="265" width="56" height="5" />
          <rect className="sys-store" x="208" y="274" width="56" height="5" />
        </g>

        {/* 3 · GPS antenna and position */}
        <g className="sys-layer" data-layer="3">
          <path className="sys-device" d="M140 150 V144 Q150 136 160 144 V150" />
          <path className="sys-cable" pathLength={1} d="M150 136 V112" />
          <path className="sys-pin" d="M150 104 C138 92 136 74 150 68 C164 74 162 92 150 104 Z" />
          <circle className="sys-ring" cx="150" cy="84" r="24" />
        </g>

        {/* 4 · 4G/5G antenna, signal arcs and uplink to the mast */}
        <g className="sys-layer" data-layer="4">
          <path className="sys-device" d="M380 150 V120" />
          <path className="sys-arc" d="M370 112 Q380 102 390 112 M364 106 Q380 90 396 106" />
          <path className="sys-cable sys-cable--link" pathLength={1} d={UPLINK} />
          <circle className="sys-signal" r="4" />
        </g>

        {/* 5 · Remote viewing: an empty outlined screen (no imagery, no fake footage) */}
        <g className="sys-layer" data-layer="5">
          <path className="sys-cable" pathLength={1} d="M548 126 V98" />
          <rect className="sys-device" x="474" y="10" width="148" height="88" rx="3" />
          <path className="sys-pane" d="M484 20 H544 V50 H484 Z M552 20 H612 V50 H552 Z M484 58 H544 V88 H484 Z M552 58 H612 V88 H552 Z" />
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
