import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, CheckCircle2, ChevronLeft, ChevronRight, ExternalLink, Images, X } from "lucide-react";
import { projectPhotos } from "../data/projectPhotos";
import { projects } from "../data/site";

export default function ProjectDetail() {
  const { projectId } = useParams();
  const project = projects.find((item) => item.id === projectId);
  const album = useMemo(() => project ? projectPhotos[project.id ?? ""] ?? [] : [], [project?.id]);
  const [activePhoto, setActivePhoto] = useState(0);
  const [showAllPhotos, setShowAllPhotos] = useState(false);
  const [lightboxPhoto, setLightboxPhoto] = useState<number | null>(null);
  const figureRefs = useRef<(HTMLElement | null)[]>([]);
  const photoButtonRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);
  const openerPhotoRef = useRef(0);
  const lightboxOpen = lightboxPhoto !== null;
  const lightboxIndexRef = useRef(lightboxPhoto ?? 0);
  lightboxIndexRef.current = lightboxPhoto ?? 0;

  useEffect(() => {
    setActivePhoto(0);
    if (!album.length || typeof IntersectionObserver === "undefined") return;
    const observer = new IntersectionObserver((entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (visible) setActivePhoto(Number(visible.target.getAttribute("data-photo-index")));
    }, { rootMargin: "-25% 0px -55% 0px", threshold: [0, 0.25, 0.5, 0.75] });
    figureRefs.current.forEach((figure) => figure && observer.observe(figure));
    return () => observer.disconnect();
  }, [projectId, album]);

  const navigateLightbox = useCallback((index: number) => {
    const target = Math.max(0, Math.min(index, album.length - 1));
    setLightboxPhoto(target);
    setActivePhoto(target);
  }, [album.length]);

  useEffect(() => {
    if (!lightboxOpen) return;
    const oldOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeButtonRef.current?.focus();
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setLightboxPhoto(null);
      if (event.key === "ArrowLeft") navigateLightbox(lightboxIndexRef.current - 1);
      if (event.key === "ArrowRight") navigateLightbox(lightboxIndexRef.current + 1);
      if (event.key === "Tab") {
        const controls = document.querySelectorAll<HTMLButtonElement>("[data-photo-lightbox] button:not(:disabled)");
        const first = controls[0];
        const last = controls[controls.length - 1];
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
        else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = oldOverflow;
      window.removeEventListener("keydown", onKeyDown);
      photoButtonRefs.current[openerPhotoRef.current]?.focus();
    };
  }, [lightboxOpen, navigateLightbox]);

  if (!project) {
    return (
      <section className="grid min-h-[60vh] place-items-center bg-paper px-5 py-20 text-center">
        <div>
          <h1 className="text-3xl font-semibold text-ink">Project not found</h1>
          <p className="mt-3 text-slate-600">This project may have moved or the link may be incorrect.</p>
          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <Link to="/projects" className="btn-solar">Browse all projects</Link>
            <Link to="/publications" className="btn-outline">Publications</Link>
            <Link to="/contact" className="btn-outline">Contact</Link>
          </div>
        </div>
      </section>
    );
  }

  const currentPhoto = Math.min(activePhoto, Math.max(album.length - 1, 0));
  const goToPhoto = (index: number) => {
    const target = Math.max(0, Math.min(index, album.length - 1));
    setActivePhoto(target);
    if (target >= 9) setShowAllPhotos(true);
    requestAnimationFrame(() => figureRefs.current[target]?.scrollIntoView({ behavior: "smooth", block: "center" }));
  };
  const openLightbox = (index: number) => {
    openerPhotoRef.current = index;
    setActivePhoto(index);
    setLightboxPhoto(index);
  };
  const expandedDescription = project.cvDescription
    ?.replace(/^CO-PI\s*:/i, "Co-Principal Investigator:")
    .replace(/^CO-I\s*:/i, "Co-Investigator:")
    .replace(/^PI\s*:/i, "Principal Investigator:");

  return (
    <>
      <section className="bg-ink px-5 pb-12 pt-16 text-white sm:pb-16 sm:pt-24">
        <div className="container-site">
          <Link to="/projects" className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-white/75 transition-colors hover:text-white">
            <ArrowLeft size={17} aria-hidden="true" /> All projects
          </Link>
          <div className="mt-8 max-w-4xl">
            <span className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ${project.status === "scheduled" || project.status === "upcoming" ? "bg-solar-100 text-solar-600" : project.status === "ended" ? "bg-white/15 text-white" : "bg-amber-100 text-amber-800"}`}>
              {project.status === "upcoming" ? "Upcoming" : project.status === "scheduled" ? "Within planned dates" : project.status === "ended" ? "Schedule ended" : "Dates to review"}
            </span>
            <h1 className="mt-5 text-3xl font-semibold leading-tight sm:text-5xl">{project.title}</h1>
            <p className="mt-4 text-lg text-white/70">{project.years}</p>
          </div>
        </div>
      </section>

      <section className="section bg-paper">
        <div className="container-site grid gap-12 lg:grid-cols-[0.8fr_1.2fr]">
          <aside className="h-fit rounded-3xl border border-slate-200 bg-white p-6 shadow-card lg:sticky lg:top-8 lg:p-7">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-teal-700">At a glance</p>
            <h2 className="mt-2 text-xl font-semibold text-ink">Project information</h2>
            <dl className="mt-5 space-y-4">
              <div><dt className="text-sm text-slate-500">Funder</dt><dd className="mt-1 font-semibold text-ink">{project.funder}</dd></div>
              <div><dt className="text-sm text-slate-500">Project value</dt><dd className="mt-1 font-semibold text-ink">{project.value}</dd></div>
              <div><dt className="text-sm text-slate-500">Role</dt><dd className="mt-1 font-semibold text-ink">{project.role}</dd></div>
              <div><dt className="text-sm text-slate-500">Period</dt><dd className="mt-1 font-semibold text-ink">{project.years}</dd></div>
            </dl>
            <a href="https://nm-aist.ac.tz/teams/prof-thomas-kivevele/" target="_blank" rel="noopener noreferrer" className="mt-5 inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-teal-700 underline decoration-teal-200 underline-offset-4 hover:text-solar-600">See selected project records on the NM-AIST profile <ExternalLink size={14} aria-hidden="true" /></a>
            {album.length > 0 && (
              <div className="mt-7 border-t border-slate-200 pt-6">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm font-semibold text-ink">Photo album</p>
                  <span className="rounded-full bg-teal-50 px-3 py-1 text-xs font-bold text-teal-700">{currentPhoto + 1} / {album.length}</span>
                </div>
                <button type="button" onClick={() => goToPhoto(currentPhoto)} aria-label={`Jump to photo ${currentPhoto + 1}`} className="mt-4 block w-full overflow-hidden rounded-2xl bg-slate-100 text-left">
                  <img src={album[currentPhoto]?.photo.src(480)} alt="" className="h-40 w-full object-cover" loading="lazy" decoding="async" />
                </button>
                <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-slate-100" role="progressbar" aria-label="Photo album reading progress" aria-valuemin={1} aria-valuemax={album.length} aria-valuenow={currentPhoto + 1}>
                  <div className="h-full rounded-full bg-teal-600 transition-[width] duration-300" style={{ width: `${((currentPhoto + 1) / album.length) * 100}%` }} />
                </div>
                <div className="mt-4 flex items-center justify-between">
                  <button type="button" disabled={currentPhoto === 0} onClick={() => goToPhoto(currentPhoto - 1)} className="min-h-10 rounded-full border border-slate-200 px-4 text-sm font-semibold text-ink hover:border-teal-500 disabled:cursor-not-allowed disabled:opacity-40">Previous</button>
                  <button type="button" disabled={currentPhoto >= album.length - 1} onClick={() => goToPhoto(currentPhoto + 1)} className="min-h-10 rounded-full border border-slate-200 px-4 text-sm font-semibold text-ink hover:border-teal-500 disabled:cursor-not-allowed disabled:opacity-40">Next</button>
                </div>
                <p className="mt-3 text-xs leading-relaxed text-slate-500">Scroll the gallery or use the arrows to move through the project photographs.</p>
              </div>
            )}
          </aside>

          <div className="min-w-0">
            <section aria-labelledby="project-outcomes-title">
              <p className="text-sm font-bold uppercase tracking-[0.16em] text-teal-700">Project overview</p>
              <h2 id="project-outcomes-title" className="mt-3 text-3xl font-semibold text-ink">Outcomes and activities</h2>
              {project.cvDescription && (
                <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 leading-relaxed text-slate-700">
                  <h3 className="mb-2 font-semibold text-ink">Project brief</h3>
                  <p>{expandedDescription}</p>
                </div>
              )}
              <ul className="mt-6 space-y-4">
                {project.outcomes.map((outcome) => (
                  <li key={outcome} className="flex gap-3 rounded-2xl border border-slate-200 bg-white p-5 text-[15px] leading-relaxed text-slate-700">
                    <CheckCircle2 size={19} className="mt-0.5 shrink-0 text-teal-600" aria-hidden="true" />{outcome}
                  </li>
                ))}
              </ul>
            </section>

            <section aria-labelledby="project-photos-title" className="mt-14">
              <div className="flex items-center gap-3 text-teal-700"><Images size={20} aria-hidden="true" /><p className="text-sm font-bold uppercase tracking-[0.16em]">Project gallery</p></div>
              <h2 id="project-photos-title" className="mt-3 text-3xl font-semibold text-ink">Project photo album</h2>
              {album.length > 0 && <p className="mt-2 text-sm text-slate-500">Browse {album.length} project photographs. Select a photo to view it full screen.</p>}
              {album.length ? (
                <div className={`mt-6 grid gap-4 ${album.length > 2 ? "sm:grid-cols-2 xl:grid-cols-3" : "sm:grid-cols-2"}`}>
                  {album.slice(0, showAllPhotos ? album.length : 9).map(({ photo, caption }, index) => (
                    <figure key={photo.src(960)} id={`project-photo-${index}`} data-photo-index={index} ref={(node) => { figureRefs.current[index] = node; }} className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-card">
                      <button ref={(node) => { photoButtonRefs.current[index] = node; }} type="button" onClick={() => openLightbox(index)} aria-label={`View full-screen photo ${index + 1}: ${photo.alt}`} className="group relative block w-full cursor-zoom-in bg-slate-200 text-left focus:outline-none focus-visible:ring-4 focus-visible:ring-inset focus-visible:ring-teal-500">
                        <img src={photo.src(960)} srcSet={`${photo.src(480)} 480w, ${photo.src(960)} 960w`} sizes="(min-width: 1280px) 30vw, (min-width: 640px) 45vw, 100vw" alt={photo.alt} className="h-64 w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]" style={{ objectPosition: photo.position }} loading="lazy" decoding="async" />
                      </button>
                      <figcaption className="px-4 py-3 text-sm leading-relaxed text-slate-600">{caption || `Research documentation: ${project.title}`}</figcaption>
                    </figure>
                  ))}
                </div>
              ) : (
                <p className="mt-5 rounded-2xl border border-dashed border-slate-300 bg-white p-6 leading-relaxed text-slate-600">No project photos are available here yet. Please check back later to see them.</p>
              )}
              {album.length > 9 && <button type="button" onClick={() => setShowAllPhotos((shown) => !shown)} className="btn-outline mt-6">{showAllPhotos ? "Show fewer photos" : `Show all ${album.length} photos`}</button>}
              <Link to="/projects" className="mt-8 inline-flex min-h-11 items-center gap-2 font-semibold text-teal-700 hover:text-solar-600"><ArrowLeft size={17} aria-hidden="true" /> Back to all projects</Link>
            </section>
          </div>
        </div>
      </section>
      {lightboxPhoto !== null && album[lightboxPhoto] && (
        <div data-photo-lightbox="" role="dialog" aria-modal="true" aria-label={`Project photo ${lightboxPhoto + 1} of ${album.length}`} className="fixed inset-0 z-[100] flex flex-col bg-ink/95 p-4 text-white backdrop-blur-sm sm:p-6" onMouseDown={(event) => { if (event.target === event.currentTarget) setLightboxPhoto(null); }}>
          <div className="flex items-center justify-between gap-4">
            <p className="text-sm font-semibold">Photo {lightboxPhoto + 1} <span className="text-white/60">of {album.length}</span></p>
            <button ref={closeButtonRef} type="button" onClick={() => setLightboxPhoto(null)} aria-label="Close full-screen photo" className="grid size-11 place-items-center rounded-full bg-white/10 transition-colors hover:bg-white/20"><X size={22} aria-hidden="true" /></button>
          </div>
          <div className="flex min-h-0 flex-1 items-center justify-center gap-3 py-4 sm:gap-8">
            <button type="button" disabled={lightboxPhoto === 0} onClick={() => navigateLightbox((lightboxPhoto ?? 0) - 1)} aria-label="Previous full-screen photo" className="grid size-11 shrink-0 place-items-center rounded-full bg-white/10 transition-colors hover:bg-white/20 disabled:cursor-not-allowed disabled:opacity-30 sm:size-14"><ChevronLeft size={27} aria-hidden="true" /></button>
            <img src={album[lightboxPhoto].photo.src(1600)} alt={album[lightboxPhoto].photo.alt} className="max-h-full max-w-[calc(100vw-8rem)] object-contain" decoding="async" />
            <button type="button" disabled={lightboxPhoto >= album.length - 1} onClick={() => navigateLightbox((lightboxPhoto ?? 0) + 1)} aria-label="Next full-screen photo" className="grid size-11 shrink-0 place-items-center rounded-full bg-white/10 transition-colors hover:bg-white/20 disabled:cursor-not-allowed disabled:opacity-30 sm:size-14"><ChevronRight size={27} aria-hidden="true" /></button>
          </div>
          <p className="text-center text-xs text-white/55">Use the arrow keys to browse. Press Escape to close.</p>
        </div>
      )}
    </>
  );
}
