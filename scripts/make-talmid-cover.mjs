// Build the Talmid Track project cover (760x460 WebP).
//
// Unlike the other covers, this one is not a screenshot. The live app is
// entirely behind authentication — talmid-track.lovable.app renders only a
// login gate to a signed-out visitor, so a capture would show a sign-in card
// and none of the product. Rather than ship a cover that proves nothing, the
// artwork is drawn: it diagrams the system's technical core, the OCR pipeline
// that reads handwritten Hebrew attendance sheets.
//
// Left  — the scanned sheet: printed Hebrew names, א/ב/ג mark boxes, pen ticks.
// Middle — the vision pass: the structured row schema the model must return.
// Right — the resolved roster: statuses, and the unread row flagged for review.
//
// Colours are the site's own (ink #171320, pearl, the iridescent accents), so
// the cover sits in the grid beside the screenshot covers without clashing.
//
// Run: node scripts/make-talmid-cover.mjs <path-to-talmid-cover.svg>

import sharp from 'sharp'
import { existsSync } from 'node:fs'

const OUT = 'public/projects/talmid-track.webp'
const W = 760
const H = 460

const src = process.argv[2]
if (!src || !existsSync(src)) {
  console.error('usage: node scripts/make-talmid-cover.mjs <svg-path>')
  process.exit(1)
}

// Render at 2x then downsample, so the hairlines and Hebrew glyphs stay crisp
// rather than aliasing at the small card size.
await sharp(src, { density: 200 })
  .resize(W * 2, H * 2, { fit: 'fill' })
  .resize(W, H)
  .webp({ quality: 88 })
  .toFile(OUT)

console.log(`cover ${OUT}`)
