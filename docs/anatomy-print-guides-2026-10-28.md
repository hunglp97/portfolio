# Anatomy printable guides and UI finishing

The existing site refresh remains the base: 24 shared-layout pages, mobile purchase and
sample actions, catalog filtering/sorting, readable schemas, form validation and accessible
navigation. This change adds the requested paper counterpart to the working inspection bench.

## Result

- Three public A4 PDFs in `downloads/`: poster (1 page), drawing (1 page), detailed (2 pages).
- A native PDF link on the Anatomy figure and a homepage `#guides` section with file type,
  paper size and page count. The shared footer links to the guides from all 24 pages.
- The selected tray now gains a stronger edge, matching the selector and readout.
- All PDF access works without JavaScript. No account, form or email is required.
- Cache version `20261028b` updates shared styles and scripts.

## Rendering and provenance

`scripts/print_guides.mjs` invokes the installed Anatomy's actual `scripts/print.mjs`.
`scripts/inspection-sheet.mjs` defines four selector poses, part selectors, pin positions,
close-ups, source notes and explanatory steps. It reads the same generated model as the
live figure. The wrapper creates an offline light page from the generated partial and
the site's interaction script, avoiding third-party checkout, analytics and font requests.

The full-snapshot figures come from the published Idealista product schema: 101,868 rows,
2026-09-25, asking price 100%, price per square metre 100%, parking advertised 53.7% and
floor 42.9%. Each PDF identifies the source and date. The illustration does not independently
audit the file or establish market coverage. Missing parking is not confirmed absence.

The PDFs use vector drawing commands and selectable text. The paper layout follows Anatomy's
black-and-white sheet system. The web link reuses Anatomy's PDF button markup and icon, with
external site CSS for typography, keyboard focus and 44px touch targets.

## Validation

- Anatomy geometry audit: 63 solids, 13 depth states, zero reported problems.
- Site layout synchronization and lint: 24 pages clean.
- Browser matrix: 24 pages x 3 widths x 2 themes = 144 checks; 14 existing interactions pass.
- Final homepage browser inspector: zero FAIL at 1440, 768 and 390px.
- Print renderer: expected 1 / 1 / 2 A4 page counts. Poppler renders are visually reviewed,
  including every page and the small annotated stills. A first poster proof had a crowded
  metric column; four field metrics now form two rows, with row count in the lead.
- PDF and new guide interactions are checked separately, including byte comparison, MIME,
  reduced motion, selected-tray consistency, anchor clearance and access without JavaScript.
- No live payment or form submission is made during QA.

Source-lint exceptions are limited to existing functional dataset metadata, the retained
brand/code font request and unused Anatomy kit typography tokens. Warnings for `seamless`
refer to kit CSS attribute names, not published marketing copy. The PDF control's outline
is a functional button boundary. No lint rule is disabled.

Evidence is retained under the task's `hlpdata-audit/` workspace: `pdf-home-final/`,
`pdf-refresh-qa/`, `guide-qa/`, and `pdf-qa/`. Public readback is recorded after deployment.

## Final visual review

ROUND 2 (print additions; existing direction retained)

Seen in one second: a clear invitation to inspect the data, beside the working bench.

Idea (one sentence): make dataset completeness inspectable, then let the buyer keep the
same explanation on paper.

Live thing: select a field and move the bench's scanner; filter real datasets and inspect
actual sample rows. The PDF is a static companion to that interaction.

Layout words by section: hero=working split / sample=proof split / catalog=short list /
includes=definition list / guides=editorial index / insights=paired charts / buying=sequence /
report=band / FAQ=split accordion / custom=action band / footer=directory.

Scores: design 6.5 · usability 8 · creativity 7.5 · content 8 → overall 7.3.

Caps applied: fewer than four real photographs caps design at 6.5. Actual data, diagrams
and samples serve the product; decorative stock photography is not added to raise a score.

Top three problems (most visible first), each with the screenshot and decision:

1. `pdf-home-final/tablet-fold.jpg`: the stacked bench extends beyond the first fold. The
   primary browse and sample actions remain visible above it; retain the readable controls.
2. `pdf-home-final/mobile-page-01.jpg`: real sample tables and charts make the page long.
   Keep only three dataset rows initially, with direct catalog and sample actions above.
3. `pdf-home-final/desktop-fold.jpg`: the drawing is compact compared with the headline.
   Keep all four scanner positions inside the frame and all controls in the first desktop
   viewport. The downloadable vector sheets provide a larger inspection surface.

Remaining inspector warnings: ten text sizes from the established site/interface scale,
no real photographs and a text-bound margin heuristic. Container edges align in the reviewed
screenshots. This is a functional and visual release, not a measured conversion improvement.
