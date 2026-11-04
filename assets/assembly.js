// Original, dependency-free choreography for the HLP Data inspection bench.
// The cursors illustrate assembly; the real SVG and its controls stay interactive.
(function () {
  'use strict';
  const root = document.querySelector('[data-assembly]');
  if (!root || !Element.prototype.animate || !window.IntersectionObserver) return;
  const art = root.querySelector('.inspector-art');
  const svg = art && art.querySelector('svg');
  const button = root.querySelector('[data-assembly-play]');
  const status = root.querySelector('[data-assembly-status]');
  if (!svg || !button || !status) return;

  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const labels = ['Price', 'Price / m²', 'Parking', 'Floor'];
  const layer = document.createElement('div');
  layer.className = 'assembly-layer';
  layer.setAttribute('aria-hidden', 'true');
  const agents = labels.map(function (label) {
    const cursor = document.createElement('div');
    cursor.className = 'assembly-cursor';
    // One static, original pointer shape. Labels never enter the accessibility tree.
    cursor.innerHTML = '<svg viewBox="0 0 24 28" width="24" height="28"><path d="M3 2L4 22L10 16L15 25L19 23L14 14L22 13Z"/></svg><span></span>';
    cursor.querySelector('span').textContent = label;
    layer.append(cursor);
    return { cursor: cursor, targets: [] };
  });
  art.append(layer);

  const parts = Array.from(svg.querySelectorAll('[data-name] > .iso-solid'));
  let animations = [], frame = 0, started = 0, duration = 0, active = false, seen = false, inView = false;
  let motionAtStart = reduced.matches;
  let bounds, jobs = [];
  const clamp = function (v) { return Math.min(1, Math.max(0, v)); };
  const ease = function (v) { return 1 - Math.pow(1 - clamp(v), 3); };

  function availability() {
    button.hidden = false;
    if (!active) status.textContent = 'Choose a field to inspect.';
  }

  function finish() {
    if (frame) cancelAnimationFrame(frame);
    frame = 0;
    animations.forEach(function (animation) { animation.cancel(); });
    animations = [];
    agents.forEach(function (agent) { agent.cursor.style.opacity = '0'; });
    root.removeAttribute('data-assembling');
    button.textContent = seen ? 'Replay animation' : 'Play animation';
    button.setAttribute('aria-label', button.textContent);
    status.textContent = 'Choose a field to inspect.';
    if (active) {
      active = false;
      root.dispatchEvent(new CustomEvent('inspect-assembly', { detail: false }));
    }
  }

  function tick(now) {
    frame = 0;
    if (!active) return;
    if (document.hidden || reduced.matches !== motionAtStart) { finish(); return; }
    const t = now - started;
    agents.forEach(function (agent, i) {
      const queue = agent.targets;
      const current = queue.find(function (job) { return t < job.end; });
      const job = current || queue[queue.length - 1];
      if (!job) return;
      const previous = queue[Math.max(0, queue.indexOf(job) - 1)];
      const from = previous === job ? { x: bounds.width * (0.24 + i * 0.16), y: bounds.height * 0.14 } : previous;
      const p = ease((t - job.start) / (job.end - job.start));
      const exit = clamp((t - duration + 360) / 360);
      const x = from.x + (job.x - from.x) * p;
      const y = from.y + (job.y - from.y) * p - Math.sin(p * Math.PI) * 14;
      agent.cursor.classList.toggle('is-left', x + agent.labelWidth + 28 > bounds.width);
      agent.cursor.classList.toggle('is-above', y + 50 > bounds.height);
      agent.cursor.style.transform = 'translate3d(' + x.toFixed(2) + 'px,' + y.toFixed(2) + 'px,0)';
      agent.cursor.style.opacity = String(clamp(t / 120) * (1 - exit));
    });
    if (t >= duration) finish();
    else frame = requestAnimationFrame(tick);
  }

  function start() {
    if (document.hidden) return;
    finish();
    bounds = art.getBoundingClientRect();
    if (!bounds.width || !bounds.height) return;
    active = true;
    motionAtStart = reduced.matches;
    seen = true;
    root.dispatchEvent(new CustomEvent('inspect-assembly', { detail: true }));
    duration = 4000;
    jobs = [];
    agents.forEach(function (agent) {
      agent.targets = [];
      agent.labelWidth = agent.cursor.querySelector('span').getBoundingClientRect().width;
    });
    // Measure all targets before animating. The frame loop only writes transforms/opacity.
    parts.forEach(function (part) {
      const group = part.parentElement;
      const tray = group.getAttribute('data-tray');
      const lane = tray === null ? null : Number(tray);
      const box = part.getBoundingClientRect();
      jobs.push({ part: part, lane: lane, x: box.left - bounds.left + box.width * 0.7,
        y: box.top - bounds.top + box.height * 0.2 });
    });
    const counts = agents.map(function (_, i) { return jobs.filter(function (job) { return job.lane === i; }).length; });
    jobs.forEach(function (job) {
      if (job.lane === null) {
        animations.push(job.part.animate([
          { opacity: 0.24, transform: 'translateY(12px)' },
          { opacity: 1, transform: 'translateY(0)' }
        ], { duration: 420, easing: 'cubic-bezier(.22,1,.36,1)', fill: 'both' }));
        return;
      }
      const agent = agents[job.lane];
      const order = agent.targets.length;
      const step = (duration - 740) / Math.max(1, counts[job.lane]);
      const delay = 240 + order * step + job.lane * 24;
      const end = delay + Math.min(320, step + 160);
      agent.targets.push({ x: job.x, y: job.y, start: delay - 100, end: end });
      animations.push(job.part.animate([
        { opacity: 0.24, transform: 'translateY(12px)' },
        { opacity: 1, transform: 'translateY(0)' }
      ], { duration: 380, delay: delay, easing: 'cubic-bezier(.22,1,.36,1)', fill: 'both' }));
    });
    root.setAttribute('data-assembling', '');
    button.textContent = 'Skip animation';
    button.setAttribute('aria-label', 'Skip the build animation');
    status.textContent = 'Four fields, taking shape.';
    started = performance.now();
    frame = requestAnimationFrame(tick);
  }

  button.addEventListener('click', function () { if (active) finish(); else start(); });
  // Reading or operating the exhibit always takes priority over its introduction.
  root.addEventListener('pointerdown', function (event) { if (active && !button.contains(event.target)) finish(); }, true);
  root.addEventListener('keydown', function (event) {
    if (active && (event.key === 'Escape' || !button.contains(event.target))) finish();
  }, true);
  reduced.addEventListener('change', function () { finish(); availability(); });
  document.addEventListener('visibilitychange', function () {
    if (document.hidden) finish();
    else if (!seen && inView) start();
  });
  window.addEventListener('pagehide', finish);
  window.addEventListener('pageshow', function (event) {
    if (!event.persisted) return;
    seen = false;
    if (inView && !document.hidden) start();
  });
  if (window.ResizeObserver) new ResizeObserver(function () {
    if (!active) return;
    finish();
    // Font loading and responsive layout can resize the art during its first run.
    // Re-measure and continue with a fresh sequence rather than losing the intro.
    if (inView && !document.hidden) start();
  }).observe(art);
  const observer = new IntersectionObserver(function (entries) {
    const entry = entries[entries.length - 1];
    inView = entry.isIntersecting && entry.intersectionRatio >= 0.25;
    if (!inView) { if (active) finish(); return; }
    // The owner explicitly requested a visible introduction on every page open,
    // including in-app browsers that report reduced motion by default.
    if (!seen) start();
  }, { threshold: 0.25 });
  observer.observe(art);
  availability();
})();
