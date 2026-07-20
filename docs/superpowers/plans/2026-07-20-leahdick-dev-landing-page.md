# תוכנית יישום — דף נחיתה leahdick-dev.com

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** בניית דף נחיתה אישי סטטי, דו‑לשוני, ופריסתו ל‑leahdick-dev.com דרך Cloudflare Pages.

**Architecture:** אתר Astro סטטי עם שני נתיבים — `/` בעברית RTL ו‑`/en` באנגלית LTR. כל התוכן מרוכז במודול טיפוסי אחד שמייצא שני אובייקטים באותה סכימה; הקומפוננטות מקבלות פרוסת תוכן כ‑prop ואינן יודעות באיזו שפה מדובר. הבדיקות רצות על פלט ה‑build האמיתי, לא על קומפוננטות מבודדות.

**Tech Stack:** Astro 5, TypeScript, Vitest, node-html-parser, @fontsource/heebo, Cloudflare Pages.

## Global Constraints

- **Node 22** — מותקן במחשב (v22.21.0), npm 10.9.4
- **אפס תלות חיצונית בזמן ריצה** — גופנים מקומיים, ללא CDN, ללא בקשות רשת מהדף
- **צבעי בסיס** — רקע `#0B0B12`, משטח `#14141F`, טקסט `#ECECF2`, טקסט משני `#9A9AAF`
- **גרדיאנט אירידיסנטי** — `linear-gradient(135deg, #F8B5E0, #C9B8F5, #A8F0E0, #FAF3A0)`, בשימוש מדוד בלבד
- **גופן** — Heebo, self-hosted דרך `@fontsource-variable/heebo`
- **אין LinkedIn** — הרשת המקצועית היא Duallin. אין להוסיף קישור או אייקון LinkedIn בשום שלב.
- **נגישות** — WCAG AA, ניווט מקלדת מלא, כיבוד `prefers-reduced-motion`
- **כל טקסט מוצג** מגיע מ‑`src/data/content.ts` בלבד. אין מחרוזות קשיחות בקומפוננטות.

---

## מבנה קבצים

| קובץ | אחריות |
|---|---|
| `src/data/types.ts` | טיפוס `SiteContent` וכל טיפוסי המשנה |
| `src/data/content.he.ts` | תוכן עברי |
| `src/data/content.en.ts` | תוכן אנגלי |
| `src/data/content.ts` | ייצוא מרוכז של `he` ו‑`en` |
| `src/layouts/Layout.astro` | מעטפת HTML, head, meta, dir/lang, hreflang |
| `src/components/Hero.astro` | סקציית פתיחה |
| `src/components/LangToggle.astro` | מתג שפה |
| `src/components/Capabilities.astro` | יכולות ליבה, שני סוגי כרטיס |
| `src/components/Projects.astro` | עטיפת סקציית הפרויקטים |
| `src/components/ProjectCard.astro` | כרטיס פרויקט בודד |
| `src/components/Experience.astro` | ניסיון תעסוקתי |
| `src/components/TechStack.astro` | סטאק טכנולוגי |
| `src/components/Education.astro` | השכלה |
| `src/components/Contact.astro` | יצירת קשר והורדת קו"ח |
| `src/pages/index.astro` | נתיב עברי |
| `src/pages/en.astro` | נתיב אנגלי |
| `src/styles/global.css` | טוקני עיצוב וסגנון גלובלי |
| `tests/content.test.ts` | בדיקות מודול התוכן |
| `tests/build.test.ts` | בדיקות על פלט ה‑build |

---

## Task 1: תשתית הפרויקט ומודול התוכן

**Files:**
- Create: `package.json`, `astro.config.mjs`, `tsconfig.json`, `vitest.config.ts`, `.gitignore`
- Create: `src/data/types.ts`, `src/data/content.he.ts`, `src/data/content.en.ts`, `src/data/content.ts`
- Test: `tests/content.test.ts`

**Interfaces:**
- Consumes: אין — זו משימת הבסיס
- Produces: `SiteContent`, `Project`, `Capability`, `ExperienceEntry`, `TechGroup`, `ContactLink`, `EvidenceClaim` מ‑`src/data/types.ts`; `he` ו‑`en` (שניהם `SiteContent`) מ‑`src/data/content.ts`

- [ ] **Step 1: אתחול הפרויקט**

```bash
cd "c:/Users/User/Documents/Landing-page"
npm create astro@latest . -- --template minimal --no-install --no-git --typescript strict --skip-houston
npm install
npm install -D vitest node-html-parser
npm install @fontsource-variable/heebo
```

הערה: התיקייה מכילה כבר `docs/` ו‑`.git`. הדגל `--no-git` מונע דריסה של הריפו הקיים.

- [ ] **Step 2: הגדרת Vitest**

צור `vitest.config.ts`:

```ts
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    include: ['tests/**/*.test.ts'],
    environment: 'node',
  },
})
```

הוסף ל‑`package.json` בתוך `"scripts"`:

```json
"test": "astro build && vitest run",
"test:unit": "vitest run tests/content.test.ts"
```

- [ ] **Step 3: כתיבת הבדיקה הנכשלת**

צור `tests/content.test.ts`:

```ts
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
```

- [ ] **Step 4: הרצת הבדיקה כדי לוודא כישלון**

```bash
npm run test:unit
```

Expected: FAIL — `Cannot find module '../src/data/content'`

- [ ] **Step 5: הגדרת הטיפוסים**

צור `src/data/types.ts`:

```ts
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
```

- [ ] **Step 6: התוכן העברי**

צור `src/data/content.he.ts`:

```ts
import type { SiteContent } from './types'

export const he: SiteContent = {
  lang: 'he',
  dir: 'rtl',
  meta: {
    title: 'לאה דיקמן — מפתחת Full Stack ומהנדסת פתרונות AI',
    description:
      'מפתחת Full Stack ומהנדסת פתרונות AI. בניית שירותי Backend, מערכות SaaS ואינטגרציות AI — בקוד ובאוטומציה.',
  },
  hero: {
    name: 'לאה דיקמן',
    title: 'מפתחת Full Stack ומהנדסת פתרונות AI',
    positioning:
      'למעלה משנתיים ניסיון בפיתוח מערכות Full Stack, שירותי Backend ומוצרי SaaS, ובשילוב יכולות AI במערכות אמיתיות.',
    ctaProjects: 'לפרויקטים',
    ctaContact: 'צרו קשר',
  },
  capabilities: {
    heading: 'יכולות ליבה',
    items: [
      {
        kind: 'featured',
        title: 'פיתוח בקוד',
        claims: [
          {
            claim: 'בניית צד שרת מאפס',
            evidence:
              'מודול "חשבוניות ישראל" ב‑Easy Tax — C#, ASP.NET Core 8, EF Core ו‑SQL Server לפי עקרונות Clean Architecture. דומיין מוסדר מול רשות המסים.',
          },
          {
            claim: 'מוצר שלם בבעלות מלאה',
            evidence:
              'מערכת ניהול השכירות — React ו‑TypeScript מול Supabase, כולל אימות Google ומייל ומודל נתונים של שוכרים, יחידות ותשלומים.',
          },
          {
            claim: 'לוגיקה עסקית לא טריוויאלית',
            evidence:
              'חיוב חשמל, מים וגז לפי קריאות מונה, ומעקב חוזים ותשלומים על לוח עברי ולועזי במקביל.',
          },
          {
            claim: 'עבודה בתוך בסיס קוד קיים',
            evidence:
              'פיתוח פיצ׳רים ב‑Plenty.AI בתוך React, TypeScript ו‑Supabase קיימים — לא רק בנייה על מגרש ריק.',
          },
        ],
        tags: [
          'C#',
          'ASP.NET Core',
          'EF Core',
          'SQL Server',
          'React',
          'TypeScript',
          'Node.js',
          'Supabase',
          'REST APIs',
          'Git',
        ],
      },
      {
        kind: 'compact',
        title: 'מערכות AI',
        tags: ['LLMs', 'RAG', 'AI Agents', 'Prompt Engineering', 'Structured Outputs'],
      },
      {
        kind: 'compact',
        title: 'אוטומציה ואינטגרציות',
        tags: ['n8n', 'Make', 'Bubble', 'Webhooks', 'אינטגרציות API'],
      },
    ],
  },
  projects: {
    heading: 'פרויקטים',
    items: [
      {
        name: 'מערכת ניהול שכירות',
        description:
          'ניהול שוכרים, יחידות ותשלומים — שכר דירה, חשמל, מים וגז לפי קריאת מונה, על לוח עברי ולועזי.',
        role: 'מוצר עצמאי · פיתוח מלא בקוד',
        tech: ['React', 'TypeScript', 'Supabase'],
        url: 'https://nihul-schhirut.lovable.app/',
      },
      {
        name: 'QSellerAI',
        description: 'פלטפורמה לניתוח שיחות מכירה ושירות.',
        role: 'AI Engineer · גרסה חדשה מלאה, שרתים ואוטומציות',
        tech: ['Bubble', 'n8n', 'Make', 'ניהול שרתים'],
        url: 'https://www.qsellerai.com/',
      },
      {
        name: 'CBS — כמה זה עולה לי',
        description:
          'עמוד נחיתה ומחשבון עלות שנתית לבעלי עסקים, עבור מבקר שכר מוסמך.',
        role: 'פיתוח מלא מאפס · מטעם חברה',
        tech: ['Bubble'],
        url: 'https://www.cbs.co.il/step/%d7%9b%d7%9e%d7%94-%d7%96%d7%94-%d7%a2%d7%95%d7%9c%d7%94-%d7%9c%d7%99/',
      },
      {
        name: 'WonderMe',
        description: 'יצירה רגשית בליווי AI.',
        role: 'פיתוח פיצ׳רים · Prompt Engineering',
        tech: ['Bubble', 'LLMs'],
        url: 'https://wonderme.ai/',
      },
      {
        name: 'Plenty.AI',
        description:
          'ניהול תקציב משפחתי מבוסס AI — דיווח הוצאות בוואטסאפ בהקלטה, טקסט או צילום קבלה, עם קטגוריזציה אוטומטית.',
        role: 'פיתוח פיצ׳רים בקוד',
        tech: ['React', 'TypeScript', 'Supabase'],
        url: 'https://plentyai.co.il',
      },
    ],
  },
  experience: {
    heading: 'ניסיון תעסוקתי',
    items: [
      {
        period: '2024 – היום',
        role: 'מפתחת Full Stack ומהנדסת פתרונות AI',
        org: 'SaaS Systems',
        bullets: [
          'פיתוח אפליקציות Web ומערכות SaaS באמצעות React, Node.js ו‑Supabase.',
          'פיתוח שירותי Backend, REST APIs, לוגיקה עסקית ואינטגרציות עם שירותי צד שלישי.',
          'תכנון ויישום פתרונות מקצה לקצה בסביבת Production.',
          'שילוב יכולות AI במערכות באמצעות LLMs, Prompt Engineering ו‑AI Agents.',
          'פיתוח אוטומציות ותהליכים לשיפור תהליכים עסקיים וחוויית המשתמש.',
        ],
      },
      {
        period: '2024',
        role: 'מפתחת Full Stack',
        org: 'Easy Tax',
        bullets: [
          'פיתוח מודול "חשבוניות ישראל" להקצאת מספרי חשבוניות מס לעסקים.',
          'בניית צד שרת מאפס ב‑C# ו‑ASP.NET Core 8.',
          'עבודה עם EF Core ו‑SQL Server לפי עקרונות Clean Architecture.',
          'ניהול גרסאות ב‑Git ולמידה עצמאית של טכנולוגיות לאורך הפיתוח.',
        ],
      },
    ],
  },
  tech: {
    heading: 'סטאק טכנולוגי',
    groups: [
      { label: 'שפות', items: ['C#', 'JavaScript', 'TypeScript', 'Python'] },
      {
        label: 'Backend',
        items: ['ASP.NET Core', '.NET', 'Node.js', 'REST APIs', 'EF Core'],
      },
      { label: 'Frontend', items: ['React', 'HTML', 'CSS'] },
      { label: 'מסדי נתונים', items: ['SQL Server', 'MongoDB', 'Supabase'] },
      {
        label: 'AI',
        items: ['LLMs', 'Prompt Engineering', 'RAG', 'AI Agents', 'Structured Outputs'],
      },
      {
        label: 'אוטומציה וכלים',
        items: ['n8n', 'Make', 'Bubble.io', 'Git', 'Docker', 'Postman', 'Webhooks'],
      },
    ],
  },
  education: {
    heading: 'השכלה',
    period: '2023 – 2024',
    institution: 'לימודי הנדסת תוכנה · מכון בית יעקב',
    detail:
      'דיפלומת הנדסאי מטעם מה"ט, מסלול מורחב בדגש על בינה מלאכותית וארכיטקטורת תוכנה.',
  },
  contact: {
    heading: 'צרו קשר',
    links: [
      { kind: 'email', label: 'ld3250803@gmail.com', href: 'mailto:ld3250803@gmail.com' },
      { kind: 'whatsapp', label: '058-3250803', href: 'https://wa.me/972583250803' },
      { kind: 'github', label: 'GitHub', href: 'https://github.com/LallyDik' },
      { kind: 'duallin', label: 'Duallin', href: 'https://www.duallin.com/in/leah-dickman' },
    ],
    cvLabel: 'הורדת קורות חיים',
    cvHref: '/cv/leah-dickman-he.pdf',
  },
  langToggle: { label: 'English', href: '/en' },
}
```

- [ ] **Step 7: התוכן האנגלי**

צור `src/data/content.en.ts`:

```ts
import type { SiteContent } from './types'

export const en: SiteContent = {
  lang: 'en',
  dir: 'ltr',
  meta: {
    title: 'Leah Dickman — Full Stack Developer & AI Solutions Engineer',
    description:
      'Full Stack Developer and AI Solutions Engineer. Backend services, SaaS systems, and AI integrations — in code and in automation.',
  },
  hero: {
    name: 'Leah Dickman',
    title: 'Full Stack Developer & AI Solutions Engineer',
    positioning:
      '2+ years building full stack systems, backend services, and AI-powered SaaS products.',
    ctaProjects: 'View projects',
    ctaContact: 'Get in touch',
  },
  capabilities: {
    heading: 'Core capabilities',
    items: [
      {
        kind: 'featured',
        title: 'Engineering in code',
        claims: [
          {
            claim: 'Server-side built from scratch',
            evidence:
              'The Israeli e-Invoicing module at Easy Tax — C#, ASP.NET Core 8, EF Core and SQL Server, following Clean Architecture. A regulated Tax Authority domain.',
          },
          {
            claim: 'A full product, fully owned',
            evidence:
              'The rental management system — React and TypeScript against Supabase, including Google and email auth and a tenant, unit and payment data model.',
          },
          {
            claim: 'Non-trivial business logic',
            evidence:
              'Electricity, water and gas billing from meter readings, with lease and payment tracking across both the Hebrew and Gregorian calendars.',
          },
          {
            claim: 'Working inside an existing codebase',
            evidence:
              'Feature development at Plenty.AI inside an established React, TypeScript and Supabase codebase — not only greenfield work.',
          },
        ],
        tags: [
          'C#',
          'ASP.NET Core',
          'EF Core',
          'SQL Server',
          'React',
          'TypeScript',
          'Node.js',
          'Supabase',
          'REST APIs',
          'Git',
        ],
      },
      {
        kind: 'compact',
        title: 'AI systems',
        tags: ['LLMs', 'RAG', 'AI Agents', 'Prompt Engineering', 'Structured Outputs'],
      },
      {
        kind: 'compact',
        title: 'Automation & integrations',
        tags: ['n8n', 'Make', 'Bubble', 'Webhooks', 'API integrations'],
      },
    ],
  },
  projects: {
    heading: 'Projects',
    items: [
      {
        name: 'Rental Management System',
        description:
          'Tenants, units and payments — rent, electricity, water and gas from meter readings, across the Hebrew and Gregorian calendars.',
        role: 'Independent product · built end to end in code',
        tech: ['React', 'TypeScript', 'Supabase'],
        url: 'https://nihul-schhirut.lovable.app/',
      },
      {
        name: 'QSellerAI',
        description: 'A platform for analysing sales and customer service conversations.',
        role: 'AI Engineer · full new version, servers and automations',
        tech: ['Bubble', 'n8n', 'Make', 'Server management'],
        url: 'https://www.qsellerai.com/',
      },
      {
        name: 'CBS — What It Really Costs Me',
        description:
          'A landing page and annual cost calculator for business owners, built for a certified payroll auditor.',
        role: 'Built from scratch · on behalf of a company',
        tech: ['Bubble'],
        url: 'https://www.cbs.co.il/step/%d7%9b%d7%9e%d7%94-%d7%96%d7%94-%d7%a2%d7%95%d7%9c%d7%94-%d7%9c%d7%99/',
      },
      {
        name: 'WonderMe',
        description: 'Emotional creative work, guided by AI.',
        role: 'Feature development · Prompt Engineering',
        tech: ['Bubble', 'LLMs'],
        url: 'https://wonderme.ai/',
      },
      {
        name: 'Plenty.AI',
        description:
          'AI-driven household budgeting — expenses logged over WhatsApp by voice, text or a photo of the receipt, categorised automatically.',
        role: 'Feature development in code',
        tech: ['React', 'TypeScript', 'Supabase'],
        url: 'https://plentyai.co.il',
      },
    ],
  },
  experience: {
    heading: 'Experience',
    items: [
      {
        period: '2024 – Present',
        role: 'Full Stack Developer & AI Solutions Engineer',
        org: 'SaaS Systems',
        bullets: [
          'Built web applications and SaaS systems using React, Node.js and Supabase.',
          'Developed backend services, REST APIs, business logic and third-party integrations.',
          'Designed and shipped end-to-end solutions in production.',
          'Integrated AI capabilities using LLMs, Prompt Engineering and AI Agents.',
          'Built automations and workflows improving business processes and user experience.',
        ],
      },
      {
        period: '2024',
        role: 'Full Stack Developer',
        org: 'Easy Tax',
        bullets: [
          'Developed the Israeli e-Invoicing module for allocating tax invoice numbers to businesses.',
          'Built the server side from scratch in C# and ASP.NET Core 8.',
          'Worked with EF Core and SQL Server following Clean Architecture principles.',
          'Used Git for version control and independently learned new technologies throughout.',
        ],
      },
    ],
  },
  tech: {
    heading: 'Tech stack',
    groups: [
      { label: 'Languages', items: ['C#', 'JavaScript', 'TypeScript', 'Python'] },
      {
        label: 'Backend',
        items: ['ASP.NET Core', '.NET', 'Node.js', 'REST APIs', 'EF Core'],
      },
      { label: 'Frontend', items: ['React', 'HTML', 'CSS'] },
      { label: 'Databases', items: ['SQL Server', 'MongoDB', 'Supabase'] },
      {
        label: 'AI',
        items: ['LLMs', 'Prompt Engineering', 'RAG', 'AI Agents', 'Structured Outputs'],
      },
      {
        label: 'Automation & tools',
        items: ['n8n', 'Make', 'Bubble.io', 'Git', 'Docker', 'Postman', 'Webhooks'],
      },
    ],
  },
  education: {
    heading: 'Education',
    period: '2023 – 2024',
    institution: 'Software Engineering · Beit Yaakov Institute',
    detail:
      'Practical Engineer diploma (MAHAT), extended track focused on artificial intelligence and software architecture.',
  },
  contact: {
    heading: 'Get in touch',
    links: [
      { kind: 'email', label: 'ld3250803@gmail.com', href: 'mailto:ld3250803@gmail.com' },
      { kind: 'whatsapp', label: '+972 58-325-0803', href: 'https://wa.me/972583250803' },
      { kind: 'github', label: 'GitHub', href: 'https://github.com/LallyDik' },
      { kind: 'duallin', label: 'Duallin', href: 'https://www.duallin.com/in/leah-dickman' },
    ],
    cvLabel: 'Download CV',
    cvHref: '/cv/leah-dickman-en.pdf',
  },
  langToggle: { label: 'עברית', href: '/' },
}
```

- [ ] **Step 8: הייצוא המרוכז**

צור `src/data/content.ts`:

```ts
export type * from './types'
export { he } from './content.he'
export { en } from './content.en'
```

- [ ] **Step 9: הרצת הבדיקות**

```bash
npm run test:unit
```

Expected: PASS — כל שבע הבדיקות עוברות.

- [ ] **Step 10: קומיט**

```bash
git add package.json package-lock.json astro.config.mjs tsconfig.json vitest.config.ts .gitignore src tests
git commit -m "Add Astro scaffold and the typed bilingual content module

All display text lives in one typed module exporting he and en against a
shared SiteContent interface, so components never hold strings and the
two languages cannot silently drift.

Tests enforce key-path parity between the languages, absolute https URLs
on every project, exactly one featured capability, and the absence of any
LinkedIn reference."
```

---

## Task 2: מעטפת, טוקני עיצוב ושני הנתיבים

**Files:**
- Create: `src/layouts/Layout.astro`, `src/styles/global.css`, `src/pages/index.astro`, `src/pages/en.astro`
- Modify: `astro.config.mjs`
- Test: `tests/build.test.ts`

**Interfaces:**
- Consumes: `he`, `en`, `SiteContent` מ‑`src/data/content.ts`
- Produces: `Layout.astro` המקבל `content: SiteContent` כ‑prop ועוטף `<slot />`

- [ ] **Step 1: כתיבת הבדיקה הנכשלת**

צור `tests/build.test.ts`:

```ts
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
      const external = [
        ...doc.querySelectorAll('link[href^="http"]'),
        ...doc.querySelectorAll('script[src^="http"]'),
      ]
      expect(external).toHaveLength(0)
    }
  })
})
```

- [ ] **Step 2: הרצה לוודא כישלון**

```bash
npx astro build && npx vitest run tests/build.test.ts
```

Expected: FAIL — `dist/en/index.html` לא קיים.

- [ ] **Step 3: טוקני העיצוב**

צור `src/styles/global.css`:

```css
@import '@fontsource-variable/heebo';

:root {
  --bg: #0b0b12;
  --surface: #14141f;
  --border: rgba(255, 255, 255, 0.08);
  --text: #ececf2;
  --text-muted: #9a9aaf;
  --iridescent: linear-gradient(135deg, #f8b5e0, #c9b8f5, #a8f0e0, #faf3a0);

  --space-section: clamp(3.5rem, 8vw, 6rem);
  --radius: 14px;
  --measure: 68ch;
}

*,
*::before,
*::after {
  box-sizing: border-box;
}

body {
  margin: 0;
  background: var(--bg);
  color: var(--text);
  font-family: 'Heebo Variable', system-ui, sans-serif;
  line-height: 1.7;
  -webkit-font-smoothing: antialiased;
}

main {
  max-width: 1100px;
  margin-inline: auto;
  padding-inline: clamp(1rem, 5vw, 2.5rem);
}

section {
  padding-block: var(--space-section);
}

h1,
h2,
h3 {
  line-height: 1.25;
  text-wrap: balance;
}

p {
  max-width: var(--measure);
}

a {
  color: inherit;
}

:focus-visible {
  outline: 2px solid #c9b8f5;
  outline-offset: 3px;
}

.section-heading {
  font-size: clamp(1.5rem, 3vw, 2rem);
  margin-block-end: 2rem;
  display: inline-block;
}

.section-heading::after {
  content: '';
  display: block;
  height: 2px;
  margin-block-start: 0.5rem;
  background: var(--iridescent);
  border-radius: 2px;
}

.card {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 1.5rem;
  transition: transform 160ms ease, border-color 160ms ease;
}

.card:hover {
  transform: translateY(-3px);
  border-color: rgba(201, 184, 245, 0.5);
}

.tag {
  display: inline-block;
  font-size: 0.8rem;
  color: var(--text-muted);
  border: 1px solid var(--border);
  border-radius: 999px;
  padding: 0.15rem 0.7rem;
  margin: 0.15rem;
}

/* Sections fade in as they enter the viewport, with zero JavaScript.
   Browsers without scroll-driven animation support simply show the
   content immediately, which is the correct fallback. */
@supports (animation-timeline: view()) {
  @media (prefers-reduced-motion: no-preference) {
    section {
      animation: reveal linear both;
      animation-timeline: view();
      animation-range: entry 10% cover 22%;
    }
  }
}

@keyframes reveal {
  from {
    opacity: 0;
    transform: translateY(14px);
  }
  to {
    opacity: 1;
    transform: none;
  }
}

@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

ההופעה בגלילה ממומשת ב‑CSS בלבד דרך `animation-timeline: view()`. דפדפן שאינו תומך מציג את התוכן מיד — זו התנהגות הנפילה הנכונה, ובניגוד למימוש ב‑JavaScript היא לא משאירה תוכן בלתי נראה אם הסקריפט נכשל.

- [ ] **Step 4: המעטפת**

צור `src/layouts/Layout.astro`:

```astro
---
import type { SiteContent } from '../data/content'
import '../styles/global.css'

interface Props {
  content: SiteContent
}

const { content } = Astro.props
const site = 'https://leahdick-dev.com'
const canonical = content.lang === 'he' ? `${site}/` : `${site}/en`
---

<!doctype html>
<html lang={content.lang} dir={content.dir}>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>{content.meta.title}</title>
    <meta name="description" content={content.meta.description} />
    <link rel="canonical" href={canonical} />
    <link rel="alternate" hreflang="he" href={`${site}/`} />
    <link rel="alternate" hreflang="en" href={`${site}/en`} />
    <link rel="icon" href="/favicon.png" type="image/png" />
    <meta property="og:title" content={content.meta.title} />
    <meta property="og:description" content={content.meta.description} />
    <meta property="og:type" content="profile" />
    <meta property="og:url" content={canonical} />
    <meta property="og:image" content={`${site}/og.png`} />
    <meta name="twitter:card" content="summary_large_image" />
  </head>
  <body>
    <main>
      <slot />
    </main>
  </body>
</html>
```

- [ ] **Step 5: שני הנתיבים**

צור `src/pages/index.astro`:

```astro
---
import Layout from '../layouts/Layout.astro'
import { he } from '../data/content'
---

<Layout content={he} />
```

צור `src/pages/en.astro`:

```astro
---
import Layout from '../layouts/Layout.astro'
import { en } from '../data/content'
---

<Layout content={en} />
```

- [ ] **Step 6: הגדרת ה‑build**

החלף את `astro.config.mjs` בתוכן הבא:

```js
import { defineConfig } from 'astro/config'

export default defineConfig({
  site: 'https://leahdick-dev.com',
  build: { format: 'directory' },
})
```

`format: 'directory'` הוא מה שגורם ל‑`en.astro` להיבנות אל `dist/en/index.html`, ולכן הכתובת היא `/en` ולא `/en.html`.

- [ ] **Step 7: הרצת הבדיקות**

```bash
npm test
```

Expected: PASS — ארבע בדיקות ה‑build ושבע בדיקות התוכן.

- [ ] **Step 8: קומיט**

```bash
git add astro.config.mjs src tests
git commit -m "Add document shell, design tokens and both language routes

Layout takes a SiteContent object and derives lang, dir, canonical and
the reciprocal hreflang pair from it, so adding a language never means
touching the shell.

Build format is set to directory so the English route resolves at /en.
A test asserts the pages request no external origins, which keeps the
self-hosted-font constraint from regressing silently."
```

---

## Task 3: Hero ומתג השפה

**Files:**
- Create: `src/components/Hero.astro`, `src/components/LangToggle.astro`
- Modify: `src/pages/index.astro`, `src/pages/en.astro`
- Modify: `tests/build.test.ts`
- Copy: `public/logo-ld.png`, `public/favicon.png`

**Interfaces:**
- Consumes: `SiteContent` מ‑Task 1, `Layout.astro` מ‑Task 2
- Produces: `Hero.astro` המקבל `content: SiteContent`; `LangToggle.astro` המקבל `toggle: SiteContent['langToggle']`

- [ ] **Step 1: העתקת הלוגו**

```bash
mkdir -p public
cp "/c/Users/User/Downloads/ChatGPT Image Jul 19, 2026, 11_49_59 AM.png" public/logo-ld.png
cp public/logo-ld.png public/favicon.png
ls -la public/
```

Expected: שני קבצים, כל אחד כ‑1.7MB. הכיווץ מטופל ב‑Task 9.

- [ ] **Step 2: הוספת הבדיקה הנכשלת**

הוסף ל‑`tests/build.test.ts`:

```ts
describe('hero', () => {
  it('shows exactly one h1 carrying the name', () => {
    const h1s = heDoc.querySelectorAll('h1')
    expect(h1s).toHaveLength(1)
    expect(h1s[0].text).toContain('לאה דיקמן')
    expect(enDoc.querySelector('h1')?.text).toContain('Leah Dickman')
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

  it('gives the logo meaningful alt text', () => {
    const logo = heDoc.querySelector('img[src="/logo-ld.png"]')
    expect(logo?.getAttribute('alt')?.length).toBeGreaterThan(0)
  })
})
```

- [ ] **Step 3: הרצה לוודא כישלון**

```bash
npm test
```

Expected: FAIL — `expected null not to be null` על `a[href="#projects"]`.

- [ ] **Step 4: מתג השפה**

צור `src/components/LangToggle.astro`:

```astro
---
import type { SiteContent } from '../data/content'

interface Props {
  toggle: SiteContent['langToggle']
}

const { toggle } = Astro.props
---

<a class="lang-toggle" href={toggle.href}>{toggle.label}</a>

<style>
  .lang-toggle {
    position: absolute;
    inset-block-start: 1.25rem;
    inset-inline-end: 1.25rem;
    font-size: 0.85rem;
    color: var(--text-muted);
    text-decoration: none;
    border: 1px solid var(--border);
    border-radius: 999px;
    padding: 0.3rem 0.9rem;
  }

  .lang-toggle:hover {
    color: var(--text);
    border-color: rgba(201, 184, 245, 0.5);
  }
</style>
```

השימוש ב‑`inset-inline-end` ולא ב‑`right` הוא מה שגורם למתג לעבור אוטומטית מצד לצד בין RTL ל‑LTR, בלי שכפול CSS.

- [ ] **Step 5: ה‑Hero**

צור `src/components/Hero.astro`:

```astro
---
import type { SiteContent } from '../data/content'
import LangToggle from './LangToggle.astro'

interface Props {
  content: SiteContent
}

const { content } = Astro.props
---

<header class="hero">
  <LangToggle toggle={content.langToggle} />

  <img class="logo" src="/logo-ld.png" alt={content.hero.name} width="96" height="96" />

  <h1>{content.hero.name}</h1>
  <p class="title">{content.hero.title}</p>
  <p class="positioning">{content.hero.positioning}</p>

  <div class="actions">
    <a class="btn primary" href="#projects">{content.hero.ctaProjects}</a>
    <a class="btn" href="#contact">{content.hero.ctaContact}</a>
  </div>
</header>

<style>
  .hero {
    position: relative;
    padding-block: clamp(4rem, 12vw, 7rem) var(--space-section);
    text-align: center;
  }

  .hero::before {
    content: '';
    position: absolute;
    inset-block-start: 2rem;
    inset-inline-start: 50%;
    transform: translateX(-50%);
    width: min(460px, 80vw);
    aspect-ratio: 1;
    background: var(--iridescent);
    filter: blur(90px);
    opacity: 0.22;
    border-radius: 50%;
    pointer-events: none;
  }

  .logo,
  h1,
  .title,
  .positioning,
  .actions {
    position: relative;
  }

  .logo {
    width: 96px;
    height: 96px;
    border-radius: 22px;
    object-fit: cover;
  }

  h1 {
    font-size: clamp(2.2rem, 6vw, 3.4rem);
    margin-block: 1rem 0.5rem;
  }

  .title {
    font-size: clamp(1.05rem, 2.4vw, 1.3rem);
    background: var(--iridescent);
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
    margin: 0 auto;
    font-weight: 600;
  }

  .positioning {
    color: var(--text-muted);
    margin: 1.25rem auto 0;
    max-width: 52ch;
  }

  .actions {
    display: flex;
    gap: 0.75rem;
    justify-content: center;
    flex-wrap: wrap;
    margin-block-start: 2rem;
  }

  .btn {
    text-decoration: none;
    border: 1px solid var(--border);
    border-radius: 999px;
    padding: 0.6rem 1.5rem;
    font-weight: 500;
  }

  .btn:hover {
    border-color: rgba(201, 184, 245, 0.5);
  }

  .btn.primary {
    background: var(--iridescent);
    color: #0b0b12;
    border-color: transparent;
    font-weight: 600;
  }
</style>
```

- [ ] **Step 6: חיבור לנתיבים**

עדכן `src/pages/index.astro`:

```astro
---
import Layout from '../layouts/Layout.astro'
import Hero from '../components/Hero.astro'
import { he } from '../data/content'
---

<Layout content={he}>
  <Hero content={he} />
</Layout>
```

עדכן `src/pages/en.astro`:

```astro
---
import Layout from '../layouts/Layout.astro'
import Hero from '../components/Hero.astro'
import { en } from '../data/content'
---

<Layout content={en}>
  <Hero content={en} />
</Layout>
```

- [ ] **Step 7: הרצת הבדיקות**

```bash
npm test
```

Expected: PASS.

- [ ] **Step 8: קומיט**

```bash
git add public src tests
git commit -m "Add hero and language toggle

The toggle is positioned with inset-inline-end rather than right, so it
mirrors itself between the RTL and LTR routes without duplicated CSS.

The iridescent gradient appears twice and only twice here: a blurred
radial glow behind the logo and the clipped text fill on the subtitle."
```

---

## Task 4: יכולות ליבה

**Files:**
- Create: `src/components/Capabilities.astro`
- Modify: `src/pages/index.astro`, `src/pages/en.astro`, `tests/build.test.ts`

**Interfaces:**
- Consumes: `Capability`, `FeaturedCapability`, `CompactCapability` מ‑Task 1
- Produces: `Capabilities.astro` המקבל `content: SiteContent`

- [ ] **Step 1: הוספת הבדיקה הנכשלת**

הוסף ל‑`tests/build.test.ts`:

```ts
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
```

הבדיקה השלישית היא ההגנה האמיתית: היא מקבעת שהכרטיס המודגש ראשון בסדר ה‑DOM, ולכן גם ראשון במובייל וגם ראשון לקורא מסך — ולא רק גדול יותר ויזואלית.

- [ ] **Step 2: הרצה לוודא כישלון**

```bash
npm test
```

Expected: FAIL — `expected [] to have a length of 1`.

- [ ] **Step 3: הקומפוננטה**

צור `src/components/Capabilities.astro`:

```astro
---
import type { SiteContent } from '../data/content'

interface Props {
  content: SiteContent
}

const { content } = Astro.props
---

<section id="capabilities">
  <h2 class="section-heading">{content.capabilities.heading}</h2>

  <div class="grid">
    {
      content.capabilities.items.map((item) => (
        <article class:list={['capability', 'card', item.kind]}>
          <h3>{item.title}</h3>

          {item.kind === 'featured' && (
            <dl class="claims">
              {item.claims.map((c) => (
                <div class="claim-row">
                  <dt class="claim">{c.claim}</dt>
                  <dd class="evidence">{c.evidence}</dd>
                </div>
              ))}
            </dl>
          )}

          <ul class="tags">
            {item.tags.map((tag) => (
              <li class="tag">{tag}</li>
            ))}
          </ul>
        </article>
      ))
    }
  </div>
</section>

<style>
  .grid {
    display: grid;
    gap: 1.25rem;
    grid-template-columns: 1fr;
  }

  @media (min-width: 900px) {
    .grid {
      grid-template-columns: repeat(2, 1fr);
    }

    .capability.featured {
      grid-column: 1 / -1;
    }
  }

  h3 {
    margin-block: 0 1rem;
    font-size: 1.2rem;
  }

  .claims {
    margin: 0 0 1.25rem;
    display: grid;
    gap: 1rem;
  }

  @media (min-width: 640px) {
    .claims {
      grid-template-columns: repeat(2, 1fr);
    }
  }

  .claim-row {
    border-inline-start: 2px solid rgba(201, 184, 245, 0.45);
    padding-inline-start: 0.9rem;
  }

  .claim {
    font-weight: 600;
    margin-block-end: 0.25rem;
  }

  .evidence {
    margin: 0;
    color: var(--text-muted);
    font-size: 0.94rem;
  }

  .tags {
    list-style: none;
    padding: 0;
    margin: 0;
  }
</style>
```

- [ ] **Step 4: חיבור לנתיבים**

החלף את `src/pages/index.astro` בשלמותו:

```astro
---
import Layout from '../layouts/Layout.astro'
import Hero from '../components/Hero.astro'
import Capabilities from '../components/Capabilities.astro'
import { he } from '../data/content'
---

<Layout content={he}>
  <Hero content={he} />
  <Capabilities content={he} />
</Layout>
```

החלף את `src/pages/en.astro` בשלמותו:

```astro
---
import Layout from '../layouts/Layout.astro'
import Hero from '../components/Hero.astro'
import Capabilities from '../components/Capabilities.astro'
import { en } from '../data/content'
---

<Layout content={en}>
  <Hero content={en} />
  <Capabilities content={en} />
</Layout>
```

- [ ] **Step 5: הרצת הבדיקות**

```bash
npm test
```

Expected: PASS.

- [ ] **Step 6: קומיט**

```bash
git add src tests
git commit -m "Add core capabilities with a featured code card

The code card spans both columns and carries four claim-evidence pairs;
the other two are compact tag lists. A test pins the featured card first
in DOM order so the emphasis survives on mobile and in screen readers,
not only in the desktop grid."
```

---

## Task 5: פרויקטים

**Files:**
- Create: `src/components/Projects.astro`, `src/components/ProjectCard.astro`
- Modify: `src/pages/index.astro`, `src/pages/en.astro`, `tests/build.test.ts`

**Interfaces:**
- Consumes: `Project` מ‑Task 1
- Produces: `Projects.astro` המקבל `content: SiteContent`; `ProjectCard.astro` המקבל `project: Project`

- [ ] **Step 1: הוספת הבדיקה הנכשלת**

הוסף ל‑`tests/build.test.ts`:

```ts
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
})
```

- [ ] **Step 2: הרצה לוודא כישלון**

```bash
npm test
```

Expected: FAIL — `expected null not to be null` על `#projects`.

- [ ] **Step 3: כרטיס הפרויקט**

צור `src/components/ProjectCard.astro`:

```astro
---
import type { Project } from '../data/content'

interface Props {
  project: Project
}

const { project } = Astro.props
---

<article class="project-card card">
  <h3>{project.name}</h3>
  <p class="role">{project.role}</p>
  <p class="description">{project.description}</p>

  <ul class="tags">
    {project.tech.map((tech) => <li class="tag">{tech}</li>)}
  </ul>

  <a href={project.url} target="_blank" rel="noopener noreferrer">
    {project.name} ↗
  </a>
</article>

<style>
  .project-card {
    display: flex;
    flex-direction: column;
    gap: 0.6rem;
  }

  h3 {
    margin: 0;
    font-size: 1.15rem;
  }

  .role {
    margin: 0;
    font-size: 0.86rem;
    font-weight: 600;
    color: #c9b8f5;
  }

  .description {
    margin: 0;
    color: var(--text-muted);
    font-size: 0.95rem;
    flex-grow: 1;
  }

  .tags {
    list-style: none;
    padding: 0;
    margin: 0;
  }

  a {
    margin-block-start: 0.4rem;
    font-size: 0.9rem;
    font-weight: 600;
    text-decoration: none;
    color: var(--text);
  }

  a:hover {
    text-decoration: underline;
  }
</style>
```

שורת התפקיד מקבלת צבע אירידיסנטי מובחן ומוצבת מעל התיאור ולא מתחתיו — היא נקראת לפני שהעין מגיעה לתוכן, וזו בדיוק המטרה.

- [ ] **Step 4: עטיפת הסקציה**

צור `src/components/Projects.astro`:

```astro
---
import type { SiteContent } from '../data/content'
import ProjectCard from './ProjectCard.astro'

interface Props {
  content: SiteContent
}

const { content } = Astro.props
---

<section id="projects">
  <h2 class="section-heading">{content.projects.heading}</h2>

  <div class="grid">
    {content.projects.items.map((project) => <ProjectCard project={project} />)}
  </div>
</section>

<style>
  .grid {
    display: grid;
    gap: 1.25rem;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  }
</style>
```

- [ ] **Step 5: חיבור לנתיבים**

החלף את `src/pages/index.astro` בשלמותו:

```astro
---
import Layout from '../layouts/Layout.astro'
import Hero from '../components/Hero.astro'
import Capabilities from '../components/Capabilities.astro'
import Projects from '../components/Projects.astro'
import { he } from '../data/content'
---

<Layout content={he}>
  <Hero content={he} />
  <Capabilities content={he} />
  <Projects content={he} />
</Layout>
```

החלף את `src/pages/en.astro` בשלמותו, זהה פרט ל‑`en`:

```astro
---
import Layout from '../layouts/Layout.astro'
import Hero from '../components/Hero.astro'
import Capabilities from '../components/Capabilities.astro'
import Projects from '../components/Projects.astro'
import { en } from '../data/content'
---

<Layout content={en}>
  <Hero content={en} />
  <Capabilities content={en} />
  <Projects content={en} />
</Layout>
```

- [ ] **Step 6: הרצת הבדיקות**

```bash
npm test
```

Expected: PASS.

- [ ] **Step 7: קומיט**

```bash
git add src tests
git commit -m "Add the projects section

Every card states the actual scope of involvement above its description,
so the role is read before the eye reaches the detail. A test asserts a
non-empty role on all five, which makes an unattributed card a build
failure rather than an oversight.

External links carry target=_blank with rel=noopener."
```

---

## Task 6: ניסיון, סטאק והשכלה

**Files:**
- Create: `src/components/Experience.astro`, `src/components/TechStack.astro`, `src/components/Education.astro`
- Modify: `src/pages/index.astro`, `src/pages/en.astro`, `tests/build.test.ts`

**Interfaces:**
- Consumes: `ExperienceEntry`, `TechGroup` מ‑Task 1
- Produces: שלוש קומפוננטות, כל אחת מקבלת `content: SiteContent`

- [ ] **Step 1: הוספת הבדיקה הנכשלת**

הוסף ל‑`tests/build.test.ts`:

```ts
describe('experience, stack and education', () => {
  it('lists both roles with their bullets', () => {
    for (const doc of [heDoc, enDoc]) {
      expect(doc.querySelectorAll('.experience-entry')).toHaveLength(2)
      const bullets = doc.querySelectorAll('.experience-entry li')
      expect(bullets.length).toBe(9)
    }
  })

  it('spells out the Easy Tax backend stack', () => {
    const text = heDoc.querySelector('#experience')?.text ?? ''
    for (const token of ['C#', 'ASP.NET Core 8', 'EF Core', 'SQL Server', 'Clean Architecture']) {
      expect(text).toContain(token)
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
    for (const doc of [heDoc, enDoc]) {
      expect(doc.querySelector('#education')).not.toBeNull()
    }
  })
})
```

- [ ] **Step 2: הרצה לוודא כישלון**

```bash
npm test
```

Expected: FAIL — `expected [] to have a length of 2`.

- [ ] **Step 3: ניסיון תעסוקתי**

צור `src/components/Experience.astro`:

```astro
---
import type { SiteContent } from '../data/content'

interface Props {
  content: SiteContent
}

const { content } = Astro.props
---

<section id="experience">
  <h2 class="section-heading">{content.experience.heading}</h2>

  <div class="entries">
    {
      content.experience.items.map((entry) => (
        <article class="experience-entry">
          <p class="period">{entry.period}</p>
          <h3>
            {entry.role} · <span class="org">{entry.org}</span>
          </h3>
          <ul>
            {entry.bullets.map((bullet) => (
              <li>{bullet}</li>
            ))}
          </ul>
        </article>
      ))
    }
  </div>
</section>

<style>
  .entries {
    display: grid;
    gap: 2rem;
  }

  .experience-entry {
    border-inline-start: 2px solid var(--border);
    padding-inline-start: 1.25rem;
  }

  .period {
    margin: 0;
    font-size: 0.85rem;
    color: var(--text-muted);
    letter-spacing: 0.04em;
  }

  h3 {
    margin-block: 0.2rem 0.75rem;
    font-size: 1.1rem;
  }

  .org {
    color: #c9b8f5;
  }

  ul {
    margin: 0;
    padding-inline-start: 1.1rem;
    color: var(--text-muted);
    font-size: 0.95rem;
  }

  li {
    margin-block-end: 0.35rem;
  }
</style>
```

- [ ] **Step 4: סטאק טכנולוגי**

צור `src/components/TechStack.astro`:

```astro
---
import type { SiteContent } from '../data/content'

interface Props {
  content: SiteContent
}

const { content } = Astro.props
---

<section id="stack">
  <h2 class="section-heading">{content.tech.heading}</h2>

  <div class="grid">
    {
      content.tech.groups.map((group) => (
        <div class="tech-group">
          <h3>{group.label}</h3>
          <ul class="tags">
            {group.items.map((item) => (
              <li class="tag">{item}</li>
            ))}
          </ul>
        </div>
      ))
    }
  </div>
</section>

<style>
  .grid {
    display: grid;
    gap: 1.5rem;
    grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  }

  h3 {
    margin-block: 0 0.6rem;
    font-size: 0.85rem;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: var(--text-muted);
  }

  .tags {
    list-style: none;
    padding: 0;
    margin: 0;
  }
</style>
```

- [ ] **Step 5: השכלה**

צור `src/components/Education.astro`:

```astro
---
import type { SiteContent } from '../data/content'

interface Props {
  content: SiteContent
}

const { content } = Astro.props
---

<section id="education">
  <h2 class="section-heading">{content.education.heading}</h2>

  <p class="period">{content.education.period}</p>
  <h3>{content.education.institution}</h3>
  <p class="detail">{content.education.detail}</p>
</section>

<style>
  .period {
    margin: 0;
    font-size: 0.85rem;
    color: var(--text-muted);
    letter-spacing: 0.04em;
  }

  h3 {
    margin-block: 0.2rem 0.5rem;
    font-size: 1.1rem;
  }

  .detail {
    margin: 0;
    color: var(--text-muted);
    font-size: 0.95rem;
  }
</style>
```

- [ ] **Step 6: חיבור לנתיבים**

החלף את `src/pages/index.astro` בשלמותו:

```astro
---
import Layout from '../layouts/Layout.astro'
import Hero from '../components/Hero.astro'
import Capabilities from '../components/Capabilities.astro'
import Projects from '../components/Projects.astro'
import Experience from '../components/Experience.astro'
import TechStack from '../components/TechStack.astro'
import Education from '../components/Education.astro'
import { he } from '../data/content'
---

<Layout content={he}>
  <Hero content={he} />
  <Capabilities content={he} />
  <Projects content={he} />
  <Experience content={he} />
  <TechStack content={he} />
  <Education content={he} />
</Layout>
```

החלף את `src/pages/en.astro` בשלמותו, זהה פרט ל‑`en`:

```astro
---
import Layout from '../layouts/Layout.astro'
import Hero from '../components/Hero.astro'
import Capabilities from '../components/Capabilities.astro'
import Projects from '../components/Projects.astro'
import Experience from '../components/Experience.astro'
import TechStack from '../components/TechStack.astro'
import Education from '../components/Education.astro'
import { en } from '../data/content'
---

<Layout content={en}>
  <Hero content={en} />
  <Capabilities content={en} />
  <Projects content={en} />
  <Experience content={en} />
  <TechStack content={en} />
  <Education content={en} />
</Layout>
```

- [ ] **Step 7: הרצת הבדיקות**

```bash
npm test
```

Expected: PASS.

- [ ] **Step 8: קומיט**

```bash
git add src tests
git commit -m "Add experience, tech stack and education

A test asserts the Easy Tax entry names C#, ASP.NET Core 8, EF Core,
SQL Server and Clean Architecture explicitly. That entry is the page's
strongest classical-backend evidence, so its detail is load-bearing and
should fail the build if it is ever trimmed."
```

---

## Task 7: יצירת קשר וקבצי קו"ח

**Files:**
- Create: `src/components/Contact.astro`, `public/cv/leah-dickman-he.pdf`, `public/cv/leah-dickman-en.pdf`
- Modify: `src/pages/index.astro`, `src/pages/en.astro`, `tests/build.test.ts`

**Interfaces:**
- Consumes: `ContactLink` מ‑Task 1
- Produces: `Contact.astro` המקבל `content: SiteContent`

- [ ] **Step 1: העתקת קובצי הקו"ח**

```bash
mkdir -p public/cv
cp "/c/Users/User/Desktop/קוח מעודכן פיתוח/לאה דיקמן.pdf" public/cv/leah-dickman-he.pdf
cp "/c/Users/User/Desktop/קוח מעודכן פיתוח/Leah Dickman .pdf" public/cv/leah-dickman-en.pdf
ls -la public/cv/
```

Expected: שני קבצים, כ‑155KB ו‑164KB. השמות באנגלית וללא רווחים כדי שכתובות ההורדה לא ידרשו קידוד תווים.

- [ ] **Step 2: הוספת הבדיקה הנכשלת**

הוסף ל‑`tests/build.test.ts`:

```ts
import { existsSync } from 'node:fs'

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
})
```

- [ ] **Step 3: הרצה לוודא כישלון**

```bash
npm test
```

Expected: FAIL — `expected null not to be null` על `#contact`.

- [ ] **Step 4: הקומפוננטה**

צור `src/components/Contact.astro`:

```astro
---
import type { SiteContent } from '../data/content'

interface Props {
  content: SiteContent
}

const { content } = Astro.props

const isExternal = (href: string) => href.startsWith('http')
---

<section id="contact">
  <h2 class="section-heading">{content.contact.heading}</h2>

  <ul class="links">
    {
      content.contact.links.map((link) => (
        <li>
          <a
            class="card"
            href={link.href}
            target={isExternal(link.href) ? '_blank' : undefined}
            rel={isExternal(link.href) ? 'noopener noreferrer' : undefined}
          >
            {link.label}
          </a>
        </li>
      ))
    }
  </ul>

  <a class="cv" href={content.contact.cvHref} download>
    {content.contact.cvLabel}
  </a>
</section>

<style>
  .links {
    list-style: none;
    padding: 0;
    margin: 0 0 2rem;
    display: grid;
    gap: 0.75rem;
    grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  }

  .links a {
    display: block;
    text-align: center;
    text-decoration: none;
    padding: 1rem;
    font-weight: 500;
    word-break: break-word;
  }

  .cv {
    display: inline-block;
    text-decoration: none;
    background: var(--iridescent);
    color: #0b0b12;
    font-weight: 600;
    border-radius: 999px;
    padding: 0.7rem 1.8rem;
  }
</style>
```

- [ ] **Step 5: חיבור לנתיבים**

החלף את `src/pages/index.astro` בשלמותו — זו הצורה הסופית שלו:

```astro
---
import Layout from '../layouts/Layout.astro'
import Hero from '../components/Hero.astro'
import Capabilities from '../components/Capabilities.astro'
import Projects from '../components/Projects.astro'
import Experience from '../components/Experience.astro'
import TechStack from '../components/TechStack.astro'
import Education from '../components/Education.astro'
import Contact from '../components/Contact.astro'
import { he } from '../data/content'
---

<Layout content={he}>
  <Hero content={he} />
  <Capabilities content={he} />
  <Projects content={he} />
  <Experience content={he} />
  <TechStack content={he} />
  <Education content={he} />
  <Contact content={he} />
</Layout>
```

החלף את `src/pages/en.astro` בשלמותו — זהה פרט ל‑`en`:

```astro
---
import Layout from '../layouts/Layout.astro'
import Hero from '../components/Hero.astro'
import Capabilities from '../components/Capabilities.astro'
import Projects from '../components/Projects.astro'
import Experience from '../components/Experience.astro'
import TechStack from '../components/TechStack.astro'
import Education from '../components/Education.astro'
import Contact from '../components/Contact.astro'
import { en } from '../data/content'
---

<Layout content={en}>
  <Hero content={en} />
  <Capabilities content={en} />
  <Projects content={en} />
  <Experience content={en} />
  <TechStack content={en} />
  <Education content={en} />
  <Contact content={en} />
</Layout>
```

- [ ] **Step 6: הרצת הבדיקות**

```bash
npm test
```

Expected: PASS.

- [ ] **Step 7: קומיט**

```bash
git add public src tests
git commit -m "Add contact section and ship both CV files

Four direct channels, no form: nothing to maintain and nothing that can
swallow an enquiry by failing quietly.

The CV filenames are ASCII so the download URLs need no percent-encoding.
A test asserts no anchor anywhere points at linkedin, since the
professional network here is Duallin and that is easy to 'correct' by
mistake later."
```

---

## Task 8: SEO ונתונים מובנים

**Files:**
- Create: `src/components/PersonSchema.astro`, `public/robots.txt`
- Modify: `src/layouts/Layout.astro`, `astro.config.mjs`, `package.json`, `tests/build.test.ts`

**Interfaces:**
- Consumes: `SiteContent` מ‑Task 1, `Layout.astro` מ‑Task 2
- Produces: `PersonSchema.astro` המקבל `content: SiteContent`

- [ ] **Step 1: התקנת מפת האתר**

```bash
npm install @astrojs/sitemap
```

- [ ] **Step 2: הוספת הבדיקה הנכשלת**

הוסף ל‑`tests/build.test.ts`:

```ts
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
  })
})
```

- [ ] **Step 3: הרצה לוודא כישלון**

```bash
npm test
```

Expected: FAIL — `expected null not to be null` על `script[type="application/ld+json"]`.

- [ ] **Step 4: הנתונים המובנים**

צור `src/components/PersonSchema.astro`:

```astro
---
import type { SiteContent } from '../data/content'

interface Props {
  content: SiteContent
}

const { content } = Astro.props

const schema = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: content.hero.name,
  jobTitle: content.hero.title,
  description: content.meta.description,
  url: 'https://leahdick-dev.com',
  email: 'ld3250803@gmail.com',
  knowsLanguage: ['he', 'en'],
  sameAs: content.contact.links
    .filter((link) => link.href.startsWith('http') && !link.href.includes('wa.me'))
    .map((link) => link.href),
}
---

<script type="application/ld+json" set:html={JSON.stringify(schema)} />
```

הסינון גוזר את `sameAs` מרשימת הקשר עצמה, כך שהוספת פרופיל חדש בעתיד מעדכנת גם את הנתונים המובנים בלי צעד נפרד שאפשר לשכוח.

- [ ] **Step 5: חיבור למעטפת**

ב‑`src/layouts/Layout.astro`, הוסף לחזית:

```astro
import PersonSchema from '../components/PersonSchema.astro'
```

ומעל `</head>`:

```astro
<PersonSchema content={content} />
```

- [ ] **Step 6: מפת אתר ו‑robots**

עדכן `astro.config.mjs`:

```js
import { defineConfig } from 'astro/config'
import sitemap from '@astrojs/sitemap'

export default defineConfig({
  site: 'https://leahdick-dev.com',
  build: { format: 'directory' },
  integrations: [sitemap()],
})
```

צור `public/robots.txt`:

```
User-agent: *
Allow: /

Sitemap: https://leahdick-dev.com/sitemap-index.xml
```

- [ ] **Step 7: הרצת הבדיקות**

```bash
npm test
```

Expected: PASS.

- [ ] **Step 8: קומיט**

```bash
git add package.json package-lock.json astro.config.mjs public src tests
git commit -m "Add Person structured data, sitemap and robots

sameAs is derived from the contact links rather than duplicated, so a
future profile is added in one place. WhatsApp is filtered out since a
wa.me link is a contact method, not a profile identity."
```

---

## Task 9: תמונת שיתוף, כיווץ נכסים ובדיקת נגישות

**Files:**
- Create: `public/og.png`, `scripts/optimize-assets.mjs`
- Modify: `public/logo-ld.png`, `public/favicon.png`, `package.json`, `tests/build.test.ts`

**Interfaces:**
- Consumes: `public/logo-ld.png` מ‑Task 3
- Produces: נכסים מכווצים, `public/og.png` בגודל 1200×630

- [ ] **Step 1: התקנת sharp**

```bash
npm install -D sharp
```

- [ ] **Step 2: הוספת הבדיקה הנכשלת**

הוסף ל‑`tests/build.test.ts`:

```ts
import { statSync } from 'node:fs'

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
```

- [ ] **Step 3: הרצה לוודא כישלון**

```bash
npm test
```

Expected: FAIL — `dist/og.png` לא קיים, ו‑`logo-ld.png` שוקל כ‑1.7MB.

- [ ] **Step 4: סקריפט הכיווץ**

צור `scripts/optimize-assets.mjs`:

```js
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
  .png({ compressionLevel: 9 })
  .toBuffer()
writeFileSync('public/og.png', og)

console.log('logo', logo.length, 'favicon', favicon.length, 'og', og.length)
```

- [ ] **Step 5: הרצת הסקריפט**

```bash
node scripts/optimize-assets.mjs
ls -la public/
```

Expected: שלושה קבצים, כל אחד מתחת ל‑200KB.

הסקריפט דורסת את `public/logo-ld.png` במקום. זו פעולה חד‑פעמית שנשמרת ב‑git, ולא שלב build חוזר — הרצה שנייה תכווץ תמונה כבר מכווצת ותאבד איכות. לכן הוא אינו מחובר ל‑`npm run build`.

- [ ] **Step 6: הרצת הבדיקות**

```bash
npm test
```

Expected: PASS.

- [ ] **Step 7: קומיט**

```bash
git add package.json package-lock.json public scripts tests
git commit -m "Optimise assets, generate the Open Graph image, assert a11y

The 1254px logo shipped at 1.7MB for a 96px slot. It is now 288px for
3x displays, with a 180px favicon and a 1200x630 OG card composited on
the base colour.

optimize-assets.mjs overwrites in place and is deliberately not wired
into the build: running it twice would recompress already-compressed
output. Accessibility tests cover alt text, heading order and accessible
link names."
```

---

## Task 10: פריסה ל‑Cloudflare Pages וחיבור הדומיין

**Files:**
- Create: `README.md`
- Modify: `.gitignore`

**Interfaces:**
- Consumes: הכל מהמשימות הקודמות
- Produces: אתר חי ב‑https://leahdick-dev.com

**דורש גישה אינטראקטיבית** לחשבון Cloudflare ולחשבון GitHub. הצעדים הראשונים אוטומטיים, האחרונים ידניים.

- [ ] **Step 1: ודא ש‑dist אינו נשמר בגיט**

```bash
grep -q "^dist" .gitignore && echo "already ignored" || echo "dist/" >> .gitignore
cat .gitignore
```

Expected: `dist/` מופיע ברשימה.

- [ ] **Step 2: אימות סופי מקומי**

```bash
npm test
npx astro preview
```

בדוק ידנית ב‑`http://localhost:4321/` וב‑`http://localhost:4321/en`:
- הדף העברי מיושר לימין, האנגלי לשמאל
- מתג השפה עובר בין הצדדים
- כל שבע הסקציות מופיעות בשני הנתיבים
- הכפתורים `#projects` ו‑`#contact` גוללים ליעד
- קובצי הקו"ח יורדים ונפתחים

עצור עם `Ctrl+C`.

- [ ] **Step 3: בדיקת רוחב מסך**

בדפדפן, פתח כלי מפתחים ובדוק בשלושה רוחבים: 375px, 768px, 1440px. ודא שאין גלילה אופקית ושהכרטיס המודגש מופיע ראשון במובייל.

- [ ] **Step 4: README**

צור `README.md`:

```markdown
# leahdick-dev.com

Personal landing page. Astro, static, bilingual.

## Development

    npm install
    npm run dev        # http://localhost:4321
    npm test           # builds, then runs the full suite
    npm run build

## Content

All display text lives in `src/data/content.he.ts` and `src/data/content.en.ts`,
both typed against `SiteContent` in `src/data/types.ts`. Components hold no
strings — to change copy, edit the content files only.

The test suite enforces that both languages expose identical key paths, so a
field added to one and forgotten in the other fails the build.

## Assets

`scripts/optimize-assets.mjs` regenerates the logo, favicon and Open Graph
image from `public/logo-ld.png`. It overwrites in place, so run it only when
replacing the source logo — never as part of a build.

## Deployment

Pushes to `main` deploy automatically to Cloudflare Pages.
Build command `npm run build`, output directory `dist`.
```

- [ ] **Step 5: קומיט ודחיפה**

```bash
git add .gitignore README.md
git commit -m "Add README and ignore build output

Documents the content-editing path and the one-shot nature of the asset
script, which is the part of this repo most likely to be misused later."
git push -u origin main
```

- [ ] **Step 6: יצירת פרויקט Cloudflare Pages** — ידני

1. היכנס ל‑Cloudflare Dashboard → **Workers & Pages** → **Create** → **Pages** → **Connect to Git**
2. אשר גישה ל‑GitHub ובחר את הריפו `LallyDik/Landing-page`
3. הגדרות ה‑build:
   - Framework preset: **Astro**
   - Build command: `npm run build`
   - Build output directory: `dist`
   - Production branch: `main`
4. **Save and Deploy**

המתן לסיום ה‑build ואמת שהדיפלוי הצליח בכתובת `*.pages.dev` שהוקצתה.

- [ ] **Step 7: חיבור הדומיין** — ידני

1. בפרויקט ה‑Pages → **Custom domains** → **Set up a domain**
2. הזן `leahdick-dev.com` ואשר
3. חזור על התהליך עבור `www.leahdick-dev.com`

מכיוון שהדומיין כבר מנוהל באותו חשבון Cloudflare, רשומות ה‑DNS נוצרות אוטומטית ותעודת ה‑SSL מונפקת בלי התערבות. אין צורך ליצור רשומות A או CNAME ידנית.

- [ ] **Step 8: אימות באתר החי**

```bash
curl -sI https://leahdick-dev.com | head -5
curl -sI https://leahdick-dev.com/en | head -5
curl -s https://leahdick-dev.com | grep -o 'dir="rtl"'
curl -s https://leahdick-dev.com/en | grep -o 'dir="ltr"'
curl -sI https://leahdick-dev.com/cv/leah-dickman-he.pdf | head -3
```

Expected: `HTTP/2 200` בכל הבדיקות, `dir="rtl"` בעברי ו‑`dir="ltr"` באנגלי.

- [ ] **Step 9: Lighthouse**

הרץ Lighthouse בכלי המפתחים של Chrome על `https://leahdick-dev.com`, במצב מובייל.

Expected: 95+ בכל ארבע הקטגוריות. אם Performance נמוך מ‑95, הסיבה הסבירה היא גודל נכסים — הרץ מחדש את Task 9 Step 5.

---

## סיכום כיסוי המפרט

| סעיף במפרט | המשימה שמיישמת |
|---|---|
| 2 — שני נתיבים, hreflang | Task 2 |
| 3.1 — Hero ומשפט המיצוב | Task 3 |
| 3.2 — יכולות, כרטיס מודגש | Task 4 |
| 3.3 — חמישה פרויקטים עם שורת תפקיד | Task 5 |
| 3.4 — ניסיון, פירוט Easy Tax | Task 6 |
| 3.5 — סטאק מקובץ, קוד ראשון | Task 6 |
| 3.6 — השכלה | Task 6 |
| 3.7 — קשר, Duallin, קו"ח | Task 7 |
| 4 — שפה חזותית, טוקנים, תנועה | Task 2, Task 3 |
| 5.1 — הפרדת תוכן ממבנה | Task 1 |
| 5.2 — מבנה קבצים | Tasks 1–7 |
| 5.3 — Cloudflare Pages ודומיין | Task 10 |
| 5.4 — SEO ונגישות | Task 8, Task 9 |
| 6 — אימות לפני סיום | Task 10 |
