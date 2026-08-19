export interface CapabilityArea {
  area: string
  detail: string
}

export interface FeaturedCapability {
  kind: 'featured'
  title: string
  areas: CapabilityArea[]
  tags: string[]
}

export interface CompactCapability {
  kind: 'compact'
  title: string
  lead: string
  tags: string[]
}

export type Capability = FeaturedCapability | CompactCapability

/** Bento weight. 'lead' spans the full grid, 'major' a wide half, 'minor' a cell. */
export type ProjectScale = 'lead' | 'major' | 'minor'

export interface Project {
  name: string
  /** What the product is — one line. */
  description: string
  /** What she actually built. The recruiter-facing answer, not the feature list. */
  contribution: string
  tech: string[]
  url: string
  repoUrl?: string
  image: string
  scale: ProjectScale
  /** True when the cover is drawn artwork rather than a screenshot, so it is
   *  letterboxed instead of cropped. */
  imageIsDiagram?: boolean
}

export interface ProjectGroup {
  label: string
  items: Project[]
}

export interface ExperienceEntry {
  period: string
  role: string
  org: string
  /** Compact stack line under each timeline entry — scannable at a glance. */
  stack: string[]
  bullets: string[]
}

export interface TechGroup {
  label: string
  items: string[]
}

export interface ContactLink {
  kind: 'email' | 'phone' | 'github' | 'duallin'
  label: string
  href: string
}

export interface SiteContent {
  lang: 'he' | 'en'
  dir: 'rtl' | 'ltr'
  opensInNewTab: string
  meta: { title: string; description: string }
  hero: {
    name: string
    title: string
    /** Stack line directly under the headline. */
    stackLine: string
    ctaProjects: string
    ctaCv: string
    /** Three short proof points. No prose. */
    stats: string[]
  }
  capabilities: { heading: string; items: Capability[] }
  projects: {
    heading: string
    groups: ProjectGroup[]
    repoLabel: string
    /** Label above the "what I built" paragraph on each card. */
    contributionLabel: string
    viewLabel: string
  }
  experience: { heading: string; items: ExperienceEntry[] }
  tech: { heading: string; groups: TechGroup[] }
  education: {
    heading: string
    period: string
    institution: string
    detail: string
  }
  contact: {
    heading: string
    /** Big question that opens the section — the CTA, not a list of details. */
    prompt: string
    ctaLabel: string
    links: ContactLink[]
    cvLabel: string
    cvHref: string
  }
  langToggle: { label: string; href: string }
}
