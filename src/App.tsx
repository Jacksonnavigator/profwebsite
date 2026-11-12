import { useEffect, useRef } from "react";
import { Link, Route, Routes, useLocation } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import About from "./pages/About";
import Projects from "./pages/Projects";
import ProjectDetail from "./pages/ProjectDetail";
import Publications from "./pages/Publications";
import Contact from "./pages/Contact";

import { metadata, missingMetadata } from "./data/metadata";
import { projects } from "./data/site";

function NotFound() {
  return (
    <section className="grid min-h-[70vh] place-items-center bg-ink px-4 pt-20 text-center text-white">
      <div>
        <h1 className="text-5xl font-semibold">This page does not exist</h1>
        <p className="mt-4 text-white/75">The link may be old or mistyped.</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link to="/" className="btn-solar">Home</Link>
          <Link to="/projects" className="btn border border-white/60 text-white hover:bg-white/10">Projects</Link>
          <Link to="/publications" className="btn border border-white/60 text-white hover:bg-white/10">Publications</Link>
          <Link to="/contact" className="btn border border-white/60 text-white hover:bg-white/10">Contact</Link>
        </div>
      </div>
    </section>
  );
}

export default function App() {
  const { pathname: rawPathname, hash } = useLocation();
  const pathname = rawPathname.replace(/\/+$/, "") || "/";
  const mounted = useRef(false);

  useEffect(() => {
    const projectId = pathname.startsWith("/projects/")
      ? pathname.slice("/projects/".length)
      : undefined;
    const project = projects.find((item) => item.id === projectId);
    const info = metadata[pathname] ?? (project
      ? {
          title: `${project.title} | Research Projects | Thomas T. Kivevele`,
          description: `${project.title}. Funder: ${project.funder}. Project period: ${project.years}.`,
        }
      : missingMetadata);
    document.title = info.title;
    const set = (selector: string, value: string) => {
      document.querySelector(selector)?.setAttribute("content", value);
    };
    set('meta[name="description"]', info.description);
    set('meta[property="og:title"]', info.title);
    set('meta[property="og:description"]', info.description);
    set('meta[name="twitter:title"]', info.title);
    set('meta[name="twitter:description"]', info.description);
    set(
      'meta[name="robots"]',
      metadata[pathname] || project ? "index,follow" : "noindex,follow",
    );
    const canonical = document.querySelector<HTMLLinkElement>(
      'link[rel="canonical"]',
    );
    const origin = canonical
      ? new URL(canonical.href).origin
      : window.location.origin;
    const url = new URL(pathname === "/" ? "/" : `${pathname}/`, origin).href;
    if (canonical) canonical.href = url;
    set('meta[property="og:url"]', url);
    document
      .querySelectorAll("script[data-profile-schema]")
      .forEach((element) => element.remove());
    if (pathname === "/" || pathname === "/about") {
      const schema = document.createElement("script");
      schema.type = "application/ld+json";
      schema.dataset.profileSchema = "";
      schema.textContent = JSON.stringify({
        "@context": "https://schema.org",
        "@type": "Person",
        name: "Thomas T. Kivevele",
        jobTitle:
          "Associate Professor of Sustainable Energy Engineering; Director of Research and Innovation",
        worksFor: {
          "@type": "Organization",
          name: "Nelson Mandela African Institution of Science and Technology",
        },
        url,
      });
      document.head.appendChild(schema);
    }
    if (hash)
      requestAnimationFrame(() => {
        let id = hash.slice(1);
        try {
          id = decodeURIComponent(id);
        } catch {
          /* Keep a malformed fragment literal. */
        }
        document.getElementById(id)?.scrollIntoView();
      });
    else {
      window.scrollTo(0, 0);
      if (mounted.current)
        document.getElementById("main")?.focus({ preventScroll: true });
    }
    mounted.current = true;
  }, [pathname, hash]);

  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-lg focus:bg-white focus:px-4 focus:py-2 focus:text-ink"
      >
        Skip to content
      </a>
      <Header />
      <main id="main" tabIndex={-1}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/projects/:projectId" element={<ProjectDetail />} />
          <Route path="/publications" element={<Publications />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </>
  );
}
