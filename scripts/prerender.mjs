import fs from "node:fs";
import path from "node:path";
import {
  metadata,
  missingMetadata,
  render,
  career,
  education,
  awards,
  patents,
} from "../.prerender/prerender-entry.js";
const template = fs.readFileSync("dist/index.html", "utf8");
const siteInput = process.env.SITE_URL || process.env.VITE_SITE_URL;
let origin = "";
if (siteInput) {
  const url = new URL(siteInput);
  if (
    url.protocol !== "https:" ||
    url.pathname !== "/" ||
    url.search ||
    url.hash
  )
    throw Error(
      "SITE_URL must be an HTTPS origin, e.g. https://your-real-domain.org",
    );
  origin = url.origin;
}
const escape = (s) =>
  s
    .replaceAll("&", "&amp;")
    .replaceAll('"', "&quot;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
for (const route of [...Object.keys(metadata), "/404"]) {
  const info = metadata[route] || missingMetadata;
  let html = template
    .replace(/<title>.*?<\/title>/, `<title>${escape(info.title)}</title>`)
    .replace(
      /<meta name="description"[^>]*>/,
      `<meta name="description" content="${escape(info.description)}" />`,
    )
    .replace('<div id="root"></div>', `<div id="root">${render(route)}</div>`);
  const url = origin
    ? new URL(route === "/" ? "/" : `${route}/`, origin).href
    : "";
  const image = origin ? `${origin}/social-preview.png` : "/social-preview.png";
  const schema = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Thomas T. Kivevele",
    jobTitle:
      "Associate Professor of Sustainable Energy Engineering; Director of Research and Innovation",
    worksFor: {
      "@type": "Organization",
      name: "Nelson Mandela African Institution of Science and Technology",
    },
    ...(url ? { url } : {}),
  };
  const extras = `<meta name="robots" content="${route === "/404" ? "noindex,follow" : "index,follow"}" />\n<meta property="og:title" content="${escape(info.title)}" />\n<meta property="og:description" content="${escape(info.description)}" />\n<meta property="og:type" content="website" />\n<meta property="og:image" content="${image}" />\n<meta property="og:image:alt" content="Thomas T. Kivevele — Sustainable Energy Engineering" />\n<meta property="og:image:width" content="1200" /><meta property="og:image:height" content="630" />\n<meta name="twitter:card" content="summary_large_image" />\n<meta name="twitter:title" content="${escape(info.title)}" />\n<meta name="twitter:description" content="${escape(info.description)}" />\n<meta name="twitter:image" content="${image}" />\n${url ? `<link rel="canonical" href="${url}" /><meta property="og:url" content="${url}" />` : ""}\n${route === "/" || route === "/about" ? `<script type="application/ld+json" data-profile-schema>${JSON.stringify(schema).replaceAll("<", "\\u003c")}</script>` : ""}`;
  html = html.replace("</head>", `${extras}\n</head>`);
  const file =
    route === "/"
      ? "dist/index.html"
      : route === "/404"
        ? "dist/404.html"
        : `dist${route}/index.html`;
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, html);
}
fs.writeFileSync(
  "dist/robots.txt",
  `User-agent: *\nAllow: /\n${origin ? `Sitemap: ${origin}/sitemap.xml\n` : ""}`,
);
if (origin)
  fs.writeFileSync(
    "dist/sitemap.xml",
    `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${Object.keys(
      metadata,
    )
      .map(
        (route) =>
          `<url><loc>${origin}${route === "/" ? "/" : `${route}/`}</loc></url>`,
      )
      .join("")}</urlset>`,
  );
else {
  console.warn(
    "SITE_URL not set: canonical URLs, absolute social URLs and sitemap are intentionally deferred. Set the real HTTPS domain and rebuild before release.",
  );
  if (fs.existsSync("dist/sitemap.xml")) fs.unlinkSync("dist/sitemap.xml");
}
const profile = `THOMAS T. KIVEVELE\nAssociate Professor, Sustainable Energy Engineering\nDirector of Research and Innovation, NM-AIST\nArusha, Tanzania\nAcademic profile\n\nEmail: thomas.kivevele@nm-aist.ac.tz\n\nEDUCATION\n${education.map((x) => `${x.year} — ${x.degree}\n${x.school}`).join("\n\n")}\n\nCAREER\n${career.map((x) => `${x.period} — ${x.role}\n${x.org}`).join("\n\n")}\n\nREGISTERED PATENTS\n${patents.map((x) => `${x.year} — ${x.title}\n${x.number}`).join("\n\n")}\n\nSELECTED AWARDS\n${awards.map((x) => `${x.year} — ${x.title}, ${x.by}`).join("\n")}\n\nThis public academic summary intentionally excludes passport details, date of birth, family information, student identifiers and referees' personal contacts.\n`;
fs.writeFileSync("dist/academic-profile.txt", profile);
fs.writeFileSync("public/academic-profile.txt", profile);
fs.rmSync(".prerender", { recursive: true, force: true });
console.log(
  `Prerendered ${Object.keys(metadata).length} routes and 404; created public academic profile.`,
);
