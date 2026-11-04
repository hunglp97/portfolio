# First-visit-only cursor introduction

The owner requires the construction effect only on the first opening, with no
repeat on any subsequent opening. This policy supersedes the replay and
storage-free behavior of the earlier renderer.

The stable localStorage key `hlpdata:swarm-seen` is shared across every route on
this origin and is independent of release or query-string versions. The engine
writes it before starting the first intro. An interrupted intro, reload,
navigation, new tab or later browser session therefore opens a complete page.
The early head bootstrap checks the same key before hiding anything, preventing
an empty flash for returning visitors. Existing ordinary reveal classes also
remain fully visible on a returning visit.

The first introduction still builds later sections as the visitor scrolls.
Tour and speed controls operate during that first introduction. Show full page
or Escape ends it permanently for this document and hides its toolbar. There is
no Replay action, Tour cannot restart it after skip, and a back-forward cache
restore reveals everything instead of restarting cursors.

If reading or writing browser storage fails, the site stays fully rendered.
JavaScript-disabled and unsupported browsers retain the native static fallback.
The flag contains only `1`, no identifier or personal data, and is not transmitted.
The privacy page now describes it. Clearing site data, a separate browser/profile
or a new private-browsing session can make the visitor new again; there is no
account-based cross-device tracking.

Validation:

- `node scripts/qa_first_visit.mjs`: 50/50 passed. Checks interruption/reload,
  navigation, another tab, another query version, a real browser-process restart
  with the same isolated disk profile, skip, absent replay, simulated back-forward
  cache, blocked storage and quota/write failure. Returning pages must never enter
  the construction state, hide their content or create the cursor UI.
- `node scripts/qa_swarm_render.mjs`: 39/39 passed, proving the first-time visual
  sequence still works at 1440, 768 and 390px.
- The general construction QA runner explicitly clears only its isolated test
  profile before each fresh-visitor case and asserts toolbar retirement instead
  of the removed replay action. The persistence suite never clears the marker
  between its returning-visitor scenarios.
- Site lint validates all 24 shared-layout pages. Syntax, design source lint and
  immutable bundle/source equality are checked before release.

The release uses `20261104f` and content-hashed renderer assets. Earlier immutable
assets remain available for cached HTML. Public deployment and browser read-back
are separate from local verification.
