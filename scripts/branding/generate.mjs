import sharp from 'sharp';
import { copyFile, writeFile } from 'node:fs/promises';

// Run from the repository root. All icons share one vector master: a "/" mark.
const master = 'scripts/branding/favicon.svg';
const background = '#121113';
const png = { palette: true, quality: 100, effort: 10 };

async function icon(size, opaque = false, maskable = false) {
  const innerSize = maskable ? Math.round(size * 0.82) : size;
  const image = await sharp(master, { density: 384 }).resize(innerSize, innerSize).png().toBuffer();
  return sharp({
    create: {
      width: size,
      height: size,
      channels: 4,
      background: opaque ? background : '#00000000',
    },
  })
    .composite([{ input: image, gravity: 'centre' }])
    .png(png)
    .toBuffer();
}

for (const [prefix, sizes, opaque] of [
  ['favicon', [16, 32, 96], false],
  ['android-icon', [36, 48, 72, 96, 144, 192], true],
  ['apple-icon', [57, 60, 72, 76, 114, 120, 144, 152, 180], true],
  ['ms-icon', [70, 144, 150, 310], true],
  ['web-app-manifest', [192, 512], true],
]) {
  for (const size of sizes) {
    await writeFile(
      `public/${prefix}-${size}x${size}.png`,
      await icon(size, opaque, prefix === 'web-app-manifest'),
    );
  }
}
for (const [name, size] of [
  ['apple-touch-icon', 180],
  ['apple-icon', 192],
  ['apple-icon-precomposed', 192],
]) {
  await writeFile(`public/${name}.png`, await icon(size, true));
}

// Keep legacy public URLs compatible with examples and existing deployments.
await writeFile('public/images/logo.png', await icon(512));
await sharp(await icon(512))
  .webp({ quality: 95 })
  .toFile('public/images/logo-thin.webp');
await sharp(await icon(512, true))
  .webp({ quality: 95 })
  .toFile('public/images/avatar.webp');

// Vector master doubles as the SVG favicon.
await copyFile(master, 'public/favicon.svg');

// ICO supports PNG payloads; include common browser and desktop sizes.
const sizes = [16, 32, 48];
const images = await Promise.all(sizes.map((size) => icon(size)));
const header = Buffer.alloc(6 + 16 * images.length);
header.writeUInt16LE(1, 2);
header.writeUInt16LE(images.length, 4);
let offset = header.length;
images.forEach((image, i) => {
  const entry = 6 + 16 * i;
  header[entry] = sizes[i];
  header[entry + 1] = sizes[i];
  // ICONDIRENTRY: four BYTEs, then two WORDs (2 bytes each).
  // wPlanes is at +4, wBitCount at +6; dwBytesInRes starts at +8.
  // https://devblogs.microsoft.com/oldnewthing/20101018-00/?p=12513
  header.writeUInt16LE(1, entry + 4);
  header.writeUInt16LE(32, entry + 6);
  header.writeUInt32LE(image.length, entry + 8);
  header.writeUInt32LE(offset, entry + 12);
  offset += image.length;
});
await writeFile('public/favicon.ico', Buffer.concat([header, ...images]));
console.log('Generated avatars, favicons, and app icons from favicon.svg');
