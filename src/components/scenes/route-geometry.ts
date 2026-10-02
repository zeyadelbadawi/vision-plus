/**
 * Geometry for the Mobile NVR "Route" scene (docs/SCENE_STORYBOARDS.md §2). Artboard 1440 × 900 (§23.6).
 * Plain data + helpers so the art stays declarative and the maths is unit-testable.
 */
export type Pt = readonly [number, number];

export const ART = { w: 1440, h: 900 } as const;

/** Road grid (plan-view city): vertical and horizontal road axes. */
export const ROADS = { x: [180, 420, 660, 900, 1140], y: [150, 330, 510, 690] } as const;

/** Primary route from the depot exit to the end point beside the management node. */
export const PRIMARY: Pt[] = [
  [180, 690],
  [420, 690],
  [420, 510],
  [660, 510],
  [660, 330],
  [900, 330],
  [900, 510],
  [1140, 510],
];
/** Beat 6: further routes, each ending in a vehicle that links to the management node. */
export const SECONDARY: Pt[][] = [
  [
    [180, 330],
    [180, 150],
    [660, 150],
    [900, 150],
  ],
  [
    [660, 840],
    [660, 690],
    [1320, 690],
    [1320, 510],
  ],
];
export const NODE = { x: 1200, y: 110, w: 150, h: 110 } as const;
export const DEPOT = { x: 52, y: 640, w: 104, h: 100 } as const;
/** Beat 5 attention zone around one route segment (420→660 at y 510). */
export const ZONE = { x: 396, y: 470, w: 288, h: 80 } as const;

export const toPath = (pts: readonly Pt[]) => pts.map(([x, y], i) => `${i ? 'L' : 'M'}${x} ${y}`).join(' ');

export function length(pts: readonly Pt[]): number {
  let total = 0;
  for (let i = 1; i < pts.length; i++) {
    const [ax, ay] = pts[i - 1]!;
    const [bx, by] = pts[i]!;
    total += Math.hypot(bx - ax, by - ay);
  }
  return total;
}

/** Point at fraction f (0–1) of a polyline's length. */
export function pointAt(pts: readonly Pt[], f: number): Pt {
  let left = Math.min(1, Math.max(0, f)) * length(pts);
  for (let i = 1; i < pts.length; i++) {
    const [ax, ay] = pts[i - 1]!;
    const [bx, by] = pts[i]!;
    const seg = Math.hypot(bx - ax, by - ay);
    if (left <= seg) {
      const t = seg ? left / seg : 0;
      return [ax + (bx - ax) * t, ay + (by - ay) * t];
    }
    left -= seg;
  }
  return pts[pts.length - 1]!;
}

/** Beat 2: location markers left along the first half of the route (the vehicle reaches 50 % in beat 2). */
export const TRAIL = [0.07, 0.14, 0.21, 0.28, 0.35, 0.42];
/** Beat 3: network points beside the route, reached in the second half of the travel. */
export const MASTS = [
  { at: 0.62, dx: 0, dy: -84 },
  { at: 0.76, dx: 84, dy: 0 },
  { at: 0.92, dx: 0, dy: 84 },
];

/** Scale so the last beat completes before the pinned stage releases (scenes.css). */
export const PIN_SCALE = 1.12;

/**
 * Per-beat progress used by the CSS (scenes.css): beat n runs while t = 1.12·p·beats passes n−1 → n,
 * reaching 1 slightly before its step text is centred. p is the MotionController "follow" progress.
 */
export function beatProgress(p: number, beats: number, n: number): number {
  const t = p * beats * PIN_SCALE;
  return Math.min(1, Math.max(0, (t - (n - 1)) * 1.4 - 0.1));
}

/** Mobile/tablet stepped frames: one crop of the artboard per beat (x, y, w, h); 4:5, the last 16:10. */
export const FRAMES: [number, number, number, number][] = [
  [20, 300, 480, 600],
  [200, 300, 480, 600],
  [580, 160, 480, 600],
  [900, 20, 480, 600],
  [300, 220, 480, 600],
  [640, 40, 800, 500],
];

/** Mirror a crop horizontally for RTL. */
export const mirrorFrame = ([x, y, w, h]: [number, number, number, number]): [number, number, number, number] => [ART.w - x - w, y, w, h];
