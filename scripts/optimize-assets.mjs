import sharp from 'sharp'
import { readFileSync, writeFileSync } from 'node:fs'

const SOURCE = 'public/logo-ld.png'
const source = readFileSync(SOURCE)

// Logo: displayed at 96px, so 288px covers 3x displays.
const logo = await sharp(source).resize(288, 288).png({ quality: 82, compressionLevel: 9 }).toBuffer()
writeFileSync(SOURCE, logo)

const favicon = await sharp(source).resize(180, 180).png({ compressionLevel: 9 }).toBuffer()
writeFileSync('public/favicon.png', favicon)

// Open Graph: 1200x630, logo centred on the darkest base colour.
const logoLayer = await sharp(source).resize(320, 320).png().toBuffer()
const og = await sharp({
  create: { width: 1200, height: 630, channels: 4, background: '#0b0b12' },
})
  .composite([{ input: logoLayer, gravity: 'center' }])
  // The composited logo carries real photographic detail (the source is
  // ~1MB for a 692x694 monogram), so plain deflate alone lands the 1200x630
  // canvas around 280KB. `palette: true` is required for sharp's PNG
  // `quality` knob to take effect at all — without it `quality` is silently
  // ignored — and quantizing gets this comfortably under the 200KB budget.
  .png({ compressionLevel: 9, palette: true })
  .toBuffer()
writeFileSync('public/og.png', og)

console.log('logo', logo.length, 'favicon', favicon.length, 'og', og.length)
