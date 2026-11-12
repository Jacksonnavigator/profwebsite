import { Link } from "react-router-dom";
import { BadgeCheck, ExternalLink, Mic } from "lucide-react";
import PageBanner from "../components/PageBanner";
import Photo from "../components/Photo";
import SectionHeading from "../components/SectionHeading";
import { photos } from "../data/images";
import { career, education, patents, service, talks } from "../data/site";

const institutionalLinks = [
  { label: "NM-AIST staff profile", href: "https://nm-aist.ac.tz/teams/prof-thomas-kivevele/" },
  { label: "Research and Innovation Directorate", href: "https://nm-aist.ac.tz/the-nelson-mandela-african-institution-of-science-and-technology-nm-aist/directorates/research-and-innovation/" },
  { label: "Google Scholar publication profile", href: "https://scholar.google.com/citations?user=HrpWQEAAAAAJ&hl=en" },
];

export default function About() {
  return (
    <>
      <PageBanner photo={photos.campus} kicker="About" title="Thomas T. Kivevele">
        Associate Professor of Sustainable Energy Engineering and Director of Research and Innovation at the Nelson Mandela
        African Institution of Science and Technology in Arusha, Tanzania.
      </PageBanner>

      <section id="biography" className="section scroll-mt-24 bg-white">
        <div className="container-site grid gap-14 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <div className="overflow-hidden rounded-[2rem] bg-teal-600 shadow-lift">
              <Photo photo={photos.technaiOsirisInstrument} width={700} className="aspect-[4/5] w-full object-[50%_20%]" />
            </div>
            <ul className="mt-6 space-y-3">
              {["Registered Professional Engineer, ERB PE10185", "ARISE Fellow, African Academy of Sciences", "Member, Tanzania Renewable Energy Association", "Editorial board, Journal of Automotive Experiences"].map((c) => (
                <li key={c} className="flex gap-3 text-[15px]">
                  <BadgeCheck size={20} className="shrink-0 text-teal-600" aria-hidden="true" /> {c}
                </li>
              ))}
            </ul>
            <div className="mt-8 rounded-2xl border border-slate-200 bg-paper p-6">
              <h2 className="font-sans text-base font-semibold text-ink">Institutional and research profiles</h2>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">Verify current appointments, institutional roles and indexed publications through these profiles.</p>
              <ul className="mt-4 space-y-3">
                {institutionalLinks.map((item) => (
                  <li key={item.href}>
                    <a href={item.href} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center gap-2 font-semibold text-teal-700 underline decoration-teal-200 underline-offset-4 hover:text-solar-600">
                      {item.label}<ExternalLink size={15} aria-hidden="true" />
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="max-w-2xl space-y-5 text-lg leading-relaxed text-slate-600">
            <SectionHeading kicker="Biography" title="Academic excellence with a practical edge" />
            <p>
Thomas Kivevele holds a PhD and an M.Tech (cum laude) in
              Mechanical Engineering, focused on sustainable energy, from
              Tshwane University of Technology in Pretoria, and a B.Sc. (Hons)
              in Electro-Mechanical Engineering from the University of Dar es
              Salaam. In 2018 he received the Fulbright African Senior Research
              Scholar Award to research biofuels at Baylor University in Texas.
            </p>
            <p>
He joined NM-AIST as a Lecturer in February 2016 and became
              Associate Professor in 2023. He teaches renewable energy
              technologies, passive solar energy systems, refrigeration and air
              conditioning, and energy auditing and management. He leads the
              Clean Energy Technologies Research Group and the Sustainable
              Energy Lab, and served six years on the University Tender Board.
            </p>
            <p>
His work spans energy research programmes supported by the World
              Bank, the European Union and other partners. This site lists 116
              journal articles and six registered
              patents covering solar dryers, a solar vaccine cooler and a biogas
              burner assembly. He was named NM-AIST's Best Innovator of the Year
              for 2020/21 and Best Worker of 2019/2020 among academic staff.
            </p>
            <p>
His consultancies include energy-efficient irrigation for the
              Tanzania Horticultural Association, a bio-digester and wetland for
              the Lake Victoria Environmental Management Programme, the 2024
              Africa Energy Market Place for the African Development Bank, and
              waste-to-energy and rice husk valorisation projects for UNIDO.
            </p>
          </div>
        </div>
      </section>

      <section id="supervision" className="section scroll-mt-24 bg-paper">
        <div className="container-site grid gap-8 rounded-3xl bg-white p-8 shadow-card md:grid-cols-[1fr_auto] md:items-center md:p-12">
          <div>
            <SectionHeading kicker="Student supervision" title="Supporting graduate researchers">
              Graduate supervision is available in sustainable energy research. Prospective students should confirm current openings and programme requirements directly with NM-AIST. Student names and personal records are not published here.
            </SectionHeading>
          </div>
          <a href={institutionalLinks[0].href} target="_blank" rel="noopener noreferrer" className="btn-outline">NM-AIST staff profile <ExternalLink size={16} aria-hidden="true" /></a>
        </div>
      </section>

      <section className="section bg-paper">
        <div className="container-site grid gap-14 lg:grid-cols-2">
          <div>
            <SectionHeading kicker="Education" title="Qualifications" />
            <ol className="mt-10 space-y-5">
              {education.map((e) => (
                <li key={e.degree} className="rounded-2xl border border-slate-200 bg-white p-6">
                  <p className="font-display text-2xl font-semibold text-solar-600">{e.year}</p>
                  <h3 className="mt-2 font-sans text-lg font-semibold text-ink">{e.degree}</h3>
                  <p className="mt-1 text-slate-600">{e.school}</p>
                </li>
              ))}
            </ol>
          </div>
          <div id="career" className="scroll-mt-24">
            <SectionHeading kicker="Career" title="Professional experience" />
            <ol className="relative mt-10 space-y-7 border-l-2 border-teal-100 pl-8">
              {career.map((c) => (
                <li key={c.period + c.role} className="relative">
                  <span className="absolute -left-[41px] top-1 h-4 w-4 rounded-full border-4 border-paper bg-teal-600" aria-hidden="true" />
                  <p className="text-sm font-semibold text-teal-600">{c.period}</p>
                  <h3 className="mt-1 font-sans text-lg font-semibold text-ink">{c.role}</h3>
                  <p className="text-slate-600">{c.org}</p>
                </li>
              ))}
            </ol>
            <p className="mt-6 text-sm leading-relaxed text-slate-500">For the current director role and institutional listing, see the <a href={institutionalLinks[1].href} target="_blank" rel="noopener noreferrer" className="font-semibold text-teal-700 underline decoration-teal-200 underline-offset-4 hover:text-solar-600">NM-AIST Research and Innovation Directorate</a>.</p>
          </div>
        </div>
      </section>

      <section className="section bg-white">
        <div className="container-site">
          <SectionHeading kicker="National service" title="Advising government and development partners" />
          <ul className="mt-12 grid gap-5 md:grid-cols-2">
            {service.map((s) => (
              <li key={s.text} className="flex gap-5 rounded-2xl border border-slate-200 p-6">
                <span className="shrink-0 font-display text-xl font-semibold text-teal-600">{s.year}</span>
                <p className="leading-relaxed text-slate-600">{s.text}</p>
              </li>
            ))}
          </ul>
          <p className="mt-6 text-sm leading-relaxed text-slate-500">Selected consultancy and project records are also listed on the <a href={institutionalLinks[0].href} target="_blank" rel="noopener noreferrer" className="font-semibold text-teal-700 underline decoration-teal-200 underline-offset-4 hover:text-solar-600">NM-AIST institutional profile</a>.</p>
        </div>
      </section>

      <section id="patents" className="section scroll-mt-24 bg-ink text-white">
        <div className="container-site grid gap-14 lg:grid-cols-2">
          <div>
            <SectionHeading kicker="Speaking" title="Keynotes and invited lectures" light />
            <ul className="mt-10 space-y-5">
              {talks.map((t) => (
                <li key={t.title} className="flex gap-4 rounded-2xl bg-white/5 p-6 ring-1 ring-white/10">
                  <Mic size={22} className="mt-1 shrink-0 text-solar" aria-hidden="true" />
                  <div>
                    <p className="font-display text-xl leading-snug">“{t.title}”</p>
                    <p className="mt-2 text-sm text-white/65">{t.where}, {t.year}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <SectionHeading kicker="Intellectual property" title="Registered patents" light>
              Six registered technologies developed for energy access, agricultural processing and sustainable materials.
            </SectionHeading>
            <ol className="mt-10 space-y-4">
              {patents.map((patent) => (
                <li key={patent.number} className="rounded-2xl bg-white/5 p-5 ring-1 ring-white/10">
                  <p className="text-sm font-semibold text-solar-400">{patent.year} · {patent.number}</p>
                  <h3 className="mt-2 text-lg font-semibold leading-snug">{patent.title}</h3>
                  <a href="https://bos.brela.go.tz/" target="_blank" rel="noopener noreferrer" className="mt-3 inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-white underline decoration-solar underline-offset-4 hover:text-solar-400">Look up this patent number in the BRELA portal <ExternalLink size={14} aria-hidden="true" /></a>
                </li>
              ))}
            </ol>
            <Link to="/projects" className="btn-ghost-light mt-8">Explore the related research projects</Link>
            <Link to="/contact" className="btn-solar mt-4">Invite him to speak</Link>
          </div>
        </div>
      </section>
    </>
  );
}
