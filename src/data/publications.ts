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
  const escape = (value: string) => value.replace(/[\\{}#$%&_~^]/g, (character) => ({
    "\\": "\\textbackslash{}",
    "{": "\\{",
    "}": "\\}",
    "#": "\\#",
    "$": "\\$",
    "%": "\\%",
    "&": "\\&",
    "_": "\\_",
    "~": "\\textasciitilde{}",
    "^": "\\textasciicircum{}",
  })[character] ?? character);
  return records
    .map((p) => {
      const type = p.type === "Journal article" ? "article"
        : p.type === "Conference paper" ? "inproceedings"
          : p.type === "Book chapter" ? "incollection" : "misc";
      const venueField = type === "article" ? "journal" : type === "inproceedings" || type === "incollection" ? "booktitle" : "note";
      const fields = [
        `  title = {${escape(p.title)}}`,
        `  author = {${escape(p.authors.replace(/,?\s*&\s*/g, " and ").replace(/,\s+(?=[A-Z][A-Z-]+,\s)/g, " and "))}}`,
        `  year = {${p.year}}`,
        ...(p.venue ? [`  ${venueField} = {${escape(p.venue)}}`] : []),
        ...(p.doi ? [`  doi = {${p.doi}}`] : []),
        ...(p.url ? [`  url = {${escape(p.url)}}`] : []),
      ];
      return `@${type}{${p.id},\n${fields.join(",\n")}\n}`;
    })
    .join("\n\n");
}
