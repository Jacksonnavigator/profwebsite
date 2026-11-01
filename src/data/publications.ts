import raw from "./publications.json";
export type Publication = {
  id: string;
  type:
    | "Journal article"
    | "Conference paper"
    | "Conference talk"
    | "Book chapter"
    | "Thesis";
  year: number;
  text: string;
  doi: string | null;
  authors: string;
  title: string;
  venue: string;
  url?: string;
};
export const publications = (raw as Publication[])
  .slice()
  .sort((a, b) => b.year - a.year);
export function bibtex(records: Publication[]) {
  const escape = (value: string) =>
    value.replace(/\\/g, "\\textbackslash{}").replace(/[{}]/g, (c) => `\\${c}`);
  return records
    .map(
      (p) =>
        `@${p.type === "Journal article" ? "article" : "misc"}{${p.id},\n  title = {${escape(p.title)}},\n  author = {${escape(p.authors)}},\n  year = {${p.year}},\n  note = {${escape(p.venue)}}${p.doi ? `,\n  doi = {${p.doi}}` : ""}\n}`,
    )
    .join("\n\n");
}
