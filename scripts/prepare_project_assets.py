"""Build responsive project photo grids and CV-sourced project detail data."""

from __future__ import annotations

import json
import re
import shutil
from pathlib import Path

from docx import Document
from PIL import Image, ImageOps


ROOT = Path(__file__).resolve().parents[1]
PICTURES = ROOT / "pictures"
CV = Path(r"C:\Users\fivia\Downloads\Prof. Kivevele TT-CV.docx")
PUBLIC = ROOT / "public" / "images" / "projects"

ALBUMS = [
    {
        "id": "solar-biogas-hybrid-dryer-for-agricultural-products",
        "name": "Solar-biogas hybrid dryer",
        "folders": [
            PICTURES / "photos ARISE-PP Poject" / "photos ARISE-PP Poject",
            PICTURES / "photos ARISE-PP Poject" / "photos ARISE-PP Poject" / "solar-biogas dryer",
            PICTURES / "photos ARISE-PP Poject" / "photos ARISE-PP Poject" / "second dryer",
        ],
    },
    {
        "id": "solar-dryer-integrated-with-energy-storage-for-drying-biomaterials",
        "name": "Solar dryer with thermal energy storage",
        "folders": [PICTURES / "Solar dryer integrated with energy storage for drying biomaterials"],
    },
    {
        "id": "solar-assisted-heat-pump-dryer-with-energy-storage",
        "name": "Solar-assisted heat-pump dryer",
        "folders": [PICTURES / "Solar-assisted heat pump dryer with energy storage" / "Event Photos"],
    },
    {
        "id": "solar-powered-cooler-for-vaccines-and-perishable-food-in-remote-areas",
        "name": "Solar-powered cooler project",
        "folders": [PICTURES / "kickoff meeting PASET RSIF Mozambique" / "kickoff meeting PASET RSIF Mozambique"],
    },
]

# CV project-table row number (excluding its header), matching project title,
# and the title's stable match phrase in the website project records.
CV_MATCHES = [
    (1, "LEAP-ENERGY PLUS", "leap energy plus"),
    (2, "SUNRISE", "sunrise"),
    (3, "Empowering Marginalized Tanzanian Youth", "clean energy skills"),
    (4, "Enhancing Supercritical Water Gasification", "supercritical water gasification"),
    (5, "Embodied energy", "embodied energy"),
    (6, "Solar-biogas hybrid system", "solar biogas hybrid"),
    (7, "Solar-powered cooler", "solar powered cooler"),
    (8, "Solar dryer integrated with energy storage", "solar dryer integrated with energy storage"),
    (9, "Exploiting the potential of underutilized plants", "underused plants"),
    (10, "ERASMUS+ KA 107 Mobility project", "tu dresden"),
    (11, "Solar-assisted heat pump dryer integrated", "solar assisted heat pump dryer with energy storage"),
    (12, "Linking East and West African farming systems", "ewa belt"),
    (13, "ERASMUS+ KA 107 Mobility project", "budapest"),
    (14, "Solar-assisted Heat Pump Drying Technology", "solar assisted heat pump drying for industry"),
    (15, "Evaluation of suitability of water hyacinth", "water hyacinth from lake victoria"),
    (16, "Establishing a Graduate School of Nuclear Science", "graduate school of nuclear"),
    (17, "DAMOC Project", "damoc"),
    (18, "Assessment of local rice husk value chains", "rice husk value chains"),
    (19, "Facilitation of Capacity-Building Workshops", "waste to energy capacity building"),
    (20, "African center of Excellence in Water Infrastructure", "wise futures"),
]


def normalized(value: str) -> str:
    value = value.casefold().replace("–", "-").replace("—", "-")
    return re.sub(r"[^a-z0-9]+", " ", value).strip()


def image_files(folder: Path) -> list[Path]:
    allowed = {".jpg", ".jpeg", ".png", ".webp"}
    return sorted(
        (
            path
            for path in folder.glob("*")
            if path.is_file()
            and path.suffix.casefold() in allowed
            and "__macosx" not in {part.casefold() for part in path.parts}
            and not path.name.startswith("._")
        ),
        key=lambda path: (str(path.parent).casefold(), path.name.casefold()),
    )


def webp_variants(source: Path, destination: Path) -> None:
    with Image.open(source) as image:
        image = ImageOps.exif_transpose(image).convert("RGB")
        for width in (480, 960, 1600):
            scaled = image.copy()
            scaled.thumbnail((width, width * 2), Image.Resampling.LANCZOS)
            scaled.save(destination.with_name(f"{destination.stem}-{width}.webp"), "WEBP", quality=80, method=6)


def build_albums() -> list[str]:
    project_photos: dict[str, list[dict[str, str]]] = {}
    summaries: list[str] = []
    for album in ALBUMS:
        sources = [path for folder in album["folders"] for path in image_files(folder)]
        album_dir = PUBLIC / album["id"]
        if album_dir.parent.resolve() != PUBLIC.resolve():
            raise ValueError(f"Unsafe generated album directory: {album_dir}")
        if album_dir.exists():
            shutil.rmtree(album_dir)
        album_dir.mkdir(parents=True, exist_ok=True)
        entries = []
        for number, source in enumerate(sources, start=1):
            name = f"{number:03d}"
            destination = album_dir / name
            webp_variants(source, destination)
            entries.append({"number": number, "alt": f"{album['name']} project photograph {number}"})
        project_photos[album["id"]] = entries
        summaries.append(f"{album['name']}: {len(sources)} photos")

    lines = [
        'import type { Photo } from "./images";',
        "",
        "export type ProjectAlbumImage = { photo: Photo; caption?: string };",
        "const projectPhoto = (project: string, number: number, alt: string): Photo => ({",
        '  src: (width) => `/images/projects/${project}/${String(number).padStart(3, "0")}-${width <= 480 ? 480 : width <= 960 ? 960 : 1600}.webp`,',
        "  alt,",
        "});",
        "",
        "export const projectPhotos: Record<string, ProjectAlbumImage[]> = {",
    ]
    for project_id, entries in project_photos.items():
        lines.append(f'  "{project_id}": [')
        for entry in entries:
            alt = json.dumps(entry["alt"], ensure_ascii=False)
            lines.append(f'    {{ photo: projectPhoto("{project_id}", {entry["number"]}, {alt}) }},')
        lines.append("  ],")
    lines.extend(["};", ""])
    (ROOT / "src" / "data" / "projectPhotos.ts").write_text("\n".join(lines), encoding="utf-8")
    return summaries


def build_cv_details() -> int:
    table = Document(CV).tables[10]
    rows = table.rows
    records = []
    for row_number, cv_title, match in CV_MATCHES:
        cells = [cell.text.replace("\n", " ").strip() for cell in rows[row_number].cells]
        description, value, duration, achievements = cells
        if normalized(cv_title) not in normalized(description):
            raise ValueError(f"CV row {row_number} did not match {cv_title!r}")
        bullets = [item.strip().strip(".; ") for item in achievements.split(";") if item.strip().strip(".; ")]
        records.append({"match": normalized(match), "description": description, "value": value, "years": duration, "outcomes": bullets})

    lines = [
        "export type CvProjectDetail = { match: string; description: string; value: string; years: string; outcomes: string[] };",
        "export const cvProjectDetails: CvProjectDetail[] = [",
    ]
    for record in records:
        lines.append("  {")
        for key in ("match", "description", "value", "years"):
            lines.append(f"    {key}: {json.dumps(record[key], ensure_ascii=False)},")
        lines.append("    outcomes: [")
        lines.extend(f"      {json.dumps(item, ensure_ascii=False)}," for item in record["outcomes"])
        lines.extend(["    ],", "  },"])
    lines.extend(["] satisfies CvProjectDetail[];", ""])
    (ROOT / "src" / "data" / "projectCvDetails.ts").write_text("\n".join(lines), encoding="utf-8")
    return len(records)


if __name__ == "__main__":
    print("Built photo grids:", "; ".join(build_albums()))
    print(f"Imported full CV project descriptions and achievements for {build_cv_details()} records")
