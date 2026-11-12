# Thomas T. Kivevele — academic website

React + TypeScript + Vite, with prerendered section and project pages, local images, publication search/filter and BibTeX export, project deep links, and a contact form with email delivery.

## Requirements and commands

Use Node.js 22.12+ (Node 24 recommended).

```sh
npm ci
npm run dev
npm run typecheck
npm run lint
npm run build
npm run preview
```

`dist/` is the deployable site. It includes the section pages, one static HTML page for each project, `404.html`, a public academic profile, local images, robots.txt, and host configuration files. The ZIP includes a prebuilt dist; rebuild after editing source or setting the real domain.

## Contact message delivery

The Vercel `/api/contact` function submits form messages through Resend. Add `RESEND_API_KEY`, `CONTACT_FROM_EMAIL` (a sender address verified with Resend), and optionally `CONTACT_TO_EMAIL` in Vercel's environment settings. The recipient defaults to the NM-AIST contact address. A successful response confirms Resend accepted the message for delivery; it is not an inbox delivery receipt. Without those settings, or on a static host without a matching API function, the form offers a copyable email draft. Netlify and Render deployments need a separately configured function or external contact endpoint to enable web-form delivery.

## Production domain — configure before release

The real domain was not supplied. Do not publish invented canonical URLs. Set `SITE_URL` to the actual HTTPS origin on your hosting service and rebuild:

```sh
SITE_URL=https://your-real-domain.org npm run build
```

This creates a sitemap, absolute social image URLs and canonical URLs for all section and project routes. Without SITE_URL, the build deliberately omits the sitemap and canonical URLs and logs a warning. Preview pages still work. `VITE_SITE_URL` is accepted as an alternative. Do not set either variable to an example domain in production.

## Deploy

### Vercel

Import the repository and deploy with the included `vercel.json`. Build: `npm run build`; output: `dist`. Set SITE_URL first. There is intentionally no catch-all SPA rewrite: known pages are real static HTML files, and unknown routes should return HTTP 404. Security and immutable hashed-asset caching headers are included.

### Netlify

Build: `npm run build`; publish: `dist`. Set SITE_URL. Included `_headers` and `_redirects` configure headers and the 404 fallback; existing static route directories are served normally. The Vercel API function is not deployed by this static-site setup, so the contact form uses its email-draft fallback until a Netlify function or external endpoint is configured.

### Render static site

Build: `npm ci && npm run build`; publish: `dist`. Set SITE_URL. Do not use a blanket `/* -> /index.html` rewrite. Use the platform's static directory index handling for existing route directories, and configure a 404 fallback to `/404.html` with HTTP 404 if required. `_headers` and `_redirects` are host-specific and may not be interpreted by Render: apply the equivalent security/cache headers in its settings. The contact form uses its email-draft fallback unless a separate backend endpoint is configured. Verify direct deep links and unknown-route status after deployment.

### Any static host

Serve route directories with index.html. Unknown routes must serve 404.html **with status 404**, not rewrite to the homepage with status 200. Serve over HTTPS. Enable compression, short/revalidation caching for HTML, and long immutable caching only for content-hashed assets. Apply the security headers shown in public/_headers. Vite's preview server is only for local preview and is not a production server.

## Tests

```sh
npx playwright install chromium
npm test
```

If using an existing Chromium executable:

```sh
CHROMIUM_PATH=/path/to/chromium npm test
```

`npm run validate` runs typecheck, ESLint, production build, and the Playwright suite. Tests cover desktop/mobile layouts, fonts, the innovation grid, recent publications, hero/partner strip, filters and form validation. Update these checks when page behavior changes. `scripts/serve.mjs` is a local test server, not production infrastructure.

Automated accessibility checks are not a full accessibility certification. Manually test keyboard, screen readers, mobile Safari/Firefox and production performance before launch.

## Editing content

- `src/data/site.ts`: public profile, education, employment, awards, projects, patents.
- `src/data/publications.json`: structured publication records, with original citation preserved.
- `src/data/metadata.ts`: per-route SEO text.
- `src/data/images.ts`: local image mappings; `public/image-credits.txt`: sources/licensing notes.
- `scripts/prerender.mjs`: static HTML, public academic profile, robots/sitemap generation.

For new publications, provide a stable unique id, type, year, title, authors, venue, original text, and DOI if known. Avoid duplicate DOIs; a missing DOI is not a reason to invent one. Review rendered title/venue fields. The BibTeX exporter separates common author delimiters, but source author strings are inconsistent; inspect author names and citation fields before using the export in a manuscript.

Profile and project information is maintained manually and is not updated automatically. Review active project dates, appointments, external links, funding attributions and publication records regularly. See CHANGELOG.md for content and source notes.

## Contact and privacy

On Vercel, the contact API submits messages to the configured recipient through Resend. It validates fields, checks same-origin requests, and uses a hidden spam-trap field. Before launch, add and apply a Vercel Firewall rate-limit rule for `/api/contact` (for example, 5 requests per IP per minute); see the [Vercel rate-limiting guide](https://vercel.com/docs/vercel-firewall/vercel-waf/rate-limiting-sdk). A successful response means Resend accepted a message for delivery, not that it reached an inbox. Visitors should not enter sensitive personal information. Never put API keys in frontend variables or source code. Other hosts need their own backend endpoint; until then, visitors can copy the email draft or use the direct email link.

Images and original fonts are hosted locally. No advertising, analytics or tracking scripts are included. Hosting providers can keep normal access logs. Confirm the site owner's authorization to publish the portrait and contact information. The public academic profile deliberately excludes passport details, date of birth, family information, student identifiers and referees' contacts. Private source documents are not included in this package.

## Original design and photography

The supplied original theme, layout and fonts are preserved. Fraunces and Plus Jakarta Sans are self-hosted in `public/fonts/`; no fallback font substitution is intended. Image replacements use existing slots only. See RESTORATION-NOTES.md for the restoration scope and public/image-credits.txt for provenance.
