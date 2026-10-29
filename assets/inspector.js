(function () {
  'use strict';
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');

  const TAU = Math.PI * 2;

  // The kit's isometric camera, so a rig can rebuild needles and pointers in the figure's own projection.
  function cameraOf(P) {
    const a = P.azimuth * Math.PI / 180, e = P.elevation * Math.PI / 180;
    return { P: P, sinA: Math.sin(a), cosA: Math.cos(a), sinE: Math.sin(e), cosE: Math.cos(e), k: P.scale * Math.sqrt(1.6) };
  }
  function iso(C, p) {
    return [C.P.origin[0] + (p[0] * C.sinA - p[1] * C.cosA) * C.k, C.P.origin[1] + ((p[0] * C.cosA + p[1] * C.sinA) * C.sinE - p[2] * C.cosE) * C.k];
  }
  function screen(C, v) {
    return [(v[0] * C.sinA - v[1] * C.cosA) * C.k, ((v[0] * C.cosA + v[1] * C.sinA) * C.sinE - v[2] * C.cosE) * C.k];
  }
  function pathOf(points) {
    return points.map(function (p, i) { return (i ? 'L' : 'M') + p[0].toFixed(1) + ' ' + p[1].toFixed(1); }).join('');
  }
  // A pointer on a horizontal face: angle 0 points to -y and turns clockwise seen from above (the kit's radialTicks).
  function spoke(C, c, angle, from, to) {
    const sx = Math.sin(angle), sy = -Math.cos(angle);
    return pathOf([iso(C, [c[0] + sx * from, c[1] + sy * from, c[2]]), iso(C, [c[0] + sx * to, c[1] + sy * to, c[2]])]);
  }
  function shift(C, v) {
    const d = screen(C, v);
    return 'translate(' + d[0].toFixed(2) + ' ' + d[1].toFixed(2) + ')';
  }

  // Each rig moves the parts that change shape or slide inside an assembly. It gets the eased stage,
  // the chain of envelopes (0 travelling, 1 working at a station) and a clock, and writes attributes only.
  const RIGS = {
    caliper: function (root, rig) {
      const C = cameraOf(rig.P);
      const needle = root.querySelector('[data-needle]');
      const lever = root.querySelector('[data-lever]');
      const stroke = root.querySelector('[data-stroke]');
      const hold = stroke && stroke.querySelector('[data-hold]');
      return {
        chain: 2,
        draw: function (s) {
          const drop = (rig.rest - rig.tops[s.index]) * s.env[1];
          const turn = (rig.rest - drop - rig.zero) / rig.perTurn;
          if (needle) needle.setAttribute('d', spoke(C, rig.needle.c, turn * TAU, -rig.needle.tail, rig.needle.r));
          if (lever) lever.setAttribute('d', spoke(C, rig.mag.c, rig.mag.off + (rig.mag.on - rig.mag.off) * s.env[0], -1.6, rig.mag.r));
          if (stroke) {
            stroke.setAttribute('transform', shift(C, [0, 0, -drop]));
            if (hold) hold.setAttribute('transform', shift(C, [0, 0, drop]));
          }
        }
      };
    },

    gateway: function (root, rig) {
      const C = cameraOf(rig.P);
      const stroke = root.querySelector('[data-stroke]');
      const hold = stroke && stroke.querySelector('[data-hold]');
      const feed = root.querySelector('[data-feed]');
      const feedHold = feed && feed.querySelector('[data-hold]');
      const spokes = root.querySelectorAll('[data-spoke]');
      const crank = root.querySelector('[data-crank]');
      const head = root.querySelector('[data-lamp="head"]');
      const w = rig.wheel;
      let turn = 0, printed = rig.feed, last = null;
      return {
        chain: 2,
        live: function (s) { return s.index === 2 && s.env[1] > 0; },
        draw: function (s) {
          const dt = last === null ? 0 : Math.min(s.time - last, 0.05);
          last = s.time;
          const drop = rig.drop * s.env[0];
          if (stroke) {
            stroke.setAttribute('transform', shift(C, [0, 0, -drop]));
            if (hold) hold.setAttribute('transform', shift(C, [0, 0, drop]));
          }
          if (head) head.toggleAttribute('data-engaged', s.env[0] > 0.9);
          // The press handwheel winds down while the probe sits in its socket.
          if (s.index === 2) turn += dt * 2.4 * s.env[1];
          spokes.forEach(function (line, j) { line.setAttribute('d', spoke(C, w.c, turn + j * TAU / 3, 2, 6.3)); });
          if (crank) crank.setAttribute('transform', shift(C, [Math.sin(turn) * w.r, w.r - Math.cos(turn) * w.r, 0]));
          // A new receipt feeds out at the S3 dock; the last one stays until the next print tears it off.
          if (s.index === 3) printed = rig.feed * s.env[1];
          if (feed) {
            feed.setAttribute('transform', shift(C, [0, printed - rig.feed, 0]));
            if (feedHold) feedHold.setAttribute('transform', shift(C, [0, rig.feed - printed, 0]));
          }
        }
      };
    },

    pipeline: function (root, rig) {
      const C = cameraOf(rig.P);
      const orbit = root.querySelector('[data-orbit]');
      const nests = Array.prototype.slice.call(root.querySelectorAll('[data-nest]'));
      const minor = root.querySelector('[data-ticks="minor"]');
      const major = root.querySelector('[data-ticks="major"]');
      const notches = root.querySelector('[data-notches]');
      const hubDots = root.querySelectorAll('[data-hub] circle');
      const detent = root.querySelector('[data-detent]');
      const crank = root.querySelector('[data-crank]');
      const gate = root.querySelector('[data-gate]');
      const agitator = root.querySelector('[data-agitator]');
      const valve = root.querySelectorAll('[data-valve-spoke]');
      const mesh = root.querySelectorAll('[data-mesh]');
      const probe = root.querySelector('[data-qa-probe]');
      const needle = root.querySelector('[data-qa-needle]');
      const press = root.querySelectorAll('[data-press]');
      const facing = function (a) { return Math.sin(a) * C.cosA - Math.cos(a) * C.sinA; };
      const ring = function (a, r, s, z) { return [Math.sin(a) * r + Math.cos(a) * s, -Math.cos(a) * r + Math.sin(a) * s, z]; };
      const hold = function (group, v) {
        if (!group) return;
        group.setAttribute('transform', shift(C, v));
        const clip = group.querySelector('[data-hold]');
        if (clip) clip.setAttribute('transform', shift(C, [-v[0], -v[1], -v[2]]));
      };
      let spin = 0, last = null, order = '';
      return {
        chain: 2,
        live: function (s) { return (s.index === 0 || s.index === 1) && s.env[1] > 0; },
        draw: function (s) {
          const dt = last === null ? 0 : Math.min(s.time - last, 0.05);
          last = s.time;
          const phi = s.stage * rig.step;
          // The table and everything on it turn by phi; nests are moved and re-sorted back to front.
          const placed = nests.map(function (el, j) {
            const a = rig.nests[j], b = a + phi;
            el.setAttribute('transform', shift(C, [rig.rn * (Math.sin(b) - Math.sin(a)), rig.rn * (Math.cos(a) - Math.cos(b)), 0]));
            return { el: el, depth: rig.rn * facing(b) };
          }).sort(function (p, q) { return p.depth - q.depth; });
          const next = placed.map(function (p) { return p.el.dataset.nest; }).join();
          if (next !== order) { order = next; placed.forEach(function (p) { orbit.appendChild(p.el); }); }
          let lo = '', hi = '';
          for (let i = 0; i < 72; i++) {
            const a = rig.tickFrom + phi + i * TAU / 72, big = i % 6 === 0;
            const d = spoke(C, [0, 0, rig.top], a, rig.tickR - (big ? 3 : 1.4), rig.tickR);
            if (big) hi += d; else lo += d;
          }
          if (minor) minor.setAttribute('d', lo);
          if (major) major.setAttribute('d', hi);
          if (notches) {
            let d = '';
            rig.nests.forEach(function (a0) {
              const a = a0 + phi;
              if (facing(a) <= 0.12) return;
              [-1.6, 1.6].forEach(function (off) { d += pathOf([iso(C, ring(a, rig.notch.r, off, rig.notch.z0)), iso(C, ring(a, rig.notch.r, off, rig.notch.z1))]); });
            });
            notches.setAttribute('d', d);
          }
          hubDots.forEach(function (dot, j) {
            const p = iso(C, ring(rig.hub.a[j] + phi, rig.hub.r, 0, rig.hub.z));
            dot.setAttribute('cx', p[0].toFixed(1)); dot.setAttribute('cy', p[1].toFixed(1));
          });
          // The detent lifts out of its notch before the table turns; the crank turns once per index.
          const out = 1 - s.env[0];
          hold(detent, [rig.detent.dir[0] * out, rig.detent.dir[1] * out, 0]);
          const theta = s.stage * TAU, cr = rig.crank.r;
          if (crank) crank.setAttribute('transform', shift(C, [Math.sin(theta) * cr, cr - Math.cos(theta) * cr, 0]));
          // Each station works while the table is locked under it.
          const work = function (i) { return s.index === i ? s.env[1] : 0; };
          if (s.index < 2) spin += dt * s.env[1];
          if (gate) gate.setAttribute('transform', shift(C, [rig.gate[0] * work(0), rig.gate[1] * work(0), 0]));
          const sh = rig.shaft;
          if (agitator) agitator.setAttribute('d', spoke(C, [sh[0], sh[1], sh[2] + 2], spin * 9, -2.4, 2.4));
          valve.forEach(function (line, j) { line.setAttribute('d', spoke(C, rig.wheel.c, spin * 1.5 + j * TAU / 3, 0, 4)); });
          const v = Math.floor(spin * 14 * (s.index === 1 ? 1 : 0)) % rig.mesh;
          mesh.forEach(function (g, j) { if ((j === v) !== (g.getAttribute('display') !== 'none')) g.setAttribute('display', j === v ? 'inline' : 'none'); });
          hold(probe, [0, 0, -rig.qa.drop * work(2)]);
          if (needle) needle.setAttribute('d', spoke(C, rig.qa.needle.c, 0.995 * TAU * work(2), -rig.qa.needle.tail, rig.qa.needle.r));
          press.forEach(function (g) { hold(g, [0, 0, -rig.press.drop * work(3)]); });
        }
      };
    }
  };

  function initInspector(root) {
    const data = root.querySelector('script[type="application/json"]');
    if (!data) return;
    let model;
    try { model = JSON.parse(data.textContent); } catch (_) { return; }
    const items = model.fields || model.stages;
    if (!items || !items.length) return;

    const select = root.querySelector('[data-inspect-field]');
    const play = root.querySelector('[data-inspect-tour]');
    const readout = root.querySelector('.inspector-result');
    const art = root.querySelector('.inspector-art');
    const moving = root.querySelectorAll('[data-scanner]');
    const choices = root.querySelectorAll('[data-inspect-choice]');
    const rateEl = root.querySelector('[data-inspect-rate]');
    const noteEl = root.querySelector('[data-inspect-note]');
    const subEl = root.querySelector('[data-inspect-sub]');
    const dx = Number(art.dataset.deltaX), dy = Number(art.dataset.deltaY);
    const rig = model.rig && RIGS[model.rig.kind] ? RIGS[model.rig.kind](root, model.rig) : null;
    const env = rig ? new Array(rig.chain).fill(1) : [];
    const stages = root.querySelectorAll('[data-stage]');
    let shown = null;

    let index = 0, position = 0, target = 0, speed = 0, last = 0, clock = 0, time = 0;
    let visible = false, frame = 0, touring = !reduced.matches;

    if (select) select.disabled = false;
    if (play) play.hidden = false;
    const fieldsContainer = root.querySelector('.inspector-fields');
    if (fieldsContainer) fieldsContainer.hidden = false;
    root.setAttribute('data-enhanced', '');
    art.tabIndex = 0;
    art.removeAttribute('aria-disabled');

    function draw() {
      const transform = 'translate(' + (dx * position).toFixed(2) + ' ' + (dy * position).toFixed(2) + ')';
      moving.forEach(function (part) { part.setAttribute('transform', transform); });
      if (!rig) return;
      // A rig works on the station it is docked at, which is the old one while the tools withdraw.
      const dock = Math.round(position * (items.length - 1));
      rig.draw({ index: dock, stage: position * (items.length - 1), position: position, env: env, time: time });
      const engaged = env[env.length - 1] > 0.5 ? dock : -1;
      if (engaged !== shown) {
        shown = engaged;
        stages.forEach(function (part) { part.toggleAttribute('data-engaged', Number(part.dataset.stage) === engaged); });
      }
    }

    // Arrival raises the envelopes in order (latch, then tool); departure lowers them in reverse,
    // and the carriage only travels once the first one is down.
    function stepEnvelopes(dt, arrived) {
      const rate = dt / 0.16;
      if (arrived) {
        for (let i = 0; i < env.length; i++) {
          if (i && env[i - 1] < 0.98) break;
          env[i] = Math.min(1, env[i] + rate * (1.15 - env[i]));
        }
      } else {
        for (let i = env.length - 1; i >= 0; i--) {
          if (i < env.length - 1 && env[i + 1] > 0.02) break;
          env[i] = Math.max(0, env[i] - rate * (env[i] + 0.15));
        }
      }
    }
    const docked = function () { return !env.length || env[0] <= 0.02; };
    const busy = function () { return env.some(function (v) { return v !== (position === target ? 1 : 0); }); };

    function setField(next, animate = true) {
      index = next;
      target = items.length > 1 ? index / (items.length - 1) : 0;
      const item = items[index];
      choices.forEach(function (button) {
        button.setAttribute('aria-pressed', String(Number(button.dataset.inspectChoice) === index));
      });
      const displayRate = item.rate !== undefined ? item.rate + '%' : item.metric;
      const ariaVal = item.rate !== undefined ? item.label + ': ' + item.rate + '% filled' : item.label + ': ' + item.metric;
      art.setAttribute('aria-valuenow', String(index));
      art.setAttribute('aria-valuetext', ariaVal);
      root.querySelectorAll('[data-tray], [data-stage]').forEach(function (part) {
        const val = Number(part.dataset.tray !== undefined ? part.dataset.tray : part.dataset.stage);
        part.toggleAttribute('data-active', val === index);
      });
      if (select) select.value = String(index);
      if (rateEl) rateEl.textContent = displayRate;
      if (subEl && item.sub) subEl.textContent = item.sub;
      if (noteEl) noteEl.textContent = item.note;
      if (reduced.matches) { position = target; speed = 0; env.fill(1); draw(); }
      if (animate) run();
    }

    function tick(now) {
      frame = 0;
      const dt = last ? Math.min((now - last) / 1000, 0.05) : 0;
      last = now;
      if (touring) {
        clock += dt;
        if (clock > 4.2) { clock = 0; setField((index + 1) % items.length, false); }
      }
      time += dt;
      if (reduced.matches) { position = target; speed = 0; env.fill(1); }
      else if (!rig) position = position + (target - position) * (1 - Math.exp(-dt / 0.25));
      else {
        stepEnvelopes(dt, position === target);
        if (docked() && position !== target) {
          // A critically damped spring: the carriage leaves gently and settles without a bump.
          const stiff = 26, damp = 2 * Math.sqrt(stiff);
          for (let i = 0; i < 4; i++) { speed += ((target - position) * stiff - speed * damp) * dt / 4; position += speed * dt / 4; }
        }
      }
      if (Math.abs(target - position) < 0.0004 && Math.abs(speed) < 0.002) { position = target; speed = 0; }
      draw();
      if (visible && !document.hidden && !reduced.matches && (touring || position !== target || busy() || (rig && rig.live && rig.live({ index: Math.round(position * (items.length - 1)), env: env })))) {
        frame = requestAnimationFrame(tick);
      }
    }

    function run() {
      if (!frame && visible && !document.hidden && !reduced.matches) {
        last = 0; frame = requestAnimationFrame(tick);
      }
    }

    function stop() { if (frame) cancelAnimationFrame(frame); frame = 0; last = 0; }

    function setTour(next) {
      touring = next;
      clock = 0;
      if (play) {
        play.setAttribute('aria-pressed', String(next));
        play.textContent = reduced.matches ? 'Next field' : next ? 'Pause tour' : 'Play tour';
      }
      if (readout) readout.setAttribute('aria-live', next ? 'off' : 'polite');
      if (next) run();
    }

    if (select) select.addEventListener('change', function () { setTour(false); setField(Number(select.value)); });
    choices.forEach(function (button) {
      button.addEventListener('click', function () { setTour(false); setField(Number(button.dataset.inspectChoice)); });
    });
    art.addEventListener('click', function (event) {
      const activeEl = event.target.closest('[data-tray], [data-stage]');
      if (activeEl) {
        const val = Number(activeEl.dataset.tray !== undefined ? activeEl.dataset.tray : activeEl.dataset.stage);
        setTour(false); setField(val);
      }
    });
    art.addEventListener('keydown', function (event) {
      let next = index;
      if (event.key === 'ArrowRight' || event.key === 'ArrowDown') next = Math.min(items.length - 1, index + 1);
      else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') next = Math.max(0, index - 1);
      else if (event.key === 'Home') next = 0;
      else if (event.key === 'End') next = items.length - 1;
      else return;
      event.preventDefault(); setTour(false); setField(next);
    });
    if (play) {
      play.addEventListener('click', function () {
        if (reduced.matches) { setTour(false); setField((index + 1) % items.length); }
        else setTour(!touring);
      });
    }
    reduced.addEventListener('change', function () { setTour(false); stop(); position = target; speed = 0; env.fill(1); draw(); });
    document.addEventListener('visibilitychange', function () { if (document.hidden) stop(); else run(); });

    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (entries) {
        visible = entries[entries.length - 1].isIntersecting;
        if (visible) run(); else stop();
      }).observe(root);
    } else { visible = true; run(); }

    setTour(touring);
    draw();
  }

  document.querySelectorAll('.data-inspector').forEach(initInspector);

  // Print guides preview interaction (if present on page)
  const preview = document.querySelector('[data-guide-preview]');
  const previewOpen = document.querySelector('[data-guide-open]');
  const previewCaption = document.querySelector('[data-guide-caption]');
  let previewRequest = 0;
  let previewTimer;
  if (preview && previewOpen && previewCaption) {
    const overlay = preview.cloneNode(false);
    overlay.removeAttribute('data-guide-preview'); overlay.removeAttribute('loading');
    overlay.classList.add('guide-preview-overlay'); overlay.alt = ''; overlay.setAttribute('aria-hidden', 'true');
    preview.parentElement.append(overlay);
    function commitPreview() {
      clearTimeout(previewTimer);
      preview.src = overlay.src;
      overlay.classList.remove('is-fading');
    }
    overlay.addEventListener('animationend', commitPreview);
    if ('IntersectionObserver' in window) {
      const warmer = new IntersectionObserver(function (entries) {
        if (!entries.some(function (entry) { return entry.isIntersecting; })) return;
        document.querySelectorAll('[data-guide-image]').forEach(function (link) {
          const image = new Image(); image.src = link.dataset.guideImage;
        });
        warmer.disconnect();
      }, { rootMargin: '1000px 0px' });
      warmer.observe(preview.parentElement);
    }
    reduced.addEventListener('change', function () {
      if (reduced.matches && overlay.classList.contains('is-fading')) commitPreview();
    });
    document.querySelectorAll('[data-guide-image]').forEach(function (link) {
      async function showPreview() {
        const request = ++previewRequest;
        const next = new Image(); next.src = link.dataset.guideImage;
        try { await next.decode(); } catch (_) { return; }
        if (request !== previewRequest) return;
        clearTimeout(previewTimer);
        overlay.classList.remove('is-fading');
        if (reduced.matches) preview.src = next.src;
        else {
          overlay.src = next.src;
          void overlay.offsetWidth;
          overlay.classList.add('is-fading');
          previewTimer = setTimeout(commitPreview, 650);
        }
        preview.alt = 'Preview: ' + link.dataset.guideLabel;
        previewOpen.href = link.href;
        previewOpen.setAttribute('aria-label', 'Open PDF: ' + link.dataset.guideLabel);
        previewCaption.textContent = link.dataset.guideLabel;
      }
      link.addEventListener('pointerenter', showPreview);
      link.addEventListener('focus', showPreview);
    });
  }
})();
