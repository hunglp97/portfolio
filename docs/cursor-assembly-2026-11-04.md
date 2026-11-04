# Inspection bench cursor assembly

## Scope and reference

The request was to apply the interaction quality of
[swarm-cursors](https://github.com/DhvanilPatel/swarm-cursors) to hlpdata.com.
That repository is a Chrome extension that snapshots a page and stages a visual
rebuild, followed by a return to the real page. Its README credits
[Joel Califa's Swarm](https://califa.github.io/swarm/) for the motion design and
states that permission should be checked before reusing its unlicensed code.

This implementation uses the general idea of cooperating cursors. It contains no
code, cursor assets, DOM snapshotter, extension engine or audio from either project.
The existing static site, branded palette, typography and inspection model remain
the owning design. No direction draw was needed for this bounded component change.

Idea: the four published dataset fields become four cursor workstations assembling
HLP Data's own inspection bench. This is a visual introduction to the existing
published snapshot, not a live collection or validation process.

## Implementation

- The foundation appears first, then four cursors work on the corresponding trays.
  The real heading, metrics, links and native field controls remain available.
- Desktop/fine-pointer introduction: once per page load, 1.6 seconds. Explicit
  Watch/Replay: 3.4 seconds on desktop, tablet and touch. No saved preferences.
- Web Animations handles the 63 existing SVG solids; one finite animation-frame
  loop positions four cursors. Geometry and label widths are measured before the
  sequence, not inside the frame loop. There are no animation dependencies.
- Cursor labels flip horizontally or vertically near the artwork's edges.
- Interaction cancels the sequence immediately. Escape and the Skip button are
  equivalent exits. Offscreen, background, page-exit, resize and preference changes
  cancel animations and clear the frame request. The scanner tour resumes in its
  previous state and still stops when a visitor chooses a field.
- Reduced motion and missing animation support show the finished original figure.
  JavaScript-disabled visitors retain the original illustration, source links and
  static field summary. All decorative cursors are hidden from assistive technology.
- The generator writes the new controls, so rebuilding the bench preserves them.
  The homepage versions the changed inspector script and the two new assets.

## Verification

- `node scripts/build_inspector.mjs --audit`: 63 solids, 13 depth states, no
  geometry, clearance, support or depth-order problems.
- `python3 scripts/lint_site.py`: all 24 pages pass, including shared chrome,
  semantics and local links.
- JavaScript syntax checks pass for both changed browser scripts and the QA runner.
- Design source lint: no failures or warnings in the new animation source/CSS.
- Before and after browser inspection at 1440, 768 and 390px: zero failures and
  three existing warnings. The two-line headline, loaded Inter font and 16px body
  text remain unchanged. Page length is about 9 desktop screens.
- 140/140 interactive browser checks pass in light/dark and normal/reduced motion at all
  three widths, including replay, skip, field interruption, keyboard inspection,
  cancellation cleanup, completion, offscreen cancellation, preference changes and
  JavaScript-disabled fallback. Results and screenshots: `.taste-skill/swarm-qa/`.

The inspector's inherited warnings are the number of font sizes across tables and
charts, the absence of footage, and a 24px measured margin difference. These are
outside the component's scope. The site presents interface/illustration evidence;
adding unrelated photography or footage would not explain the dataset more clearly.
No payment or lead-form submission is part of QA. Browser emulation is not a claim
of physical-device performance or a measured frame-rate guarantee.

## Visual critique

ROUND 1
Seen in one second: the existing two-line data headline, followed by the bench.
Idea (one sentence): the four snapshot fields become cursor workstations assembling
the inspection bench.
Live thing: choose a field to move the scanner; explicitly replay or skip assembly.
Layout words by section: hero=editorial exhibit / sample=split / datasets=list /
details=definition list / guides=print display / insights=charts / buying=steps /
faq=accordion / contact=full field.
Scores: design 6.5 · usability 8.5 · creativity 8.5 · content 8.5 → overall 7.7.
Caps applied: design capped for relying on interface drawings rather than four real
photographs. This is a subjective critique, not a measured user outcome.
Top three problems (most visible first), each with the screenshot it shows in and the fix:
1. Tablet animation labels crossed the artwork edge in the first motion pass
   (`swarm-qa/768-building.jpg`): fixed by flipping labels and assigning cursor jobs
   only to the corresponding trays.
2. The mobile status could wrap differently while replaying (`swarm-after/mobile-fold.jpg`):
   shortened both messages and reserved a stable control-row height.
3. The full mobile page remains long (`swarm-final/mobile-page-01.jpg` and `02`):
   retained the existing tables, charts and disclosures; broader content editing is
   separate from adding this component's motion.

No new found photography, video or third-party art was introduced.
