import { describe, it, expect, beforeAll } from 'vitest'
import { readFileSync, readdirSync, existsSync, statSync } from 'node:fs'
import { join, extname } from 'node:path'
import { parse } from 'node-html-parser'
import type { HTMLElement } from 'node-html-parser'
import { he, en } from '../src/data/content'

let heDoc: HTMLElement
let enDoc: HTMLElement

beforeAll(() => {
  heDoc = parse(readFileSync('dist/index.html', 'utf8'))
  enDoc = parse(readFileSync('dist/en/index.html', 'utf8'))
})

// Astro hashes emitted filenames, so discover them rather than hardcoding
// one — used both to find the built CSS and to scan dist/ for images.
function listFilesRecursive(dir: string): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = join(dir, entry.name)
    return entry.isDirectory() ? listFilesRecursive(full) : [full]
  })
}

describe('document shell', () => {
  it('sets lang and dir per route', () => {
    expect(heDoc.querySelector('html')?.getAttribute('lang')).toBe('he')
    expect(heDoc.querySelector('html')?.getAttribute('dir')).toBe('rtl')
    expect(enDoc.querySelector('html')?.getAttribute('lang')).toBe('en')
    expect(enDoc.querySelector('html')?.getAttribute('dir')).toBe('ltr')
  })

  it('carries a distinct title and description per route', () => {
    expect(heDoc.querySelector('title')?.text).toContain('לאה דיקמן')
    expect(enDoc.querySelector('title')?.text).toContain('Leah Dickman')
    for (const doc of [heDoc, enDoc]) {
      const description = doc.querySelector('meta[name="description"]')
      expect(description?.getAttribute('content')?.length).toBeGreaterThan(50)
    }
  })

  it('cross-links the languages with reciprocal hreflang tags', () => {
    for (const doc of [heDoc, enDoc]) {
      const links = doc.querySelectorAll('link[rel="alternate"]')
      const langs = links.map((l) => l.getAttribute('hreflang')).sort()
      expect(langs).toEqual(['en', 'he'])
    }
  })

  it('requests no external origins', () => {
    for (const doc of [heDoc, enDoc]) {
      // canonical/alternate links are same-origin SEO metadata, never fetched
      // by the browser, so they are excluded from this "no external requests"
      // check — a CDN stylesheet or script src is what this guards against.
      const external = [
        ...doc
          .querySelectorAll('link[href^="http"]')
          .filter((l) => !['canonical', 'alternate'].includes(l.getAttribute('rel') ?? '')),
        ...doc.querySelectorAll('script[src^="http"]'),
        ...doc.querySelectorAll('img[src^="http"]'),
      ]
      expect(external).toHaveLength(0)

      // JSON-LD is structured data, not executable code — it legitimately
      // embeds https:// URLs (schema.org context, profile links) with no
      // network request implied, so it's excluded here. Any other inline
      // <script> body is guarded: an embedded raw URL is exactly how a
      // fetch()-based or document.write CDN regression would show up.
      for (const script of doc.querySelectorAll('script:not([src])')) {
        if (script.getAttribute('type') === 'application/ld+json') continue
        expect(script.text).not.toMatch(/https?:\/\//)
      }
    }

    // The likeliest real regression is invisible to the HTML-only checks
    // above: someone swapping the self-hosted @font-face src for a CDN URL
    // (or a background: url()) inside CSS. Read every built stylesheet from
    // disk and check.
    const cssDir = 'dist/_astro'
    const cssFiles = readdirSync(cssDir).filter((f) => f.endsWith('.css'))
    expect(cssFiles.length).toBeGreaterThan(0)
    for (const file of cssFiles) {
      const css = readFileSync(join(cssDir, file), 'utf8')
      expect(css).not.toMatch(/https?:\/\//)
    }
  })
})

describe('hero', () => {
  it('shows exactly one h1 carrying the name', () => {
    const heH1s = heDoc.querySelectorAll('h1')
    expect(heH1s).toHaveLength(1)
    expect(heH1s[0].text).toContain('לאה דיקמן')

    const enH1s = enDoc.querySelectorAll('h1')
    expect(enH1s).toHaveLength(1)
    expect(enH1s[0].text).toContain('Leah Dickman')
  })

  it('offers both calls to action as in-page anchors', () => {
    for (const doc of [heDoc, enDoc]) {
      expect(doc.querySelector('a[href="#projects"]')).not.toBeNull()
      expect(doc.querySelector('a[href="#contact"]')).not.toBeNull()
    }
  })

  it('links each route to the other language', () => {
    expect(heDoc.querySelector('a[href="/en"]')).not.toBeNull()
    expect(enDoc.querySelector('a[href="/"]')).not.toBeNull()
  })

  it('marks the logo decorative with a present but empty alt attribute', () => {
    for (const doc of [heDoc, enDoc]) {
      const logo = doc.querySelector('img[src="/logo-ld.png"]')
      expect(logo?.attributes.alt).toBeDefined()
      expect(logo?.getAttribute('alt')).toBe('')
    }
  })
})

describe('capabilities', () => {
  it('renders one featured card and two compact cards', () => {
    for (const doc of [heDoc, enDoc]) {
      expect(doc.querySelectorAll('.capability.featured')).toHaveLength(1)
      expect(doc.querySelectorAll('.capability.compact')).toHaveLength(2)
    }
  })

  it('states four claim-evidence pairs in the featured card', () => {
    for (const doc of [heDoc, enDoc]) {
      const featured = doc.querySelector('.capability.featured')
      expect(featured?.querySelectorAll('.claim')).toHaveLength(4)
      expect(featured?.querySelectorAll('.evidence')).toHaveLength(4)
    }
  })

  it('puts the featured card first in source order', () => {
    for (const doc of [heDoc, enDoc]) {
      const first = doc.querySelector('.capability')
      expect(first?.classList.contains('featured')).toBe(true)
    }
  })
})

describe('projects', () => {
  it('renders five cards under an anchorable section', () => {
    for (const doc of [heDoc, enDoc]) {
      expect(doc.querySelector('#projects')).not.toBeNull()
      expect(doc.querySelectorAll('.project-card')).toHaveLength(5)
    }
  })

  it('states a role on every card', () => {
    for (const doc of [heDoc, enDoc]) {
      const roles = doc.querySelectorAll('.project-card .role')
      expect(roles).toHaveLength(5)
      for (const role of roles) {
        expect(role.text.trim().length).toBeGreaterThan(0)
      }
    }
  })

  it('opens external links safely in a new tab', () => {
    for (const doc of [heDoc, enDoc]) {
      const links = doc.querySelectorAll('.project-card a')
      // Five cards each contribute their live-product link, plus one repo
      // link on the rental management card.
      expect(links).toHaveLength(6)
      for (const link of links) {
        expect(link.getAttribute('target')).toBe('_blank')
        expect(link.getAttribute('rel')).toContain('noopener')
      }
    }
  })

  it('leads with the independently built product', () => {
    // The lead project's name differs per language, so assert against the
    // content module rather than a hardcoded string — a hardcoded Hebrew
    // string only ever checked the Hebrew route, so an English regression
    // that reordered projects.items would ship unnoticed.
    for (const [doc, content] of [
      [heDoc, he],
      [enDoc, en],
    ] as const) {
      const first = doc.querySelector('.project-card h3')
      expect(first?.text).toContain(content.projects.items[0].name)
    }
  })

  it('gives every project card a cover image that ships in the build', () => {
    for (const doc of [heDoc, enDoc]) {
      const cards = doc.querySelectorAll('.project-card')
      expect(cards).toHaveLength(5)
      for (const card of cards) {
        const cover = card.querySelector('img.cover')
        expect(cover).not.toBeNull()
        const src = cover!.getAttribute('src') ?? ''
        expect(src).toMatch(/^\/projects\/.+\.webp$/)
        // The referenced file must actually exist in the build output, so a
        // typo'd or renamed cover is a failed build rather than a live 404.
        expect(existsSync(`dist${src}`)).toBe(true)
        // Decorative: the card's h3 already names the project, so a screen
        // reader must not hear the same thing twice.
        expect(cover!.getAttribute('alt')).toBe('')
      }
    }
  })

  it('hides the arrow glyph on project links from assistive technology', () => {
    for (const doc of [heDoc, enDoc]) {
      // This asserts per link, not per card, so the rental card's extra repo
      // link (its own arrow, alongside the live-product link's arrow) is
      // covered by the same loop rather than breaking an assumption of one
      // arrow per card.
      const links = doc.querySelectorAll('.project-card a')
      expect(links).toHaveLength(6)
      for (const link of links) {
        const arrow = link.querySelector('span[aria-hidden="true"]')
        expect(arrow).not.toBeNull()
        expect(arrow?.text).toContain('↗')
      }
    }
  })

  it('links the rental management card to its source repository', () => {
    for (const [doc, content] of [
      [heDoc, he],
      [enDoc, en],
    ] as const) {
      const repoLinks = doc.querySelectorAll('.project-card a[href="https://github.com/LallyDik/bayit-yisraeli-menahal"]')
      expect(repoLinks).toHaveLength(1)

      const repoLink = repoLinks[0]
      expect(repoLink.getAttribute('target')).toBe('_blank')
      expect(repoLink.getAttribute('rel')).toContain('noopener')
      expect(repoLink.querySelector('.visually-hidden')).not.toBeNull()

      // Every other project card has no repoUrl in the content module, so
      // none of them should render a repo link.
      const cards = doc.querySelectorAll('.project-card')
      expect(cards).toHaveLength(content.projects.items.length)
      const cardsWithRepoLink = cards.filter(
        (card) => card.querySelectorAll('a[href="https://github.com/LallyDik/bayit-yisraeli-menahal"]').length > 0
      )
      expect(cardsWithRepoLink).toHaveLength(1)

      const projectsWithRepoUrl = content.projects.items.filter((p) => p.repoUrl)
      expect(projectsWithRepoUrl).toHaveLength(1)
    }
  })
})

describe('experience, stack and education', () => {
  it('lists both roles with their bullets', () => {
    for (const doc of [heDoc, enDoc]) {
      const entries = doc.querySelectorAll('.experience-entry')
      expect(entries).toHaveLength(2)
      expect(entries[0].querySelectorAll('li')).toHaveLength(5)
      expect(entries[1].querySelectorAll('li')).toHaveLength(4)
    }
  })

  it('spells out the Easy Tax backend stack', () => {
    for (const doc of [heDoc, enDoc]) {
      // Scoped to the Easy Tax entry specifically, not the whole
      // #experience section — otherwise these tokens could migrate into the
      // other role's bullets, or survive as a stray mention, while Easy
      // Tax's own bullets are emptied, and this test would stay green.
      const easyTaxEntry = doc
        .querySelectorAll('.experience-entry')
        .find((entry) => entry.text.includes('Easy Tax'))
      expect(easyTaxEntry).toBeDefined()
      const text = easyTaxEntry?.text ?? ''
      for (const token of ['C#', 'ASP.NET Core 8', 'EF Core', 'SQL Server', 'Clean Architecture']) {
        expect(text).toContain(token)
      }
    }
  })

  it('groups the tech stack with languages first', () => {
    for (const doc of [heDoc, enDoc]) {
      const groups = doc.querySelectorAll('.tech-group')
      expect(groups).toHaveLength(6)
      expect(groups[0].querySelector('h3')?.text).toMatch(/שפות|Languages/)
    }
  })

  it('renders education', () => {
    for (const [doc, content] of [
      [heDoc, he],
      [enDoc, en],
    ] as const) {
      const section = doc.querySelector('#education')
      expect(section).not.toBeNull()

      const heading = section?.querySelector('h2')?.text.trim() ?? ''
      const period = section?.querySelector('.period')?.text.trim() ?? ''
      const institution = section?.querySelector('h3')?.text.trim() ?? ''
      const detail = section?.querySelector('.detail')?.text.trim() ?? ''

      expect(heading.length).toBeGreaterThan(0)
      expect(period).toBe(content.education.period)
      expect(institution).toBe(content.education.institution)
      expect(detail).toBe(content.education.detail)
    }
  })
})

describe('contact', () => {
  it('exposes all four channels', () => {
    for (const doc of [heDoc, enDoc]) {
      const contact = doc.querySelector('#contact')
      expect(contact).not.toBeNull()
      expect(contact?.querySelector('a[href^="mailto:"]')).not.toBeNull()
      expect(contact?.querySelector('a[href*="wa.me"]')).not.toBeNull()
      expect(contact?.querySelector('a[href*="github.com"]')).not.toBeNull()
      expect(contact?.querySelector('a[href*="duallin.com"]')).not.toBeNull()
    }
  })

  it('offers the CV for the matching language', () => {
    expect(heDoc.querySelector('a[href="/cv/leah-dickman-he.pdf"]')).not.toBeNull()
    expect(enDoc.querySelector('a[href="/cv/leah-dickman-en.pdf"]')).not.toBeNull()
  })

  it('ships both CV files in the build output', () => {
    expect(existsSync('dist/cv/leah-dickman-he.pdf')).toBe(true)
    expect(existsSync('dist/cv/leah-dickman-en.pdf')).toBe(true)
  })

  it('never renders a linkedin link', () => {
    for (const doc of [heDoc, enDoc]) {
      expect(doc.querySelectorAll('a[href*="linkedin"]')).toHaveLength(0)
    }
  })

  it('announces new-tab links to screen readers but not the mailto link', () => {
    for (const doc of [heDoc, enDoc]) {
      const contact = doc.querySelector('#contact')
      const blankLinks = contact?.querySelectorAll('a[target="_blank"]') ?? []
      expect(blankLinks.length).toBeGreaterThan(0)
      for (const link of blankLinks) {
        expect(link.querySelector('.visually-hidden')).not.toBeNull()
      }

      const mailtoLink = contact?.querySelector('a[href^="mailto:"]')
      expect(mailtoLink?.querySelector('.visually-hidden')).toBeNull()
    }
  })
})

describe('structured data and crawling', () => {
  it('embeds a valid Person schema on both routes', () => {
    for (const doc of [heDoc, enDoc]) {
      const script = doc.querySelector('script[type="application/ld+json"]')
      expect(script).not.toBeNull()
      const data = JSON.parse(script!.text)
      expect(data['@type']).toBe('Person')
      expect(data.name.length).toBeGreaterThan(0)
      expect(data.url).toBe('https://leahdick-dev.com')
      expect(Array.isArray(data.sameAs)).toBe(true)
      expect(data.sameAs).toContain('https://github.com/LallyDik')
    }
  })

  it('emits a sitemap and robots file', () => {
    expect(existsSync('dist/sitemap-index.xml')).toBe(true)
    expect(existsSync('dist/robots.txt')).toBe(true)

    const robots = readFileSync('dist/robots.txt', 'utf8')
    expect(robots).toContain('Sitemap: https://leahdick-dev.com/sitemap-index.xml')

    // The index file only lists child sitemap(s); the actual page URLs live
    // in whichever child file(s) it points at, so follow the reference
    // rather than assuming a filename.
    const index = readFileSync('dist/sitemap-index.xml', 'utf8')
    const childLocs = [...index.matchAll(/<loc>(.*?)<\/loc>/g)].map((m) => m[1])
    expect(childLocs.length).toBeGreaterThan(0)

    const childPages = childLocs.map((loc) => {
      const path = new URL(loc).pathname
      expect(existsSync(`dist${path}`)).toBe(true)
      return readFileSync(`dist${path}`, 'utf8')
    })
    const sitemapContent = childPages.join('\n')

    expect(sitemapContent).toContain('<loc>https://leahdick-dev.com/</loc>')
    expect(sitemapContent).toContain('<loc>https://leahdick-dev.com/en/</loc>')
  })
})

describe('assets', () => {
  it('keeps every shipped image under 200KB', () => {
    // Scan dist/ recursively instead of naming files explicitly, so a
    // fourth image added later is checked automatically instead of
    // shipping unchecked at any size.
    const imageExtensions = new Set(['.png', '.jpg', '.jpeg', '.webp', '.svg', '.gif', '.avif'])
    const images = listFilesRecursive('dist').filter((file) =>
      imageExtensions.has(extname(file).toLowerCase())
    )
    // Guards against an empty/misconfigured scan passing vacuously.
    expect(images.length).toBeGreaterThanOrEqual(3)
    for (const file of images) {
      expect(statSync(file).size).toBeLessThan(200 * 1024)
    }
  })
})

describe('rtl correctness', () => {
  it('uses logical CSS properties instead of physical left/right ones', () => {
    // One stylesheet serves both the RTL Hebrew route and the LTR English
    // route, which only works if directional spacing/alignment uses logical
    // properties (padding-inline-start, inset-inline-end, text-align: start)
    // instead of physical ones (padding-left, text-align: right) — a
    // physical property mirrors incorrectly when dir="rtl".
    const cssDir = 'dist/_astro'
    const cssFiles = readdirSync(cssDir).filter((f) => f.endsWith('.css'))
    expect(cssFiles.length).toBeGreaterThan(0)

    for (const file of cssFiles) {
      const css = readFileSync(join(cssDir, file), 'utf8')

      for (const token of [
        'margin-left',
        'margin-right',
        'padding-left',
        'padding-right',
        'border-left',
        'border-right',
      ]) {
        expect(css).not.toContain(token)
      }

      expect(css).not.toMatch(/text-align\s*:\s*left\b/i)
      expect(css).not.toMatch(/text-align\s*:\s*right\b/i)

      // Bare left:/right: offsets are physical too. The one deliberate
      // exception: Hero.astro centres its decorative glow with
      // `left: 50%; transform: translateX(-50%)`. Centering is
      // direction-symmetric, so a logical property is the wrong tool there
      // — strip exactly that declaration before scanning for anything else,
      // so e.g. `left: 0` or `padding-left: 1rem` still fail.
      const withoutCenteringException = css.replace(/left\s*:\s*50%/gi, '')
      expect(withoutCenteringException).not.toMatch(/(?<![a-z-])(left|right)\s*:/i)
    }
  })
})

describe('accessibility', () => {
  it('gives every image alt text', () => {
    for (const doc of [heDoc, enDoc]) {
      for (const img of doc.querySelectorAll('img')) {
        expect(img.getAttribute('alt')).not.toBeUndefined()
      }
    }
  })

  it('has no heading level skips', () => {
    for (const doc of [heDoc, enDoc]) {
      const levels = doc
        .querySelectorAll('h1, h2, h3')
        .map((h) => Number(h.tagName[1]))
      for (let i = 1; i < levels.length; i++) {
        expect(levels[i] - levels[i - 1]).toBeLessThanOrEqual(1)
      }
    }
  })

  it('gives every link an accessible name', () => {
    for (const doc of [heDoc, enDoc]) {
      for (const a of doc.querySelectorAll('a')) {
        const name = a.text.trim() || a.getAttribute('aria-label') || ''
        expect(name.length).toBeGreaterThan(0)
      }
    }
  })
})
