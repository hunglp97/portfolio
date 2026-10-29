import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import * as k from '../vendor/anatomy/iso-kit.mjs';
import * as A from '../vendor/anatomy/audit.mjs';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');

const model = {
  title: 'Retail price index caliper',
  subtitle: 'Continente shelf analysis · 38,383 products',
  stages: [
    {
      id: 'overall',
      label: '1. All 209 groups',
      metric: '56.0%',
      sub: 'Own-brand price index',
      note: 'Overall median: retailer private label sells at 56.0% of the manufacturer-brand price.',
      x: -90
    },
    {
      id: 'dairy',
      label: '2. Dairy & Milk',
      metric: '52.4%',
      sub: 'High volume staples',
      note: 'Staple dairy products show aggressive private-label penetration and narrow quality spreads.',
      x: -30
    },
    {
      id: 'pantry',
      label: '3. Dry Groceries',
      metric: '58.1%',
      sub: 'Packaged foods',
      note: 'Manufacturer brand equity holds a stronger price premium in packaged dry goods.',
      x: 30
    },
    {
      id: 'cleaning',
      label: '4. Cleaning & Home',
      metric: '48.7%',
      sub: 'Deepest discount gap',
      note: 'Chemical and cleaning categories exhibit the largest absolute gap between branded and own label.',
      x: 90
    }
  ]
};

const W = 640, H = 320;
const base = { x: -144, y: -65, w: 288, d: 119, r: 6 };
const scannerBounds = { x: -101, y: -53, w: 202, d: 79, r: 0 };
const P = k.fitProjection([...k.boxCorners(base, -6, 8), ...k.boxCorners(scannerBounds, 16, 72)], W, H, { pad: 16, azimuth: 35, elevation: 36 });
const R = A.recorder(P, { order: ['indicator'] });
let count = 0;

function slab(name, plan, z, h, tone = 'mid', options = {}) {
  const { moving = false, inner = '', lit = false, ...meta } = options;
  const paths = k.slabOf(plan, z, h, P, 5, Math.min(0.7, h / 3));
  const svg = k.solidSvg(paths, { tone, lit, inner });
  R.put({
    name, piece: moving ? 'indicator' : 'fixed', move: moving ? [180, 0, 0] : undefined,
    at: [plan.x + plan.w / 2, plan.y + plan.d / 2, z + h / 2], svg,
    shapes: [R.solid(A.slab(plan, z, h, { name, ...meta }, 5))], moving
  });
  count++;
}

function screws(plan, z) {
  return k.dotsSvg(k.corners(plan, Math.min(3, plan.w / 4, plan.d / 4)).map(([x, y]) => k.iso([x, y, z], P)), { size: 0.6, tone: 'hi' });
}

// Feet and deck
for (const [i, [x, y]] of k.corners(base, 18).entries()) {
  slab(`stand.foot.${i}`, { x: x - 7, y: y - 7, w: 14, d: 14, r: 3 }, -6, 3, 'lo');
  slab(`stand.pad.${i}`, { x: x - 6, y: y - 6, w: 12, d: 12, r: 2 }, -3, 3, 'lo');
}
slab('stand.deck', base, 0, 8, 'mid', { inner: screws(base, 8) + k.lineSvg(k.planOutline(k.insetPlan(base, 5), 8, P), { tone: 'faint' }) });

// Rail assembly
for (const x of [-128, 116]) for (const y of [-53, -35]) {
  const p = { x, y, w: 12, d: 10, r: 2 };
  slab(`rail.mount.${x}.${y}`, p, 8, 5, 'mid', { inner: screws(p, 13) });
}
for (const y of [-49, -31]) slab(`rail.${y}`, { x: -128, y, w: 256, d: 4, r: 1 }, 13, 3, 'hi');
for (const x of [-134, 128]) for (const y of [-51, -33]) slab(`rail.stop.${x}.${y}`, { x, y, w: 6, d: 8, r: 1 }, 8, 11, 'mid');

// 4 Category Caliper Stages
const rates = [56.0, 52.4, 58.1, 48.7];
model.stages.forEach((st, i) => {
  const cx = st.x;
  const plat = { x: cx - 22, y: -10, w: 44, d: 46, r: 2 };
  slab(`station.${i}.platform`, plat, 8, 3, 'mid', { inner: screws(plat, 11) });
  
  // Reference Block (Manufacturer Brand = 100% standard height)
  slab(`station.${i}.mfg_ref`, { x: cx - 18, y: -2, w: 14, d: 30, r: 2 }, 11, 24, 'lo');
  
  // Own Brand measured block with calibrated height
  const h = Math.round(24 * (rates[i] / 100));
  slab(`station.${i}.own_block`, { x: cx + 2, y: -2, w: 16, d: 30, r: 2 }, 11, h, 'hi', { lit: true });
});

// Indicator carriage (caliper probe)
slab('carriage.base', { x: -101, y: -53, w: 22, d: 26, r: 2 }, 16, 8, 'hi', { moving: true });
slab('carriage.cover', { x: -100, y: -51, w: 20, d: 22, r: 1 }, 24, 2, 'hi', { moving: true, inner: screws({ x: -100, y: -51, w: 20, d: 22, r: 1 }, 26) });
slab('carriage.upright', { x: -94, y: -39, w: 8, d: 6, r: 1 }, 26, 38, 'mid', { moving: true });
slab('carriage.arm', { x: -94, y: -39, w: 8, d: 63, r: 1 }, 64, 6, 'hi', { moving: true });
slab('carriage.head', { x: -100, y: 10, w: 20, d: 18, r: 2 }, 50, 14, 'hi', { moving: true });
slab('carriage.sensor', { x: -96, y: 14, w: 12, d: 10, r: 0.5 }, 49, 1, 'hi', { moving: true, lit: true });
slab('carriage.top', { x: -97, y: 13, w: 14, d: 12, r: 1 }, 70, 2, 'hi', { moving: true });

// Front ruler
const ruler = { x: -124, y: 44, w: 248, d: 5, r: 1 };
const ticks = k.topTicks(-120, 120, 5, 5, 44, 8.6, [2, 3.8], P);
slab('ruler', ruler, 8, 0.6, 'lo', { inner: k.lineSvg(ticks.minor, { tone: 'lo' }) + k.lineSvg(ticks.major, { tone: 'mid' }) });

const states = A.uniformStates(12);
A.settle(R, P, { states });
R.items.sort((a, b) => a.key - b.key);

const svg = k.figureSvg({
  width: W, height: H,
  label: 'An isometric retail price index caliper measuring own-brand price gap across FMCG categories.',
  body: R.items.map(item => {
    const st = item.name.match(/^station\.(\d)\./)?.[1];
    return `<g data-name="${item.name}"${item.moving ? ' data-scanner' : ''}${st !== undefined ? ` data-stage="${st}"${st === '0' ? ' data-active="true"' : ''}` : ''}>${item.svg}</g>`;
  })
}).replace('viewBox="0 0 640 320"', 'viewBox="130 10 380 304"');

const delta = k.iso([180, 0, 0], P).map((n, i) => n - k.iso([0, 0, 0], P)[i]);
const first = model.stages[0];

const partial = `<figure class="data-inspector data-caliper iso iso-plate" data-ui aria-labelledby="caliper-title">
  <figcaption class="inspector-head">
    <h2 id="caliper-title">Price Index Caliper · Measured Own-Brand Gap</h2>
    <span class="inspector-source">Continente Portugal Online Shelf Census</span>
  </figcaption>
  <p class="inspector-meta">209 comparable groups &middot; 38,383 products &middot; Own-brand vs manufacturer brands</p>
  <div class="inspector-layout">
    <div class="inspector-art" tabindex="-1" role="slider" aria-disabled="true" aria-label="Select a retail category to inspect. Use the arrow keys, Home or End." aria-valuemin="0" aria-valuemax="3" aria-valuenow="0" aria-valuetext="${first.label}: ${first.metric}" data-delta-x="${delta[0]}" data-delta-y="${delta[1]}">
      ${svg}
    </div>
    <div class="inspector-desk">
      <div class="inspector-fields" aria-label="Retail categories" hidden>
        ${model.stages.map((st, i) => `
          <button type="button" data-inspect-choice="${i}" aria-pressed="${i === 0}">
            <span>${st.label}</span>
            <strong>${st.metric}</strong>
            <span class="inspector-field-fill" aria-hidden="true" style="--field-fill:${rates[i]}%"></span>
          </button>
        `).join('')}
      </div>
      <div class="inspector-control">
        <label for="inspect-caliper-stage">Inspect category</label>
        <select id="inspect-caliper-stage" data-inspect-field disabled>
          ${model.stages.map((st, i) => `<option value="${i}">${st.label} · ${st.sub}</option>`).join('')}
        </select>
        <span class="inspector-hint">Tap a category station to inspect.</span>
        <button type="button" class="inspector-tour" data-inspect-tour aria-pressed="false" hidden>Play tour</button>
      </div>
      <div class="inspector-result" aria-live="polite" aria-atomic="true">
        <p><strong data-inspect-rate>${first.metric}</strong><span data-inspect-sub>${first.sub}</span></p>
        <p data-inspect-note>${first.note}</p>
      </div>
    </div>
  </div>
  <div class="inspector-foot">
    <p class="inspector-caption">Dark block = Manufacturer Brand (100% index). Light block = Retailer Own Brand. Caliper jaw measures unit-price gap.</p>
  </div>
  <script type="application/json" id="caliper-model">${JSON.stringify(model)}</script>
</figure>`;

writeFileSync(resolve(ROOT, 'partials/data-caliper.html'), partial + '\n');

const reportPath = resolve(ROOT, 'retail-report.html');
let report = readFileSync(reportPath, 'utf8');
const start = '<!-- anatomy:retail-caliper -->', end = '<!-- /anatomy:retail-caliper -->';
if (report.includes(start)) {
  report = report.replace(new RegExp(start + '[\\s\\S]*?' + end), start + '\n' + partial + '\n' + end);
} else {
  report = report.replace('<aside class="buy-panel"', `${start}\n${partial}\n${end}\n\n      <aside class="buy-panel"`);
}
writeFileSync(reportPath, report);

console.log(`Built retail caliper: ${count} solids across 4 categories`);
A.auditOrExit(R, P, { states });
