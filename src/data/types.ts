export interface EvidenceClaim {
  claim: string
  evidence: string
}

export interface FeaturedCapability {
  kind: 'featured'
  title: string
  claims: EvidenceClaim[]
  tags: string[]
}

export interface CompactCapability {
  kind: 'compact'
  title: string
  tags: string[]
}

export type Capability = FeaturedCapability | CompactCapability

export interface Project {
  name: string
  description: string
  role: string
  tech: string[]
  url: string
}

export interface ExperienceEntry {
  period: string
  role: string
  org: string
  bullets: string[]
}

export interface TechGroup {
  label: string
  items: string[]
}

export interface ContactLink {
  kind: 'email' | 'whatsapp' | 'github' | 'duallin'
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
    positioning: string
    ctaProjects: string
    ctaContact: string
  }
  capabilities: { heading: string; items: Capability[] }
  projects: { heading: string; items: Project[] }
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
    links: ContactLink[]
    cvLabel: string
    cvHref: string
  }
  langToggle: { label: string; href: string }
}
