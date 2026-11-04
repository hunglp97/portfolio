> This full-rebuild release is historical. The current [first-visit policy](swarm-first-visit-2026-11-04.md) overrides its replay and storage behavior.

# Swarm-style progressive page render

## Reference and corrected acceptance

The owner supplied the actual [36.24-second Swarm Rebuild video](https://github.com/DhvanilPatel/swarm-cursors/blob/main/media/demo.mp4).
The video was downloaded for analysis and inspected through a full-duration
2-second frame sheet, a denser first-8-second sheet and full-size frames.
The previous `20261104c` release exposed native blocks with four cursors, which
missed the visual grammar of constructing a page from a blank canvas.

Observed choreography:

- The existing page disappears. Colored cursors gather around the favicon.
- Rulers and alignment guides arrive as the swarm fans out.
- Cursors drag rectangles with growing width/height readouts; a temporary neutral
  placeholder becomes the actual surface or image.
- Text is typed into a drawn box. Large headings begin small and grow in steps.
- Repeated items are selected and dragged from an existing master, then edited.
- Scrolling exposes new work. A Tour control can advance through the page.

The [repository README](https://github.com/DhvanilPatel/swarm-cursors) confirms
that model and credits Joel Califa's [Swarm](https://califa.github.io/swarm-site/)
for the original motion design. This release is an independent implementation.
No source code, pointer art, audio, branding or third-party website content from
those projects is redistributed.

## Implementation

`assets/page-build.js` classifies the native document into structural surfaces,
text, media and controls. The homepage has approximately 407 layers (the exact
count varies with responsive and progressively enabled native controls), rather
than the previous 179 masked content blocks. All 24 routes inherit the renderer
through the existing shared-asset generator, version `20261104e`.

The initial canvas lasts about one second. Twelve colored cursors (eight on
phones) orbit the HLP mark, then draw parent frames before their children.
Surface paint is restored independently of its content. Text masks follow
actual character geometry from DOM Ranges, preserving the browser's wrapping;
headings are scaled after typing. Media is swept into a measured frame.
Repeated text/control records drag a temporary, inert, styled copy of a completed
master before typing their own content. The underlying text and inputs are never
replaced. No screenshot reconstruction or framework migration is used.

The page stays interactive. Pointerdown or keyboard focus releases the relevant
native target and its ancestor surfaces. Alpha masks preserve hit testing.
Offscreen and filtered content starts when it becomes visible. Added native rows
are discovered; removed rows and decorative preview clones are cleaned up. SVG
rig mutations do not cause document rediscovery. The Anatomy scanner pauses only
while its illustration is being placed.

Show full page and Escape finish all layers. Replay page returns the current
viewport to the blank canvas. Tour advances after visible work finishes; speed
cycles through 1×, 2× and 3×. The toolbar chooses a corner away from visible
headings, and footer space is reserved. Backgrounding stops active work; returning
continues it. Back-forward cache restores the sequence. Printing reveals all.

The frame loop stops when visible work ends. Geometry reads are batched; glyph
Ranges are recalculated for reflow, not on every scroll tick. Drawing tools are
removed from hit testing and the render tree when inactive. Dense visible queues
have a bounded waiting fallback. No storage, audio or new service is involved.

## Release asset integrity

Public read-back found stale responses at the old fixed asset paths. The shared
partial now uses physical, content-hashed filenames produced by
`node scripts/package_swarm.mjs`. The source remains `assets/page-build.js` and
`.css`; their release copies are byte-identical. Run the packager before
`sync_layout.py` after changing either source. Existing release copies are retained
for cached HTML. No CDN purge or client cache clearing is required.

## Fallbacks and explicit motion exception

The owner explicitly requires this effect to start on opening the app, including
in browsers reporting reduced motion. That request overrides the usual static
reduced-motion presentation; it does not alter the browser preference. Escape and
Show full page are always available.

A synchronous bootstrap hides the first native frame while the deferred engine
starts. If that script is blocked, a three-second guard releases the complete
native page. Disabled JavaScript, unsupported animation/masking or a runtime
exception leaves or restores the complete page. A native component's decorative
image clone cannot inherit an unfinished construction mask.

## Validation

- `node scripts/qa_page_build.mjs`: **362/362 passed**, full interaction matrix, all sections and all
  24 routes at 1440/768/390, light/dark, both motion preferences; filters, input,
  keyboard, menu, preview, chart and static/error fallbacks.
- `node scripts/qa_swarm_render.mjs`: **39/39 passed**, assertions on actual frame observations,
  including a blank start, parent-before-child draw, changing glyph masks,
  small-to-large headings, unchanged copy, duplicate dragging and skip.
- A further **192/192 route assertions passed** and check immediate Show full page / Escape
  rendering on all 24 routes in both motion modes, including opacity before the
  next animation frame. Skip cancels inherited CSS transitions as well as jobs.
- **9/9 additional lifecycle checks passed** and cover background/foreground, resize, Escape
  and simulated back-forward cache.
- **10/10 additional checks passed**, covering Tour scrolling, stop/restart, speed, a 320px viewport
  and a blocked-engine bootstrap fallback.
- Site lint checks all 24 pages. JavaScript syntax, design source lint and
  `git diff --check` are required before release.

Final screenshots are in ignored `.taste-skill/swarm-final4/`; the unskipped
sequence and geometry traces are in `.taste-skill/swarm-choreography/`.
Finished-page measurement uses the existing local inspector harness with native
Escape before measurement. It retains the owning skill's measurement and judgment
code. The explicitly requested blank/typing phase is separately tested and viewed;
it is not presented as an immediately readable static page. No skill or gate is
modified. The finished-state inspection reports zero failures and three inherited
warnings: type-size count, no footage and a 24px measured margin difference.
These are retained because this change concerns reconstruction choreography,
with the established data, brand and layout kept.

No physical-device frame-rate measurement, form submission or checkout
transaction is claimed.

## Visual critique

ROUND 1
Seen in one second: a colored cursor swarm around the HLP mark on an empty canvas.
Idea (one sentence): the data-inspection website visibly constructs its surfaces,
copy and figures under the visitor's eyes as they move through the page.
Live thing: scroll-to-build, native field inspection and optional automatic Tour.
Layout words by section: hero=exhibit / sample=split table / catalog=list /
features=definitions / guides=print display / insights=charts / buying=steps /
faq=accordion / invitation=full field / footer=columns.
Scores: design 6.5 · usability 7.5 · creativity 7.5 · content 8.5 → overall 7.2.
Caps applied: existing illustration-led content has fewer than four independent
real pictures. The familiar reference choreography is intentionally adopted.
Top three problems (most visible first), each with the screenshot it shows in and the fix:
1. The earlier sequence began with blocks already laid out and only four identical
   cursors. In `swarm-choreography/1440-orbit.jpg` and `1440-draw.jpg`, the replacement
   starts empty and constructs parent frames using a colored swarm.
2. Tool labels and inactive neutral ghosts polluted the finished-page measurements
   and could crowd small rows. `swarm-final4/desktop-fold.jpg` now shows inactive
   tools removed; duplicate dimension labels and zero-size guides were removed.
3. The fixed toolbar can cover running copy or chart details at the screen edge
   (`swarm-final4/mobile-page-02.jpg`). It now moves away from headings and the
   footer can scroll clear. Some overlay remains inherent in keeping controls
   always available. The requested intro also delays reading by a few seconds.

No new photographs, footage, generated assets or sample business content were
introduced. Public deployment and read-back must be verified separately from
these local results.
