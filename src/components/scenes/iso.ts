/**
 * Isometric projection helpers for the Mobile NVR concept scenes (preview prototype, 2026-10-02).
 * World units: x = vehicle length (front at +x), y = width (near side at +y), z = height. The viewer looks from
 * +x +y +z, so faces at max x, max y and max z are the visible ones.
 */
export type V3 = readonly [number, number, number];

const C = Math.cos(Math.PI / 6);
const S = 0.5;

export function makeIso(scale: number, ox: number, oy: number) {
  const p = ([x, y, z]: V3): [number, number] => [ox + (x - y) * C * scale, oy + (x + y) * S * scale - z * scale];
  const f = (n: number) => Math.round(n * 10) / 10;
  const pt = (v: V3) => {
    const [a, b] = p(v);
    return `${f(a)} ${f(b)}`;
  };
  /** Closed polygon through world points. */
  const poly = (pts: V3[]) => `M${pts.map(pt).join(' L')} Z`;
  /** Open polyline through world points. */
  const line = (pts: V3[]) => `M${pts.map(pt).join(' L')}`;
  /** The three visible faces of an axis-aligned box: top (z1), front (x1) and side (y1). */
  const box = (x0: number, x1: number, y0: number, y1: number, z0: number, z1: number) => ({
    top: poly([
      [x0, y0, z1],
      [x1, y0, z1],
      [x1, y1, z1],
      [x0, y1, z1],
    ]),
    front: poly([
      [x1, y0, z0],
      [x1, y1, z0],
      [x1, y1, z1],
      [x1, y0, z1],
    ]),
    side: poly([
      [x0, y1, z0],
      [x1, y1, z0],
      [x1, y1, z1],
      [x0, y1, z1],
    ]),
  });
  /** A circle in a world plane ('xy' ground, 'xz' side, 'yz' front), sampled as a closed path. */
  const circle = (c: V3, r: number, plane: 'xy' | 'xz' | 'yz', n = 36) => {
    const pts: V3[] = [];
    for (let i = 0; i < n; i++) {
      const a = (i / n) * Math.PI * 2;
      const u = Math.cos(a) * r;
      const v = Math.sin(a) * r;
      pts.push(plane === 'xy' ? [c[0] + u, c[1] + v, c[2]] : plane === 'xz' ? [c[0] + u, c[1], c[2] + v] : [c[0], c[1] + u, c[2] + v]);
    }
    return poly(pts);
  };
  return { p, pt, poly, line, box, circle };
}
