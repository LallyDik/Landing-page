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

  it('exposes five projects with absolute https urls', () => {
    for (const content of [he, en]) {
      expect(content.projects.items).toHaveLength(5)
      for (const project of content.projects.items) {
        expect(() => new URL(project.url)).not.toThrow()
        expect(new URL(project.url).protocol).toBe('https:')
        expect(project.tech.length).toBeGreaterThan(0)
      }
    }
  })

  it('never links to linkedin', () => {
    const serialized = JSON.stringify([he, en]).toLowerCase()
    expect(serialized).not.toContain('linkedin')
  })

  it('marks exactly one capability as featured', () => {
    for (const content of [he, en]) {
      const featured = content.capabilities.items.filter((c) => c.kind === 'featured')
      expect(featured).toHaveLength(1)
    }
  })
})
