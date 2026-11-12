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
  projects,
  projectPhotos,
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
const projectRoutes = projects.map((project) => ({
  route: `/projects/${project.id}`,
  info: {
    title: `${project.title} | Research Projects | Thomas T. Kivevele`,
    description: `${project.title}. Funder: ${project.funder}. Project period: ${project.years}.`,
  },
}));
const routes = [
  ...Object.keys(metadata).map((route) => ({ route, info: metadata[route] })),
  ...projectRoutes,
  { route: "/404", info: missingMetadata },
];
for (const { route, info } of routes) {
  const routeProject = projects.find((project) => route === `/projects/${project.id}`);
  const leadPhoto = routeProject ? projectPhotos[routeProject.id ?? ""]?.[0]?.photo : undefined;
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
  const imagePath = leadPhoto?.src(960) || "/social-preview.png";
  const image = origin ? new URL(imagePath, origin).href : imagePath;
  const imageAlt = leadPhoto?.alt || "Thomas T. Kivevele, Sustainable Energy Engineering";
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
  const extras = [
    `<meta name="robots" content="${route === "/404" ? "noindex,follow" : "index,follow"}" />`,
    `<meta property="og:title" content="${escape(info.title)}" />`,
    `<meta property="og:description" content="${escape(info.description)}" />`,
    `<meta property="og:type" content="${routeProject ? "article" : "website"}" />`,
    `<meta property="og:image" content="${image}" />`,
    `<meta property="og:image:alt" content="${escape(imageAlt)}" />`,
    ...(routeProject ? [] : ['<meta property="og:image:width" content="1200" />', '<meta property="og:image:height" content="630" />']),
    '<meta name="twitter:card" content="summary_large_image" />',
    `<meta name="twitter:title" content="${escape(info.title)}" />`,
    `<meta name="twitter:description" content="${escape(info.description)}" />`,
    `<meta name="twitter:image" content="${image}" />`,
    ...(url ? [`<link rel="canonical" href="${url}" />`, `<meta property="og:url" content="${url}" />`] : []),
    ...(route === "/" || route === "/about" ? [`<script type="application/ld+json" data-profile-schema>${JSON.stringify(schema).replaceAll("<", "\\u003c")}</script>`] : []),
  ].join("\n");
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
    `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${routes
      .filter(({ route }) => route !== "/404")
      .map(
        ({ route }) =>
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
  `Prerendered ${Object.keys(metadata).length + projects.length} routes and 404; created public academic profile.`,
);
