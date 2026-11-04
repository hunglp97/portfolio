# Make the cursor animation discoverable

The owner opened the released homepage and could not see the new animation. The
initial implementation hid its replay control whenever reduced motion was reported.
Its 1.6-second, desktop-only introduction was also easy to miss. The earlier QA
incorrectly treated the hidden control as a passing accessibility outcome.

The corrected behavior is:

- A blue Play animation button remains visible after JavaScript enhancement,
  including under reduced motion. Replay and Skip use the same control.
- The automatic introduction runs for four seconds when the artwork enters view
  on any viewport. The owner explicitly clarified that opening the page must apply
  the effect immediately, so the finite introduction also runs in in-app browsers
  reporting reduced motion. No preference is persisted or changed. A subsequent
  preference change during playback still cancels the sequence.
- The reduced-motion stylesheet no longer hides the decorative cursor layer.
  Cursors return to zero opacity after the finite sequence. Field selection, Escape, offscreen
  and background cancellation continue to work.
- The homepage versions both animation assets as `20261104b`, so browsers request
  the corrected JavaScript and CSS.
- A page initially loaded in the background starts its introduction when first
  brought forward. Returning via the browser's back/forward cache starts it again.
- Font loading or responsive resizing during playback re-measures the artwork and
  restarts the finite sequence, so a late font cannot silently consume the intro.
- SVG solids disable CSS transitions so the global reduced-motion duration reset
  cannot create unintended transitions when Web Animations are cancelled.

The browser regression runner now checks the visible control and explicit playback
under both motion preferences, at 1440/768/390px in light and dark themes. It checks
the settled SVG animation state after a paint as well as immediate interaction.

The existing design direction, illustration and content are retained. The added
control is deliberately prominent; this change fixes discoverability rather than
claiming a new visual-design score. Screenshots are in ignored
`.taste-skill/visibility-fix/` and `.taste-skill/swarm-qa/`.

Validation: 206/206 browser interaction checks and 6/6 simulated lifecycle checks
pass. All 24 pages pass site lint; the three-width visual inspector reports zero
failures and the same three inherited warnings documented in the initial report.
