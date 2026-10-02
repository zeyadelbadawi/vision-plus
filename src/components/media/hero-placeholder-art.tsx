/**
 * PREVIEW-ONLY placeholder art for HOME-HERO (no real photograph supplied yet).
 * Architectural linework in the Option B greys with gold "light seams" — echoing the approved
 * Option B reference mood (charcoal architecture, warm linear light). It is a drawing, clearly not a
 * photograph, never represents a real Vision Plus site, and is removed automatically as soon as the
 * real HOME-HERO asset is registered as final (IMAGE_ASSET_MANIFEST §5–6).
 * The subject sits in the central/inline-end zone so the headline band stays clear (manifest safe zones).
 */
export function HeroPlaceholderArt() {
  return (
    <svg className="hero-art" viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice" aria-hidden="true" focusable="false">
      <path
        className="hero-art__struct"
        d="M1010 130L1440 200.0 M1010 130L560 192.7 M1010 194L1440 250.8 M1010 194L560 245.3 M1010 258L1440 301.6 M1010 258L560 297.8 M1010 322L1440 352.4 M1010 322L560 350.3 M1010 386L1440 403.3 M1010 386L560 402.9 M1010 450L1440 454.1 M1010 450L560 455.4 M1010 514L1440 504.9 M1010 514L560 507.9 M1010 578L1440 555.8 M1010 578L560 560.4 M1010 642L1440 606.6 M1010 642L560 613.0 M1010 706L1440 657.4 M1010 706L560 665.5 M1010 770L1440 708.3 M1010 770L560 718.0 M1010 834L1440 759.1 M1010 834L560 770.5 M1010 898L1440 809.9 M1010 898L560 823.1 M1010 60L1440 144.4 M1010 60L560 135.3 M1075 72.8L1075 900 M1150 87.5L1150 900 M1236 104.3L1236 900 M1335 123.8L1335 900 M945 70.9L945 900 M872 83.1L872 900 M790 96.8L790 900 M700 111.9L700 900 M600 128.6L600 900 M1010 60L1010 900"
      />
      <path className="hero-art__seam" pathLength={1} d="M1010 900L1010 250" />
      <path className="hero-art__seam hero-art__seam--2" pathLength={1} d="M1010 514L1440 504.9" />
      <path className="hero-art__seam hero-art__seam--3" pathLength={1} d="M1010 514L560 507.9" />
    </svg>
  );
}
