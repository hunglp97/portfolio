(function () {
  'use strict';
  const root = document.querySelector('.data-inspector');
  const data = document.getElementById('inspection-model');
  if (!root || !data) return;
  let model;
  try { model = JSON.parse(data.textContent); } catch (_) { return; }
  const select = root.querySelector('[data-inspect-field]');
  const play = root.querySelector('[data-inspect-tour]');
  const readout = root.querySelector('.inspector-result');
  const art = root.querySelector('.inspector-art');
  const moving = root.querySelectorAll('[data-scanner]');
  const choices = root.querySelectorAll('[data-inspect-choice]');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const dx = Number(art.dataset.deltaX), dy = Number(art.dataset.deltaY);
  let index = 0, position = 0, target = 0, last = 0, clock = 0;
  let visible = false, frame = 0, touring = !reduced.matches;
  select.disabled = false;
  play.hidden = false;
  root.querySelector('.inspector-fields').hidden = false;
  root.setAttribute('data-enhanced', '');
  art.tabIndex = 0;
  art.removeAttribute('aria-disabled');

  function draw() {
    const transform = 'translate(' + (dx * position).toFixed(2) + ' ' + (dy * position).toFixed(2) + ')';
    moving.forEach(function (part) { part.setAttribute('transform', transform); });
  }
  function setField(next, animate = true) {
    index = next;
    target = index / (model.fields.length - 1);
    const field = model.fields[index];
    choices.forEach(function (button) { button.setAttribute('aria-pressed', String(Number(button.dataset.inspectChoice) === index)); });
    art.setAttribute('aria-valuenow', String(index));
    art.setAttribute('aria-valuetext', field.label + ': ' + field.rate + '% filled');
    root.querySelectorAll('[data-tray]').forEach(function (part) {
      part.toggleAttribute('data-active', Number(part.dataset.tray) === index);
    });
    select.value = String(index);
    root.querySelector('[data-inspect-rate]').textContent = field.rate + '%';
    root.querySelector('[data-inspect-note]').textContent = field.note;
    if (reduced.matches) { position = target; draw(); }
    if (animate) run();
  }
  function tick(now) {
    frame = 0;
    const dt = last ? Math.min((now - last) / 1000, .05) : 0;
    last = now;
    if (touring) {
      clock += dt;
      if (clock > 4.2) { clock = 0; setField((index + 1) % model.fields.length, false); }
    }
    position = reduced.matches ? target : position + (target - position) * (1 - Math.exp(-dt / .25));
    if (Math.abs(target - position) < .0001) position = target;
    draw();
    if (visible && !document.hidden && !reduced.matches && (touring || position !== target)) frame = requestAnimationFrame(tick);
  }
  function run() {
    if (!frame && visible && !document.hidden && !reduced.matches) { last = 0; frame = requestAnimationFrame(tick); }
  }
  function stop() { if (frame) cancelAnimationFrame(frame); frame = 0; last = 0; }
  function setTour(next) {
    touring = next;
    clock = 0;
    play.setAttribute('aria-pressed', String(next));
    play.textContent = reduced.matches ? 'Next field' : next ? 'Pause tour' : 'Play tour';
    readout.setAttribute('aria-live', next ? 'off' : 'polite');
    if (next) run();
  }
  select.addEventListener('change', function () { setTour(false); setField(Number(select.value)); });
  choices.forEach(function (button) {
    button.addEventListener('click', function () { setTour(false); setField(Number(button.dataset.inspectChoice)); });
  });
  art.addEventListener('click', function (event) {
    const tray = event.target.closest('[data-tray]');
    if (tray) { setTour(false); setField(Number(tray.dataset.tray)); }
  });
  art.addEventListener('keydown', function (event) {
    let next = index;
    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') next = Math.min(model.fields.length - 1, index + 1);
    else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') next = Math.max(0, index - 1);
    else if (event.key === 'Home') next = 0;
    else if (event.key === 'End') next = model.fields.length - 1;
    else return;
    event.preventDefault(); setTour(false); setField(next);
  });
  play.addEventListener('click', function () {
    if (reduced.matches) { setTour(false); setField((index + 1) % model.fields.length); }
    else setTour(!touring);
  });
  reduced.addEventListener('change', function () { setTour(false); stop(); position = target; draw(); });
  document.addEventListener('visibilitychange', function () { if (document.hidden) stop(); else run(); });
  if ('IntersectionObserver' in window) new IntersectionObserver(function (entries) {
    visible = entries[entries.length - 1].isIntersecting;
    if (visible) run(); else stop();
  }).observe(root);
  else { visible = true; run(); }
  setTour(touring);
  draw();

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
