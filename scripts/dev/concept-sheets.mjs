// Contact sheets for the Mobile NVR concept review, from docs/review/p2-mnvr-concepts/*.webp (run concept-shots first).
import sharp from 'sharp';

const D = process.env.OUT ?? 'docs/review/p2-mnvr-concepts';
const sheet = async (out, cols, cellW, files) => {
  const imgs = await Promise.all(files.map((f) => sharp(`${D}/${f}.webp`).resize({ width: cellW }).toBuffer({ resolveWithObject: true })));
  const gap = 12;
  const rowH = [];
  imgs.forEach((im, i) => (rowH[Math.floor(i / cols)] = Math.max(rowH[Math.floor(i / cols)] ?? 0, im.info.height)));
  const top = (r) => gap + rowH.slice(0, r).reduce((a, h) => a + h + gap, 0);
  const width = cols * cellW + (cols + 1) * gap;
  const height = top(rowH.length);
  const composite = imgs.map((im, i) => ({ input: im.data, left: gap + (i % cols) * (cellW + gap), top: top(Math.floor(i / cols)) }));
  await sharp({ create: { width, height, channels: 3, background: '#9a9a9a' } })
    .composite(composite)
    .webp({ quality: 76 })
    .toFile(`${D}/${out}.webp`);
  console.log(`${D}/${out}.webp ${width}×${height}`);
};
const steps = (c, l, w, n, word) => Array.from({ length: n }, (_, i) => `${c}-${l}-${w}-${word}-${i + 1}`);

for (const l of ['en', 'ar']) {
  await sheet(`sheet-A-onboard-desktop-${l}`, 2, 720, [...steps('a', l, 1440, 5, 'step'), `a-${l}-1440-static`]);
  await sheet(`sheet-B-route-desktop-${l}`, 2, 720, [...steps('b', l, 1440, 6, 'beat'), `b-${l}-1440-static`]);
}
await sheet('sheet-A-onboard-mobile-en-ar', 5, 300, [...steps('a', 'en', 390, 5, 'step'), ...steps('a', 'ar', 390, 5, 'step')]);
await sheet('sheet-B-route-mobile-en-ar', 6, 300, [...steps('b', 'en', 390, 6, 'beat'), ...steps('b', 'ar', 390, 6, 'beat')]);
await sheet('sheet-reduced-motion-mobile-en-ar', 4, 300, ['a-en-390-static', 'a-ar-390-static', 'b-en-390-static', 'b-ar-390-static']);
