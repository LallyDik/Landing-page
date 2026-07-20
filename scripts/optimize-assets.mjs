// ⚠️ DESTRUCTIVE, RUN AT MOST ONCE: this script reads public/logo-ld.png
// and overwrites that same file with a compressed 288px version a few
// lines below. It must only ever run against the pristine ~1MB source.
// Running it again re-compresses an already-compressed image — the loss
// is silent (no error, no warning) and permanent.
//
// If you need to re-run it (tuning resize/quality, adding an asset,
// etc.), first restore the pristine source from git history:
//
//   git checkout c6b151e -- public/logo-ld.png
//
// then verify it is back to 1,005,308 bytes before running this script
// again. This is also why it is not wired into `npm run build`: it is a
// one-time asset pipeline step whose output is committed, not a
// repeatable build step.

import sharp from 'sharp'
import { readFileSync, writeFileSync } from 'node:fs'

const SOURCE = 'public/logo-ld.png'
const source = readFileSync(SOURCE)

// Logo: displayed at 96px, so 288px covers 3x displays.
const logo = await sharp(source).resize(288, 288).png({ quality: 82, compressionLevel: 9 }).toBuffer()
writeFileSync(SOURCE, logo)

const favicon = await sharp(source).resize(180, 180).png({ quality: 82, compressionLevel: 9 }).toBuffer()
writeFileSync('public/favicon.png', favicon)

// Open Graph: 1200x630, logo centred on the darkest base colour.
const logoLayer = await sharp(source).resize(320, 320).png().toBuffer()
const og = await sharp({
  create: { width: 1200, height: 630, channels: 4, background: '#0b0b12' },
})
  .composite([{ input: logoLayer, gravity: 'center' }])
  // The composited logo carries real photographic detail (the source is
  // ~1MB for a 692x694 monogram), so plain deflate alone lands the 1200x630
  // canvas at 284,474 bytes — over the 200KB budget. Quantization (palette
  // mode) is what gets it under budget. `palette: true` is set explicitly
  // here for clarity, but sharp auto-enables palette mode whenever `quality`
  // is set and `palette` is left unspecified (verified against
  // node_modules/sharp/dist/output.cjs:741-745), so `quality: 82` alone
  // would produce byte-identical output.
  .png({ compressionLevel: 9, palette: true })
  .toBuffer()
writeFileSync('public/og.png', og)

console.log('logo', logo.length, 'favicon', favicon.length, 'og', og.length)
