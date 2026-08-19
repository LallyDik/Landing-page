import type { SiteContent } from './types'

export const en: SiteContent = {
  lang: 'en',
  dir: 'ltr',
  opensInNewTab: 'opens in a new tab',
  meta: {
    title: 'Leah Dickman — Full Stack Developer & AI Solutions Engineer',
    description:
      'Full Stack Developer and AI Solutions Engineer. Backend services, SaaS systems, and AI integrations — in code and in automation.',
  },
  hero: {
    name: 'Leah Dickman',
    title: 'Full Stack Developer building production-ready AI products',
    stackLine: 'React · TypeScript · .NET · Node.js · AI Systems',
    ctaProjects: 'View projects',
    ctaCv: 'Download CV',
    stats: ['Full Stack + AI', 'Production Systems', 'End-to-End Development'],
  },
  capabilities: {
    heading: 'Core expertise',
    items: [
      {
        kind: 'compact',
        title: 'Full Stack Engineering',
        lead: 'Whole systems from server to interface, on Clean Architecture principles.',
        tags: ['React', 'TypeScript', '.NET', 'Node.js'],
      },
      {
        kind: 'compact',
        title: 'AI Engineering',
        lead: 'AI capabilities embedded in real products — from use case to reliable output.',
        tags: ['LLMs', 'RAG', 'AI Agents', 'Structured Outputs'],
      },
      {
        kind: 'compact',
        title: 'Automation & Integrations',
        lead: 'Connecting systems and automating workflows across tools and data sources.',
        tags: ['n8n', 'Make', 'APIs', 'Webhooks'],
      },
    ],
  },
  projects: {
    heading: 'Projects',
    repoLabel: 'Source code',
    contributionLabel: 'My contribution',
    viewLabel: 'View project',
    groups: [
      {
        label: 'Featured projects',
        items: [
          {
            name: 'Talmid Track',
            description:
              'A student management and tracking platform — attendance, casework, tasks and alerts, on a full Hebrew calendar.',
            contribution:
              'Designed and developed the product end-to-end: application architecture, the data model and multi-tenant permissions, dashboards, forms and validation, and reporting and export workflows. Its technical core is an OCR engine that reads handwritten Hebrew attendance sheets — client-side rasterising and column slicing, vision-based detection with structured output, and a majority vote that flags uncertain records for human review.',
            tech: ['React 19', 'TypeScript', 'TanStack', 'Supabase', 'Tailwind', 'OCR'],
            url: 'https://talmid-track.lovable.app/',
            repoUrl: 'https://github.com/LallyDik/talmid-track',
            image: '/projects/talmid-track.webp',
            imageIsDiagram: true,
            scale: 'lead',
          },
          {
            name: 'Rental Management System',
            description:
              'Tenants, units and payments — rent, electricity, water and gas from meter readings, across the Hebrew and Gregorian calendars.',
            contribution:
              'An independent product I built from scratch in code — the data model, meter-based billing calculations, user management and the entire interface.',
            tech: ['React', 'TypeScript', 'Supabase'],
            url: 'https://nihulschirut.com',
            repoUrl: 'https://github.com/LallyDik/bayit-yisraeli-menahal',
            image: '/projects/nihul.webp',
            scale: 'lead',
          },
        ],
      },
      {
        label: 'AI & production products',
        items: [
          {
            name: 'QSellerAI',
            description: 'A platform for analysing sales and customer service conversations.',
            contribution:
              'Built a full new version of the product, including the AI conversation-analysis workflows, automations, integrations and server management.',
            tech: ['Bubble', 'n8n', 'Make', 'Server management'],
            url: 'https://www.qsellerai.com/',
            image: '/projects/qsellerai.webp',
            scale: 'major',
          },
          {
            name: 'Plenty.AI',
            description:
              'AI-driven household budgeting — expenses logged over WhatsApp by voice, text or a photo of the receipt, categorised automatically.',
            contribution:
              'Feature development in code around the logging flow — processing incoming messages, the automatic categorisation and how it surfaces in the product.',
            tech: ['React', 'TypeScript', 'Supabase', 'LLMs'],
            url: 'https://plentyai.co.il',
            image: '/projects/plenty.webp',
            scale: 'major',
          },
        ],
      },
      {
        label: 'Additional work',
        items: [
          {
            name: 'CBS — What It Really Costs Me',
            description:
              'An annual payroll-cost calculator for business owners — what an employee truly costs.',
            contribution:
              'Built from scratch for a certified payroll auditor, including the cost model and the questionnaire flow.',
            tech: ['Bubble'],
            url: 'https://www.cbs.co.il/step/%d7%9b%d7%9e%d7%94-%d7%96%d7%94-%d7%a2%d7%95%d7%9c%d7%94-%d7%9c%d7%99/',
            image: '/projects/cbs.webp',
            scale: 'minor',
          },
          {
            name: 'WonderMe',
            description: 'Emotional creative work, guided by AI.',
            contribution:
              'Feature development and prompt engineering across the product’s AI flows.',
            tech: ['Bubble', 'LLMs'],
            url: 'https://wonderme.ai/',
            image: '/projects/wonderme.webp',
            scale: 'minor',
          },
        ],
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
        stack: ['React', 'Node.js', 'Supabase', 'AI'],
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
        stack: ['C#', 'ASP.NET Core', 'EF Core', 'SQL Server'],
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
      { label: 'Frontend', items: ['React', 'TypeScript', 'TanStack', 'Tailwind'] },
      { label: 'Backend', items: ['C#', 'ASP.NET Core', 'Node.js', 'REST APIs', 'EF Core'] },
      { label: 'Data', items: ['SQL Server', 'PostgreSQL', 'Supabase', 'MongoDB'] },
      { label: 'AI', items: ['LLMs', 'RAG', 'AI Agents', 'Structured Outputs'] },
      { label: 'Automation', items: ['n8n', 'Make', 'Webhooks', 'Git', 'Docker'] },
    ],
  },
  education: {
    heading: 'Certification',
    period: 'MAHAT · 2025',
    institution: 'Certified Practical Engineer · Software Engineering · with Distinction',
    detail:
      'Practical Engineer diploma from MAHAT — Israel’s Government Institute for Technological Training, Beit Yaakov College, software engineering track.',
  },
  contact: {
    heading: 'Get in touch',
    prompt: 'Looking for a Full Stack developer who ships AI to production?',
    ctaLabel: 'Email me',
    links: [
      { kind: 'email', label: 'ld3250803@gmail.com', href: 'mailto:ld3250803@gmail.com' },
      { kind: 'phone', label: '+972 58-325-0803', href: 'tel:+972583250803' },
      { kind: 'github', label: 'GitHub', href: 'https://github.com/LallyDik' },
      { kind: 'duallin', label: 'Duallin', href: 'https://www.duallin.com/in/leah-dickman' },
    ],
    cvLabel: 'Download CV',
    cvHref: '/cv/leah-dickman-en.pdf',
  },
  langToggle: { label: 'עברית', href: '/' },
}
