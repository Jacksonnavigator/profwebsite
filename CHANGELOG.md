# Project photography - 29 October 2026

- Added an individual detail page for every project. The project list now links directly to each page, which holds the project's funder, value, role, period, outcomes and matching photo grid together.
- Put all 237 supplied photos from the four matching project folders into their respective project detail grids: 49 solar-biogas, 70 thermal-storage dryer, 80 heat-pump dryer, and 38 PASET cooler-event photographs. Generated 480px and 960px WebP variants (474 files) for responsive loading.
- Imported all 20 project descriptions, grant values, periods and achievement lists from the attached CV. The original CV project descriptions are shown on each project detail page; achievements and exact CV values/periods populate the project information.
- Captions identify event/documentation images; the second hybrid drying unit is not presented as the same model as the primary unit.
- Expanded PI and Co-PI in the project page copy, and added a sticky gallery companion in the left column with a live image preview, progress indicator and previous/next photo controls.
- Made every project photo open in a keyboard-accessible full-screen viewer with 1600px images, Escape to close, arrow-key navigation and direct previous/next controls. Sidebar navigation now advances its active-photo state before scrolling to the selected image.

# Original-source design restoration

The originally supplied website is now the design baseline. Fraunces and Plus Jakarta Sans are restored and bundled locally; original theme/base CSS are byte-identical. Original templates/grid/hero/portrait sizes/section order are restored. Earlier redesign/layout changes recorded below are superseded.

# Website fixes — 27 October 2026

## Content reconciliation

Source: CV supplied by the user, signed 19 October 2026. The CV itself has summary/table conflicts, resolved conservatively:

- Employment: use the detailed employment table — MUST Nov 2015–Jan 2016, NM-AIST Lecturer Feb 2016–May 2020, Senior Lecturer Jun 2020–Aug 2023, Associate Professor Sep 2023–present, Director Aug 2024–Jul 2027. Removed the conflicting 2015 NM-AIST joining claim.
- Awards: use the detailed awards table — Best Innovator 2020/21.
- Supervision: 19 MSc and 29 PhD entries include ongoing work. Removed the assertion that all 48 are graduates. No student identities or identifiers are published.
- Publications: display the actual 116 journal records in the 133-record library, rather than using the CV summary's broader “120+” claim as a library count. Existing deduplicated record set retained; two malformed/truncated DOIs normalized from the CV. Original citation text remains available.
- Patents: detailed patents section lists six registrations; retained six rather than the older summary paragraph's four. Added a patents section with numbers exactly as supplied.
- Funding: removed the ambiguous aggregate “funding secured” headline. Kept per-project figures, consortium totals, centre budgets and institutional shares clearly distinguished; did not sum currencies or attribute entire consortium budgets personally.
- Projects: restored the omitted TWAS water-hyacinth project (2018–2019) and separated the two Erasmus mobility grants previously merged. Now 20 entries, 7 running and 13 completed as of the CV review date. Updated COSTECH and DAMOC budget details and UNIDO date ranges from the detailed records.
- Cooling research: removed wording implying −10 °C is appropriate for vaccines generally. The research prototype's reported temperature is retained only as an application-specific result requiring storage validation.
- Experience: replaced hard-coded “sixteen years” with a career beginning in 2007, without inventing continuity across gaps in the employment record.

## Interface and accessibility

Visible personal name and role; naturally wrapping static hero headline; mobile slideshow controls; autoplay off by default; explicit pause persists across hover/focus changes; live reduced-motion handling; static partner list; improved contrast; required labels and stable error associations; menu focus restoration; route-change focus; shorter selected homepage content; smaller portrait presentation; precise project anchors/details.

## Research discovery

Structured publication fields replace runtime citation parsing. Fifteen results per page, persistent/shareable search parameters, always-available clear filters, original citations, descriptive publisher links, and filtered BibTeX export. Ongoing project disclosure says “project details,” not “results.”

## Contact

Clearly labelled email-draft workflow, direct-email and clipboard fallbacks, length limits and privacy explanation. No backend delivery or false “sent” state. A delivery service requires separate configuration.

## Build, SEO, dependencies and privacy

Updated Vite, router, PostCSS and related tooling; ESLint and browser/axe tests added. Five prerendered pages and a real local 404; per-route metadata, social PNG, Person structured data, domain-aware canonical/sitemap generation, local optimized images, local/system fonts, public privacy-minimized academic profile, security-header templates and deployment documentation.

## Still requires real-world inputs/verification

- Set the actual production SITE_URL and rebuild; no domain was supplied.
- Use a hosting account and verify production TLS, headers, cache, deep links and 404 status. Nothing was deployed from this task.
- Supply approved high-resolution portrait and real project photos if desired. The original portrait is resolution-limited; stock photographs remain explicitly illustrative.
- Confirm public image/contact permissions and manually review scholarly metadata/DOI destinations. All 112 nonempty DOI links redirected successfully at doi.org during local review after correction; this does not verify publisher metadata, full-text access or clinical validation.
- Real-device/browser, screen-reader and field performance checks remain release checks; automated local results are not a certification.
