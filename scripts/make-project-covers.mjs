// Turn the raw 1295x879 site screenshots in public/projects/*.png into
// consistent card cover images, then remove the raw PNGs.
//
// Each cover is a top-aligned crop (so bottom-corner widgets — the Lovable
// badge on nihul, accessibility/ESC buttons on the others — fall away) at a
// fixed 76:46 ratio, exported as WebP for a small, in-budget file.
//
// wonderme is not screenshotted: NetFree blocks the live site, so the raw
// capture was the filter's block page. It gets an iridescent gradient cover
// with the project name instead, matching the design's fallback plan.
//
// One-shot, like optimize-assets.mjs: it consumes public/projects/*.png and
// writes public/projects/*.webp. Re-running after the PNGs are gone simply
// regenerates the wonderme fallback and leaves the rest untouched.

import sharp from 'sharp'
import { readdirSync, existsSync, rmSync } from 'node:fs'

const DIR = 'public/projects'
const COVER_W = 760
const COVER_H = 460
// Crop this tall a band from the top of the 1295x879 source before scaling,
// keeping the hero and clearing the bottom ~90px where the corner widgets sit.
const CROP_H = Math.round((1295 * COVER_H) / COVER_W) // 784

const shots = ['qsellerai', 'nihul', 'plenty', 'cbs']

for (const name of shots) {
  const src = `${DIR}/${name}.png`
  if (!existsSync(src)) {
    console.log(`skip ${name}: no source png`)
    continue
  }
  const meta = await sharp(src).metadata()
  const cropH = Math.min(CROP_H, meta.height)
  await sharp(src)
    .extract({ left: 0, top: 0, width: meta.width, height: cropH })
    .resize(COVER_W, COVER_H, { fit: 'cover', position: 'top' })
    .webp({ quality: 80 })
    .toFile(`${DIR}/${name}.webp`)
  console.log(`cover ${name}.webp`)
}

// wonderme fallback: iridescent gradient with the wordmark, same dimensions.
const fallback = `
<svg xmlns="http://www.w3.org/2000/svg" width="${COVER_W}" height="${COVER_H}">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#F8B5E0"/>
      <stop offset="0.35" stop-color="#C9B8F5"/>
      <stop offset="0.7" stop-color="#A8F0E0"/>
      <stop offset="1" stop-color="#FAF3A0"/>
    </linearGradient>
  </defs>
  <rect width="${COVER_W}" height="${COVER_H}" fill="url(#g)"/>
  <text x="50%" y="50%" text-anchor="middle" dominant-baseline="central"
        font-family="Segoe UI, Arial, sans-serif" font-size="72" font-weight="700"
        fill="#0B0B12" opacity="0.82">WonderMe</text>
</svg>`
await sharp(Buffer.from(fallback)).webp({ quality: 82 }).toFile(`${DIR}/wonderme.webp`)
console.log('cover wonderme.webp (gradient fallback — NetFree blocked the live site)')

// Remove the raw PNGs so only the covers ship.
for (const f of readdirSync(DIR)) {
  if (f.endsWith('.png')) {
    rmSync(`${DIR}/${f}`)
    console.log(`removed ${f}`)
  }
}
