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
    button.closest('header').classList.add('menu-ready');
    const icon = button.querySelector('i');
    const label = button.querySelector('[data-menu-label]');
    const setOpen = function (open) {
      menu.setAttribute('data-open', open ? 'true' : 'false');
      button.setAttribute('aria-expanded', open ? 'true' : 'false');
      button.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
      if (icon) icon.className = open ? 'ph ph-x' : 'ph ph-list';
      if (label) label.textContent = open ? 'Close' : 'Menu';
    };
    button.addEventListener('click', function () {
      setOpen(menu.getAttribute('data-open') !== 'true');
    });
    menu.addEventListener('click', function (e) { if (e.target.closest('a')) setOpen(false); });
    document.addEventListener('click', function (e) {
      if (!menu.contains(e.target) && !button.contains(e.target)) setOpen(false);
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
          if (list.hasAttribute('data-preview')) list.setAttribute('data-preview', 'false');
          active = tag;
          chips.forEach(function (c) { c.setAttribute('aria-pressed', c === chip ? 'true' : 'false'); });
          apply();
        });
      });
      if (list.id === 'catalog-list') {
        const label = el('label', 'filter-view', 'View');
        const select = el('select');
        select.setAttribute('aria-label', 'Filter datasets');
        chips.forEach(function (chip) {
          const option = el('option', '', chip.textContent.replace(/(\D)(\d+)$/, '$1 ($2)'));
          option.value = chip.getAttribute('data-filter');
          select.appendChild(option);
          chip.addEventListener('click', function () { select.value = option.value; });
        });
        select.addEventListener('change', function () { chips.find(function (chip) { return chip.getAttribute('data-filter') === select.value; }).click(); });
        label.appendChild(select); root.appendChild(label); root.classList.add('has-mobile-view');
      }
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
        if (status) status.textContent = list.getAttribute('data-preview') === 'true' ?
          'Showing ' + Math.min(3, shown) + ' selected datasets from a catalog of ' + rows.length :
          shown === rows.length ? 'Showing all ' + shown + ' datasets' : 'Showing ' + shown + ' of ' + rows.length + ' datasets';
        const more = list.parentElement.querySelector('.home-list-more p');
        if (more) more.textContent = list.getAttribute('data-preview') === 'true' ?
          'Showing a selection. The full catalog includes every dataset.' :
          'Showing every matching dataset. Search and compare in the full catalog.';
      }

      const reset = empty ? empty.querySelector('[data-filter-reset]') : null;
      if (reset) {
        reset.addEventListener('click', function () {
          active = 'all';
          if (search) search.value = '';
          chips.forEach(function (c) { c.setAttribute('aria-pressed', c.getAttribute('data-filter') === 'all' ? 'true' : 'false'); });
          const view = root.querySelector('.filter-view select');
          if (view) view.value = 'all';
          apply();
        });
      }
      apply();
    });
  }

  function initCatalogSort() {
    const control = document.querySelector('[data-dataset-sort]');
    const list = document.getElementById('catalog-list');
    if (!control || !list) return;
    const rows = Array.from(list.querySelectorAll('.dataset-row'));
    const values = rows.map(function (row, index) {
      const snapshot = row.querySelector('.kicker')?.textContent.match(/Snapshot\s+(\d{4})(?:-(\d{2})-(\d{2})|-Q([1-4]))/);
      const date = snapshot ? Date.UTC(Number(snapshot[1]), snapshot[4] ? (Number(snapshot[4]) - 1) * 3 : Number(snapshot[2]) - 1, snapshot[3] ? Number(snapshot[3]) : 1) : 0;
      const priceText = row.querySelector('.amount')?.textContent || '';
      const price = /\d/.test(priceText) ? Number(priceText.replace(/[^\d.]/g, '')) : Infinity;
      return { row: row, original: index, newest: date, rows: Number((row.querySelector('.facts dd')?.textContent || '0').replace(/[^\d]/g, '')), price: price };
    });
    control.addEventListener('change', function () {
      const key = control.value;
      values.slice().sort(function (a, b) {
        const delta = key === 'original' ? a.original - b.original : key === 'price' ? a.price - b.price : b[key] - a[key];
        return delta || a.original - b.original;
      }).forEach(function (item) { list.appendChild(item.row); });
      const status = document.getElementById('catalog-list-status');
      if (status) status.textContent = 'Sorted by ' + control.selectedOptions[0].textContent.toLowerCase() + '. ' + rows.filter(function (r) { return !r.hidden; }).length + ' datasets shown.';
    });
  }

  function initReadingTools() {
    const prose = document.querySelector('.prose');
    if (prose && !document.querySelector('.toc')) {
      const headings = Array.from(prose.querySelectorAll('h2'));
      if (headings.length > 2) {
        const nav = el('nav', 'toc');
        nav.setAttribute('aria-label', 'On this page');
        nav.appendChild(el('p', '', 'On this page'));
        const links = el('ul');
        headings.forEach(function (heading, i) {
          if (!heading.id) heading.id = 'section-' + (i + 1);
          const li = el('li');
          const a = el('a', '', heading.textContent);
          a.href = '#' + heading.id; li.appendChild(a); links.appendChild(li);
        });
        nav.appendChild(links); prose.prepend(nav);
      }
    }
    const head = document.querySelector('.product-head');
    if (head) {
      const nav = el('nav', 'product-jumps');
      nav.setAttribute('aria-label', 'Dataset sections');
      [['sample', 'Sample rows'], ['schema', 'Schema'], ['limits', 'Known limits'], ['licence', 'Licence']].forEach(function (item) {
        if (!document.getElementById(item[0])) return;
        const a = el('a', '', item[1]); a.href = '#' + item[0]; nav.appendChild(a);
      });
      if (nav.children.length) head.appendChild(nav);
    }
    document.querySelectorAll('.buy-panel .includes').forEach(function (list) {
      const details = el('details', 'buy-details');
      const summary = el('summary', '', 'What is included');
      details.open = matchMedia('(min-width: 1024px)').matches;
      list.before(details); details.appendChild(summary); details.appendChild(list);
      matchMedia('(min-width: 1024px)').addEventListener('change', function (e) { details.open = e.matches; });
    });
    document.querySelectorAll('pre.code').forEach(function (pre) {
      const wrap = el('div', 'code-wrap');
      pre.before(wrap); wrap.appendChild(pre);
      const button = el('button', 'code-copy', 'Copy code');
      button.type = 'button';
      button.addEventListener('click', async function () {
        try {
          await navigator.clipboard.writeText(pre.textContent);
          button.textContent = 'Copied';
        } catch (_) {
          const range = document.createRange(); range.selectNodeContents(pre);
          const selection = window.getSelection(); selection.removeAllRanges(); selection.addRange(range);
          button.textContent = 'Code selected';
        }
        window.setTimeout(function () { button.textContent = 'Copy code'; }, 2000);
      });
      wrap.appendChild(button);
    });
    document.querySelectorAll('.table-scroll').forEach(function (box) {
      const hint = el('p', 'scroll-help', 'Swipe or scroll to see every column.');
      hint.hidden = true; box.after(hint);
      function update() {
        const scrolls = box.scrollWidth > box.clientWidth + 2;
        hint.hidden = !scrolls;
        if (scrolls) { box.tabIndex = 0; box.setAttribute('role', 'region'); box.setAttribute('aria-label', 'Scrollable data table'); }
        else { box.removeAttribute('tabindex'); box.removeAttribute('role'); box.removeAttribute('aria-label'); }
      }
      update();
      if ('ResizeObserver' in window) new ResizeObserver(update).observe(box);
      new MutationObserver(update).observe(box, { childList: true });
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
    form.noValidate = true;
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
      const group = input.closest('.field-group');
      const descriptions = [];
      group.querySelectorAll('.help, .error').forEach(function (text, i) {
        if (!text.id) text.id = input.id + '-hint-' + i;
        descriptions.push(text.id);
      });
      if (descriptions.length) input.setAttribute('aria-describedby', descriptions.join(' '));
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
  const REVEAL_BLOCKS = 'main .section-head h2, main .section-head p, main .section-head > .link-arrow, .feature-list > div, .chart, .steps > li, .cta-band > *, .cta-final > *, .faq > details';

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
        // The reveal transition would otherwise replace the block's own hover transition.
        window.setTimeout(function () { node.classList.remove('reveal'); }, 600);
      });
    }, { rootMargin: '0px 0px -8% 0px' });
    document.querySelectorAll(REVEAL_BLOCKS).forEach(function (node) {
      if (node.hidden || node.getBoundingClientRect().top < fold) return;
      node.classList.add('reveal', 'reveal-pending');
      observer.observe(node);
    });
  }

  function ready(fn) {
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', fn);
    else fn();
  }

  ready(function () {
    initMenu();
    initFilters();
    initCatalogSort();
    initCharts();
    initSamples();
    initRequestForm();
    initReadingTools();
    initReveal();
  });
})();
