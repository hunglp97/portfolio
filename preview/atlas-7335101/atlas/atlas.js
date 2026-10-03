/* Atlas: the interactive layer enhances static, checked municipality pages. */
(() => {
  'use strict';
  const counts = new Set(['listings_sale', 'listings_rent', 'agencies']);
  const official = new Set(['ine_transaction_eur_m2', 'short_term_rental_registrations']);
  const labels = {
    listings_sale: ['Sale listings', ''], listings_rent: ['Rental listings', ''],
    median_asking_price_sale: ['Median asking price · homes', '€'],
    median_asking_eur_m2_sale: ['Median asking price · homes / m²', '€/m²'],
    median_rent_month: ['Median monthly rent · homes', '€/month'],
    median_rent_eur_m2: ['Median rent · homes / m²', '€/m²/month'],
    gross_rental_yield_pct: ['Gross yield proxy', '%'],
    median_days_on_market: ['Median listing age · all types', 'days'],
    price_reduced_share_pct: ['Listings with a lower asking price · all types', '%'],
    ine_transaction_eur_m2: ['INE transaction price / m²', '€/m²'],
    asking_vs_transaction_pct: ['Asking vs INE transaction price', '%'],
    short_term_rental_registrations: ['Registered local accommodation', ''],
    agencies: ['Agencies represented', '']
  };
  function visible(key, m) {
    return m && typeof m.value === 'number' && Number.isFinite(m.value) && !m.suppressed &&
      (counts.has(key) || official.has(key) || (m.n || 0) >= 30);
  }
  function format(key, m) {
    if (!visible(key, m)) return 'Not enough data';
    const n = new Intl.NumberFormat('en-GB', {maximumFractionDigits: 1}).format(m.value);
    const unit = labels[key][1];
    return unit === '€' ? `€${n}` : `${n}${unit ? ' ' + unit : ''}`;
  }
  function colorStops(items, key) {
    const values = items.map(c => c.metrics[key]).filter(m => visible(key, m)).map(m => m.value).sort((a,b) => a-b);
    if (!values.length) return [];
    // Deduplicate thresholds: MapLibre interpolate requires strictly increasing stops.
    return [...new Set([values[0], values[Math.floor((values.length-1)/2)], values[values.length-1]])];
  }
  const api = {visible, format, colorStops};
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  if (typeof document === 'undefined') return;
  const el = id => document.getElementById(id);
  const config = JSON.parse(el('atlas-config').textContent);
  const language = config.language;
  const messages = config.messages;
  const t = (key, values = {}) => messages[key].replace(/\{([a-z_]+)\}/g, (_, k) => values[k] ?? '');
  const atlasRoot = new URL(document.body.dataset.atlasRoot || './', location.href);
  const atlasUrl = path => new URL(path, atlasRoot).href;
  const localizedFormat = (key, m) => {
    if (!visible(key, m)) return t('not_enough');
    const number = new Intl.NumberFormat(language === 'pt' ? 'pt-PT' : 'en-GB', {maximumFractionDigits:1}).format(m.value);
    const unit = messages['unit.' + key] || labels[key][1];
    return unit === '€' ? `€${number}` : `${number}${unit ? ' ' + unit : ''}`;
  };
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let map, chart, items, byCode, summary, geo, selected = '', mapReady = false;
  const metricControl = el('metric'), regionControl = el('region');
  for (const id of ['metric','region','district','country-view','globe-view','islands-view']) el(id).disabled = true;
  function mapMessage(message) {
    el('map-status').textContent = message;
    el('map-status').hidden = false;
  }
  function paint() {
    if (!mapReady) return;
    const key = metricControl.value;
    for (const f of geo.features) {
      const m = byCode.get(f.properties.code)?.metrics[key];
      f.properties.indicator = visible(key, m) ? m.value : null;
    }
    map.getSource('municipalities').setData(geo);
    const stops = colorStops(items, key), palette = ['#365e5b','#8bbb8a','#e6dc83'];
    const ramp = stops.length > 1 ? ['interpolate',['linear'],['get','indicator'],
      ...stops.flatMap((v,i) => [v,palette[Math.round(i * 2 / (stops.length-1))]])] : '#8bbb8a';
    map.setPaintProperty('municipalities-fill','fill-color',
      ['case',['==',['get','indicator'],null],'#4c5c64',ramp]);
  }
  function fitRegion(code) {
    if (!mapReady || !code) return;
    const feature = geo.features.find(f => f.properties.code === code);
    const points = [];
    function walk(c) { if (typeof c[0] === 'number') points.push(c); else c.forEach(walk); }
    walk(feature.geometry.coordinates);
    const bounds = points.reduce((b,p) => b.extend(p), new maplibregl.LngLatBounds());
    map.fitBounds(bounds, {padding:70, maxZoom:10, duration:reduced ? 0 : 900});
  }
  function filterDistrict(fly = false) {
    const district = el('district').value;
    for (const option of regionControl.options) option.hidden = Boolean(option.value && district && option.dataset.district !== district);
    if (!mapReady) return;
    const codes = items.filter(c => c.distrito === district).map(c => c.code);
    const filter = district ? ['in',['get','code'],['literal',codes]] : null;
    map.setFilter('municipalities-fill', filter);
    map.setFilter('municipalities-line', filter);
    if (district && fly) {
      const bounds = new maplibregl.LngLatBounds();
      const walk = c => typeof c[0] === 'number' ? bounds.extend(c) : c.forEach(walk);
      geo.features.filter(f => codes.includes(f.properties.code)).forEach(f => walk(f.geometry.coordinates));
      if (!bounds.isEmpty()) map.fitBounds(bounds,{padding:60,duration:reduced?0:900});
    }
  }
  function selectRegion(code, fly = false) {
    if (code && !byCode.has(code)) code = '';
    if (code && el('district').value && byCode.get(code).distrito !== el('district').value) {
      el('district').value = byCode.get(code).distrito;
      filterDistrict();
    }
    selected = code; regionControl.value = code;
    const c = byCode.get(code), metrics = c ? c.metrics : summary.national;
    el('region-name').textContent = c ? c.name : 'Portugal';
    el('region-metrics').replaceChildren();
    for (const [key,m] of Object.entries(metrics)) {
      if (!labels[key]) continue;
      const card = document.createElement('article'); card.className = 'metric';
      card.dataset.claim = c ? `concelhos.json#/items/${items.indexOf(c)}/metrics/${key}` : `summary.json#/national/${key}`;
      for (const [tag,text] of [['h3',t('metric.' + key)],['strong',localizedFormat(key,m)],['small',official.has(key) ? t('official') : `n = ${m.n ?? t('unknown')}`]]) {
        const child = document.createElement(tag); child.textContent = text; card.append(child);
      }
      el('region-metrics').append(card);
    }
    const insufficient = c && !visible(metricControl.value,c.metrics[metricControl.value]);
    el('data-status').textContent = insufficient ? t('insufficient_status') : t('observed_status');
    el('region-link').href = atlasUrl((language === 'pt' ? 'pt/' : '') + (c ? `PRT/real-estate/${code}/` : 'regions.html'));
    el('region-link').textContent = c ? t('read_region', {name:c.name}) : t('browse_profiles');
    if (mapReady) map.setFilter('selection', ['==',['get','code'],code]);
    if (fly) fitRegion(code);
    const hash = code ? `#concelho=${code}` : '';
    history.replaceState(null,'',location.pathname + location.search + hash);
  }
  async function readJSON(path) {
    const response = await fetch(atlasUrl(path), {cache:'no-cache'});
    if (!response.ok) throw new Error(`Cannot load ${path}`);
    return response.json();
  }
  async function checkedJSON(path, sha) {
    const response = await fetch(atlasUrl(`data/${path}`), {cache:'no-cache'});
    if (!response.ok) throw new Error(`Cannot load ${path}`);
    const raw = await response.arrayBuffer();
    // HTTPS and localhost expose SubtleCrypto. Else keep the static fallback.
    if (!window.crypto?.subtle) throw new Error('Data verification requires HTTPS or localhost');
    const digest = await crypto.subtle.digest('SHA-256',raw);
    const hex = Array.from(new Uint8Array(digest),b => b.toString(16).padStart(2,'0')).join('');
    if (hex !== sha) throw new Error(`Data version mismatch: ${path}`);
    return JSON.parse(new TextDecoder().decode(raw));
  }
  function loadScript(url) {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script'); script.src = url; script.async = true;
      const timer = setTimeout(() => { script.remove(); reject(new Error('Library timeout')); }, 15000);
      script.onload = () => { clearTimeout(timer); resolve(); };
      script.onerror = () => { clearTimeout(timer); reject(new Error('Library unavailable')); };
      document.head.append(script);
    });
  }
  async function loadMap() {
    try { await loadScript('https://unpkg.com/maplibre-gl@5.6.1/dist/maplibre-gl.js'); }
    catch { mapMessage(t('map_unavailable')); return; }
    if (typeof maplibregl === 'undefined' || !maplibregl.supported()) {
      mapMessage(t('map_unavailable')); return;
    }
    try {
      map = new maplibregl.Map({container:'map', center:[-15,35], zoom:1.4,
        style:'https://demotiles.maplibre.org/style.json', attributionControl:true, cooperativeGestures:true});
      map.addControl(new maplibregl.NavigationControl({showCompass:false}),'bottom-right');
      map.on('error',() => mapMessage(t('map_resources')));
      map.on('load', () => {
        map.setProjection({type:'globe'});
        map.addSource('municipalities',{type:'geojson',data:geo});
        map.addLayer({id:'municipalities-fill',type:'fill',source:'municipalities',paint:{'fill-color':'#8bbb8a','fill-opacity':.9}});
        map.addLayer({id:'municipalities-line',type:'line',source:'municipalities',paint:{'line-color':'#193d33','line-width':.7}});
        map.addLayer({id:'selection',type:'line',source:'municipalities',filter:['==',['get','code'],''],paint:{'line-color':'#fff6b7','line-width':3}});
        mapReady = true; paint(); filterDistrict(); el('map-status').hidden = true;
        for (const id of ['country-view','globe-view','islands-view']) el(id).disabled = false;
        selectRegion(selected); if (selected) fitRegion(selected);
        map.on('click','municipalities-fill',e => selectRegion(e.features[0].properties.code,true));
        map.on('mouseenter','municipalities-fill',() => map.getCanvas().style.cursor = 'pointer');
        map.on('mouseleave','municipalities-fill',() => map.getCanvas().style.cursor = '');
      });
    } catch { mapMessage(t('map_unavailable')); }
  }
  async function loadChart() {
    try { await loadScript('https://cdn.jsdelivr.net/npm/echarts@5.6.0/dist/echarts.min.js'); }
    catch { el('types-chart').hidden = true; return; }
    if (typeof echarts === 'undefined') { el('types-chart').hidden = true; return; }
    const data = Object.entries(summary.property_types).sort((a,b) => b[1]-a[1]);
    const theme = () => {
      const style = getComputedStyle(document.documentElement);
      return {text:style.getPropertyValue('--muted').trim(), line:style.getPropertyValue('--line').trim()};
    };
    const colors = theme();
    chart = echarts.init(el('types-chart'));
    chart.setOption({animation:!reduced, grid:{left:130,right:50,top:15,bottom:20},
      xAxis:{type:'value',axisLabel:{color:colors.text},splitLine:{lineStyle:{color:colors.line}}},
      yAxis:{type:'category',inverse:true,data:data.map(r => messages['type.' + r[0]] || r[0]),axisLabel:{color:colors.text},axisTick:{show:false}},
      series:[{type:'bar',data:data.map(r => r[1]),itemStyle:{color:'#8bbb8a',borderRadius:[0,3,3,0]},barMaxWidth:20}]});
    window.matchMedia('(prefers-color-scheme: light)').addEventListener('change',() => {
      const colors = theme();
      chart.setOption({xAxis:{axisLabel:{color:colors.text},splitLine:{lineStyle:{color:colors.line}}},yAxis:{axisLabel:{color:colors.text}}});
    });
    window.addEventListener('resize',() => chart.resize());
  }
  async function init() {
    try {
      const manifest = await readJSON('data/manifest.json');
      [summary,{items}] = await Promise.all([
        checkedJSON('PRT/real-estate/summary.json',manifest.files['PRT/real-estate/summary.json'].sha256),
        checkedJSON('PRT/real-estate/concelhos.json',manifest.files['PRT/real-estate/concelhos.json'].sha256)]);
      if (items.length !== 308 || summary.cell !== 'PRT/real-estate') throw new Error('Unexpected data structure');
      byCode = new Map(items.map(c => [c.code,c]));
      metricControl.disabled = regionControl.disabled = el('district').disabled = false;
      selectRegion(new URLSearchParams(location.hash.slice(1)).get('concelho') || '');
      regionControl.addEventListener('change',() => selectRegion(regionControl.value,true));
      el('district').addEventListener('change',() => {
        const district = el('district').value;
        if (selected && district && byCode.get(selected).distrito !== district) selectRegion('');
        filterDistrict(true);
      });
      metricControl.addEventListener('change',() => { paint(); selectRegion(selected); });
      el('country-view').addEventListener('click',() => map.fitBounds([[-9.6,36.9],[-6.1,42.2]],{padding:55,duration:reduced?0:1200}));
      el('islands-view').addEventListener('click',() => map.fitBounds([[-31.5,29.8],[-6,42.3]],{padding:50,duration:reduced?0:1200}));
      el('globe-view').addEventListener('click',() => map.flyTo({center:[-15,35],zoom:1.4,duration:reduced?0:1200}));
      try {
        const boundary = await readJSON('data/boundary-manifest.json');
        geo = await checkedJSON('concelhos.geojson', boundary.sha256);
        if (geo.features.length !== 308 || new Set(geo.features.map(f => f.properties.code)).size !== 308 ||
            geo.features.some(f => !byCode.has(f.properties.code))) throw new Error('Boundary mismatch');
        loadMap();
      } catch { mapMessage(t('map_data_unavailable')); }
      const observer = new IntersectionObserver(entries => {
        if (entries.some(entry => entry.isIntersecting)) { observer.disconnect(); loadChart(); }
      },{rootMargin:'150px'});
      observer.observe(el('types-chart'));
    } catch (error) {
      el('data-status').textContent = t('data_unavailable');
      mapMessage(t('map_data_unavailable'));
      console.error('Atlas:',error.message);
    }
  }
  init();
})();
