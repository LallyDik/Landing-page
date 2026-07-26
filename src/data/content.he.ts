import type { SiteContent } from './types'

export const he: SiteContent = {
  lang: 'he',
  dir: 'rtl',
  opensInNewTab: 'נפתח בלשונית חדשה',
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
        areas: [
          {
            area: 'קוד נקי וארכיטקטורה',
            detail:
              'כתיבת קוד קריא ומתוחזק לפי עקרונות Clean Architecture — הפרדת שכבות, אחריות ברורה ומבנה שנשאר קל להרחבה ולתחזוקה.',
          },
          {
            area: 'פיתוח Full Stack מקצה לקצה',
            detail:
              'בניית מערכות שלמות מהשרת ועד הממשק — C# ו‑ASP.NET Core, Node.js, React ו‑TypeScript, המחוברים ב‑REST APIs.',
          },
          {
            area: 'שילוב יכולות AI במערכות',
            detail:
              'הטמעת LLMs, סוכנים ו‑RAG כחלק אמין ומובנה מהמוצר — יכולת שמשולבת בתוך הזרימה, לא הדבקה חיצונית.',
          },
          {
            area: 'מסדי נתונים ואמינות',
            detail:
              'תכנון סכימות ב‑SQL Server, PostgreSQL/Supabase ו‑MongoDB עם EF Core, ובנייה לביצועים ולאמינות בסביבת Production.',
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
        lead: 'הטמעת יכולות AI במוצרים אמיתיים — מהגדרת התרחיש ועד פלט אמין.',
        tags: ['LLMs', 'RAG', 'AI Agents', 'Prompt Engineering', 'Structured Outputs'],
      },
      {
        kind: 'compact',
        title: 'אוטומציה ואינטגרציות',
        lead: 'חיבור מערכות ותהליכים אוטומטיים בין כלים ומקורות מידע.',
        tags: ['n8n', 'Make', 'Bubble', 'Webhooks', 'אינטגרציות API'],
      },
    ],
  },
  projects: {
    heading: 'פרויקטים',
    repoLabel: 'קוד המקור',
    items: [
      {
        name: 'מערכת ניהול שכירות',
        description:
          'ניהול שוכרים, יחידות ותשלומים — שכר דירה, חשמל, מים וגז לפי קריאת מונה, על לוח עברי ולועזי.',
        role: 'מוצר עצמאי · פיתוח מלא בקוד',
        tech: ['React', 'TypeScript', 'Supabase'],
        url: 'https://nihulschirut.com',
        repoUrl: 'https://github.com/LallyDik/bayit-yisraeli-menahal',
        image: '/projects/nihul.webp',
      },
      {
        name: 'QSellerAI',
        description: 'פלטפורמה לניתוח שיחות מכירה ושירות.',
        role: 'AI Engineer · גרסה חדשה מלאה, שרתים ואוטומציות',
        tech: ['Bubble', 'n8n', 'Make', 'ניהול שרתים'],
        url: 'https://www.qsellerai.com/',
        image: '/projects/qsellerai.webp',
      },
      {
        name: 'CBS — כמה זה עולה לי',
        description:
          'מחשבון עלות שכר שנתית לבעלי עסקים — כמה באמת עולה עובד — שבניתי עבור מבקר שכר מוסמך.',
        role: 'פיתוח מלא מאפס · מטעם חברה',
        tech: ['Bubble'],
        url: 'https://www.cbs.co.il/step/%d7%9b%d7%9e%d7%94-%d7%96%d7%94-%d7%a2%d7%95%d7%9c%d7%94-%d7%9c%d7%99/',
        image: '/projects/cbs.webp',
      },
      {
        name: 'WonderMe',
        description: 'יצירה רגשית בליווי AI.',
        role: 'פיתוח פיצ׳רים · Prompt Engineering',
        tech: ['Bubble', 'LLMs'],
        url: 'https://wonderme.ai/',
        image: '/projects/wonderme.webp',
      },
      {
        name: 'Plenty.AI',
        description:
          'ניהול תקציב משפחתי מבוסס AI — דיווח הוצאות בוואטסאפ בהקלטה, טקסט או צילום קבלה, עם קטגוריזציה אוטומטית.',
        role: 'פיתוח פיצ׳רים בקוד',
        tech: ['React', 'TypeScript', 'Supabase'],
        url: 'https://plentyai.co.il',
        image: '/projects/plenty.webp',
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
    heading: 'הסמכה',
    period: 'מה"ט · 2025',
    institution: 'הנדסאית מוסמכת · הנדסת תוכנה · בהצטיינות',
    detail:
      'דיפלומת הנדסאי מטעם מה"ט — המכון הממשלתי להכשרה טכנולוגית, מכון בית יעקב, במגמת הנדסת תוכנה.',
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
