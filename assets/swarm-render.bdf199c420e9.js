// Original page renderer, choreographed from the Swarm Rebuild video reference.
// The native DOM keeps its layout, text, links and state throughout construction.
(function () {
  'use strict';
  const html = document.documentElement;
  clearTimeout(window.__pageBuildGuard);
  if (!document.querySelector('main') || !Element.prototype.animate || !window.IntersectionObserver ||
      !window.CSS || !CSS.supports('mask-size', '100% 100%')) {
    html.removeAttribute('data-page-build-boot'); return;
  }
  // The head claims the single introduction before hiding anything. A later
  // visit, denied storage or a missing bootstrap always keeps the page static.
  if (!window.__pageBuildFirstVisit) {
    html.setAttribute('data-page-build-seen', '');
    html.removeAttribute('data-page-build-boot'); return;
  }
  window.__pageBuildFirstVisit = false;
  const scriptURL = document.currentScript.src;
  const omit = 'script,style,noscript,template,option,.visually-hidden,.skip-link,.hp-field,[aria-hidden="true"],.page-build-layer,.page-build-tools';
  const media = 'svg,img,video,canvas,iframe,pre,.inspector-art';
  const copy = 'h1,h2,h3,h4,h5,h6,p,a,button,summary,label,dt,dd,th,td,figcaption,legend,.brand';
  const blocks = 'div,p,ul,ol,dl,table,figure,h1,h2,h3,h4,form,fieldset';
  const frames = '.hero,.data-inspector,.file-preview,.dataset-row,.guide-preview,.feature-list>div,.steps>li,.guide-list>li,.project-invitation,.field-group,.site-footer,.site-header';
  const palette = ['#0785d1','#e24c80','#22a584','#9160d8','#e18b27','#3881dd','#d45548','#199ba8','#aa61ba','#669d3f','#de7654','#566ada'];
  const records = [], content = new Map(), surfaces = new Map(), families = new Map();
  const active = new Set();
  const clamp = v => Math.max(0, Math.min(1, v));
  const ease = v => 1 - Math.pow(1 - clamp(v), 3);
  const mix = (a, b, p) => a + (b - a) * p;
  let observer, changes, raf = 0, dirty = true, reflow = true, disabled = false, initial = true;
  let introStart = 0, introEnd = 0, speed = 1, tour = false, tourAt = 0, lastStats = 0, lastTime = 0;
  let mouse = { x: innerWidth * .5, y: innerHeight * .45 }, lastScroll = scrollY, scrollHeat = 0;

  const layer = document.createElement('div');
  layer.className = 'page-build-layer'; layer.setAttribute('data-ui', ''); layer.setAttribute('aria-hidden', 'true');
  const rulerX = document.createElement('div'), rulerY = document.createElement('div');
  rulerX.className = 'page-build-ruler page-build-ruler-x'; rulerY.className = 'page-build-ruler page-build-ruler-y';
  const intro = document.createElement('div'); intro.className = 'page-build-intro';
  const logo = document.createElement('img'); logo.src = new URL('../favicon.svg', scriptURL).href; logo.alt = '';
  intro.append(logo); layer.append(rulerX, rulerY, intro);
  const tools = document.createElement('div'); tools.className = 'page-build-tools'; tools.setAttribute('data-ui', '');
  const status = document.createElement('span'); status.textContent = 'Preparing the canvas';
  function button(label, name) {
    const b = document.createElement('button'); b.type = 'button'; b.textContent = label;
    b.setAttribute('data-page-build-' + name, ''); tools.append(b); return b;
  }
  tools.append(status);
  const tourButton = button('Tour', 'tour'); tourButton.setAttribute('aria-pressed', 'false');
  const speedButton = button('1×', 'speed'); speedButton.setAttribute('aria-label', 'Build speed: 1 times');
  const toggle = button('Show full page', 'toggle');
  const agents = palette.slice(0, innerWidth < 600 ? 8 : 12).map(function (color, i) {
    const node = document.createElement('div'); node.className = 'page-build-agent'; node.style.setProperty('--agent', color);
    node.innerHTML = '<svg class="page-build-pointer" viewBox="0 0 24 28" width="20" height="24"><path d="M3 2L4 22L10 16L15 25L19 23L14 14L22 13Z"/></svg>' +
      '<svg class="page-build-cross" viewBox="0 0 24 24" width="24" height="24"><path d="M12 2V22M2 12H22"/></svg>' +
      '<svg class="page-build-beam" viewBox="0 0 20 28" width="20" height="28"><path d="M4 3H16M10 3V25M4 25H16"/></svg><span></span>';
    const guide = document.createElement('div'); guide.className = 'page-build-guide'; guide.style.setProperty('--agent', color);
    guide.innerHTML = '<i></i><i></i><i></i><i></i><small></small>';
    const ghost = document.createElement('div'); ghost.className = 'page-build-ghost'; ghost.style.setProperty('--agent', color);
    const snap = document.createElement('div'); snap.className = 'page-build-snap';
    guide.hidden = ghost.hidden = snap.hidden = true;
    layer.append(ghost, guide, snap, node);
    return { node, guide, ghost, snap, badge: guide.querySelector('small'), label: node.querySelector('span'),
      x: innerWidth / 2, y: innerHeight / 2, vx: 0, vy: 0, job: null, index: i };
  });

  function rulers() {
    [rulerX, rulerY].forEach(function (node, index) {
      node.replaceChildren();
      const length = index ? innerHeight : innerWidth;
      for (let n = 50; n < length; n += 50) {
        const tick = document.createElement('span'); tick.style[index ? 'top' : 'left'] = n + 'px';
        tick.textContent = n % 100 ? '' : String(n); node.append(tick);
      }
    });
  }
  function pending() { return records.some(r => r.state !== 'done'); }
  function stats() {
    const done = records.filter(r => r.state === 'done').length;
    tools.hidden = disabled || !pending();
    status.textContent = initial ? 'Preparing the canvas' : disabled ? 'Page ready' : done + ' / ' + records.length + ' layers';
    tools.toggleAttribute('data-working', active.size > 0 || initial);
    tourButton.setAttribute('aria-pressed', String(tour));
    html.toggleAttribute('data-page-build-working', !disabled && (initial || active.size > 0));
  }
  function state(r, value) {
    r.state = value;
    r.el.setAttribute(r.kind === 'surface' ? 'data-build-surface' : 'data-build-state', value);
    if (value !== 'building') r.el.removeAttribute('data-build-phase');
  }
  function resetPaint(r) {
    ['--build-alpha','--build-scale','--build-mask-size','--build-mask-position'].forEach(k => r.el.style.removeProperty(k));
  }
  function finish(r) {
    state(r, 'done'); resetPaint(r); active.delete(r);
    if (r.agent) {
      const a = r.agent; a.job = null;
      a.guide.style.opacity = a.ghost.style.opacity = a.snap.style.opacity = '0';
      a.guide.hidden = a.ghost.hidden = a.snap.hidden = true;
      a.badge.textContent = ''; a.label.textContent = '';
      a.ghost.replaceChildren(); r.agent = null;
    }
    if (r.instrument) { r.instrument.dispatchEvent(new CustomEvent('inspect-assembly', { detail: false })); r.instrument = null; }
  }
  function revealAll(stop) {
    // Cancel inherited CSS transitions as well as our drawing jobs. Otherwise
    // reduced-motion's universal 0.01ms rule can leave an unpainted opacity frame.
    html.setAttribute('data-page-build-settling', '');
    disabled = stop; initial = false; tour = false;
    html.removeAttribute('data-page-build-intro'); html.removeAttribute('data-page-build-boot');
    intro.style.opacity = '0';
    if (raf) cancelAnimationFrame(raf); raf = 0;
    records.forEach(finish);
    agents.forEach(a => { a.node.style.opacity = '0'; });
    layer.hidden = true;
    void document.body.offsetHeight;
    html.removeAttribute('data-page-build-settling');
    stats();
  }
  function failOpen() {
    revealAll(true); html.removeAttribute('data-page-build');
    layer.remove(); tools.remove();
    if (observer) observer.disconnect(); if (changes) changes.disconnect();
  }
  function paintSurface(el, style) {
    return frames.split(',').some(s => el.matches(s)) || style.backgroundImage !== 'none' ||
      style.backgroundColor !== 'rgba(0, 0, 0, 0)' && style.backgroundColor !== 'transparent' ||
      ['Top','Right','Bottom','Left'].some(side => parseFloat(style['border' + side + 'Width']) > 0 && style['border' + side + 'Style'] !== 'none');
  }
  function family(el, kind) {
    const repeat = el.closest('.dataset-row,.hero-facts>div,.feature-list>div,.steps>li,.guide-list>li,.bars>li,tr,.fill');
    let key;
    if (repeat && repeat.parentElement) {
      const parts = []; let child = el;
      while (child !== repeat) {
        parts.unshift(child.tagName + ':' + Array.from(child.parentElement.children).indexOf(child)); child = child.parentElement;
      }
      key = repeat.parentElement;
      if (!families.has(key)) families.set(key, new Map());
      const group = kind + ':' + parts.join('/');
      if (!families.get(key).has(group)) families.get(key).set(group, []);
      return families.get(key).get(group);
    }
    if (el.parentElement && el.parentElement.children.length > 1) {
      key = el.parentElement;
      if (!families.has(key)) families.set(key, new Map());
      const group = kind + ':' + el.tagName;
      if (!families.get(key).has(group)) families.get(key).set(group, []);
      return families.get(key).get(group);
    }
    return [];
  }
  function add(el, kind, parent) {
    const map = kind === 'surface' ? surfaces : content;
    if (map.has(el)) return map.get(el);
    const r = { el, kind, parent, state: disabled ? 'done' : 'pending', visible: false, waiting: 0, agent: null, stops: null };
    r.family = family(el, kind); r.family.push(r);
    records.push(r); map.set(el, r); state(r, r.state); observer.observe(el); return r;
  }
  function visit(el, parent) {
    if (el.matches(omit)) {
      // Native components may clone an image already marked by the renderer.
      // Decorative clones must not inherit a pending mask from their source.
      if (!content.has(el) && !surfaces.has(el)) {
        el.removeAttribute('data-build-state'); el.removeAttribute('data-build-surface');
        el.removeAttribute('data-build-phase'); resetPaint({ el });
      }
      return;
    }
    if (el.namespaceURI !== 'http://www.w3.org/1999/xhtml' && el.tagName.toLowerCase() !== 'svg') return;
    if (content.has(el)) return;
    const style = getComputedStyle(el);
    if (style.display === 'none' && !el.hidden || style.visibility === 'hidden') return;
    const hasCopy = !!el.textContent.trim();
    if (el.matches(media)) { add(el, 'media', parent); return; }
    if (el.matches('input,select,textarea')) { add(el, 'control', parent); return; }
    const direct = Array.from(el.childNodes).some(n => n.nodeType === 3 && n.textContent.trim());
    if ((el.matches(copy) || direct) && hasCopy && !el.querySelector(blocks)) {
      add(el, el.matches('button,.btn,.menu-button,.header-cta') ? 'button' : 'text', parent); return;
    }
    if (surfaces.has(el)) parent = surfaces.get(el);
    else if (paintSurface(el, style)) parent = add(el, 'surface', parent);
    Array.from(el.children).forEach(child => visit(child, parent));
  }
  function discover() {
    [document.querySelector('.site-header'), document.querySelector('main'), document.querySelector('.site-footer')]
      .filter(Boolean).forEach(el => visit(el, null));
    // Remove records for rows replaced by the site's CSV loader.
    for (let i = records.length - 1; i >= 0; i--) {
      const r = records[i]; if (r.el.isConnected) continue;
      finish(r); observer.unobserve(r.el); content.delete(r.el); surfaces.delete(r.el); records.splice(i, 1);
      const index = r.family.indexOf(r); if (index !== -1) r.family.splice(index, 1);
    }
  }
  function box(el) {
    const b = el.getBoundingClientRect();
    if (b.width < 1 || b.height < 1 || b.bottom < 18 || b.top > innerHeight - 14 || b.right < 0 || b.left > innerWidth) return null;
    // A section larger than the screen is drawn through the currently visible portion.
    return { left: b.left, top: b.top, width: b.width, height: b.height, right: b.right, bottom: b.bottom };
  }
  function drawBox(r) {
    const b = r.rect;
    if (r.kind !== 'surface') return b;
    const top = Math.max(20, b.top), bottom = Math.min(innerHeight - 25, b.bottom);
    return { left: b.left, top, width: b.width, height: Math.max(1, bottom - top), right: b.right, bottom };
  }
  function textStops(r) {
    const base = r.rect, stops = [], walker = document.createTreeWalker(r.el, NodeFilter.SHOW_TEXT);
    const range = document.createRange(); let node;
    // Range geometry follows the browser's real wrapping and inline styles.
    while ((node = walker.nextNode()) && stops.length < 650) {
      for (let i = 0; i < node.length && stops.length < 650; i++) {
        range.setStart(node, i); range.setEnd(node, i + 1);
        const rect = range.getBoundingClientRect();
        if (!rect.width || !rect.height) continue;
        stops.push({ x: Math.max(0, rect.right - base.left), y: Math.max(0, rect.top - base.top), h: rect.height });
      }
    }
    return stops;
  }
  function cloneGhost(r, a) {
    const source = r.master && r.master.el;
    if (!source || source.querySelectorAll('*').length > 50 || source.matches('svg,.inspector-art')) return;
    const clone = source.cloneNode(true);
    const originals = [source].concat(Array.from(source.querySelectorAll('*')));
    const copies = [clone].concat(Array.from(clone.querySelectorAll('*')));
    const props = ['font','color','letter-spacing','line-height','text-align','background','border','border-radius','padding','display','gap','align-items','justify-content'];
    copies.forEach(function (copy, i) {
      const style = getComputedStyle(originals[i]);
      props.forEach(prop => copy.style.setProperty(prop, style.getPropertyValue(prop)));
      Array.from(copy.attributes).forEach(attr => {
        if (attr.name === 'id' || attr.name === 'name' || attr.name.startsWith('data-build') || attr.name.startsWith('on')) copy.removeAttribute(attr.name);
      });
      copy.style.opacity = '1'; copy.style.maskImage = 'none'; copy.style.margin = '0';
    });
    clone.setAttribute('inert', ''); clone.style.width = '100%'; clone.style.height = '100%';
    a.ghost.replaceChildren(clone);
  }
  function start(r, a, now) {
    r.rect = box(r.el); if (!r.rect) return false;
    if (r.el.contains(document.activeElement)) { release(r.el); return false; }
    r.master = r.family.find(item => item !== r && item.state === 'done' && item.el.isConnected && box(item.el));
    if (r.kind === 'surface' || r.kind === 'media' || r.kind === 'control') r.master = null;
    r.started = now; r.from = { x: a.x, y: a.y }; r.agent = a; a.job = r;
    r.stops = r.kind === 'text' || r.kind === 'button' ? textStops(r) : [];
    r.heading = r.el.matches('h1,h2') && parseFloat(getComputedStyle(r.el).fontSize) > 30;
    r.typeTime = Math.max(430, Math.min(r.el.matches('h1') ? 1250 : 1500, r.stops.length * 13));
    r.duration = (r.kind === 'surface' ? 720 : r.kind === 'media' ? 1450 : r.kind === 'control' ? 850 :
      (r.master ? 540 : 510) + r.typeTime + (r.heading ? 420 : 100)) / speed;
    r.lastChar = -1; state(r, 'building'); active.add(r);
    if (r.master) cloneGhost(r, a);
    r.instrument = r.el.matches('.inspector-art') && r.el.closest('.data-inspector');
    if (r.instrument) r.instrument.dispatchEvent(new CustomEvent('inspect-assembly', { detail: true }));
    return true;
  }
  function ready(r) {
    return !r.parent || r.parent.state === 'done';
  }
  function pump(now) {
    const queue = records.filter(r => r.state === 'pending' && r.visible && ready(r))
      .map(r => ({ r, rect: box(r.el) })).filter(item => item.rect);
    queue.sort(function (a, b) {
      const ab = a.rect, bb = b.rect;
      return (a.r.kind === 'surface' ? -350 : 0) + ab.top + ab.left * .035 -
        ((b.r.kind === 'surface' ? -350 : 0) + bb.top + bb.left * .035);
    });
    agents.forEach(function (a) { if (!a.job && queue.length) start(queue.shift().r, a, now); });
    return queue.length > 0;
  }
  function cursor(a, x, y, tool, label, alpha) {
    a.node.hidden = alpha === 0;
    a.x = x; a.y = y; a.node.setAttribute('data-tool', tool);
    a.node.style.transform = 'translate3d(' + Math.max(4, Math.min(innerWidth - 22, x)).toFixed(1) + 'px,' + Math.max(4, Math.min(innerHeight - 28, y)).toFixed(1) + 'px,0)';
    a.node.style.opacity = String(alpha); a.label.textContent = label;
    a.node.classList.toggle('is-left', x > innerWidth - 135);
    a.node.classList.toggle('is-above', y > innerHeight - 68);
  }
  function guide(a, b, width, height, label, alpha) {
    a.guide.hidden = width < 2 || height < 2;
    a.guide.style.transform = 'translate3d(' + b.left.toFixed(1) + 'px,' + b.top.toFixed(1) + 'px,0)';
    a.guide.style.width = Math.max(1, width).toFixed(1) + 'px'; a.guide.style.height = Math.max(1, height).toFixed(1) + 'px';
    a.guide.style.opacity = String(alpha); a.badge.textContent = label;
    a.guide.classList.toggle('is-above', b.top + height > innerHeight - 80);
  }
  function snap(a, b, progress) {
    a.snap.hidden = progress === 0;
    a.snap.style.left = '18px'; a.snap.style.top = Math.max(18, b.top).toFixed(1) + 'px';
    a.snap.style.width = Math.max(0, (b.left - 18) * progress) + 'px'; a.snap.style.opacity = String(1 - progress * .4);
  }
  function render(r, now) {
    const a = r.agent, b = drawBox(r);
    const t = (now - r.started) * speed, travel = ease(t / 180);
    const draw = ease((t - 180) / (r.master ? 360 : 330));
    const dragEnd = r.master ? 540 : 510;
    const typing = clamp((t - dragEnd) / r.typeTime);
    const growth = r.heading ? .34 + .66 * Math.round(ease((t - dragEnd - r.typeTime) / 360) * 4) / 4 : 1;
    let x = b.left + b.width * draw, y = b.top + b.height * draw;
    let label = '', tool = 'cross';
    r.el.setAttribute('data-build-phase', t < dragEnd ? r.master ? 'duplicate' : 'draw' : r.kind === 'surface' ? 'fill' : r.kind === 'media' ? 'place' : 'type');
    guide(a, b, b.width * draw, b.height * draw, Math.round(b.width * draw) + ' × ' + Math.round(b.height * draw), 1);
    a.guide.setAttribute('data-tool', r.kind);
    if (t < dragEnd) {
      a.ghost.hidden = false;
      if (r.master) {
        const origin = r.master.el.getBoundingClientRect();
        const dx = mix(origin.left, b.left, draw), dy = mix(origin.top, b.top, draw);
        a.ghost.style.transform = 'translate3d(' + dx + 'px,' + dy + 'px,0)';
        a.ghost.style.width = b.width + 'px'; a.ghost.style.height = b.height + 'px'; a.ghost.style.opacity = '.7';
        x = dx + b.width * .75; y = dy + b.height * .5;
        label = '⌥ Drag copy'; tool = 'pointer';
        a.badge.textContent = Math.round(Math.hypot(b.left - origin.left, b.top - origin.top) * draw) + ' px';
        snap(a, b, draw);
      } else {
        a.ghost.style.transform = 'translate3d(' + b.left + 'px,' + b.top + 'px,0)';
        a.ghost.style.width = b.width * draw + 'px'; a.ghost.style.height = b.height * draw + 'px';
        a.ghost.style.opacity = r.kind === 'surface' || r.kind === 'media' || r.kind === 'button' ? '.65' : '0';
        if (r.kind === 'text') snap(a, b, draw);
      }
    } else {
      a.ghost.style.opacity = a.snap.style.opacity = '0';
      a.ghost.hidden = a.snap.hidden = true;
      if (r.kind === 'surface') {
        tool = 'pointer';
        // Restore only this box's paint; its text and child layers still wait.
        r.el.setAttribute('data-build-surface', 'painting');
      } else if (r.kind === 'media' || r.kind === 'control') {
        const p = ease((t - dragEnd) / (r.kind === 'media' ? 850 : 300));
        r.el.style.setProperty('--build-alpha', '1');
        r.el.style.setProperty('--build-mask-size', '100% ' + p * 100 + '%,0% 0%');
        r.el.style.setProperty('--build-mask-position', '0 0,0 0');
        x = b.left + b.width; y = b.top + b.height * p; label = r.kind === 'media' ? 'Place image' : 'Place field'; tool = 'pointer';
      } else {
        const n = Math.min(r.stops.length - 1, Math.floor(typing * r.stops.length));
        const stop = r.stops[Math.max(0, n)];
        r.el.style.setProperty('--build-alpha', typing > 0 ? '1' : '0');
        r.el.style.setProperty('--build-scale', String(growth));
        if (stop && n !== r.lastChar) {
          const top = Math.max(0, stop.y - 2), height = stop.h + 5;
          r.el.style.setProperty('--build-mask-size', b.width + 'px ' + top + 'px,' + stop.x + 'px ' + height + 'px');
          r.el.style.setProperty('--build-mask-position', '0 0,0 ' + top + 'px');
          r.lastChar = n;
        }
        if (typing >= 1) r.el.style.setProperty('--build-mask-size', '100% 100%,0% 0%');
        x = b.left + (stop ? stop.x : b.width * typing) * growth;
        y = b.top + (stop ? stop.y + stop.h * .7 : b.height * .5) * growth;
        label = r.heading && typing >= 1 ? 'Resize' : 'Type'; tool = 'text';
        if (r.heading) guide(a, b, b.width * growth, b.height * growth, Math.round(parseFloat(getComputedStyle(r.el).fontSize) * growth) + ' px', 1);
      }
    }
    cursor(a, mix(r.from.x, x, travel), mix(r.from.y, y, travel), tool, label, 1);
  }
  function orbit(now) {
    if (!introStart) { introStart = now; introEnd = now + 1050; }
    const p = clamp((now - introStart) / 1050), centerX = innerWidth * .5, centerY = innerHeight * .43;
    intro.style.opacity = String(1 - ease((p - .6) / .4));
    agents.forEach(function (a, i) {
      const angle = now * .003 + i * Math.PI * 2 / agents.length;
      const radius = 78 + Math.sin(i * 1.8 + now * .002) * 18 + p * 25;
      cursor(a, centerX + Math.cos(angle) * radius, centerY + Math.sin(angle) * radius * .68, 'pointer', '', 1);
    });
    if (p >= 1) {
      initial = false; html.removeAttribute('data-page-build-intro');
      records.forEach(r => { r.waiting = now; }); stats();
    }
  }
  function flock(a, now, dt) {
    let tx = mouse.x, ty = mouse.y;
    if (active.size) {
      const jobs = Array.from(active), job = jobs[a.index % jobs.length];
      tx = job.rect.left + job.rect.width * .5; ty = Math.max(70, Math.min(innerHeight - 100, job.rect.top + job.rect.height * .5));
    }
    const angle = now * .0007 + a.index * 2.4;
    tx += Math.cos(angle) * (50 + a.index * 6); ty += Math.sin(angle) * (45 + a.index * 3);
    let ax = (tx - a.x) * .0014, ay = (ty - a.y) * .0014;
    agents.forEach(function (other) {
      if (other === a) return;
      const dx = a.x - other.x, dy = a.y - other.y, d2 = dx * dx + dy * dy;
      if (d2 > 1 && d2 < 1600) { ax += dx / d2 * 4; ay += dy / d2 * 4; }
    });
    a.vx = (a.vx + ax * dt) * .86; a.vy = (a.vy + ay * dt) * .86;
    cursor(a, a.x + a.vx * dt, a.y + a.vy * dt, 'pointer', '', 1);
  }
  function measure() {
    // Read unscaled geometry before any writes so text-size steps do not move guides.
    active.forEach(r => { if (r.heading) r.el.style.setProperty('--build-scale', '1'); });
    active.forEach(function (r) {
      const b = box(r.el);
      if (!b) { finish(r); return; }
      const widthChanged = Math.abs(r.rect.width - b.width) > 1;
      r.rect = b;
      if (r.stops.length && (reflow || widthChanged)) r.stops = textStops(r);
    });
    dockTools(); dirty = false; reflow = false;
  }
  function dockTools() {
    const size = tools.getBoundingClientRect(), pad = innerWidth < 600 ? 12 : 20;
    const heads = Array.from(document.querySelectorAll('main h1,main h2,main h3')).map(el => el.getBoundingClientRect())
      .filter(b => b.height > 1 && b.bottom > 70 && b.top < innerHeight);
    const bottom = innerHeight - size.height - 16;
    const choices = innerWidth < 600 ? [[pad, bottom, 'bottom-right'], [pad, 76, 'top-right']] :
      [[innerWidth - size.width - pad, bottom, 'bottom-right'], [pad, bottom, 'bottom-left'],
       [innerWidth - size.width - pad, 76, 'top-right'], [pad, 76, 'top-left']];
    let best = choices[0], least = Infinity;
    choices.forEach(function (choice) {
      const overlaps = heads.filter(b => b.left < choice[0] + size.width && b.right > choice[0] && b.top < choice[1] + size.height && b.bottom > choice[1]).length;
      if (overlaps < least) { best = choice; least = overlaps; }
    });
    tools.setAttribute('data-dock', best[2]);
  }
  function tick(now) {
    raf = 0; if (disabled || document.hidden) return;
    try {
      const dt = Math.min(2, (now - (lastTime || now - 16)) / 16); lastTime = now;
      if (initial) { orbit(now); raf = requestAnimationFrame(tick); return; }
      if (document.querySelector('.menu-button[aria-expanded="true"],dialog[open]')) {
        active.forEach(finish); agents.forEach(a => { a.node.style.opacity = '0'; }); stats(); return;
      }
      active.forEach(r => { if (now - r.started >= r.duration) finish(r); });
      if (dirty) measure();
      const waiting = pump(now);
      active.forEach(r => render(r, now));
      agents.forEach(a => { if (!a.job) flock(a, now, dt); });
      // Dense tables must eventually become readable, including after a rapid scroll.
      records.forEach(r => { if (r.state === 'pending' && r.visible && now - r.waiting > 12000 / speed) finish(r); });
      if (tour && !active.size && !waiting && now - tourAt > 500) {
        if (scrollY + innerHeight >= document.documentElement.scrollHeight - 4) tour = false;
        else { window.scrollBy({ top: innerHeight * .65, behavior: 'smooth' }); tourAt = now; }
      }
      if (now - lastStats > 150) { stats(); lastStats = now; }
      if (active.size || waiting || tour || now - introEnd < 1600) raf = requestAnimationFrame(tick);
      else { agents.forEach(a => { a.node.style.opacity = '0'; }); layer.hidden = true; stats(); }
    } catch (_) { failOpen(); }
  }
  function wake() { if (!disabled && !document.hidden && !raf) { layer.hidden = false; raf = requestAnimationFrame(tick); } }
  function release(target) {
    if (!(target instanceof Element)) return;
    // Native hit testing, keyboard order, form values and text nodes never change.
    records.forEach(r => { if (r.el === target || r.el.contains(target) || target.contains(r.el)) finish(r); });
    if (initial) { initial = false; html.removeAttribute('data-page-build-intro'); intro.style.opacity = '0'; }
    dirty = true; wake();
  }
  try {
    html.setAttribute('data-page-build', ''); html.setAttribute('data-page-build-intro', '');
    document.body.append(layer, tools); rulers();
    observer = new IntersectionObserver(function (entries) {
      const now = performance.now();
      entries.forEach(function (entry) {
        [content.get(entry.target), surfaces.get(entry.target)].filter(Boolean).forEach(function (r) {
          r.visible = entry.isIntersecting;
          if (r.visible) r.waiting = now;
          else if (r.state === 'building') finish(r);
        });
      }); dirty = true; wake();
    }, { rootMargin: '0px 0px -14px 0px', threshold: 0 });
    discover(); html.removeAttribute('data-page-build-boot');
    changes = new MutationObserver(function (list) {
      if (list.some(m => Array.from(m.addedNodes).concat(Array.from(m.removedNodes)).some(n => n.nodeType === 1 && n.namespaceURI === 'http://www.w3.org/1999/xhtml'))) {
        discover(); dirty = true; wake();
      }
    });
    changes.observe(document.querySelector('main'), { childList: true, subtree: true });
    document.addEventListener('pointerdown', e => { if (!e.target.closest('.page-build-tools')) release(e.target); }, true);
    document.addEventListener('focusin', e => { if (!e.target.closest('.page-build-tools')) release(e.target); }, true);
    document.addEventListener('pointermove', e => { mouse = { x: e.clientX, y: e.clientY }; }, { passive: true });
    document.addEventListener('keydown', e => { if (e.key === 'Escape') revealAll(true); });
    toggle.addEventListener('click', () => revealAll(true));
    tourButton.addEventListener('click', () => { if (disabled || !pending()) return; tour = !tour; tourAt = performance.now(); stats(); wake(); });
    speedButton.addEventListener('click', () => {
      active.forEach(finish); speed = speed === 3 ? 1 : speed + 1;
      speedButton.textContent = speed + '×'; speedButton.setAttribute('aria-label', 'Build speed: ' + speed + ' times'); wake();
    });
    window.addEventListener('scroll', function () {
      scrollHeat = Math.abs(scrollY - lastScroll); lastScroll = scrollY;
      if (scrollHeat > innerHeight * 1.5) active.forEach(finish);
      dirty = true; if (disabled) dockTools(); else wake();
    }, { passive: true });
    window.addEventListener('resize', () => { rulers(); reflow = true; dirty = true; if (disabled) dockTools(); else wake(); }, { passive: true });
    document.fonts.ready.then(() => { reflow = true; dirty = true; wake(); });
    document.addEventListener('visibilitychange', function () {
      if (document.hidden) {
        active.forEach(finish); if (raf) cancelAnimationFrame(raf); raf = 0;
        if (initial) introStart = 0;
      } else { records.forEach(r => { if (r.visible) r.waiting = performance.now(); }); dirty = true; wake(); }
    });
    window.addEventListener('pagehide', () => revealAll(true));
    window.addEventListener('beforeprint', () => revealAll(true));
    window.addEventListener('pageshow', e => { if (e.persisted) revealAll(true); });
    window.addEventListener('error', failOpen, { once: true });
    stats(); wake();
  } catch (_) { failOpen(); }
})();
