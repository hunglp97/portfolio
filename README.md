# HLP Data — Commercial Web Data Feeds & Market Intelligence Infrastructure

> Production-grade, schema-standardized datasets for hedge funds, market research teams, and business intelligence systems. Delivered via automated Amazon S3 push and REST API.

[![Website](https://img.shields.io/badge/Production-hlpdata.com-00dc82?style=flat-square)](https://hlpdata.com)
[![License](https://img.shields.io/badge/License-Commercial%20B2B-blue?style=flat-square)](https://hlpdata.com/terms.html)
[![Compliance](https://img.shields.io/badge/Data%20Audit-100%25%20Verified-emerald?style=flat-square)](https://hlpdata.com/api.html)

---

## 🌐 Overview

**HLP Data** (`hlpdata.com`) engineers enterprise data pipelines extracting public commercial web intelligence across European real estate, FMCG retail grocery, and global luxury fashion.

All datasets are delivered with:
- **Strict Schema Enforcement**: 100% adherence to standard contracts (`REAL-ESTATE-BASIC`, `GROCERY-PLP`, `FASHION-PDP`).
- **Full Scope Auditing**: Every delivery undergoes 100% census validation — zero placeholder rows, zero interpolated metrics, zero mock values.
- **Enterprise Delivery**: Automated daily/weekly sync to client Amazon S3 buckets or programmatic REST API queries.

---

## 📊 Core Commercial Datasets

| Dataset | Scope | Attributes | Schema | Sample Download |
|:---|:---|:---:|:---:|:---:|
| **[Rightmove UK National Census](https://hlpdata.com/datasets/rightmove-uk.html)** | 544,502 residential sale listings (100% of 3,121 UK outcodes) | 32 cols | `REAL-ESTATE-BASIC` | [Sample CSV](https://hlpdata.com/samples/rightmove_uk_national_sample.csv) |
| **[Idealista Portugal Property Feed](https://hlpdata.com/datasets/idealista-portugal.html)** | 2,640 residential sale listings across 13 Portuguese districts | 32 cols | `REAL-ESTATE-BASIC` | [Sample CSV](https://hlpdata.com/samples/idealista_real_estate_sample.csv) |
| **[Continente Supermarket FMCG](https://hlpdata.com/datasets/continente-portugal.html)** | 11,711 verified grocery SKUs across 10 departmental aisles | 31 cols | `GROCERY-PLP` | [Sample CSV](https://hlpdata.com/samples/continente_grocery_plp_sample.csv) |

---

## 🏛️ Site Architecture & Structure

The site uses static HTML, CSS and browser JavaScript, with no frontend framework or runtime package installation:

```
├── index.html                   # Main commercial portal & business use cases
├── custom-data.html             # Custom extraction inquiry & lead capture
├── api.html                     # Developer docs (REST API & Amazon S3 push)
├── terms.html                   # Commercial licensing & compliance terms
├── privacy.html                 # Privacy policy (public data only, zero PII)
├── datasets/
│   ├── index.html               # Catalog index of all production datasets
│   ├── rightmove-uk.html        # Rightmove UK census detail & SLA fill rates
│   ├── idealista-portugal.html  # Idealista Portugal property feed detail
│   ├── continente-portugal.html # Continente FMCG catalog detail
├── samples/                     # Sanitized public sample CSV files
├── style.css                    # Responsive dark/light theme CSS3 system
├── script.js                    # Trilingual i18n runtime (EN/ES/PT) & modal inspector
├── sitemap.xml                  # Search engine index with full URL hierarchy
└── robots.txt                   # Search crawler directives
```

---

## 🚀 Local Development

To run the site locally for testing:

```bash
# Start a local HTTP server
python3 -m http.server 8000

# Open in browser
open http://localhost:8000
```

Verify script integrity:
```bash
node --check script.js
```

---

## 📬 Commercial Inquiries & Licensing

- **Sales & Feeds**: `sales@hlpdata.com`
- **Data Privacy & Compliance**: `privacy@hlpdata.com`
- **Portal**: [hlpdata.com](https://hlpdata.com)

## UI development and the Anatomy figure

The inspection bench is built with the MIT-licensed Anatomy geometry kit in `vendor/anatomy/`.
The build reads row counts, collection date and four fill rates from the published Idealista
product page. These are published full-snapshot figures, not estimates from the sample and
not a live scan. The figure explicitly distinguishes field completeness from dataset coverage.

```bash
node scripts/build_inspector.mjs --audit
python3 scripts/sync_layout.py
python3 scripts/lint_site.py
node --check script.js
node --check assets/inspector.js
```

Rebuild the figure after changing its source product page. Generated outputs are
`partials/data-inspector.html`, the marked section in `index.html`, and
`assets/inspection-model.json`. Only the generated SVG and a small browser script are sent
to visitors; the geometry/audit modules are build tools. No WebGL or framework is required.

The homepage keeps every dataset row in the source but initially shows a three-item selection.
Using a category filter expands the matching set. The catalog offers full search, category
selection, sorting and the comparison table. Both views retain the existing generated row
markers and class names. Product pages generated by `databoutique-pilot` inherit the same
CSS and JavaScript, including mobile purchase order and section links.

Local browser QA should block Umami, Payhip and form submission. Check 1440, 768 and 390px,
both color schemes, reduced motion, JavaScript disabled, CSV load/error, filters/reset/sort,
menu keyboard behavior and form validation. A local flag remembers that the introductory construction has already been shown.

### Printable Anatomy guides

The figure has a PDF link and the homepage's `#guides` section offers three A4 formats:
poster (1 page), annotated drawing (1 page) and detailed reading guide (2 pages). All three
come from Anatomy's own `scripts/print.mjs` renderer, with the same SVG parts, field model
and working selector as the website. They preserve the snapshot date, published source
and missing-value caveats. They contain vector drawings and selectable text.

```bash
node scripts/print_guides.mjs --png
node scripts/preview_guides.mjs
python3 scripts/sync_layout.py
python3 scripts/lint_site.py
```

Requires Chrome and the installed Anatomy skill at `~/.agents/skills/anatomy`; set
`ANATOMY_HOME` for another installation. No npm packages are required. The wrapper builds
an offline light page from the generated partial, captures four reduced-motion poses,
prints all formats and copies only the PDFs into `downloads/`. HTML and PNG proofs stay in
ignored `tmp/pdfs/`. Inspect every PDF page after regeneration; a successful page-count
check alone does not rule out overlapping content. Reprint after changing the source model.

The PDF icon/link uses Anatomy's MIT-licensed `pdf-button.mjs`. Its CSS is adapted to the
site's external stylesheet and 44px touch targets; no inline style block is shipped.

The exhibition layout makes the bench the main working exhibit. Its four fields can be
selected by the native buttons, by clicking a physical tray, or with arrows/Home/End on
the focused drawing. The original select and a static field summary remain available
when JavaScript is disabled. Automatic motion pauses offscreen and stops under reduced
motion. The guide preview changes when a download link is focused or hovered, with a
short crossfade (an instant change under reduced motion).
The remaining preview images are warmed once the print display approaches the viewport.

### Page-wide cursor construction

The first page opened by a new browser begins as a blank canvas. A colored cursor swarm gathers
around the HLP mark, then draws structural frames and surfaces before adding
content. Cursors drag boxes with dimensions, type real glyphs, enlarge headings,
sweep images into place and drag copies from completed repeated items. The same
renderer builds later sections on scroll, including tables, charts and the footer.
It follows the supplied Swarm Rebuild video reference; the implementation and
pointer artwork are original. No reference-project source is redistributed.

`assets/page-build.js` and `assets/page-build.css` are loaded through the shared
asset partial on all 24 pages. Run `node scripts/package_swarm.mjs` before
`python3 scripts/sync_layout.py` after editing either renderer source; the partial
loads content-hashed release copies so CDN caches cannot mix releases. A short bootstrap guard prevents a flash of the
finished page and releases it within three seconds if the renderer is blocked.
The real DOM keeps its layout, semantics, links, inputs and text throughout.
Temporary inert duplicates are drawing-tool feedback only. Pointer interaction
or keyboard focus reveals the native target and its containing surfaces.

Show full page or Escape reveals everything and ends the introduction. The
`hlpdata:swarm-seen` local flag prevents it from running again on reload, navigation,
new tabs or future visits. The key is independent of the release version. There is
no replay control; returning through the back-forward cache stays static. Tour automatically scrolls after each viewport
finishes; 1× / 2× / 3× changes build speed. There are at most 12 cursors (8 on
phones). Idle agents flock during construction and the entire layer stops when
visible work ends. Backgrounding suspends work. The toolbar moves away from
visible headings and space is reserved below the final footer.

At the owner's explicit request, reconstruction starts automatically even when
an in-app browser reports reduced motion. The browser motion preference is unchanged; only the anonymous introduction-seen
flag is stored locally. If storage is unavailable, the page stays static. JavaScript-disabled and unsupported browsers show the complete static
site; a runtime failure reveals all content. No extension, audio, framework or
new network service is involved. The cursor layer never receives pointer events.

For browser QA, start a local server and run:

```bash
python3 -m http.server 8765 --bind 127.0.0.1
# In a second terminal, with Node 22+ and Chrome installed:
node scripts/qa_page_build.mjs http://127.0.0.1:8765/
node scripts/qa_swarm_render.mjs http://127.0.0.1:8765/
node scripts/qa_first_visit.mjs http://127.0.0.1:8765/
```

The commands use the design-taste-frontend skill's Chrome helper; set
`TASTE_SKILL_HOME` if it is outside `~/.codex/skills/design-taste-frontend`.
External analytics, checkout and fonts are blocked during QA. The interaction
suite covers three widths, both themes and motion preferences, every homepage
section, all 24 routes and native controls. The visual behavior suite records
frame geometry to check blank start, parent-before-child construction, glyph
progress, heading resizing and actual duplicate dragging. Artifacts stay in
ignored `.taste-skill/`. See `docs/swarm-render-2026-11-04.md` for the video
observations, final validation and visual critique. Earlier cursor reports are
historical and describe superseded releases.

`preview_guides.mjs` requires Poppler's `pdftoppm`. It renders the first page of each
published PDF to the three `assets/guide-*.png` files. Run it after reprinting so the
website preview always matches the file being downloaded.
