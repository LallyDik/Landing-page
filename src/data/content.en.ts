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
        areas: [
          {
            area: 'Clean code & architecture',
            detail:
              'Readable, maintainable code on Clean Architecture principles — layered separation, clear responsibilities and a structure that stays easy to extend.',
          },
          {
            area: 'End-to-end full stack',
            detail:
              'Whole systems from server to interface — C# and ASP.NET Core, Node.js, React and TypeScript, tied together with REST APIs.',
          },
          {
            area: 'AI woven into systems',
            detail:
              'LLMs, agents and RAG embedded as a reliable, structured part of the product — integrated into the flow, not bolted on.',
          },
          {
            area: 'Data & reliability',
            detail:
              'Schema design across SQL Server, PostgreSQL/Supabase and MongoDB with EF Core, built for performance and production reliability.',
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
        lead: 'AI capabilities embedded in real products — from use case to reliable output.',
        tags: ['LLMs', 'RAG', 'AI Agents', 'Prompt Engineering', 'Structured Outputs'],
      },
      {
        kind: 'compact',
        title: 'Automation & integrations',
        lead: 'Connecting systems and automating workflows across tools and data sources.',
        tags: ['n8n', 'Make', 'Bubble', 'Webhooks', 'API integrations'],
      },
    ],
  },
  projects: {
    heading: 'Projects',
    repoLabel: 'Source code',
    items: [
      {
        name: 'Rental Management System',
        description:
          'Tenants, units and payments — rent, electricity, water and gas from meter readings, across the Hebrew and Gregorian calendars.',
        role: 'Independent product · built end to end in code',
        tech: ['React', 'TypeScript', 'Supabase'],
        url: 'https://nihul-schhirut.lovable.app/',
        repoUrl: 'https://github.com/LallyDik/bayit-yisraeli-menahal',
        image: '/projects/nihul.webp',
      },
      {
        name: 'QSellerAI',
        description: 'A platform for analysing sales and customer service conversations.',
        role: 'AI Engineer · full new version, servers and automations',
        tech: ['Bubble', 'n8n', 'Make', 'Server management'],
        url: 'https://www.qsellerai.com/',
        image: '/projects/qsellerai.webp',
      },
      {
        name: 'CBS — What It Really Costs Me',
        description:
          'A landing page and annual cost calculator for business owners, built for a certified payroll auditor.',
        role: 'Built from scratch · on behalf of a company',
        tech: ['Bubble'],
        url: 'https://www.cbs.co.il/step/%d7%9b%d7%9e%d7%94-%d7%96%d7%94-%d7%a2%d7%95%d7%9c%d7%94-%d7%9c%d7%99/',
        image: '/projects/cbs.webp',
      },
      {
        name: 'WonderMe',
        description: 'Emotional creative work, guided by AI.',
        role: 'Feature development · Prompt Engineering',
        tech: ['Bubble', 'LLMs'],
        url: 'https://wonderme.ai/',
        image: '/projects/wonderme.webp',
      },
      {
        name: 'Plenty.AI',
        description:
          'AI-driven household budgeting — expenses logged over WhatsApp by voice, text or a photo of the receipt, categorised automatically.',
        role: 'Feature development in code',
        tech: ['React', 'TypeScript', 'Supabase'],
        url: 'https://plentyai.co.il',
        image: '/projects/plenty.webp',
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
    heading: 'Certification',
    period: 'MAHAT · 2025',
    institution: 'Certified Practical Engineer · Software Engineering · with Distinction',
    detail:
      'Practical Engineer diploma from MAHAT — Israel’s Government Institute for Technological Training, Beit Yaakov College, software engineering track.',
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
