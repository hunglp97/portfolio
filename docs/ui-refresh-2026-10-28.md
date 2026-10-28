# HLP Data UI refresh, 28 October 2026

Implemented by Codex. The site retains its static HTML/CSS/JavaScript stack and existing commercial destinations.

## Visitor-facing changes

- A working Anatomy inspection bench explains four published Idealista fill rates. Selecting a field moves the scanner and updates the explanation. Its 63 solids represent a physical card inspection bench; stack height encodes completeness. The caption distinguishes field completeness from dataset coverage and a dated snapshot from a live scan.
- The homepage introduces sample inspection before the catalog. It initially displays three products, retaining all generated rows and expanding them when a category is selected. A direct sample download appears in the first phone screen.
- Catalog search, filter and result count now sit together with sorting by date, records or price. Phone filters use a select instead of several rows of chips. Price and sample actions precede description and statistics on phones.
- Product and monthly-report purchase actions precede metrics on phones. A native disclosure preserves the full included-items list. Dataset section links jump to sample, schema, limits and licence.
- The custom request form starts with the website and fields needed, followed by contact information. Optional delivery, timing, budget and notes are grouped in a disclosure. Field names, required rules, anti-spam inputs and server action are preserved. Inline errors are associated with their inputs; native required-field validation remains available without JavaScript.
- API and prose pages receive section links. Code blocks have copy/select feedback. Wide tables retain their full data and get a scroll hint and keyboard focus region.
- Shared styles use readable labels, tabular figures, flat surfaces, consistent corners and spacing. Navigation works without JavaScript; with JavaScript, Menu supports Escape, outside click and link selection. Both system themes and reduced motion are supported without storing preferences.

## Design decision

Direction: **The product performs**, seed **949656452**, with the existing navy/blue/teal palette and Inter retained. The site's own material is its inspectable, dated dataset; this becomes a bench where the visitor chooses a field and reads its published completeness. Real samples remain next to the illustration further down the page.

The dealt narrow, mostly empty hero and logo tiles were unsuitable for the real sample evidence and available assets. The actual hero follows the direction's main composition: clear claim on one side, a working demonstration on the other. No customer logos, photography, testimonials or performance claims were invented.

## Validation

- `python3 scripts/lint_site.py`: all 24 main-site pages clean, shared assets `20261028a`.
- JavaScript syntax checks for `script.js`, `assets/inspector.js` and the build script pass; Git whitespace check clean.
- Full local browser matrix: 24 pages × 1440/768/390px × light/dark = **144 page checks**, with no JavaScript exceptions, broken visible images, multiple/missing h1 or horizontal page overflow. Every h1 remained at two lines or fewer. All mobile purchase actions measured before 780px.
- **14 behavioral checks** pass: homepage selection expansion; four inspector field values; mobile menu/Escape/focus; catalog filter/no-results/reset/sort; invalid-form blocking/focus; server-error rendering; real CSV preview; mobile purchase disclosure; API tools; automatic tour progression; offscreen suspension; no-JavaScript fallback.
- An intentionally blocked CSV request displays the failure explanation and retains a usable download link. No form was submitted and no checkout or payment was performed.
- Anatomy geometry audit: **0 failures**, including support, sinking, depth order and movement checks over 13 sampled positions. Line-end checks: **0 floating ends** in each of four resting positions in both themes. All generated screenshots and the two 4× detail views were opened. Rebuilding the figure is deterministic. Scanner bounds are checked against the SVG viewBox at all four fields.
- Product generator compatibility: existing marked row/compare blocks and purchase links are unchanged. The actual `refresh_hero_facts` function reconciles the new homepage and correctly updates totals/count in a simulated added-product case. Existing product-page class contracts remain intact; no generator fork or backend change was necessary.

The local QA server removes Umami and Payhip scripts. Evidence is saved in the chat artifact directory under `hlpdata-audit/`: `after-home/`, `after-catalog/`, `refresh-qa/`, and `inspector-*.png`. Production verification is recorded separately after release.

## Rendered design review

The page inspector reports **0 FAIL** for homepage and catalog at 1440/768/390. The catalog is evaluated as a working list. The homepage allows `few-pictures`, `no-footage` and `icon-cards`: real tables and the custom working illustration are the evidence; dataset rows with download icons are not icon-topped feature cards. No imagery is being passed off as customer work.

Remaining warnings are understood: the homepage uses interface evidence rather than photography; the text-bounds detector measures unequal terminal text extents although the common container's left/right outer margins match; the catalog intentionally scrolls through 13 products rather than shrinking them all into the first screen. The source-pattern linter still flags legacy selector names and inactive declarations, code font configuration and licensed Anatomy CSS; this is not reported as a clean source-pattern lint.

ROUND 3

Seen in one second: the inspection claim and a physical scanner over stacks of data cards.

Idea (one sentence): inspecting the completeness of a dated file becomes an interactive desktop inspection bench.

Live thing: select one of four fields to read its published completeness; search, filter and sort the actual catalog.

Layout words by section: hero=working split / sample=proof split / catalog=short list / includes=definition list / insights=paired charts / buying=sequence / report=band / FAQ=split accordion / custom=action band.

Scores: design 6.5 · usability 8 · creativity 7.5 · content 8 → overall 7.3.

Caps applied: design is capped at 6.5 by the skill's photography rubric; SVG drawings do not count as photographs. This is a design review, not a conversion measurement or accessibility certification.

Top three remaining limitations, each with the screenshot it shows in and the decision:

1. `after-home/tablet-fold.jpg`: the detailed figure uses more vertical space when stacked. Kept at a readable size, with a direct free-sample action above it.
2. `after-catalog/mobile-page-02.jpg`: the full comparison table scrolls horizontally inside its frame. Its hint and focusable region expose all columns without losing data.
3. `after-home/mobile-page-02.jpg`: analytical charts and FAQ make the page longer. These are real evidence and purchasing answers; no repeated full catalog is placed ahead of them.

## Maintenance and limits

Run `node scripts/build_inspector.mjs --audit` when updating the source product's published statistics, then sync layout and lint. The figure is generated from that page; it is not an independent dataset audit. Existing prices, coupons, licence terms, sample files and payment destinations have not changed. No claim of improved conversion, Lighthouse score, full dataset accuracy or successful live payment is established by this work.

The main business site is the 24 pages managed by `scripts/sync_layout.py`. The standalone SQL sample explorer and unrelated Delta Force utility retain their separate interfaces.
