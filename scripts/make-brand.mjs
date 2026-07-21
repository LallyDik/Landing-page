// Generates the favicon and Open Graph image for the new identity, from
// scratch (no source logo). Deep violet base + the mature iridescent
// gradient as the signature, matching the site's palette.
//
// One-shot, committed output — like the other asset scripts, not wired into
// the build. Overwrites public/favicon.png and public/og.png.

import sharp from 'sharp'
import { writeFileSync } from 'node:fs'

const INK = '#171320'
const grad = (id) => `
  <linearGradient id="${id}" x1="0" y1="0" x2="1" y2="1">
    <stop offset="0" stop-color="#f25caf"/>
    <stop offset="0.35" stop-color="#8e63f0"/>
    <stop offset="0.7" stop-color="#3fd0d0"/>
    <stop offset="1" stop-color="#efce55"/>
  </linearGradient>`

// favicon: iridescent tile with a dark LD monogram.
const favicon = `
<svg xmlns="http://www.w3.org/2000/svg" width="256" height="256">
  <defs>${grad('g')}</defs>
  <rect width="256" height="256" rx="52" fill="url(#g)"/>
  <text x="50%" y="53%" text-anchor="middle" dominant-baseline="central"
        font-family="Arial, Helvetica, sans-serif" font-size="150" font-weight="800"
        fill="${INK}">LD</text>
</svg>`
await sharp(Buffer.from(favicon)).png({ compressionLevel: 9 }).toFile('public/favicon.png')

// Open Graph: violet base, gradient mark, name + role.
const og = `
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630">
  <defs>${grad('g2')}</defs>
  <rect width="1200" height="630" fill="${INK}"/>
  <rect x="96" y="215" width="200" height="200" rx="40" fill="url(#g2)"/>
  <text x="96" y="200" font-family="Arial, Helvetica, sans-serif" font-size="26"
        font-weight="700" letter-spacing="6" fill="#b79bf5">FULL STACK · AI SOLUTIONS</text>
  <text x="360" y="300" font-family="Arial, Helvetica, sans-serif" font-size="96"
        font-weight="800" fill="#efe9f4">Leah Dickman</text>
  <text x="360" y="380" font-family="Arial, Helvetica, sans-serif" font-size="40"
        font-weight="500" fill="#b79bf5">Full Stack &amp; AI Solutions Engineer</text>
</svg>`
await sharp(Buffer.from(og)).png({ compressionLevel: 9 }).toFile('public/og.png')

console.log('favicon.png + og.png regenerated for the new identity')
