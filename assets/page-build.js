// Original, dependency-free page construction. Animates the real DOM, never a screenshot.
(function () {
  'use strict';
  if (!document.querySelector('main') || !Element.prototype.animate || !window.IntersectionObserver ||
      !window.CSS || !CSS.supports('mask-size', '100% 100%')) return;

  const html = document.documentElement;
  const atomic = '.inspector-art, .inspector-fields, .inspector-control, .inspector-result, .inspector-foot, ' +
    '.hero-facts > div, .metrics > *, .dataset-row > div, .dataset-row > dl, .feature-list > div, ' +
    '.steps > li, .guide-list > li, .guide-preview, .bars > li, .field-group, .form-actions, ' +
    '.footer-brand, .footer-nav > div, .footer-operator, main pre, main .toc';
  const leaves = 'main h1, main h2, main h3, main p, main button, main a, main summary, ' +
    'main .table-scroll tr, main .prose li, main img, .site-header .brand, .site-nav > a, ' +
    '.header-cta, .menu-button';
  const excluded = 'script, style, noscript, .visually-hidden, .skip-link, .hp-field, ' +
    '[aria-hidden="true"], .page-build-tools, .page-build-layer';
  const records = new Map();
  const active = new Map();
  let observer, changes, frame = 0, disabled = false, dirty = true, last = 0;
  const clamp = function (v) { return Math.max(0, Math.min(1, v)); };
  const ease = function (v) { return 1 - Math.pow(1 - clamp(v), 3); };

  const layer = document.createElement('div');
  layer.className = 'page-build-layer';
  layer.setAttribute('data-ui', '');
  layer.setAttribute('aria-hidden', 'true');
  const tools = document.createElement('div');
  tools.className = 'page-build-tools';
  tools.setAttribute('data-ui', '');
  const status = document.createElement('span');
  status.textContent = 'Building the page';
  const toggle = document.createElement('button');
  toggle.type = 'button';
  toggle.setAttribute('data-page-build-toggle', '');
  toggle.textContent = 'Show full page';
  tools.append(status, toggle);
  const agents = Array.from({ length: innerWidth < 600 ? 3 : 4 }, function (_, index) {
    const node = document.createElement('div');
    node.className = 'page-build-agent';
    node.innerHTML = '<svg class="page-build-pointer" viewBox="0 0 24 28" width="24" height="28"><path d="M3 2L4 22L10 16L15 25L19 23L14 14L22 13Z"/></svg>' +
      '<svg class="page-build-beam" viewBox="0 0 20 28" width="20" height="28"><path d="M4 3H16M10 3V25M4 25H16"/></svg><span></span>';
    const guide = document.createElement('div');
    guide.className = 'page-build-guide';
    layer.append(guide, node);
    return { node: node, guide: guide, label: node.querySelector('span'), x: 24 + index * 34, y: 84, job: null };
  });

  function countPending() {
    let count = 0;
    records.forEach(function (r) { if (r.state !== 'done') count++; });
    return count;
  }

  function updateTools() {
    const remaining = countPending();
    toggle.textContent = remaining ? 'Show full page' : 'Replay page';
    status.textContent = disabled ? 'Page ready' : active.size ? 'Building the page' : remaining ? 'Scroll to keep building' : 'Page ready';
    tools.toggleAttribute('data-working', active.size > 0);
  }

  function setState(r, state) {
    r.state = state;
    r.el.setAttribute('data-build-state', state);
  }

  function finish(r) {
    if (r.animation) { r.animation.cancel(); r.animation = null; }
    setState(r, 'done');
    if (r.agent) {
      r.agent.node.style.opacity = '0';
      r.agent.guide.style.opacity = '0';
      r.agent.job = null;
      r.agent = null;
    }
    if (r.instrument) { r.instrument.dispatchEvent(new CustomEvent('inspect-assembly', { detail: false })); r.instrument = null; }
    active.delete(r.el);
  }

  function showEverything(stop) {
    disabled = stop;
    if (frame) cancelAnimationFrame(frame);
    frame = 0;
    records.forEach(finish);
    updateTools();
  }

  function failOpen() {
    showEverything(true);
    html.removeAttribute('data-page-build');
    layer.remove();
    tools.remove();
    if (observer) observer.disconnect();
    if (changes) changes.disconnect();
  }

  function register(el) {
    if (records.has(el) || el.closest(excluded) || !el.textContent.trim() && !el.querySelector('img,svg,input') && el.tagName !== 'IMG') return;
    const parent = el.parentElement && el.parentElement.closest('[data-build-state]');
    if (parent || el.querySelector('[data-build-state]')) return;
    const kind = el.matches('.inspector-art, .guide-preview, img, pre') ? 'media' :
      el.matches('tr, .bars > li, .dataset-row > *, .guide-list > li, .steps > li') ? 'row' :
      el.matches('h1,h2,h3,p,.brand,.site-nav > a') ? 'text' : 'box';
    const record = { el: el, kind: kind, state: 'pending', visible: false, waiting: 0, animation: null, agent: null };
    records.set(el, record);
    setState(record, disabled ? 'done' : 'pending');
    observer.observe(el);
  }

  function discover() {
    records.forEach(function (r, el) {
      if (el.isConnected) return;
      finish(r); observer.unobserve(el); records.delete(el);
    });
    document.querySelectorAll(atomic).forEach(register);
    document.querySelectorAll(leaves).forEach(function (el) { if (!el.closest(atomic)) register(el); });
  }

  function visibleBox(el) {
    const r = el.getBoundingClientRect();
    const top = el.closest('.site-header') ? 0 : 68;
    return r.width > 1 && r.height > 1 && r.bottom > top && r.top < innerHeight - 12 && r.right > 0 && r.left < innerWidth ? r : null;
  }

  function start(r, agent, now) {
    const rect = visibleBox(r.el);
    if (!rect) { r.visible = false; return; }
    if (r.el.contains(document.activeElement) || r.el.matches(':focus')) { finish(r); return; }
    r.rect = rect;
    r.started = now;
    r.duration = r.el.matches('h1') ? 1200 : r.kind === 'text' ? Math.min(900, 420 + r.el.textContent.trim().length * 4) : r.kind === 'media' ? 1050 : r.kind === 'row' ? 560 : 650;
    r.agent = agent;
    r.from = { x: agent.x, y: agent.y };
    agent.job = r;
    agent.label.textContent = r.kind === 'text' ? 'Type' : r.kind === 'row' ? 'Duplicate' : r.kind === 'media' ? 'Place image' : 'Draw';
    agent.node.setAttribute('data-tool', r.kind);
    r.labelWidth = agent.label.getBoundingClientRect().width;
    setState(r, 'building');
    r.instrument = r.el.matches('.inspector-art') && r.el.closest('.data-inspector');
    if (r.instrument) r.instrument.dispatchEvent(new CustomEvent('inspect-assembly', { detail: true }));
    // Alpha masks preserve the native hit area; clip-path would swallow clicks
    // on a button or link before its painted edge reaches the pointer.
    const from = r.kind === 'text' || r.kind === 'row' ? '0% 100%, 0% 0%' : '0% 0%, 0% 0%';
    let keys = [{ maskSize: from }, { maskSize: '100% 100%, 0% 0%' }];
    r.lines = 1;
    if (r.kind === 'text') {
      const style = getComputedStyle(r.el);
      const lineHeight = parseFloat(style.lineHeight) || parseFloat(style.fontSize) * 1.4;
      const textHeight = rect.height - parseFloat(style.paddingTop) - parseFloat(style.paddingBottom);
      r.lines = Math.max(1, Math.min(30, Math.round(textHeight / lineHeight)));
      if (r.lines > 1) {
        keys = [];
        for (let line = 0; line < r.lines; line++) {
          [0, 100].forEach(function (x) {
            const y0 = line * 100 / r.lines;
            keys.push({ offset: (line + x / 100) / r.lines,
              maskSize: '100% ' + y0 + '%, ' + x + '% ' + (100 / r.lines) + '%',
              maskPosition: '0 0, 0 ' + (r.lines === 1 ? 0 : line * 100 / (r.lines - 1)) + '%' });
          });
        }
      }
    }
    r.animation = r.el.animate(keys, {
      delay: 140, duration: r.duration, fill: 'both', easing: r.kind === 'text' ? 'linear' : 'cubic-bezier(.22,1,.36,1)'
    });
    active.set(r.el, r);
  }

  function pump(now) {
    if (agents.every(function (agent) { return agent.job; })) return false;
    const queue = [];
    records.forEach(function (r) {
      if (r.state !== 'pending' || !r.visible) return;
      const rect = visibleBox(r.el);
      if (!rect) return;
      const priority = r.el.matches('h1') ? -10000 : r.el.matches('.hero .lead, .hero-actions > *') ? -5000 : rect.top;
      queue.push({ r: r, priority: priority });
    });
    queue.sort(function (a, b) { return a.priority - b.priority; });
    agents.forEach(function (agent) {
      if (agent.job || !queue.length) return;
      start(queue.shift().r, agent, now);
    });
    return queue.length > 0;
  }

  function render(r, now) {
    const a = r.agent, box = r.rect;
    const p = clamp((now - r.started - 140) / r.duration);
    const travel = ease((now - r.started) / 140);
    const q = r.kind === 'text' ? p : ease(p);
    const line = Math.min(r.lines - 1, Math.floor(p * r.lines));
    let x = box.left + box.width * (r.kind === 'text' ? p * r.lines - line : q);
    let y = r.kind === 'text' ? box.top + box.height * (line + .65) / r.lines : r.kind === 'row' ? box.top + box.height * .5 : box.top + box.height * q;
    x = a.x = r.from.x + (x - r.from.x) * travel;
    y = a.y = r.from.y + (y - r.from.y) * travel;
    x = Math.min(innerWidth - 26, Math.max(5, x));
    y = Math.min(innerHeight - 32, Math.max(4, y));
    a.node.style.transform = 'translate3d(' + x.toFixed(1) + 'px,' + y.toFixed(1) + 'px,0)';
    a.node.style.opacity = '1';
    a.node.classList.toggle('is-left', x + r.labelWidth + 32 > innerWidth);
    a.node.classList.toggle('is-above', y + 60 > innerHeight);
    a.guide.style.transform = 'translate3d(' + box.left.toFixed(1) + 'px,' + box.top.toFixed(1) + 'px,0)';
    a.guide.style.width = box.width.toFixed(1) + 'px';
    a.guide.style.height = box.height.toFixed(1) + 'px';
    a.guide.style.opacity = String((1 - p * .5) * travel);
    a.guide.setAttribute('data-tool', r.kind);
  }

  function tick(now) {
    frame = 0;
    if (disabled || document.hidden) return;
    try {
      if (document.querySelector('.menu-button[aria-expanded="true"], dialog[open]')) {
        active.forEach(finish); updateTools(); return;
      }
      // Layout reads are batched before drawing the four guides and cursors.
      active.forEach(function (r) { if (now - r.started >= r.duration + 140) finish(r); });
      if (dirty) {
        active.forEach(function (r) {
          const box = visibleBox(r.el);
          if (box) r.rect = box; else finish(r);
        });
        dirty = false;
      }
      const waiting = pump(now);
      active.forEach(function (r) { render(r, now); });
      // No visible content may be stranded by an unusually dense viewport.
      records.forEach(function (r) { if (r.state === 'pending' && r.visible && now - r.waiting > 5000) finish(r); });
      if (now - last > 200) { updateTools(); last = now; }
      if (active.size || waiting) frame = requestAnimationFrame(tick);
      else updateTools();
    } catch (_) { failOpen(); }
  }

  function wake() {
    if (!disabled && !document.hidden && !frame) frame = requestAnimationFrame(tick);
  }

  function releasePath(target) {
    if (!(target instanceof Element)) return;
    const el = target.closest('[data-build-state]');
    if (el && records.has(el)) finish(records.get(el));
    dirty = true;
    wake();
  }

  function replay() {
    showEverything(false);
    records.forEach(function (r) {
      r.waiting = performance.now();
      setState(r, 'pending');
    });
    dirty = true;
    wake();
  }

  try {
    html.setAttribute('data-page-build', '');
    document.body.append(layer, tools);
    observer = new IntersectionObserver(function (entries) {
      const now = performance.now();
      entries.forEach(function (entry) {
        const r = records.get(entry.target);
        if (!r) return;
        r.visible = entry.isIntersecting;
        if (r.visible) r.waiting = now;
        else if (r.state === 'building') finish(r);
      });
      dirty = true;
      wake();
    }, { rootMargin: '0px 0px -12px 0px', threshold: 0 });
    discover();
    changes = new MutationObserver(function (list) {
      if (list.some(function (m) { return Array.from(m.addedNodes).concat(Array.from(m.removedNodes)).some(function (n) { return n.nodeType === 1 && n.namespaceURI === 'http://www.w3.org/1999/xhtml'; }); })) {
        discover(); dirty = true; wake();
      }
    });
    changes.observe(document.querySelector('main'), { childList: true, subtree: true });
    document.addEventListener('pointerdown', function (e) { releasePath(e.target); }, true);
    document.addEventListener('focusin', function (e) { releasePath(e.target); }, true);
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') showEverything(true); });
    toggle.addEventListener('click', function () { if (countPending()) showEverything(true); else replay(); });
    window.addEventListener('scroll', function () { dirty = true; wake(); }, { passive: true });
    window.addEventListener('resize', function () { dirty = true; wake(); }, { passive: true });
    document.fonts.ready.then(function () { dirty = true; wake(); });
    document.addEventListener('visibilitychange', function () {
      if (document.hidden) {
        active.forEach(finish);
        if (frame) cancelAnimationFrame(frame);
        frame = 0;
      } else {
        records.forEach(function (r) { if (r.visible) r.waiting = performance.now(); });
        dirty = true; wake();
      }
    });
    window.addEventListener('pagehide', function () { showEverything(true); });
    window.addEventListener('pageshow', function (e) { if (e.persisted) replay(); });
    // Failure must reveal the complete native page, including if a later script fails.
    window.addEventListener('error', failOpen, { once: true });
    updateTools();
    wake();
  } catch (_) { failOpen(); }
})();
