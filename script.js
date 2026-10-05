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
  // Custom data form: validates inline, then hands the request to the
  // visitor's email app (the site has no backend). Never claims receipt.
  // ------------------------------------------------------------------
  function initRequestForm() {
    const form = document.getElementById('customDataForm');
    if (!form) return;
    const notice = document.getElementById('formMailtoNotice');
    const reopen = document.getElementById('reopenMailtoLink');
    const copyBtn = document.getElementById('copyRequestBtn');
    const copyLabel = document.getElementById('copyRequestLabel');
    let lastRequestText = '';

    function validate(input) {
      const group = input.closest('.field-group');
      const ok = input.checkValidity();
      if (group) group.setAttribute('data-invalid', ok ? 'false' : 'true');
      input.setAttribute('aria-invalid', ok ? 'false' : 'true');
      return ok;
    }

    form.querySelectorAll('input, textarea, select').forEach(function (input) {
      input.addEventListener('blur', function () { if (input.value) validate(input); });
      input.addEventListener('input', function () {
        const group = input.closest('.field-group');
        if (group && group.getAttribute('data-invalid') === 'true') validate(input);
      });
    });

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      let firstBad = null;
      form.querySelectorAll('input, textarea, select').forEach(function (input) {
        if (!validate(input) && !firstBad) firstBad = input;
      });
      if (firstBad) { firstBad.focus(); return; }
      const val = function (id) { return document.getElementById(id).value.trim(); };
      const subject = '[Custom Dataset Request] ' + val('company') + ' - ' + val('targetWebsite');
      const body =
        'Name: ' + val('fullName') + '\n' +
        'Work Email: ' + val('workEmail') + '\n' +
        'Company: ' + val('company') + '\n' +
        'Target Website: ' + val('targetWebsite') + '\n' +
        'Update Frequency: ' + val('updateFrequency') + '\n' +
        'Delivery Preference: ' + val('deliveryPreference') + '\n\n' +
        'Required Fields:\n' + val('dataFields') + '\n\n' +
        'Additional Notes:\n' + val('notes');
      lastRequestText = 'To: sales@hlpdata.com\nSubject: ' + subject + '\n\n' + body;
      const mailtoUrl = 'mailto:sales@hlpdata.com?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
      if (reopen) reopen.setAttribute('href', mailtoUrl);
      if (copyLabel) copyLabel.textContent = 'Copy request text';
      if (notice) { notice.hidden = false; notice.focus(); }
      hlpTrack('generate_lead', { page: window.location.pathname, method: 'custom_form' });
      window.location.href = mailtoUrl;
    });

    if (copyBtn) {
      copyBtn.addEventListener('click', function () {
        if (!lastRequestText) return;
        const done = function (ok) { if (copyLabel) copyLabel.textContent = ok ? 'Copied' : 'Copy failed, select the text in your email app instead'; };
        if (navigator.clipboard && window.isSecureContext) {
          navigator.clipboard.writeText(lastRequestText).then(function () { done(true); }, function () { done(false); });
        } else {
          done(false);
        }
      });
    }
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
  });
})();
