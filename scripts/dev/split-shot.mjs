// Dev utility: split a tall screenshot into viewport-sized slices for review.
import sharp from 'sharp';
const [,, file, slice = '1600'] = process.argv;
const img = sharp(file);
const { width, height } = await img.metadata();
const h = Number(slice);
for (let i = 0, y = 0; y < height; i++, y += h) {
  await sharp(file).extract({ left: 0, top: y, width, height: Math.min(h, height - y) }).toFile(file.replace('.png', `-part${i}.png`));
}
console.log(Math.ceil(height / h), 'parts');
