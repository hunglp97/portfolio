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
menu keyboard behavior and form validation. The site stores no UI preferences in the browser.

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

`preview_guides.mjs` requires Poppler's `pdftoppm`. It renders the first page of each
published PDF to the three `assets/guide-*.png` files. Run it after reprinting so the
website preview always matches the file being downloaded.
