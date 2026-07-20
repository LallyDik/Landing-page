import { describe, it, expect, beforeAll } from 'vitest'
import { readFileSync, existsSync, statSync } from 'node:fs'
import { parse } from 'node-html-parser'
import type { HTMLElement } from 'node-html-parser'
import { he, en } from '../src/data/content'

let heDoc: HTMLElement
let enDoc: HTMLElement

beforeAll(() => {
  heDoc = parse(readFileSync('dist/index.html', 'utf8'))
  enDoc = parse(readFileSync('dist/en/index.html', 'utf8'))
})

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
      ]
      expect(external).toHaveLength(0)
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
      expect(links).toHaveLength(5)
      for (const link of links) {
        expect(link.getAttribute('target')).toBe('_blank')
        expect(link.getAttribute('rel')).toContain('noopener')
      }
    }
  })

  it('leads with the independently built product', () => {
    const first = heDoc.querySelector('.project-card h3')
    expect(first?.text).toContain('ניהול שכירות')
  })

  it('hides the arrow glyph on project links from assistive technology', () => {
    for (const doc of [heDoc, enDoc]) {
      const links = doc.querySelectorAll('.project-card a')
      expect(links).toHaveLength(5)
      for (const link of links) {
        const arrow = link.querySelector('span[aria-hidden="true"]')
        expect(arrow).not.toBeNull()
        expect(arrow?.text).toContain('↗')
      }
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
      const text = doc.querySelector('#experience')?.text ?? ''
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
    for (const file of ['dist/logo-ld.png', 'dist/favicon.png', 'dist/og.png']) {
      expect(existsSync(file)).toBe(true)
      expect(statSync(file).size).toBeLessThan(200 * 1024)
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
