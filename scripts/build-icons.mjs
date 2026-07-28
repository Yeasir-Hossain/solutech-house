/**
 * Icons: src/app/icon.svg -> favicon.ico, apple-icon.png, PWA icons.
 *
 * icon.svg is the single source; it is the favicon cut of
 * public/img/logo-mark.svg (less padding, wider split so the halves still read
 * at 16px). Re-run after either SVG changes. Idempotent.
 */
import sharp from 'sharp';
import fs from 'node:fs/promises';

const APP = 'src/app';
const ICON = `${APP}/icon.svg`;

/** ICO container holding PNG entries (Vista+ / every current browser). */
function ico(entries) {
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(entries.length, 4);
  const dir = Buffer.alloc(16 * entries.length);
  let offset = 6 + dir.length;
  entries.forEach((e, i) => {
    const o = i * 16;
    dir.writeUInt8(e.size >= 256 ? 0 : e.size, o);
    dir.writeUInt8(e.size >= 256 ? 0 : e.size, o + 1);
    dir.writeUInt16LE(1, o + 4);
    dir.writeUInt16LE(32, o + 6);
    dir.writeUInt32LE(e.png.length, o + 8);
    dir.writeUInt32LE(offset, o + 12);
    offset += e.png.length;
  });
  return Buffer.concat([header, dir, ...entries.map((e) => e.png)]);
}

const render = (size, opts = {}) =>
  sharp(ICON, { density: 1200 })
    .resize(size, size, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toBuffer()
    .then((buf) => (opts.flat ? sharp(buf).flatten({ background: opts.flat }).png().toBuffer() : buf));

// favicon.ico — transparent, three classic sizes.
const sizes = [16, 32, 48];
const pngs = await Promise.all(sizes.map((s) => render(s)));
await fs.writeFile(
  `${APP}/favicon.ico`,
  ico(sizes.map((size, i) => ({ size, png: pngs[i] })))
);

// apple-icon: iOS composites onto its own square, so ship it opaque with padding.
const inner = await sharp(ICON, { density: 1200 }).resize(148, 148).png().toBuffer();
await sharp({
  create: { width: 180, height: 180, channels: 4, background: '#ffffff' },
})
  .composite([{ input: inner, top: 16, left: 16 }])
  .png()
  .toFile(`${APP}/apple-icon.png`);

// Android / PWA install icons.
for (const size of [192, 512]) {
  const pad = Math.round(size * 0.09);
  const art = await sharp(ICON, { density: 1200 })
    .resize(size - pad * 2, size - pad * 2)
    .png()
    .toBuffer();
  await sharp({ create: { width: size, height: size, channels: 4, background: '#ffffff' } })
    .composite([{ input: art, top: pad, left: pad }])
    .png()
    .toFile(`public/img/icon-${size}.png`);
}

console.log('icons written');
