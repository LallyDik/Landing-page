// Build the project card covers (760x460 WebP).
//
// Four live sites were re-captured at 1280x800 with the scrollbar hidden
// (public/projects/_src_*.png); each is top-cropped so bottom-corner widgets
// and the scrollbar gutter fall away.
//
// WonderMe cannot be captured cleanly: its live gallery is full of
// NetFree-blocked tiles, repeated images and one sombre photo, and the app
// needs a login agent-browser doesn't have. The owner supplied a screenshot;
// only its top branded header (logo + tagline) is clean, so the cover is that
// header contained on the banner's own background colour — no gallery.
//
// One-shot: consumes the _src_ PNGs (+ a WonderMe source path via arg) and
// writes the *.webp covers, then removes the sources.

import sharp from 'sharp'
import { readdirSync, existsSync, rmSync } from 'node:fs'

const DIR = 'public/projects'
const W = 760
const H = 460

const sites = ['qsellerai', 'nihul', 'plenty', 'cbs']

for (const name of sites) {
  const src = `${DIR}/_src_${name}.png`
  if (!existsSync(src)) {
    console.log(`skip ${name}: no source`)
    continue
  }
  const meta = await sharp(src).metadata()
  // Top-crop to the cover ratio, staying clear of the bottom ~5% widgets.
  const cropH = Math.min(Math.round((meta.width * H) / W), Math.round(meta.height * 0.95))
  await sharp(src)
    .extract({ left: 0, top: 0, width: meta.width, height: cropH })
    .resize(W, H, { fit: 'cover', position: 'top' })
    .webp({ quality: 80 })
    .toFile(`${DIR}/${name}.webp`)
  console.log(`cover ${name}.webp`)
}

// WonderMe: source path passed as the first CLI arg.
const wmSrc = process.argv[2]
if (wmSrc && existsSync(wmSrc)) {
  const meta = await sharp(wmSrc).metadata()
  const bandW = Math.round(meta.width * 0.615) // exclude the chat panel on the right
  const bandH = Math.round(meta.height * 0.2) // the header band only
  // Sample the banner background colour from a top-left pixel.
  const { data } = await sharp(wmSrc)
    .extract({ left: 8, top: 8, width: 1, height: 1 })
    .raw()
    .toBuffer({ resolveWithObject: true })
  const bg = { r: data[0], g: data[1], b: data[2] }

  const header = await sharp(wmSrc)
    .extract({ left: 0, top: 0, width: bandW, height: bandH })
    .toBuffer()
  await sharp({
    create: { width: W, height: H, channels: 3, background: bg },
  })
    .composite([{ input: await sharp(header).resize({ width: Math.round(W * 0.92) }).toBuffer(), gravity: 'center' }])
    .webp({ quality: 82 })
    .toFile(`${DIR}/wonderme.webp`)
  console.log('cover wonderme.webp (branded header, gallery excluded)')
}

// Clean up sources.
for (const f of readdirSync(DIR)) {
  if (f.startsWith('_src_') && f.endsWith('.png')) {
    rmSync(`${DIR}/${f}`)
    console.log(`removed ${f}`)
  }
}
