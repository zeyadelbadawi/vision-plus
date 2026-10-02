// Contact sheets for the implemented Mobile NVR scenes (Concept A On board, Concept B fleet scene), from
// docs/review/p2-mnvr-final/*.webp (run `OUT=docs/review/p2-mnvr-final ONLY=mnvr node scripts/dev/review-shots.mjs` first).
import sharp from 'sharp';

const D = process.env.OUT ?? 'docs/review/p2-mnvr-final';
const sheet = async (out, cols, cellW, files) => {
  const imgs = await Promise.all(files.map((f) => sharp(`${D}/${f}.webp`).resize({ width: cellW }).toBuffer({ resolveWithObject: true })));
  const gap = 12;
  const rowH = [];
  imgs.forEach((im, i) => (rowH[Math.floor(i / cols)] = Math.max(rowH[Math.floor(i / cols)] ?? 0, im.info.height)));
  const top = (r) => gap + rowH.slice(0, r).reduce((a, h) => a + h + gap, 0);
  const composite = imgs.map((im, i) => ({ input: im.data, left: gap + (i % cols) * (cellW + gap), top: top(Math.floor(i / cols)) }));
  await sharp({ create: { width: cols * cellW + (cols + 1) * gap, height: top(rowH.length), channels: 3, background: '#9a9a9a' } })
    .composite(composite)
    .webp({ quality: 76 })
    .toFile(`${D}/${out}.webp`);
  console.log(`${D}/${out}.webp`);
};
const seq = (k, l, w, n, word) => Array.from({ length: n }, (_, i) => `${k}-${l}-${w}-${word}-${i + 1}`);
for (const l of ['en', 'ar']) {
  await sheet(`sheet-onboard-desktop-${l}`, 2, 720, [...seq('onboard', l, 1440, 5, 'step'), `onboard-${l}-1440-static`]);
  await sheet(`sheet-route-desktop-${l}`, 2, 720, seq('route', l, 1440, 6, 'beat'));
}
await sheet('sheet-onboard-mobile-en-ar', 5, 300, [...seq('onboard', 'en', 390, 5, 'step'), ...seq('onboard', 'ar', 390, 5, 'step')]);
await sheet('sheet-route-mobile-en-ar', 6, 300, [...seq('route', 'en', 390, 6, 'beat'), ...seq('route', 'ar', 390, 6, 'beat')]);
await sheet('sheet-reduced-motion-desktop-en-ar', 2, 720, ['onboard-en-1440-static', 'onboard-ar-1440-static', 'route-en-1440-static', 'route-ar-1440-static']);
await sheet('sheet-reduced-motion-mobile-en-ar', 4, 300, ['onboard-en-390-static', 'onboard-ar-390-static', 'route-en-390-static', 'route-ar-390-static']);
