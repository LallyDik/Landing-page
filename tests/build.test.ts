import { describe, it, expect, beforeAll } from 'vitest'
import { readFileSync } from 'node:fs'
import { parse } from 'node-html-parser'
import type { HTMLElement } from 'node-html-parser'

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
