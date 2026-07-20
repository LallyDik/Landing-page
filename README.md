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
field added to one and forgotten in the other fails the build rather than
silently shipping a half-translated page.

Hebrew is the default route (`/`, RTL); English is `/en` (LTR). One stylesheet
serves both, so directional CSS uses logical properties (`inset-inline-end`,
`padding-inline-start`) rather than `left`/`right`. Symmetric centering is the
one exception — it has no directional meaning.

## Tests

`npm test` runs `astro build` first, then asserts against the real HTML in
`dist/` rather than against isolated components. What the suite checks is what
actually ships.

Some assertions exist to stop a specific regression rather than to prove the
markup renders:

- the featured capability card must come first in DOM order, so its emphasis
  survives on mobile and in screen readers, not just in the desktop grid
- every project card must carry a non-empty role line
- the Easy Tax entry must name C#, ASP.NET Core 8, EF Core, SQL Server and
  Clean Architecture
- no anchor anywhere may point at linkedin

That last one is not an oversight. There is no LinkedIn profile; the
professional network here is [Duallin](https://www.duallin.com/in/leah-dickman),
which is easy to "correct" into a LinkedIn link by mistake.

## Assets

`scripts/optimize-assets.mjs` regenerates the logo, favicon and Open Graph
image from `public/logo-ld.png`.

**It overwrites its own input in place and must run at most once against the
pristine source.** A second run silently recompresses already-compressed
output. The script's header comment carries the git command to restore the
source if it genuinely needs re-running. It is deliberately not wired into
`npm run build`.

## Deployment

Pushes to `main` deploy automatically to Cloudflare Pages.

- Build command: `npm run build`
- Output directory: `dist`

The domain is managed in the same Cloudflare account, so it is attached through
the project's Custom Domains screen — Cloudflare writes the DNS records and
issues the certificate itself. There are no manual A or CNAME records to
maintain, and no proxy-versus-DNS-only decision to get wrong.
