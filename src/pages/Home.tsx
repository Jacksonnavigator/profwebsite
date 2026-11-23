import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, FlaskConical, GraduationCap, Landmark, Mail, MapPin, Pause, Phone, Play } from "lucide-react";
import HeroSlider from "../components/HeroSlider";
import Photo from "../components/Photo";
import SectionHeading from "../components/SectionHeading";
import PublicationCard from "../components/PublicationCard";
import ContactForm from "../components/ContactForm";
import { photos } from "../data/images";
import { awards, contact, impact, innovations, journey, partners, projects, stats, innovationLink } from "../data/site";
import { publications } from "../data/publications";

const impactIcons = { flask: FlaskConical, graduation: GraduationCap, landmark: Landmark } as const;
const statDetails: Record<string, { to: string; label: string }> = {
  "Journal articles listed": { to: "/publications", label: "Browse publications" },
  "Engineering career began": { to: "/about#career", label: "See career history" },
  "Registered patents": { to: "/about#patents", label: "View patent details" },
  "Research projects listed": { to: "/projects", label: "Browse the project list" },
};

export default function Home() {
  const [partnersPaused, setPartnersPaused] = useState(false);
  const [partnersInteracting, setPartnersInteracting] = useState(false);
  const latest = publications.filter((p) => p.type === "Journal article" && p.doi).slice(0, 6);

  return (
    <>
      <HeroSlider />

      {/* About and figures */}
      <section className="section bg-paper">
        <div className="container-site">
          <SectionHeading kicker="About Kivevele" title="An engineer who builds energy solutions Africa can use" center>
            A registered Professional Engineer and Associate Professor whose work spans solar drying, biofuels, heat pumps,
            microgrids and waste-to-energy, from the lab at NM-AIST to farms and clinics across Tanzania.
          </SectionHeading>

          <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((s) => (
              <div key={s.label} className="group relative flex flex-col items-start overflow-hidden rounded-3xl border border-slate-200 bg-white p-7 shadow-card transition-transform duration-300 hover:-translate-y-1">
                <div className="absolute -right-10 -top-10 h-28 w-28 rounded-full bg-solar-100 transition-transform duration-500 group-hover:scale-125" aria-hidden="true" />
                <p className="relative font-display text-5xl font-semibold text-teal-600">{s.label === "Research projects listed" ? projects.length : s.value}</p>
                <p className="relative mt-3 text-lg font-semibold text-ink">{s.label}</p>
                <p className="relative mt-2 text-[15px] leading-relaxed text-slate-600">{s.detail}</p>
                <Link to={statDetails[s.label].to} className="relative mt-5 inline-flex min-h-11 items-center font-semibold text-teal-700 underline decoration-teal-200 underline-offset-4 hover:text-solar-600">
                  {statDetails[s.label].label} <ArrowRight size={16} className="ml-2" aria-hidden="true" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Journey: the reference's "What I'm building" */}
      <section className="section bg-white">
        <div className="container-site grid items-center gap-14 lg:grid-cols-[1fr_1.1fr]">
          <div className="relative mx-auto w-full max-w-md lg:max-w-none">
            <div className="absolute -left-4 -top-4 h-full w-full rounded-[2rem] bg-gradient-to-br from-solar to-solar-600" aria-hidden="true" />
            <div className="relative overflow-hidden rounded-[2rem] bg-teal-600 shadow-lift">
              <Photo photo={photos.worldScienceForum} width={800} className="aspect-[4/5] w-full object-[50%_20%]" />
            </div>
            <div className="absolute -bottom-6 right-4 rounded-2xl bg-ink px-6 py-5 text-white shadow-lift sm:right-[-1.5rem]">
              <p className="font-display text-3xl font-semibold text-solar">2018</p>
              <p className="mt-1 text-sm text-white/75">Fulbright African Senior<br />Research Scholar</p>
            </div>
          </div>

          <div>
            <SectionHeading kicker="The journey" title="From power plants to a pan-African research lab">
              Sixteen years that took him from commissioning generators in Dar es Salaam to leading research and innovation at one
              of Africa's leading science institutions.
            </SectionHeading>
            <ol className="mt-10 space-y-8">
              {journey.map((j, i) => (
                <li key={j.title} className="relative pl-16">
                  <span className="absolute left-0 top-0 grid h-11 w-11 place-items-center rounded-full bg-teal-50 font-display text-lg font-semibold text-teal-600">
                    {i + 1}
                  </span>
                  <h3 className="text-2xl font-semibold text-ink">{j.title}</h3>
                  <p className="mt-2 leading-relaxed text-slate-600">{j.body}</p>
                </li>
              ))}
            </ol>
            <Link to="/about#career" className="btn-outline mt-8">Read the full career history <ArrowRight size={18} aria-hidden="true" /></Link>
          </div>
        </div>
      </section>

      {/* Innovations grid: the reference's "Our Ventures" */}
      <section className="section bg-ink">
        <div className="container-site">
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <SectionHeading kicker="Research and innovation" title="Technologies built in his lab" light>
              Patented designs and flagship research programmes, funded by partners on four continents.
            </SectionHeading>
            <Link to="/projects" className="btn-solar shrink-0">
              View all projects <ArrowRight size={18} aria-hidden="true" />
            </Link>
          </div>

          <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {innovations.map((v, i) => (
              <Link
                key={v.title}
                to={innovationLink(i)}
                className="group relative flex min-h-[22rem] flex-col justify-end overflow-hidden rounded-3xl bg-ink-700 p-6 ring-1 ring-white/10"
              >
                <Photo photo={v.photo} width={600} className="absolute inset-0 h-full w-full transition-transform duration-700 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/75 to-ink/5" />
                <div className="relative">
                  <p className="text-sm font-semibold text-solar-400">{v.tag}</p>
                  <h3 className="mt-2 text-2xl font-semibold leading-tight text-white">{v.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-white/80">{v.summary}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Impact: the reference's "Creating Impact" */}
      <section className="section bg-paper">
        <div className="container-site">
          <SectionHeading kicker="Creating impact" title="Three roles, one mission" center>
            Clean, affordable energy for African communities, and the people and policies to deliver it.
          </SectionHeading>

          <div className="mt-16 space-y-10">
            {impact.map((c, i) => {
              const Icon = impactIcons[c.icon as keyof typeof impactIcons];
              return (
                <article
                  key={c.title}
                  className={`grid overflow-hidden rounded-[2rem] bg-white shadow-card lg:grid-cols-2 ${i % 2 ? "lg:[&>*:first-child]:order-2" : ""}`}
                >
                  <div className="relative min-h-[18rem]">
                    <Photo photo={c.photo} width={900} className="absolute inset-0 h-full w-full" />
                  </div>
                  <div className="p-8 md:p-12">
                    <span className="grid h-14 w-14 place-items-center rounded-2xl bg-solar-100 text-solar-600">
                      <Icon size={26} aria-hidden="true" />
                    </span>
                    <h3 className="mt-6 text-3xl font-semibold text-ink md:text-4xl">{c.title}</h3>
                    <p className="mt-2 text-lg font-medium text-teal-600">{c.tagline}</p>
                    <p className="mt-4 leading-relaxed text-slate-600">{c.body}</p>
                    <ul className="mt-6 grid gap-3 sm:grid-cols-2">
                      {c.points.map((p) => (
                        <li key={p} className="flex gap-3 text-[15px] text-ink">
                          <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-solar" aria-hidden="true" />
                          {p}
                        </li>
                      ))}
                    </ul>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* Recognition and partners */}
      <section className="relative isolate overflow-hidden bg-teal-600 py-20 text-white">
        <Photo photo={photos.mountainTrees} width={1800} className="absolute inset-0 -z-20 h-full w-full opacity-25" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-teal-600 via-teal-600/90 to-teal-600/70" />
        <div className="container-site">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="kicker text-solar-400">Recognition</p>
              <h2 className="mt-3 font-display text-3xl font-semibold text-white sm:text-4xl">Awards and research milestones</h2>
            </div>
            <a href="https://nm-aist.ac.tz/teams/prof-thomas-kivevele/" target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center self-start font-semibold text-white underline decoration-solar underline-offset-4 hover:text-solar-400 sm:self-auto">
              NM-AIST staff profile <ArrowRight size={17} className="ml-2" aria-hidden="true" />
            </a>
          </div>
          {awards[0] && (
            <article className="mt-9 grid overflow-hidden rounded-3xl border border-white/20 bg-ink/20 shadow-lift md:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
              {awards[0].image && <img src={awards[0].image} alt={awards[0].imageAlt} className="h-64 w-full object-cover sm:h-80 md:h-full md:min-h-80" loading="lazy" />}
              <div className="flex flex-col justify-center p-6 sm:p-9">
                <p className="font-display text-2xl font-semibold text-solar-400">{awards[0].year}</p>
                {awards[0].sourceUrl ? <a href={awards[0].sourceUrl} target="_blank" rel="noopener noreferrer" className="mt-2 inline-flex items-start gap-2 text-xl font-semibold leading-snug underline decoration-solar/70 underline-offset-4 hover:text-solar-400 sm:text-2xl">{awards[0].title}<ArrowRight size={18} className="mt-1 shrink-0" aria-hidden="true" /></a> : <h3 className="mt-2 text-xl font-semibold leading-snug sm:text-2xl">{awards[0].title}</h3>}
                <p className="mt-3 text-base text-white/75">{awards[0].by}</p>
              </div>
            </article>
          )}
          <ul className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {awards.slice(1).map((a) => (
              <li key={a.title} className="h-full rounded-2xl border border-white/20 bg-white/5 p-5 sm:p-6">
                <p className="font-display text-2xl font-semibold text-solar-400">{a.year}</p>
                {a.sourceUrl ? <a href={a.sourceUrl} target="_blank" rel="noopener noreferrer" className="mt-2 inline-flex items-start gap-2 text-lg font-semibold leading-snug underline decoration-solar/70 underline-offset-4 hover:text-solar-400">{a.title}<ArrowRight size={16} className="mt-1 shrink-0" aria-hidden="true" /></a> : <h3 className="mt-2 text-lg font-semibold leading-snug">{a.title}</h3>}
                <p className="mt-2 text-sm leading-relaxed text-white/75">{a.by}</p>
              </li>
            ))}
          </ul>
        </div>
        <div className="mt-16 overflow-hidden border-y border-white/15 py-6" aria-label="Funders and partners" onMouseEnter={() => setPartnersInteracting(true)} onMouseLeave={() => setPartnersInteracting(false)} onFocusCapture={() => setPartnersInteracting(true)} onBlurCapture={(event) => { if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setPartnersInteracting(false); }}>
          <div className="container-site mb-4 flex justify-end">
            <button type="button" onClick={() => setPartnersPaused((value) => !value)} aria-pressed={partnersPaused} className="btn min-h-10 border border-white/50 px-4 text-sm text-white hover:bg-white/10">
              {partnersPaused ? <Play size={16} aria-hidden="true" /> : <Pause size={16} aria-hidden="true" />}
              {partnersPaused ? "Resume partner list" : "Pause partner list"}
            </button>
          </div>
          <ul className="flex w-max animate-marquee gap-12 whitespace-nowrap font-display text-2xl font-semibold text-white/80" style={{ animationPlayState: partnersPaused || partnersInteracting ? "paused" : "running" }}>
            {[...partners, ...partners].map((p, i) => (
              <li key={i} aria-hidden={i >= partners.length} className={`flex items-center gap-12 ${i >= partners.length ? "motion-reduce:hidden" : ""}`}>
                {p}
                <span className="h-2 w-2 rounded-full bg-solar" aria-hidden="true" />
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Latest research: the reference's "News Updates" */}
      <section className="section bg-white">
        <div className="container-site">
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <SectionHeading kicker="Latest research" title="Recent journal articles">
              Six DOI-linked articles from the latest publication years represented in this library, ordered by year.
            </SectionHeading>
            <Link to="/publications" className="btn-outline shrink-0">
              Browse all {publications.length} publications <ArrowRight size={18} aria-hidden="true" />
            </Link>
          </div>
          <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {latest.map((p) => (
              <PublicationCard key={p.text} pub={p} />
            ))}
          </div>
        </div>
      </section>

      {/* Get in touch */}
      <section className="section bg-paper" id="contact">
        <div className="container-site grid gap-12 lg:grid-cols-[1fr_1.3fr]">
          <div>
            <SectionHeading kicker="Get in touch" title="Let's work together">
              Research partnerships, consultancy, speaking invitations and graduate supervision.
            </SectionHeading>
            <ul className="mt-10 space-y-6">
              <li className="flex gap-4">
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-teal-600 text-white"><MapPin size={22} aria-hidden="true" /></span>
                <div>
                  <h3 className="font-sans text-base font-semibold">Office</h3>
                  <p className="mt-1 text-slate-600">{contact.office.slice(1).join(", ")}</p>
                </div>
              </li>
              <li className="flex gap-4">
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-teal-600 text-white"><Phone size={22} aria-hidden="true" /></span>
                <div>
                  <h3 className="font-sans text-base font-semibold">Phone</h3>
                  {contact.phones.map((p) => (
                    <a key={p} href={`tel:${p.replace(/\s/g, "")}`} className="mt-1 block text-slate-600 hover:text-teal-600">{p}</a>
                  ))}
                </div>
              </li>
              <li className="flex gap-4">
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-teal-600 text-white"><Mail size={22} aria-hidden="true" /></span>
                <div className="min-w-0">
                  <h3 className="font-sans text-base font-semibold">Email</h3>
                  <a href={`mailto:${contact.emailPrimary}`} className="mt-1 block break-all text-slate-600 hover:text-teal-600">{contact.emailPrimary}</a>
                </div>
              </li>
            </ul>
          </div>
          <ContactForm />
        </div>
      </section>
    </>
  );
}
