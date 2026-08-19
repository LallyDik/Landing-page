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
    title: 'בונה מוצרי AI ומערכות Full Stack שרצות ב‑Production',
    stackLine: 'React · TypeScript · .NET · Node.js · מערכות AI',
    ctaProjects: 'לפרויקטים',
    ctaCv: 'הורדת קורות חיים',
    stats: ['Full Stack + AI', 'מערכות Production', 'פיתוח מקצה לקצה'],
  },
  capabilities: {
    heading: 'תחומי ליבה',
    items: [
      {
        kind: 'compact',
        title: 'הנדסת Full Stack',
        lead: 'מערכות שלמות מהשרת ועד הממשק, לפי עקרונות Clean Architecture.',
        // "ASP.NET Core" rather than a bare ".NET": a leading dot reorders to
        // the wrong end under RTL and renders as "NET.".
        tags: ['React', 'TypeScript', 'ASP.NET Core', 'Node.js'],
      },
      {
        kind: 'compact',
        title: 'הנדסת AI',
        lead: 'הטמעת יכולות AI במוצרים אמיתיים — מהגדרת התרחיש ועד פלט אמין.',
        tags: ['LLMs', 'RAG', 'AI Agents', 'Structured Outputs'],
      },
      {
        kind: 'compact',
        title: 'אוטומציה ואינטגרציות',
        lead: 'חיבור מערכות ותהליכים אוטומטיים בין כלים ומקורות מידע.',
        tags: ['n8n', 'Make', 'APIs', 'Webhooks'],
      },
    ],
  },
  projects: {
    heading: 'פרויקטים',
    repoLabel: 'קוד המקור',
    contributionLabel: 'מה בניתי',
    viewLabel: 'לצפייה בפרויקט',
    groups: [
      {
        label: 'פרויקטים מרכזיים',
        items: [
          {
            name: 'Talmid Track',
            description:
              'מערכת לניהול ומעקב אחר תלמידים — נוכחות, טיפולים, משימות והתראות, על לוח עברי מלא.',
            contribution:
              'תכנון ופיתוח המוצר מקצה לקצה: ארכיטקטורת האפליקציה, מודל הנתונים והרשאות רב‑דיירים, לוחות בקרה, טפסים ו‑validation, ותהליכי דיווח וייצוא. הליבה הטכנית היא מנוע OCR לזיהוי דפי נוכחות בכתב‑יד עברי — רסטריזציה וחיתוך של הסריקה בצד‑הלקוח, זיהוי מבוסס Vision עם פלט מובנה, והכרעת‑רוב שמסמנת רשומות לא‑ודאיות לאימות אנושי.',
            tech: ['React 19', 'TypeScript', 'TanStack', 'Supabase', 'Tailwind', 'OCR'],
            url: 'https://talmid-track.lovable.app/',
            repoUrl: 'https://github.com/LallyDik/talmid-track',
            image: '/projects/talmid-track.webp',
            imageIsDiagram: true,
            scale: 'lead',
          },
          {
            name: 'מערכת ניהול שכירות',
            description:
              'ניהול שוכרים, יחידות ותשלומים — שכר דירה, חשמל, מים וגז לפי קריאת מונה, על לוח עברי ולועזי.',
            contribution:
              'מוצר עצמאי שבניתי מאפס בקוד — מודל הנתונים, חישובי החיוב לפי קריאות מונה, ניהול המשתמשים והממשק כולו.',
            tech: ['React', 'TypeScript', 'Supabase'],
            url: 'https://nihulschirut.com',
            repoUrl: 'https://github.com/LallyDik/bayit-yisraeli-menahal',
            image: '/projects/nihul.webp',
            scale: 'lead',
          },
        ],
      },
      {
        label: 'מוצרי AI ו‑Production',
        items: [
          {
            name: 'QSellerAI',
            description: 'פלטפורמה לניתוח שיחות מכירה ושירות.',
            contribution:
              'בניית גרסה חדשה מלאה של המוצר, כולל תהליכי AI לניתוח השיחות, אוטומציות, אינטגרציות וניהול השרתים.',
            tech: ['Bubble', 'n8n', 'Make', 'ניהול שרתים'],
            url: 'https://www.qsellerai.com/',
            image: '/projects/qsellerai.webp',
            scale: 'major',
          },
          {
            name: 'Plenty.AI',
            description:
              'ניהול תקציב משפחתי מבוסס AI — דיווח הוצאות בוואטסאפ בהקלטה, טקסט או צילום קבלה, עם קטגוריזציה אוטומטית.',
            contribution:
              'פיתוח פיצ׳רים בקוד סביב זרימת הדיווח — עיבוד ההודעות הנכנסות, הקטגוריזציה האוטומטית והצגתה במוצר.',
            tech: ['React', 'TypeScript', 'Supabase', 'LLMs'],
            url: 'https://plentyai.co.il',
            image: '/projects/plenty.webp',
            scale: 'major',
          },
        ],
      },
      {
        label: 'פרויקטים נוספים',
        items: [
          {
            name: 'CBS — כמה זה עולה לי',
            description:
              'מחשבון עלות שכר שנתית לבעלי עסקים — כמה באמת עולה עובד.',
            contribution:
              'פיתוח מלא מאפס עבור מבקר שכר מוסמך, כולל מודל החישוב וזרימת השאלון.',
            tech: ['Bubble'],
            url: 'https://www.cbs.co.il/step/%d7%9b%d7%9e%d7%94-%d7%96%d7%94-%d7%a2%d7%95%d7%9c%d7%94-%d7%9c%d7%99/',
            image: '/projects/cbs.webp',
            scale: 'minor',
          },
          {
            name: 'WonderMe',
            description: 'יצירה רגשית בליווי AI.',
            contribution: 'פיתוח פיצ׳רים ועבודת Prompt Engineering על זרימות ה‑AI במוצר.',
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
    heading: 'ניסיון תעסוקתי',
    items: [
      {
        period: '2024 – היום',
        role: 'מפתחת Full Stack ומהנדסת פתרונות AI',
        org: 'SaaS Systems',
        stack: ['React', 'Node.js', 'Supabase', 'AI'],
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
        stack: ['C#', 'ASP.NET Core', 'EF Core', 'SQL Server'],
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
      { label: 'Frontend', items: ['React', 'TypeScript', 'TanStack', 'Tailwind'] },
      { label: 'Backend', items: ['C#', 'ASP.NET Core', 'Node.js', 'REST APIs', 'EF Core'] },
      { label: 'Data', items: ['SQL Server', 'PostgreSQL', 'Supabase', 'MongoDB'] },
      { label: 'AI', items: ['LLMs', 'RAG', 'AI Agents', 'Structured Outputs'] },
      { label: 'אוטומציה', items: ['n8n', 'Make', 'Webhooks', 'Git', 'Docker'] },
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
    prompt: 'מחפשים מפתחת Full Stack ל‑AI ולמערכות Production?',
    ctaLabel: 'דברו איתי',
    links: [
      { kind: 'email', label: 'ld3250803@gmail.com', href: 'mailto:ld3250803@gmail.com' },
      { kind: 'phone', label: '058-3250803', href: 'tel:+972583250803' },
      { kind: 'github', label: 'GitHub', href: 'https://github.com/LallyDik' },
      { kind: 'duallin', label: 'Duallin', href: 'https://www.duallin.com/in/leah-dickman' },
    ],
    cvLabel: 'הורדת קורות חיים',
    cvHref: '/cv/leah-dickman-he.pdf',
  },
  langToggle: { label: 'English', href: '/en' },
}
