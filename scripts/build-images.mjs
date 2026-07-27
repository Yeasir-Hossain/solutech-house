/**
 * Image migration: WordPress uploads -> web/public/media.
 *
 * WP kept 402 originals (mostly full-size PNGs, ~393MB) plus ~1775 generated
 * thumbnail variants. Next/image does its own resizing, so only the originals
 * are migrated — re-encoded to WebP and capped at MAX_WIDTH, which is where the
 * bulk of the saving comes from.
 *
 * Writes public/media/** and content/images.json (source file -> {src,w,h}),
 * which build-content.mjs uses to rewrite image URLs inside post content.
 */
import fs from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const ROOT = path.resolve(import.meta.dirname, '..');
const UPLOADS = path.resolve(ROOT, '../wp-content/uploads');
const THEME_IMG = path.resolve(ROOT, '../wp-content/themes/wbah/assets/img');
const OUT_MEDIA = path.join(ROOT, 'public/media');
const OUT_IMG = path.join(ROOT, 'public/img');
const OUT_MAP = path.join(ROOT, 'content/images.json');

const MAX_WIDTH = 1600;
const RASTER = /\.(png|jpe?g|webp|avif|gif)$/i;
// WP's generated variants: foo-1024x768.png. Those are derivatives of an
// original we already migrate, so skipping them is not data loss.
const VARIANT = /-\d+x\d+\.\w+$/;

async function walk(dir, base = dir, acc = []) {
  let entries;
  try {
    entries = await fs.readdir(dir, { withFileTypes: true });
  } catch {
    return acc;
  }
  for (const e of entries) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) {
      if (e.name.startsWith('_')) continue; // _export, etc.
      await walk(full, base, acc);
    } else if (RASTER.test(e.name) && !VARIANT.test(e.name)) {
      acc.push(path.relative(base, full));
    }
  }
  return acc;
}

async function convert(srcPath, destNoExt) {
  const img = sharp(srcPath, { animated: false });
  const meta = await img.metadata();
  const resize = meta.width && meta.width > MAX_WIDTH ? { width: MAX_WIDTH } : null;
  const pipeline = resize ? img.resize(resize) : img;
  const dest = `${destNoExt}.webp`;
  await fs.mkdir(path.dirname(dest), { recursive: true });
  const info = await pipeline.webp({ quality: 80, effort: 5 }).toFile(dest);
  return { width: info.width, height: info.height, bytes: info.size };
}

async function main() {
  await fs.mkdir(OUT_MEDIA, { recursive: true });
  await fs.mkdir(path.dirname(OUT_MAP), { recursive: true });

  const files = await walk(UPLOADS);
  console.log(`uploads: ${files.length} originals -> ${OUT_MEDIA}`);

  const map = {};
  let inBytes = 0;
  let outBytes = 0;
  let done = 0;

  // Bounded concurrency — sharp is native and will happily saturate the box.
  const CONCURRENCY = 8;
  let cursor = 0;
  async function worker() {
    while (cursor < files.length) {
      const rel = files[cursor++];
      const src = path.join(UPLOADS, rel);
      const relNoExt = rel.replace(/\.\w+$/, '');
      try {
        const stat = await fs.stat(src);
        const out = await convert(src, path.join(OUT_MEDIA, relNoExt));
        inBytes += stat.size;
        outBytes += out.bytes;
        map[rel] = { src: `/media/${relNoExt}.webp`, width: out.width, height: out.height };
      } catch (err) {
        console.warn(`  skip ${rel}: ${err.message}`);
      }
      if (++done % 50 === 0) console.log(`  ${done}/${files.length}`);
    }
  }
  await Promise.all(Array.from({ length: CONCURRENCY }, worker));

  // Theme design images (hero art, logos) ship as-is — already curated and small.
  await fs.cp(THEME_IMG, OUT_IMG, { recursive: true });

  await fs.writeFile(OUT_MAP, JSON.stringify(map, null, 2));
  console.log(
    `\ndone: ${Object.keys(map).length} images  ${(inBytes / 1048576).toFixed(1)}MB -> ${(
      outBytes / 1048576
    ).toFixed(1)}MB  (${((1 - outBytes / inBytes) * 100).toFixed(1)}% smaller)`
  );
  console.log(`map: ${path.relative(ROOT, OUT_MAP)}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
