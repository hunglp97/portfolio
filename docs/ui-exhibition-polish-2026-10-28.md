# HLP Data: an inspection exhibit

The owner's feedback was that the first refresh still lacked visual impact. The central
problem was composition: a small Anatomy widget had the same visual weight as ordinary
page furniture. This revision stages the working model as an exhibit and gives the site
a more decisive typographic scale.

## Art direction

Direction: **Dressed as something else**, seed **1449454481**. Borrowed category: a science
museum exhibition. The existing brand palette and typefaces are retained. The previous
quiet direction is replaced because the owner explicitly asked for a more striking result.

Idea: HLP's published field completeness becomes a physical bench that visitors operate
before choosing a snapshot. The headline, live model, sample evidence and printed sheets
all support the same act of inspection. No invented customer work or stock imagery is used.

## What visitors see and do

- A two-line, poster-scale headline and a full-width working bench, with a tighter SVG
  frame. Measured first-viewport SVG coverage increases from 11% to 21% at 1440px.
- Four native field buttons with actual fill-rate bars. Clicking a physical tray selects
  that field too; arrows, Home and End operate the focused drawing. Each input updates
  the scanner, selected tray, button state, accessible value and explanation together.
- A static, disabled drawing and source explanation when JavaScript is unavailable.
- An editorial catalog without a stack of filled dataset cards; search, sorting, prices,
  comparisons and sample actions remain explicit.
- Real first-page PDF previews. Focusing or hovering a format's download link changes the
  preview and its open-PDF destination. A short crossfade follows reduced-motion settings.
- A larger custom-data invitation and a shared HLP DATA wordmark at the end of all 24 pages.

The preview PNGs are generated from the published PDF bytes by `scripts/preview_guides.mjs`.
Run it after reprinting. The three preview images total about 395 KB and are loaded lazily;
the additional format previews load when requested. The geometry remains a 63-solid SVG
with no WebGL or framework dependency.

## Verification

- Site synchronization and source lint: 24 pages clean, version `20261028c`.
- Existing browser matrix: 144 page checks and 14 interaction checks pass, covering three
  viewport sizes and both themes. The targeted homepage review was repeated after the
  tablet layout correction.
- New interactions: 78 checks pass at 1440, 768 and 390px in both themes. These exercise
  actual pointer clicks on all four SVG trays, keyboard selection, touch target sizes,
  preview selection and console errors.
- Additional 320px check: no horizontal overflow and a two-line headline.
- Preview motion: crossfade starts and finishes; changing to reduced motion cancels it
  and shows the selected document. A browser test caught a problem with a Web Animations
  version; CSS animation now follows the site's global motion policy and passes.
- Anatomy audit reports zero problems over 63 solids and 13 motion states. Line checks
  report zero floating ends for every field in both themes.
- Homepage and catalog browser inspectors report zero FAIL at all three viewports.
- Existing PDFs, checkout destinations and public sample data are read back separately
  after deployment. No payment or form submission is made during QA.

Evidence is retained in the task's `hlpdata-audit/` folder: `whoa-final-3/`, `whoa-catalog/`,
`whoa-qa/`, `whoa-interactions/`, `whoa-motion.json` and the Anatomy line-check captures.
The first local matrix run encountered a preview-server navigation timeout; it was rerun
after restarting the local server with quiet request logging and completed successfully.

## Final critique

ROUND 3

Seen in one second: “Know your data”, then a large machine with four inspectable stacks.

Idea (one sentence): let the buyer operate a physical explanation of HLP's published
dataset gaps, then inspect the same evidence in samples and printable plates.

Live thing: selecting a physical tray or a field changes the scanner and the exact rate;
choosing a print format changes the real document preview.

Layout words by section: hero=exhibit / totals=ledger / sample=proof split / catalog=board /
includes=definition spread / guides=print display / insights=paired charts / buying=sequence /
report=band / FAQ=index / custom=large invitation / footer=wordmark.

Scores: design 6.5 · usability 8.5 · creativity 8 · content 8.5 → overall 7.6.

Caps applied: fewer than four real photographs caps design at 6.5. The paper previews are
documents containing drawings, not photographs, regardless of the inspector's image count.
No cap is bypassed by the duplicated image used for the crossfade.

Top three problems (most visible first), each with its screenshot and decision:

1. `whoa-final-3/mobile-page-02.jpg`: the two actual chart panels make a long mobile page.
   They retain their source notes and readable labels. Browse/sample actions are available
   above the exhibit, and the catalog provides the shorter purchase path.
2. `whoa-final-3/desktop-fold.jpg`: the drawing still reads as an explanation, rather than
   a photographed artifact. Its larger scale, four-tone faces and working selector are
   the deliberate visual identity. Photography is not invented to improve the score.
3. `whoa-catalog/mobile-fold.jpg`: the larger store title uses more space than a compact
   working-list title. Filters and the first dataset's sample/purchase actions still fit
   into the first viewport, so the editorial hierarchy is retained.

The 768px hero was corrected after round 2: the headline now leads, with the supporting
copy and actions below it. The unused vertical gap is removed. All listed homepage and
catalog screenshots were opened and reviewed. Remaining inspector warnings concern the
inherited interface/display type scale, the text-bound margin heuristic and the catalog's
intentional larger title. No conversion or sales improvement is established by this review.
