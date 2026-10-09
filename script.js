// HLP Data site script. No framework, no dependency. Every feature checks for its markup first,
// so one file serves every page.

(function () {
  'use strict';

  // ------------------------------------------------------------------
  // Funnel measurement: begin_checkout, file_download, generate_lead.
  // Sent to Umami (cookieless) once its script has loaded, otherwise dropped.
  // No form content or email address is ever sent. Capture phase so the
  // Payhip overlay script cannot swallow the click first.
  // ------------------------------------------------------------------
  function hlpTrack(name, params) {
    try {
      if (window.umami && typeof window.umami.track === 'function') window.umami.track(name, params || {});
    } catch (e) { /* measurement must never break the page */ }
  }
  window.hlpTrack = hlpTrack;

  function fileNameOf(href) {
    const clean = (href || '').split('#')[0].split('?')[0];
    return clean.substring(clean.lastIndexOf('/') + 1);
  }

  document.addEventListener('click', function (e) {
    const el = e.target && e.target.closest ? e.target.closest('a, .payhip-buy-button') : null;
    if (!el) return;
    const href = el.getAttribute('href') || '';
    const page = window.location.pathname;
    if (el.classList.contains('payhip-buy-button') || /payhip\.com/i.test(href)) {
      const m = /payhip\.com\/b\/([A-Za-z0-9]+)/i.exec(href);
      hlpTrack('begin_checkout', { item_id: (m && m[1]) || el.getAttribute('data-product') || '', page: page });
    } else if (el.tagName === 'A' && (el.hasAttribute('download') || /\.csv$/i.test(href.split('#')[0].split('?')[0]))) {
      hlpTrack('file_download', { file_name: fileNameOf(href) || el.getAttribute('download') || '' });
    } else if (/^mailto:/i.test(href)) {
      hlpTrack('generate_lead', { page: page });
    }
  }, true);

  // ------------------------------------------------------------------
  // Mobile menu
  // ------------------------------------------------------------------
  function initMenu() {
    const button = document.querySelector('.menu-button');
    const menu = document.getElementById('mobile-menu');
    if (!button || !menu) return;
    const icon = button.querySelector('i');
    const setOpen = function (open) {
      menu.setAttribute('data-open', open ? 'true' : 'false');
      button.setAttribute('aria-expanded', open ? 'true' : 'false');
      button.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
      if (icon) icon.className = open ? 'ph ph-x' : 'ph ph-list';
    };
    button.addEventListener('click', function () {
      setOpen(menu.getAttribute('data-open') !== 'true');
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && menu.getAttribute('data-open') === 'true') {
        setOpen(false);
        button.focus();
      }
    });
    window.matchMedia('(min-width: 861px)').addEventListener('change', function (mq) {
      if (mq.matches) setOpen(false);
    });
  }

  // ------------------------------------------------------------------
  // Dataset filters: chips (data-filter) + optional search box.
  // Rows carry data-tags="real-estate portugal ..." and are hidden, never removed.
  // ------------------------------------------------------------------
  function initFilters() {
    document.querySelectorAll('[data-dataset-filter]').forEach(function (root) {
      const list = document.getElementById(root.getAttribute('data-dataset-filter'));
      if (!list) return;
      const rows = Array.prototype.slice.call(list.querySelectorAll('[data-tags]'));
      const chips = Array.prototype.slice.call(root.querySelectorAll('[data-filter]'));
      const search = root.querySelector('input[type="search"]');
      const empty = document.getElementById(list.id + '-empty');
      const status = document.getElementById(list.id + '-status');
      const linked = document.querySelectorAll('[data-filter-sync="' + list.id + '"] [data-tags]');
      let active = 'all';

      chips.forEach(function (chip) {
        const tag = chip.getAttribute('data-filter');
        const count = tag === 'all' ? rows.length : rows.filter(function (r) { return hasTag(r, tag); }).length;
        const badge = chip.querySelector('.filter-count');
        if (badge) badge.textContent = String(count);
        chip.addEventListener('click', function () {
          active = tag;
          chips.forEach(function (c) { c.setAttribute('aria-pressed', c === chip ? 'true' : 'false'); });
          apply();
        });
      });
      if (search) search.addEventListener('input', apply);

      function hasTag(row, tag) {
        return (' ' + row.getAttribute('data-tags') + ' ').indexOf(' ' + tag + ' ') !== -1;
      }

      function apply() {
        const q = search ? search.value.trim().toLowerCase() : '';
        let shown = 0;
        const visible = {};
        rows.forEach(function (row) {
          const okTag = active === 'all' || hasTag(row, active);
          const okText = !q || row.textContent.toLowerCase().indexOf(q) !== -1;
          row.hidden = !(okTag && okText);
          if (!row.hidden) {
            shown += 1;
            visible[row.getAttribute('data-id')] = true;
          }
        });
        linked.forEach(function (row) { row.hidden = !visible[row.getAttribute('data-id')]; });
        if (empty) empty.hidden = shown !== 0;
        if (status) status.textContent = shown === rows.length ? 'Showing all ' + shown + ' datasets' : 'Showing ' + shown + ' of ' + rows.length + ' datasets';
      }

      const reset = empty ? empty.querySelector('[data-filter-reset]') : null;
      if (reset) {
        reset.addEventListener('click', function () {
          active = 'all';
          if (search) search.value = '';
          chips.forEach(function (c) { c.setAttribute('aria-pressed', c.getAttribute('data-filter') === 'all' ? 'true' : 'false'); });
          apply();
        });
      }
    });
  }

  // ------------------------------------------------------------------
  // Bar charts with a metric switch. Each <li> carries one data-* value per
  // metric; the switch rescales the bars and rewrites the value labels.
  // ------------------------------------------------------------------
  function initCharts() {
    document.querySelectorAll('[data-chart]').forEach(function (chart) {
      const list = chart.querySelector('.bars');
      const buttons = chart.querySelectorAll('[data-metric]');
      if (!list || !buttons.length) return;
      const items = Array.prototype.slice.call(list.querySelectorAll('li'));

      function show(metric, prefix, suffix) {
        const values = items.map(function (li) { return Number(li.getAttribute('data-' + metric)); });
        const max = Math.max.apply(null, values);
        const order = items.map(function (li, i) { return { li: li, v: values[i] }; }).sort(function (a, b) { return b.v - a.v; });
        order.forEach(function (o, rank) {
          o.li.style.order = String(rank);
          o.li.classList.toggle('is-top', rank === 0);
          o.li.querySelector('.track span').style.setProperty('--pct', (o.v / max * 100).toFixed(1) + '%');
          o.li.querySelector('.value').textContent = prefix + o.v.toLocaleString('en-US') + suffix;
        });
      }

      buttons.forEach(function (b) {
        b.addEventListener('click', function () {
          buttons.forEach(function (x) { x.setAttribute('aria-pressed', x === b ? 'true' : 'false'); });
          show(b.getAttribute('data-metric'), b.getAttribute('data-prefix') || '', b.getAttribute('data-suffix') || '');
        });
      });
    });
  }

  // ------------------------------------------------------------------
  // Sample table: reads the real public sample CSV and shows the first rows.
  // ------------------------------------------------------------------
  function parseCsv(text) {
    text = text.replace(/^﻿/, '');
    const firstLine = text.slice(0, text.indexOf('\n') === -1 ? text.length : text.indexOf('\n'));
    const sep = (firstLine.split(';').length >= firstLine.split(',').length) ? ';' : ',';
    const rows = [];
    let row = [];
    let cell = '';
    let quoted = false;
    for (let i = 0; i < text.length; i++) {
      const c = text[i];
      if (quoted) {
        if (c === '"' && text[i + 1] === '"') { cell += '"'; i++; }
        else if (c === '"') quoted = false;
        else cell += c;
      } else if (c === '"') quoted = true;
      else if (c === sep) { row.push(cell); cell = ''; }
      else if (c === '\n' || c === '\r') {
        if (c === '\r' && text[i + 1] === '\n') i++;
        row.push(cell); cell = '';
        if (row.length > 1 || row[0] !== '') rows.push(row);
        row = [];
      } else cell += c;
    }
    if (cell !== '' || row.length) { row.push(cell); rows.push(row); }
    return { headers: rows[0] || [], rows: rows.slice(1) };
  }

  function el(tag, cls, text) {
    const node = document.createElement(tag);
    if (cls) node.className = cls;
    if (text !== undefined) node.textContent = text;
    return node;
  }

  function initSamples() {
    document.querySelectorAll('[data-sample-src]').forEach(function (box) {
      const src = box.getAttribute('data-sample-src');
      const wanted = (box.getAttribute('data-columns') || '').split(',').map(function (s) { return s.trim(); }).filter(Boolean);
      const limit = Number(box.getAttribute('data-rows') || 8);
      const status = box.querySelector('.sample-status');
      fetch(src, { cache: 'no-cache' })
        .then(function (res) { if (!res.ok) throw new Error('HTTP ' + res.status); return res.text(); })
        .then(function (text) {
          const data = parseCsv(text);
          const cols = (wanted.length ? wanted : data.headers.slice(0, 8))
            .map(function (c) { return data.headers.indexOf(c); })
            .filter(function (i) { return i !== -1; });
          const rows = data.rows.slice(0, limit);
          const numeric = cols.map(function (ci) {
            return rows.every(function (r) { return r[ci] === '' || r[ci] === undefined || /^-?\d+(\.\d+)?$/.test(r[ci]); });
          });
          const table = el('table', 'table table-compact');
          const thead = el('thead');
          const hr = el('tr');
          cols.forEach(function (ci, k) {
            const th = el('th', numeric[k] ? 'num' : '', data.headers[ci]);
            th.scope = 'col';
            hr.appendChild(th);
          });
          thead.appendChild(hr);
          table.appendChild(thead);
          const tbody = el('tbody');
          rows.forEach(function (r) {
            const tr = el('tr');
            cols.forEach(function (ci, k) {
              const v = r[ci] === undefined ? '' : r[ci];
              const td = el('td', numeric[k] ? 'num' : 'clip', v === '' ? 'empty' : v);
              if (v === '') td.classList.add('muted');
              if (!numeric[k] && v.length > 28) td.title = v;
              tr.appendChild(td);
            });
            tbody.appendChild(tr);
          });
          table.appendChild(tbody);
          const cap = el('caption', '', 'First ' + rows.length + ' of ' + data.rows.length + ' sample rows, ' + cols.length + ' of ' + data.headers.length + ' columns shown. The download has every column.');
          table.appendChild(cap);
          box.replaceChildren(table);
        })
        .catch(function () {
          if (status) status.textContent = 'The sample preview could not load here. The CSV download below still works.';
        });
    });
  }

  // ------------------------------------------------------------------
  // Custom data form: validates inline, then posts to admin.hlpdata.com/api/leads, which stores the
  // request and redirects back here with ?sent=<reference> or ?error=<code>. The page only says
  // "received" when the server sent a reference back: it never assumes receipt.
  // ------------------------------------------------------------------
  const LEAD_ERRORS = {
    missing: 'A required field was empty. Please fill it in and send again.',
    bad_email: 'The email address was not accepted. Please check it and send again.',
    too_long: 'One of the fields is too long. Please shorten it and send again.',
    too_fast: 'The form was sent too quickly to be checked. Please wait a few seconds and send again.',
    too_large: 'The request is too long. Please shorten it and send again.',
    rate: 'Several requests came from your connection in the last hour. Please email sales@hlpdata.com instead.',
    server: 'We could not save your request just now. Please email sales@hlpdata.com instead.'
  };

  function showLeadStatus() {
    const box = document.getElementById('formStatus');
    if (!box) return;
    const params = new URLSearchParams(window.location.search);
    const sent = params.get('sent');
    const error = params.get('error');
    if (!sent && !error) return;
    const title = document.getElementById('formStatusTitle');
    const text = document.getElementById('formStatusText');
    if (sent) {
      title.textContent = 'Request received';
      text.textContent = (/^HLP-[0-9A-F]{6}$/.test(sent) ? 'Your reference is ' + sent + '. ' : '') +
        'We reply by email to the address you gave, usually with questions or a quote.';
      hlpTrack('generate_lead', { page: window.location.pathname, method: 'custom_form' });
    } else {
      box.classList.add('is-error');
      title.textContent = 'Your request was not sent';
      text.textContent = LEAD_ERRORS[error] || LEAD_ERRORS.server;
    }
    box.hidden = false;
    box.focus();
  }

  function initRequestForm() {
    showLeadStatus();
    const form = document.getElementById('customDataForm');
    if (!form) return;
    const started = form.querySelector('input[name="t"]');
    if (started) started.value = String(Date.now());

    function validate(input) {
      const group = input.closest('.field-group');
      const ok = input.checkValidity();
      if (group) group.setAttribute('data-invalid', ok ? 'false' : 'true');
      input.setAttribute('aria-invalid', ok ? 'false' : 'true');
      return ok;
    }

    const fields = form.querySelectorAll('.field-group input, .field-group textarea, .field-group select');
    fields.forEach(function (input) {
      input.addEventListener('blur', function () { if (input.value) validate(input); });
      input.addEventListener('input', function () {
        const group = input.closest('.field-group');
        if (group && group.getAttribute('data-invalid') === 'true') validate(input);
      });
    });

    form.addEventListener('submit', function (e) {
      let firstBad = null;
      fields.forEach(function (input) {
        if (!validate(input) && !firstBad) firstBad = input;
      });
      if (firstBad) {
        e.preventDefault();
        firstBad.focus();
        return;
      }
      const btn = document.getElementById('submitBtn');
      if (btn) { btn.disabled = true; btn.textContent = 'Sending'; }
    });
  }

  // ------------------------------------------------------------------
  // Motion. All of it is decoration: the page is complete without it, and
  // none of it runs when the visitor asks for reduced motion.
  // ------------------------------------------------------------------
  const REDUCED = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const GLOW_CARDS = '.dataset-row, .feature-card, .steps > li';
  const REVEAL_BLOCKS = 'main .section-head, .dataset-row, .feature-card, .chart, .steps > li, .cta-band, .cta-final, .faq details';

  // Cards light up under the pointer: the stylesheet reads --mx / --my.
  function initCardGlow() {
    if (REDUCED || !window.matchMedia('(hover: hover)').matches) return;
    document.addEventListener('pointermove', function (e) {
      const card = e.target && e.target.closest ? e.target.closest(GLOW_CARDS) : null;
      if (!card) return;
      const box = card.getBoundingClientRect();
      card.style.setProperty('--mx', (e.clientX - box.left) + 'px');
      card.style.setProperty('--my', (e.clientY - box.top) + 'px');
    }, { passive: true });
  }

  // Blocks that start below the fold fade up once as they scroll in. Blocks already on
  // screen are never hidden, so nothing blinks while this script loads.
  function initReveal() {
    if (REDUCED || !('IntersectionObserver' in window)) return;
    const fold = window.innerHeight;
    const observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        const node = entry.target;
        observer.unobserve(node);
        node.classList.remove('reveal-pending');
        // The reveal transition would otherwise replace the card's own hover transition.
        window.setTimeout(function () {
          node.classList.remove('reveal');
          node.style.removeProperty('transition-delay');
        }, 900);
      });
    }, { rootMargin: '0px 0px -8% 0px' });
    const perParent = new Map();
    document.querySelectorAll(REVEAL_BLOCKS).forEach(function (node) {
      if (node.hidden || node.getBoundingClientRect().top < fold) return;
      const k = perParent.get(node.parentNode) || 0;
      perParent.set(node.parentNode, k + 1);
      node.style.transitionDelay = (Math.min(k, 5) * 60) + 'ms';
      node.classList.add('reveal', 'reveal-pending');
      observer.observe(node);
    });
  }

  // The hero totals count up to the number that is already in the page.
  function initCountUp() {
    if (REDUCED) return;
    document.querySelectorAll('.hero-facts dd').forEach(function (node) {
      const final = node.textContent.trim();
      if (!/^\d[\d,]*$/.test(final)) return;
      const target = Number(final.replace(/,/g, ''));
      const started = performance.now();
      const duration = 1100;
      function frame(now) {
        const p = Math.min(1, (now - started) / duration);
        const eased = 1 - Math.pow(1 - p, 3);
        node.textContent = p === 1 ? final : Math.round(target * eased).toLocaleString('en-US');
        if (p < 1) window.requestAnimationFrame(frame);
      }
      window.requestAnimationFrame(frame);
    });
  }

  function ready(fn) {
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', fn);
    else fn();
  }

  ready(function () {
    initMenu();
    initFilters();
    initCharts();
    initSamples();
    initRequestForm();
    initCardGlow();
    initReveal();
    initCountUp();
  });
})();
