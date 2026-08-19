import { describe, it, expect } from 'vitest'
import { he, en } from '../src/data/content'

function keyPaths(value: unknown, prefix = ''): string[] {
  if (Array.isArray(value)) {
    return value.flatMap((item, i) => keyPaths(item, `${prefix}[${i}]`))
  }
  if (value !== null && typeof value === 'object') {
    return Object.keys(value)
      .sort()
      .flatMap((key) => keyPaths((value as Record<string, unknown>)[key], `${prefix}.${key}`))
  }
  return [prefix]
}

describe('content parity', () => {
  it('he and en expose identical key paths', () => {
    expect(keyPaths(en)).toEqual(keyPaths(he))
  })

  it('declares the correct language and direction', () => {
    expect(he.lang).toBe('he')
    expect(he.dir).toBe('rtl')
    expect(en.lang).toBe('en')
    expect(en.dir).toBe('ltr')
  })
})

describe('content integrity', () => {
  it('has no empty strings anywhere', () => {
    for (const content of [he, en]) {
      const flatten = (v: unknown): string[] =>
        Array.isArray(v)
          ? v.flatMap(flatten)
          : v !== null && typeof v === 'object'
            ? Object.values(v).flatMap(flatten)
            : typeof v === 'string'
              ? [v]
              : []
      for (const s of flatten(content)) {
        expect(s.trim()).not.toBe('')
      }
    }
  })

  it('exposes six projects across three groups with absolute https urls', () => {
    for (const content of [he, en]) {
      expect(content.projects.groups).toHaveLength(3)
      const projects = content.projects.groups.flatMap((g) => g.items)
      expect(projects).toHaveLength(6)
      for (const project of projects) {
        expect(() => new URL(project.url)).not.toThrow()
        expect(new URL(project.url).protocol).toBe('https:')
        expect(project.tech.length).toBeGreaterThan(0)
        // Every card answers "what did she build", not just what it is.
        expect(project.contribution.trim().length).toBeGreaterThan(0)
      }
    }
  })

  it('leads with two full-width projects', () => {
    for (const content of [he, en]) {
      const lead = content.projects.groups[0].items
      expect(lead).toHaveLength(2)
      expect(lead.every((p) => p.scale === 'lead')).toBe(true)
      // Talmid Track is the flagship and must come first.
      expect(lead[0].name).toBe('Talmid Track')
    }
  })

  it('offers three hero proof points and three expertise areas', () => {
    for (const content of [he, en]) {
      expect(content.hero.stats).toHaveLength(3)
      expect(content.capabilities.items).toHaveLength(3)
    }
  })

  it('never links to linkedin', () => {
    const serialized = JSON.stringify([he, en]).toLowerCase()
    expect(serialized).not.toContain('linkedin')
  })

  it('keeps every expertise area to a single compact line', () => {
    // Core expertise is deliberately three equal areas now — no featured
    // card with nested detail — so the section stays scannable.
    for (const content of [he, en]) {
      expect(content.capabilities.items.every((c) => c.kind === 'compact')).toBe(true)
    }
  })
})
