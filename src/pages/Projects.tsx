import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import PageBanner from "../components/PageBanner";
import { photos } from "../data/images";
import { projects, type Project } from "../data/site";

const filters = [
  { id: "all", label: "All projects", test: () => true },
  { id: "upcoming", label: "Upcoming", test: (p: Project) => p.status === "upcoming" },
  { id: "scheduled", label: "Within planned dates", test: (p: Project) => p.status === "scheduled" },
  { id: "ended", label: "Schedule ended", test: (p: Project) => p.status === "ended" },
  { id: "review", label: "Dates to review", test: (p: Project) => p.status === "review" },
] as const;

const funders = [...new Set(projects.map((project) => project.funder))].sort((a, b) => a.localeCompare(b));
const years = [...new Set(projects.flatMap((project) => [...project.years.matchAll(/\b20\d{2}\b/g)].map((match) => match[0])))].sort((a, b) => Number(b) - Number(a));
const topics = [
  { label: "Solar drying", pattern: /solar|dryer|drying/i },
  { label: "Bioenergy and biomass", pattern: /biofuel|bioenergy|biogas|gasification|rice husk|biomass|hyacinth/i },
  { label: "Grids and power systems", pattern: /grid|power system|electricity/i },
  { label: "Training and research capacity", pattern: /training|skills|education|university|graduate|capacity|exchange|school/i },
  { label: "Policy and consultancy", pattern: /consult|business model|market|policy|incubation|innovation/i },
];

const statusLabel: Record<Project["status"], string> = {
  upcoming: "Upcoming",
  scheduled: "Within planned dates",
  ended: "Schedule ended",
  review: "Dates to review",
};

function ProjectCard({ p }: { p: Project }) {
  return (
    <article className="flex flex-col rounded-3xl border border-slate-200 bg-white p-7 shadow-card">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <span className={`rounded-full px-3 py-1 text-xs font-bold ${p.status === "scheduled" || p.status === "upcoming" ? "bg-solar-100 text-solar-600" : p.status === "ended" ? "bg-teal-50 text-teal-600" : "bg-amber-100 text-amber-800"}`}>
          {statusLabel[p.status]}
        </span>
        <span className="text-sm font-semibold text-slate-500">{p.years}</span>
      </div>
      <h2 className="mt-4 text-2xl font-semibold leading-snug text-ink">{p.title}</h2>
      <dl className="mt-5 grid gap-3 text-[15px] sm:grid-cols-2">
        <div><dt className="text-slate-500">Funder</dt><dd className="font-semibold text-ink">{p.funder}</dd></div>
        <div><dt className="text-slate-500">Value</dt><dd className="font-semibold text-ink">{p.value}</dd></div>
        <div className="sm:col-span-2"><dt className="text-slate-500">Role</dt><dd className="font-semibold text-ink">{p.role}</dd></div>
      </dl>
      <Link to={`/projects/${p.id}`} className="mt-6 inline-flex min-h-11 items-center gap-2 self-start text-sm font-semibold text-teal-700 hover:text-solar-600">
        View project and photo album <span aria-hidden="true">&rarr;</span>
      </Link>
    </article>
  );
}

export default function Projects() {
  const [filter, setFilter] = useState<(typeof filters)[number]["id"]>("all");
  const [query, setQuery] = useState("");
  const [funder, setFunder] = useState("");
  const [year, setYear] = useState("");
  const [topic, setTopic] = useState("");
  const active = filters.find((item) => item.id === filter)!;
  const shown = useMemo(() => {
    const term = query.trim().toLowerCase();
    return projects.filter((project) => {
      const searchable = [project.title, project.funder, project.role, project.years, project.cvDescription ?? "", ...project.outcomes]
        .join(" ")
        .toLowerCase();
      return active.test(project)
        && (!term || searchable.includes(term))
        && (!funder || project.funder === funder)
        && (!topic || topics.find((item) => item.label === topic)?.pattern.test(searchable))
        && (!year || project.years.includes(year));
    });
  }, [active, funder, query, topic, year]);
  const clear = () => { setFilter("all"); setQuery(""); setFunder(""); setYear(""); setTopic(""); };
  const hasFilters = filter !== "all" || query.trim() !== "" || funder !== "" || year !== "" || topic !== "";
  const field = "mt-2 block min-h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-base focus:border-teal-500 focus:outline-none focus:ring-4 focus:ring-teal-100";

  return (
    <>
      <PageBanner photo={photos.demonstration} kicker="Research projects" title="Funded research and innovation">
        {projects.length} projects led as principal investigator, co-investigator or lead consultant, with funders including the
        European Union, the World Bank, the US National Academies, EPFL, the IAEA and UNIDO.
      </PageBanner>

      <section className="section bg-paper">
        <div className="container-site">
          <div className="grid gap-4 rounded-3xl bg-white p-6 shadow-card md:grid-cols-2 xl:grid-cols-[1fr_220px_160px_240px]">
            <div>
              <label htmlFor="project-search" className="text-sm font-semibold">Search projects</label>
              <input id="project-search" type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Title, funder, topic, role or outcome" className={field} />
            </div>
            <div>
              <label htmlFor="project-funder" className="text-sm font-semibold">Funder</label>
              <select id="project-funder" value={funder} onChange={(event) => setFunder(event.target.value)} className={field}>
                <option value="">All funders</option>
                {funders.map((name) => <option key={name} value={name}>{name}</option>)}
              </select>
            </div>
            <div>
              <label htmlFor="project-year" className="text-sm font-semibold">Project year</label>
              <select id="project-year" value={year} onChange={(event) => setYear(event.target.value)} className={field}>
                <option value="">All years</option>
                {years.map((value) => <option key={value} value={value}>{value}</option>)}
              </select>
            </div>
            <div>
              <label htmlFor="project-topic" className="text-sm font-semibold">Topic</label>
              <select id="project-topic" value={topic} onChange={(event) => setTopic(event.target.value)} className={field}>
                <option value="">All topics</option>
                {topics.map((item) => <option key={item.label} value={item.label}>{item.label}</option>)}
              </select>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-2" role="group" aria-label="Filter by project schedule">
            {filters.map((f) => (
              <button
                key={f.id}
                type="button"
                aria-pressed={filter === f.id}
                onClick={() => setFilter(f.id)}
                className={`min-h-11 rounded-full px-5 text-sm font-semibold transition-colors ${
                  filter === f.id ? "bg-ink text-white" : "border border-slate-200 bg-white text-ink hover:border-teal-500"
                }`}
              >
                {f.label} <span className="opacity-60">{projects.filter(f.test).length}</span>
              </button>
            ))}
          </div>

          <p className="mt-8 text-sm font-semibold text-slate-600" aria-live="polite">Showing {shown.length} of {projects.length} projects. Schedule labels follow the listed project dates.</p>

          {hasFilters && <button type="button" onClick={clear} className="btn-outline mt-4">Clear filters</button>}

          {shown.length > 0 ? <div className="mt-6 grid gap-6 md:grid-cols-2">
            {shown.map((p) => <ProjectCard key={p.title} p={p} />)}
          </div> : <p className="mt-6 rounded-3xl border border-dashed border-slate-300 bg-white p-8 text-center text-slate-600">No projects match these filters. Try a different search or clear the filters.</p>}

          <div className="mt-16 flex flex-col items-start gap-5 rounded-3xl bg-ink p-8 text-white md:flex-row md:items-center md:justify-between md:p-12">
            <div>
              <h2 className="text-3xl font-semibold">Have a project in mind?</h2>
              <p className="mt-2 text-white/75">He welcomes partners for joint proposals, consultancies and student placements.</p>
            </div>
            <Link to="/contact" className="btn-solar shrink-0">Propose a collaboration</Link>
          </div>
        </div>
      </section>
    </>
  );
}
