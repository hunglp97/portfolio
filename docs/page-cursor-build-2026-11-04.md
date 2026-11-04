> Historical release `20261104c`, superseded by [the video-based renderer](swarm-render-2026-11-04.md).

# Page-wide cursor construction

## Corrected scope

The owner clarified that the reference meant each part of the whole page should
be progressively built by cursors. The earlier implementation only assembled the
Anatomy exhibit and therefore did not meet that scope. This release replaces it
with one shared construction engine on all 24 published routes.

The concept is inspired by [swarm-cursors](https://github.com/DhvanilPatel/swarm-cursors)
and its credited [Swarm reference](https://califa.github.io/swarm/). No source code,
cursor art, snapshot engine or audio from those unlicensed projects is included.
The rendering, task scheduler, cursor paths and pointer shapes here are original.

## Behavior

- The native heading is typed line by line while other cursors draw the controls.
  Media expands from a drawn corner; tables, dataset facts, list rows and charts
  appear as repeated placements. Header and footer are included.
- New sections begin as they enter the viewport. Hidden catalog rows are observed
  and build when a filter makes them visible. Added CSV rows are discovered; removed
  DOM rows are released. SVG rig updates do not retrigger DOM discovery.
- The page is the actual interactive DOM, with no screenshot cover, cloned checkout,
  HTML replacement, text mutation, scroll interception or extension installation.
- Four agents at most, three on a phone. The frame loop runs only while jobs are
  active. Geometry reads are batched on scroll and resize; no idle cursor flock.
- Pointer and keyboard focus immediately finish the affected target. Native inputs
  retain their values. Show full page and Escape finish all tasks. Replay page
  stages the whole page again and starts in the current viewport.
- The Anatomy scanner pauses only while its illustration is being placed, then
  returns to its existing behavior. Its native field controls remain available.
- Unsupported animation, disabled JavaScript or a runtime error shows the original
  complete page. No text or input data is sent by the animation. There is no storage.
- The owner explicitly requested automatic construction even in in-app browsers
  reporting reduced motion. This is a bounded page construction, with an always
  available skip control. The browser preference itself is never changed.

## Integration

`partials/assets.html` loads `assets/page-build.css` and `assets/page-build.js`
through the existing shared-chrome generator. Asset version is `20261104c`.
The ordinary reveal observer skips pages owned by the construction engine, avoiding
two competing opacity/transform effects. Product generation retains its existing
markers and classes. The old bench-only engine, local toolbar and QA runner are
retired. Legacy assets remain available for stale HTML caches but current pages
do not load them; historical reports remain in Git.

Construction outlines and type baselines are functional drawing-tool feedback,
not resting dividers. They are marked as such for source lint and disappear at the
end of each task. The toolbar reserves 84px below the page so it does not obscure
the final footer content. Analytics now loads asynchronously after the construction
engine, so a tracking request cannot postpone the requested first-frame sequence.

## Validation

Use `node scripts/qa_page_build.mjs` with a local server on port 8765. It exercises
automatic construction in both motion modes and themes at 1440, 768 and 390px,
checks the entire section sequence, all published routes, native filtering and form
typing, keyboard/skip/replay, and static/error fallbacks. External services are
blocked and no payment or form submission is performed.

The work retains the established composition, palette, typography and actual data.
Before measurements are the prior `visibility-auto` inspection; after measurements
and frames are in `.taste-skill/page-final/`. Temporary alpha masks preserve
native hit areas, unlike clipping, and are intentional
only while an assigned cursor works; finished content must be fully visible.
Screenshots of in-progress construction are in `.taste-skill/page-build-qa/`.

The visual inspector is run with `--allow reduced-hidden` for the owner's explicit
request to build the page automatically even when reduced motion is reported.
That exception covers temporary construction masks only. The interaction suite
separately requires visible content to finish, and tests immediate Show full page,
Escape, native focus, unsupported JavaScript and runtime-failure fallbacks.

Finished-page inspection uses a local copy of the unchanged skill measurement and
judgment code, with native Escape input before its measurements. This exercises the
real Show full page behavior and avoids mistaking an in-progress task for a layout
hole. The live, unskipped sequence is validated separately by the scroll suite and
construction screenshots. No owning skill files or gate rules are modified.

Final local checks: 350/350 browser assertions (including all 24 routes) and 9/9
simulated lifecycle assertions pass. Site lint passes on 24 pages. Syntax and design
source lint pass. Finished-page measurement at all three widths reports zero failures
with the explicit reduced-motion exception above, and the same three inherited
warnings: type-size count, no footage and the measured margin difference. No physical
device frame-rate guarantee, checkout transaction or form submission is claimed.

## Visual critique

ROUND 1
Seen in one second: four drawing tools construct the actual headline and actions.
Idea (one sentence): the dataset inspection workspace is assembled under the visitor's
eyes, then extended section by section as they scroll.
Live thing: scroll to build the next section, operate native controls immediately,
or show/replay the full page.
Layout words by section: hero=exhibit / sample=split table / catalog=list /
features=definitions / guides=print display / insights=charts / buying=steps /
faq=accordion / invitation=full field / footer=columns.
Scores: design 6.5 · usability 8 · creativity 8.5 · content 8.5 → overall 7.6.
Caps applied: illustration-led design retains the previous photo-count cap.
Top three problems (most visible first), each with the screenshot it shows in and the fix:
1. Blank areas during active construction (`page-build-qa/1440-intro.jpg`) are
   intentional for the requested effect, but must never persist. The scheduler
   caps visible waiting, interaction reveals immediately and Escape shows all.
2. Masked menu controls initially swallowed pointer hits. Alpha masks now preserve
   their hit areas; native menu open/close and paused construction pass browser QA.
3. The fixed skip/replay toolbar can cover a small area at a viewport's lower edge
   (`page-final/mobile-fold.jpg`). It reserves space at the document end so final
   footer content can scroll clear; the page's long mobile layout remains unchanged.

No new photography, video, third-party art or generated media was introduced.
